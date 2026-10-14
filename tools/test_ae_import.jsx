try {
  var f = new File("C:/Users/2047/.gemini/antigravity-ide/scratch/Educaplay-AE/episodios/AMB26-04/assets/5.jfif");
  var res = "NOT FOUND";
  if (f.exists) {
    try {
      if (!app.project) app.newProject();
      var it = app.project.importFile(new ImportOptions(f));
      res = "OK: " + it.name;
      it.remove();
    } catch(e) {
      res = "ERROR: " + e.toString();
    }
  }
  var out = new File("C:/Users/2047/.gemini/antigravity-ide/scratch/Educaplay-AE/tools/import_res.txt");
  out.open("w");
  out.write(res + "\nVersion: " + app.version);
  out.close();
} catch(err) {
  var out2 = new File("C:/Users/2047/.gemini/antigravity-ide/scratch/Educaplay-AE/tools/import_res.txt");
  out2.open("w");
  out2.write("GLOBAL ERROR: " + err.toString());
  out2.close();
}
