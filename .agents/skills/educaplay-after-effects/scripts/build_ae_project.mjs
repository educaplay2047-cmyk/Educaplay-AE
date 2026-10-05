/**
 * build_ae_project.mjs — Automatización en Node.js nativo para generar el proyecto After Effects
 * tras la aprobación de la Matriz de Sincronización Pre-Edición.
 *
 *   node tools/build_ae_project.mjs [EPISODE_CODE] [--dir <ruta_episodio>]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync, execFileSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MOTOR_DIR = path.join(ROOT, 'motor');

const args = process.argv.slice(2);
let episodeCode = 'AMB26-01';
let customDir = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--dir' && args[i + 1]) {
    customDir = path.resolve(args[i + 1]);
    i++;
  } else if (!args[i].startsWith('--')) {
    episodeCode = args[i];
  }
}

const workDir = customDir || path.join(ROOT, 'episodios', episodeCode);
const episodiosDir = path.join(ROOT, 'episodios', episodeCode);

console.log('='.repeat(70));
console.log(`🚀 GENERANDO PROYECTO AFTER EFFECTS — ${episodeCode}`);
console.log(`   Directorio de trabajo: ${workDir}`);
console.log('='.repeat(70));

// 1. Validar o copiar archivo de datos aprobados
const aprobadaPath = path.join(workDir, 'TABLA_SINCRONIZACION_APROBADA.json');
const datosPath = path.join(workDir, 'TABLA_SINCRONIZACION_DATOS.json');

if (!fs.existsSync(aprobadaPath) && fs.existsSync(datosPath)) {
  fs.copyFileSync(datosPath, aprobadaPath);
  console.log(`✓ Copiado ${datosPath} → ${aprobadaPath}`);
}

// 2. Exportar manifiesto AE desde el motor
console.log('\n📦 Paso 1: Exportando manifiesto AE y preparando assets desde el motor...');
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const resExport = spawnSync(npmCmd, ['run', 'export:ae', '--', episodeCode], {
  cwd: MOTOR_DIR,
  stdio: 'inherit',
  shell: true
});

if (resExport.status !== 0) {
  console.error(`✗ Error al exportar manifiesto.`);
  process.exit(1);
}

// 3. Asegurar script constructor build-[CODE].jsx
const jsxSkillPath = path.join(ROOT, 'ae', `build-${episodeCode}.jsx`);
if (!fs.existsSync(jsxSkillPath)) {
  const templatePath = path.join(ROOT, 'ae', 'build-episode.jsx');
  const manifestPath = path.join(episodiosDir, 'manifest.json').replace(/\\/g, '/');
  let jsxCode = fs.readFileSync(templatePath, 'utf8');
  jsxCode = jsxCode.replace('EPISODIO_PLACEHOLDER', episodeCode);
  jsxCode = jsxCode.replace('MANIFEST_PATH_PLACEHOLDER', manifestPath);
  fs.writeFileSync(jsxSkillPath, jsxCode, 'utf8');
  console.log(`✓ Creado script constructor: ${jsxSkillPath}`);
}

// 4. Ejecutar el constructor en After Effects
console.log('\n🎬 Paso 2: Ejecutando After Effects y armando composiciones...');
const runnerPath = path.join(ROOT, 'ae', 'run.mjs');
if (fs.existsSync(runnerPath)) {
  const resRun = spawnSync('node', [runnerPath, episodeCode], {
    cwd: ROOT,
    stdio: 'inherit'
  });
  if (resRun.status === 0) {
    console.log(`\n🎉 ¡Proyecto After Effects construido con éxito en episodios/${episodeCode}/${episodeCode}.aep!`);
  } else {
    console.log(`\n⚠ Manifiesto generado. Podés abrir After Effects y ejecutar ae/build-${episodeCode}.jsx directamente.`);
  }
}
