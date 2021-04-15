// Written in 2014 for Ingress to solve the problem of walking distances per teams.

// Retrieves JSON from URL
function getJSON(url) {
  Utilities.sleep(1000)
  var response = UrlFetchApp.fetch(url);
  var data = JSON.parse(response.getContentText());
  
  return data;
}

// Returns all distances from all legs
function getAllDistance(legs) {
  var distance = 0;
  
  for (i = 0; i<legs.length; i++) {
    distance = distance + getOneDistance(legs[i]);
  }
  
  return distance.toFixed(1);
}

// Returns all durations from all legs
function getAllDuration(legs) {
  var duration = 0;
  
  for (i = 0; i<legs.length; i++) {
    duration = duration + getOneDuration(legs[i]);
  }
  
  return duration.toFixed(0);
}

// Main function: returns list of duration and distance for both
// longest leg and all legs
function getData(url) {
  var text = []
  var json = getJSON(url)
  var legs = json.routes[0].legs
  
  var longestLeg = getLongestRoute(legs)
  text.push(longestLeg)
  
  var allDistance = getAllDistance(legs)
  var allDuration = getAllDuration(legs)
 
  text.push(String(allDuration) + " mins" + "(" + String(allDistance) + " mi)")
  
  return [text]
}

// Returns distance for a single leg
function getOneDistance(leg) {
  var d = leg.distance.text.split(" ");
  return Number(d[0]);
}

// Returns duration for a single leg
function getOneDuration(leg) {
  var d = leg.duration.text.split(" ");
  return Number(d[0]);
}


// swap values in the array. used to sort the array to find the 
// longest leg
function swap (arr,x,y) {
  var a = arr[x];
  var b = arr[y];
  arr[x] = b;
  arr[y] = a;
  return arr;
}

// Finds the longest leg based on distance
function getLongestRoute(legs) {
  var nLegs = legs.length
  
  for (j = 0; j < nLegs - 1; j++) {
       
    var iMin = j
    
    for (i = j+1; i < nLegs; i++) {
      if (getOneDistance(legs[i]) < getOneDistance(legs[iMin])) {
        iMin = i
      }
    }
    
    if (iMin != j) {
      legs = swap(legs,j,iMin);
    }
  }
  
  return String(getOneDuration(legs[nLegs-1])) + " mins" + " (" + String(getOneDistance(legs[nLegs-1])) + " mi)"
}
