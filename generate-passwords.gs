function generatePasswords() {
  var cell
  var range = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('zello_passwords')
  
  for (var cellRow = 1; cellRow <= range.getHeight(); cellRow++) {
    cell = range.getCell(cellRow, 1)
    cell.setValue(getPassphrase())
  }
}

function getPassphrase() {
    var url = "https://randompassphrasegenerator.com/";
    var doc = UrlFetchApp.fetch(url);
    var regExp = new RegExp("\"thePhrase\">(.*)<\/h1>", "gi");
    var passphrase = regExp.exec(doc.getContentText())[1].replace(/\s/g,"");
    
    Logger.log(passphrase)
    return passphrase
}
