/**
 * local_bridge_server.mjs — Servidor local Bridge multiplataforma (Node.js nativo)
 * Conecta el Tablero Interactivo de Sincronización Pre-Edición (HTML) con el motor de After Effects.
 *
 *   node tools/local_bridge_server.mjs [EPISODE_CODE] [--port 3210] [--dir <ruta_episodio>]
 *
 * Endpoints:
 *   - GET  /health, /api/health
 *   - GET  /status, /api/status, /api/build-status
 *   - POST /api/build-ae, /api/generate-and-preview
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MOTOR_DIR = path.join(ROOT, 'motor');

// Parseo de argumentos
const args = process.argv.slice(2);
let episodeCode = 'AMB26-01';
let port = 3210;
let customDir = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--port' && args[i + 1]) {
    port = parseInt(args[i + 1], 10);
    i++;
  } else if (args[i] === '--dir' && args[i + 1]) {
    customDir = path.resolve(args[i + 1]);
    i++;
  } else if (!args[i].startsWith('--')) {
    episodeCode = args[i];
  }
}

const workDir = customDir || path.join(ROOT, 'episodios', episodeCode);
const approvedPath = path.join(workDir, 'TABLA_SINCRONIZACION_APROBADA.json');
const aepPath = path.join(ROOT, 'episodios', episodeCode, `${episodeCode}.aep`);

const buildState = {
  status: 'idle',
  percent: 0,
  elapsedSec: 0,
  remainingSec: 35,
  currentStep: 'Listo para generar',
  message: 'Esperando inicio...',
  aepReady: false,
  aepPath: '',
  aepSizeMb: 0,
  logs: []
};

function checkStatus() {
  const targetAep = fs.existsSync(aepPath)
    ? aepPath
    : (fs.existsSync(path.join(workDir, `${episodeCode}.aep`)) ? path.join(workDir, `${episodeCode}.aep`) : null);

  if (targetAep) {
    const stats = fs.statSync(targetAep);
    buildState.aepReady = true;
    buildState.aepPath = targetAep;
    buildState.aepSizeMb = +(stats.size / (1024 * 1024)).toFixed(2);
  } else {
    buildState.aepReady = false;
    buildState.aepPath = '';
    buildState.aepSizeMb = 0;
  }
}

function startBuildAsync(matrixData) {
  buildState.status = 'running';
  buildState.percent = 10;
  buildState.elapsedSec = 0;
  buildState.remainingSec = 30;
  buildState.currentStep = 'Exportando manifiesto AE y preparando assets...';
  buildState.logs = [`[${new Date().toLocaleTimeString()}] ▶ Iniciando armado de ${episodeCode}...`];

  // 1. Guardar matriz aprobada
  try {
    fs.mkdirSync(workDir, { recursive: true });
    if (matrixData && Object.keys(matrixData).length > 0) {
      fs.writeFileSync(approvedPath, JSON.stringify(matrixData, null, 2), 'utf8');
      buildState.logs.push(`[${new Date().toLocaleTimeString()}] ✓ Guardado ${approvedPath}`);
    }
  } catch (err) {
    buildState.logs.push(`[${new Date().toLocaleTimeString()}] ⚠ Error guardando matriz: ${err.message}`);
  }

  // Timer de avance de progreso
  const progressTimer = setInterval(() => {
    buildState.elapsedSec += 1;
    if (buildState.remainingSec > 2) buildState.remainingSec -= 1;
    if (buildState.percent < 85 && buildState.status === 'running') {
      buildState.percent += 2;
    }
  }, 1000);

  // 2. Ejecutar export:ae
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const exportProc = spawn(npmCmd, ['run', 'export:ae', '--', episodeCode], { cwd: MOTOR_DIR });

  exportProc.stdout.on('data', (d) => {
    const line = d.toString().trim();
    if (line) buildState.logs.push(line);
  });

  exportProc.on('close', (code) => {
    if (code !== 0) {
      clearInterval(progressTimer);
      buildState.status = 'error';
      buildState.currentStep = 'Error exportando manifiesto';
      buildState.message = `export:ae falló con código ${code}`;
      return;
    }

    buildState.percent = 50;
    buildState.currentStep = 'Ejecutando constructor en After Effects (ae/run.mjs)...';
    buildState.logs.push(`[${new Date().toLocaleTimeString()}] ✓ Manifiesto exportado. Lanzando After Effects...`);

    // 3. Ejecutar run.mjs
    const aeProc = spawn('node', [path.join(ROOT, 'ae', 'run.mjs'), episodeCode], { cwd: ROOT });

    aeProc.stdout.on('data', (d) => {
      const line = d.toString().trim();
      if (line) buildState.logs.push(line);
    });

    aeProc.on('close', (aeCode) => {
      clearInterval(progressTimer);
      checkStatus();
      if (aeCode === 0 || buildState.aepReady) {
        buildState.status = 'completed';
        buildState.percent = 100;
        buildState.remainingSec = 0;
        buildState.currentStep = '¡Proyecto After Effects generado con éxito!';
        buildState.logs.push(`[${new Date().toLocaleTimeString()}] 🎉 Proyecto finalizado exitosamente.`);
      } else {
        buildState.status = 'completed';
        buildState.percent = 100;
        buildState.currentStep = 'Manifiesto generado. Ejecutar build-[CODE].jsx en AE.';
        buildState.logs.push(`[${new Date().toLocaleTimeString()}] ✓ Manifiesto y assets listos para abrir en AE.`);
      }
    });
  });
}

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = req.url.split('?')[0];

  if (req.method === 'GET') {
    if (url === '/health' || url === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'educaplay-ae-bridge', episode: episodeCode, port }));
      return;
    }

    if (url === '/status' || url === '/api/status' || url === '/api/build-status') {
      checkStatus();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(buildState));
      return;
    }
  }

  if (req.method === 'POST') {
    if (url === '/api/save' || url === '/api/save-matrix' || url === '/save') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        let matrixData = {};
        try {
          if (body) matrixData = JSON.parse(body);
          fs.mkdirSync(workDir, { recursive: true });
          fs.writeFileSync(approvedPath, JSON.stringify(matrixData, null, 2), 'utf8');
          console.log(`[${new Date().toLocaleTimeString()}] ✓ Guardada tabla aprobada en ${approvedPath}`);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ status: 'ok', message: 'Tabla aprobada guardada en disco.', path: approvedPath }));
        } catch (e) {
          console.warn('Error al guardar matriz:', e.message);
          res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ status: 'error', message: e.message }));
        }
      });
      return;
    }

    if (url === '/api/build-ae' || url === '/api/generate-and-preview' || url === '/generate-and-preview') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        let matrixData = {};
        try {
          if (body) matrixData = JSON.parse(body);
        } catch (e) {
          console.warn('No se pudo parsear body JSON:', e.message);
        }

        startBuildAsync(matrixData);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ status: 'started', message: 'Construcción iniciada. Monitoreando...' }));
      });
      return;
    }
  }

  res.writeHead(404);
  res.end('Not Found');
});

checkStatus();
server.listen(port, '127.0.0.1', () => {
  console.log(`\n======================================================================`);
  console.log(`📡 Bridge Server (${episodeCode}) activo en http://127.0.0.1:${port}`);
  console.log(`   Directorio de trabajo: ${workDir}`);
  console.log(`   AEP listo:            ${buildState.aepReady ? 'SÍ (' + buildState.aepSizeMb + ' MB)' : 'NO'}`);
  console.log(`   Endpoints disponibles:`);
  console.log(`     - GET  /health, /api/health`);
  console.log(`     - GET  /api/status, /api/build-status`);
  console.log(`     - POST /api/build-ae, /api/generate-and-preview`);
  console.log(`======================================================================\n`);
});
