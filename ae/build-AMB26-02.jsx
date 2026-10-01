// Launcher directo para After Effects - AMB26-02
// EducaPlay Secundaria (Corrientes)
(function() {
  var logMessages = [];
  function localLog(msg) {
    logMessages.push(msg);
    $.writeln(msg);
  }

  try {
    // 1. Cerrar cualquier proyecto previo sin guardar para evitar diálogo modal bloqueante
    if (app.project) {
      try {
        app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
      } catch (e) {
        localLog("· Aviso al cerrar proyecto previo: " + e.toString());
      }
    }

    // 2. Establecer el manifiesto canónico para AMB26-02
    $.global.EDUCAPLAY_MANIFEST = "C:/Users/produ/Videos/EDUCAPLAY LOCAL/episodios/AMB26-02/manifest.json";

    var buildFile = new File("C:/Users/produ/Videos/EDUCAPLAY LOCAL/ae/build-episode.jsx");
    if (!buildFile.exists) {
      throw new Error("No se encontró build-episode.jsx en: " + buildFile.fsName);
    }

    // 3. Evaluar constructor central de EducaPlay
    $.evalFile(buildFile);

    // 4. Asegurar carpetas de revisión
    var revDir = new Folder("C:/Users/produ/Videos/EDUCAPLAY LOCAL/episodios/AMB26-02/revision");
    if (!revDir.exists) revDir.create();

    var stillDir = new Folder("C:/Users/produ/Videos/EDUCAPLAY LOCAL/episodios/AMB26-02/revision/stills");
    if (!stillDir.exists) stillDir.create();

    // 5. Guardar log de revisión
    var logFile = new File("C:/Users/produ/Videos/EDUCAPLAY LOCAL/episodios/AMB26-02/revision/log.txt");
    logFile.encoding = "UTF-8";
    logFile.open("w");
    if (typeof LOG !== "undefined" && LOG.length > 0) {
      logFile.write(LOG.join("\n"));
    } else if (logMessages.length > 0) {
      logFile.write(logMessages.join("\n"));
    } else {
      logFile.write("✓ Episodio AMB26-02 armado con éxito.");
    }
    logFile.close();

    // 6. Exportar stills de revisión
    var comp = null;
    for (var i = 1; i <= app.project.numItems; i++) {
      var it = app.project.item(i);
      if (it instanceof CompItem && it.name === "AMB26-02") {
        comp = it;
        break;
      }
    }

    var frames = [300, 450, 560, 800, 1100, 1300, 1450, 1700, 2000, 2150, 2300, 2500, 2750, 3100, 3500, 3650, 3860, 4000, 4200];
    if (comp) {
      for (var k = 0; k < frames.length; k++) {
        var fr = frames[k];
        var pad = ("00000" + fr).slice(-5);
        var outPng = new File("C:/Users/produ/Videos/EDUCAPLAY LOCAL/episodios/AMB26-02/revision/stills/f" + pad + ".png");
        try {
          comp.saveFrameToPng(fr / comp.frameRate, outPng);
        } catch(errPng) {}
      }
    }

    // 7. Copiar el .aep a la carpeta local del capítulo
    try {
      var localFolder = new Folder("C:/Users/produ/Videos/EDUCAPLAY LOCAL/SECUNDARIA/Educación Ambiental integral/AMB26-02");
      if (localFolder.exists && app.project && app.project.file) {
        app.project.file.copy("C:/Users/produ/Videos/EDUCAPLAY LOCAL/SECUNDARIA/Educación Ambiental integral/AMB26-02/AMB26-02.aep");
      }
    } catch(errCopy) {}

  } catch(globalErr) {
    var errLog = new File("C:/Users/produ/Videos/EDUCAPLAY LOCAL/episodios/AMB26-02/revision/log.txt");
    errLog.encoding = "UTF-8";
    errLog.open("w");
    errLog.write("✗ Error fatal en build-AMB26-02.jsx: " + globalErr.toString() + " (línea " + globalErr.line + ")\n" + logMessages.join("\n"));
    errLog.close();
  } finally {
    // 8. Marcar como terminado para el servidor de monitoreo y popup web
    var doneFile = new File("C:/Users/produ/Videos/EDUCAPLAY LOCAL/episodios/AMB26-02/revision/done.txt");
    doneFile.open("w");
    doneFile.write("DONE " + new Date().toString());
    doneFile.close();
  }
})();
