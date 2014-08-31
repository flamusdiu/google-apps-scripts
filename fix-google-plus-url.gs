function fix_gplus_url() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = SpreadsheetApp.getActiveSheet();

  var googleEX = new XRegExp (/\++[^/]+|\d{21}/);
  
  var colN = sheet.getLastColumn();
  var rowN = sheet.getLastRow();
  
  var colGPlus = find_gplus_column(rowN,colN);
  
  if (colGPlus == 0) {
    Logger.log("No G+ URL Profile column in spreadsheet!");
  } else {
    var range =  sheet.getRange(colGPlus[0],colGPlus[1],rowN);
    
    for ( var row = colGPlus[0]; row < rowN; row ++) {
      
      var current = sheet.getRange(row, colGPlus[1]); 
      
      if (current.getValue()) {
        var uid = googleEX.exec(current.getValue());
      
        Logger.log(uid);
        
        if (uid) {
          var new_gplus_url = '=hyperlink("https://plus.google.com/' + uid + '")';
        
          current.setFormula(new_gplus_url);
        } else {
          current.setBackground('red');
          current.setFontColor('white');
          Logger.log("Could not find user's UID! Error for G+ URL: " + current.getValue());
        }
      } 
    }
  }
}

function find_gplus_column(colN) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = SpreadsheetApp.getActiveSheet();
  
  var googleEX = new XRegExp("(google\.com)");
  for ( var row = 1; row < 10; row++ ) {
    for (var col = 1; col < colN+1; col++ ) {
      if (googleEX.exec(sheet.getRange(row,col).getValue())) {
          return [row,col];
      }
    }
  } 
  
  return 0;
}

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('G+ URL Fixer')
      .addItem('Run Fix', 'fix_gplus_url')
      .addToUi();
}
