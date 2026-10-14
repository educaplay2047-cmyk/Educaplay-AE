var manifestPath = "c:/Users/2047/.gemini/antigravity-ide/scratch/Educaplay-AE/episodios/AMB26-04/manifest.json";
$.global.EDUCAPLAY_MANIFEST = manifestPath;
var logFile = new File("c:/Users/2047/.gemini/antigravity-ide/scratch/Educaplay-AE/episodios/AMB26-04/revision/log.txt");

try {
  $.evalFile(File("c:/Users/2047/.gemini/antigravity-ide/scratch/Educaplay-AE/ae/build-episode.jsx"));
} catch (err) {
  if (typeof LOG === 'undefined') LOG = [];
  LOG.push('✗ Error en build-episode.jsx: ' + err.toString() + ' (línea ' + err.line + ')');
} finally {
  try {
    logFile.encoding = 'UTF-8';
    logFile.open('w');
    logFile.write((typeof LOG !== 'undefined' ? LOG : ['✗ el constructor no dejó LOG']).join('\n'));
    logFile.close();
  } catch(e) {}
  app.quit();
}
