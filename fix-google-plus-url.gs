/*************************************************
*  
*  Primary Function for scrips. 
*  
*
**************************************************/
function fix_urls() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = SpreadsheetApp.getActiveSheet();

  var googleEX = new RegExp (/\++[^/]+|\d{21}/);
  
  var col = new Cols(sheet.getLastColumn());
  var rowN = sheet.getLastRow();
  
  if ((col.gPlusCol == 0) && (col.gCommunityCol == 0 )) {
    Logger.log("No G+ URL Profile or Community column in spreadsheet! Stopping script.");
    return;
  } else {
    
    for ( var row = col.firstRow; row <= rowN; row ++) {
      
      if (col.gPlusCol > 0) {
        var gPlus = sheet.getRange(row, col.gPlusCol); 
        
        if (gPlus.getValue()) {
          var uid = googleEX.exec(gPlus.getValue());
          
          if (uid) {
            var new_gplus_url = 'https://plus.google.com/' + encodeURIComponent(uid).replace(/%2B/,"+");
            var new_gplus_link_label = 'https://plus.google.com/' + decodeURIComponent(uid);
            var new_gplus_url_formula = '=hyperlink("' + new_gplus_url + '","' + new_gplus_link_label + '")';
            if (gPlus.getFormula() != new_gplus_url_formula) {
              
              gPlus.setFormula(new_gplus_url_formula);
              
              if (gPlus.getFormula() != new_gplus_url_formula) {
                //Something when wrong
                set_range_error(gPlus);
              }
            }
          } else {
            set_range_error(gPlus);
          }
        }
      }
      
      if (col.gCommunityCol > 0) {
        var gCommunity = sheet.getRange(row, col.gCommunityCol);
        
        if (gCommunity.getValue()) {
           var uid = googleEX.exec(gCommunity.getValue());
           
           if (uid) {
             var new_gplus_url = 'https://plus.google.com/communities/' + encodeURIComponent(uid).replace(/%2B/,"+");
             var new_gplus_link_label = 'https://plus.google.com/communities/' + decodeURIComponent(uid);
             var new_gplus_url_formula = '=hyperlink("' + new_gplus_url + '","' + new_gplus_link_label + '")';
             if (gCommunity.getFormula() != new_gplus_url_formula) {
               
               gCommunity.setFormula(new_gplus_url_formula);
               
               if (gCommunity.getFormula() != new_gplus_url_formula) {
                 //Something when wrong
                 set_range_error(gCommunity);
               }
             }
           } else {
             set_range_error(gCommunity);
           }
         } 
      }
    }
  }
  
}

function set_range_error(range) {
  range.setBackground('red');
  range.setFontColor('white');
  Logger.log("Could not find user's UID! Error for G+ URL: " + range.getValue());
}

function Cols (colN) {
  this.colN = colN;
  this.firstRow = 0;
  this.gPlusCol = 0;
  this.gCommunityCol = 0;
  this.find_columns();
}

Cols.prototype =  {
  
  find_columns: function() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = SpreadsheetApp.getActiveSheet();
    
    var googleEX1 = new RegExp("(google\.com)");
    var googleEX2 = new RegExp("(google\.com.*communities)");
    var gPlusCol = new Array();
    var gCommunityCol = new Array();
    
    for ( var row = 1; row < 10; row++ ) {
      for (var col = 1; col < this.colN+1; col++ ) {
        if (this.gPlusCol == 0)
          if (googleEX1.exec(sheet.getRange(row,col).getValue())) {
            if (this.firstRow == 0) this.firstRow = row;
            this.gPlusCol = col;
          }
        
        if (this.gCommunityCol == 0) {
          if (googleEX2.exec(sheet.getRange(row,col).getValue())) {            
            if (this.firstRow == 0) this.firstRow = row;
            this.gCommunityCol = col;
          }
        }
      }
    }    
  }
}


function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('G+ URL Fixer')
      .addItem('Run Fix', 'fix_urls')
      .addToUi();
}

function onInstall(e) {
  onOpen(e);
}
