function generatePassword() {
  
  if (this.Value == '' || this.value == null) {
    var url = "https://randompassphrasegenerator.com/";
    var doc = UrlFetchApp.fetch(url);
    var regExp = new RegExp("\"thePhrase\">(.*)<\/h1>", "gi");
    var passphrase = regExp.exec(doc.getContentText())[1].replace(/\s/g,"")
    
    
    return passphrase
  }
}
