// Written in 2014 for Ingress
// Shows how to create a matrix of colors from a set of cells
// which can be used for conditional formatting based on some value.

// Global array to hold operators -> colors mapping
var operatorColors = []

function onEdit(){
  buildOpArray()
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (ss.getSheetName() == "BATTLE BOARD") {
    updateBBColors();
    
    if ((ss.getActiveCell().getColumn() == 5) && ss.getActiveCell().getValue() == "") {
      ss.getActiveCell().setValue("UNASSIGNED")
    }
  } else if (ss.getSheetName() == "SOP Squad Filter") {
    updateFilter();
  }
}


function updateBBColors() {
    var cell = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getActiveCell();
    var result = findByName(operatorColors, cell.getValue());
    if (result) {
      cell.setBackground(result.color);
    }
}

// Runs when click on the "Refresh" Button on Color Filter
function updateFilter() {
  buildOpArray()
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var firstBlankRow = getFirstEmptyRowByColumnArray("D7:D") + 6 
  
  ss.getRange("D" + firstBlankRow.toString() + ":D").setBackground("#FFFFFF");
  setBackgroundOnRange(ss.getRange("D7:D" + firstBlankRow));
  
  var firstBlankRow = getFirstEmptyRowByColumnArray("F7:F") + 6
  ss.getRange("F" + firstBlankRow.toString() + ":F").setBackground("#FFFFFF");
  setBackgroundOnRange(ss.getRange("F7:F" + firstBlankRow));
  
}

// Sets colors of backgroun using an array
function setBackgroundOnRange (range) {   
  for (i = 7; i < range.getNumRows(); i++) {
    var values = range.getValues();
    colors = values.map(function(obj) {
      var result = findByName(operatorColors, obj[0])
      
      if (result) {
        return [result.color]
      } else {
        return ["#FFFFFF"]
      }
      
    })
  }
  
  range.setBackgrounds(colors)
}

// Builds the mapping of Ops to colors
function buildOpArray() {
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data");
  var r = SpreadsheetApp.getActiveSpreadsheet().getRangeByName("operators");
  var backgrounds = r.getBackgrounds();
  var names = r.getValues();
  
  for (i = 0; i < names.length; i++) {
    operatorColors.push({name:names[i][0], color:backgrounds[i][0]});
  }
}

// Finds Op obj in the Op -> colors array
function findByName(source, name) {
  return source.filter(function ( obj ) {
    return obj.name == name;
  })[0];
}

// http://stackoverflow.com/a/27179623
// Don's array approach - checks first column only
// With added stopping condition & correct result.
// From answer http://stackoverflow.com/a/9102463/1677912
function getFirstEmptyRowByColumnArray(range) {
  var spr = SpreadsheetApp.getActiveSpreadsheet();
  var column = spr.getRange(range);
  var values = column.getValues(); // get all data in one call
  var ct = 0;
  while ( values[ct] && values[ct][0] != "" ) {
    ct++;
  }
  return (ct+1);
}
