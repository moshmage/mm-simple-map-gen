var mapMatrix = new Array();

var config = {
  columns: 0,
  rows: 0,
  maxEscapeRoutes: 1,
  usedEscapes: 0
};

var escapeRoutes = 1;
var usedEscapes = 0;

var exits = {
  left: 1,
  right: 2,
  north: 3,
  south: 4
};

function getExitName(index) {
  return Object.keys(exits)[index];
}

function getRandomExit() {
  return exits[getExitName(Math.floor(Math.random() * (exits.length - 1)))];
}

function passFail() {
  return Math.floor(Math.random() * 10) >= 5;
}

function basicRulesPass(exit, row, column) {

  if (exit === exits.left && column === 0) return false;
  if (exit === exits.north && row === 0) return false;
  if (exit === exits.right && column === config.columns) return false;
  if (exit === exits.south && row === config.rows) return false;

  /* If it didn't return until now, we are probably on the middle
   * but we'll still make sure of that and then return passFail()
   * so we can make some randomness on the middle blocks */
  if (row > 0 && row < config.rows &&
      column > 0 && column < config.columns) {
    return passFail();
  }

  return true;
}

function canBeExit(exit, row, column) {

  if (exit === exits.north || exit === exits.right || exit === exits.south) {
    if (column === config.columns || column === Math.ceil((config.columns / 2 ) + 1 )) return true;
  }

  return false;
}

function setupMatrix(rows, columns) {
  var i = 0, z = 0, y = 0, canGo = [], pass = false, exit;
  config.rows = rows - 1;
  config.columns = columns - 1;

  for (z; z <= config.rows; z++) {
    mapMatrix[z] = [];
    for (i = 0; i <= config.columns; i++) {
      canGo = [];
      for (y = Object.keys(exits).length - 1; y >= 0; y--) {
        pass = basicRulesPass(exits[getExitName(y)], z, i);
        if (!pass && passFail()) {
          if (config.usedEscapes < config.maxEscapeRoutes) {
            pass = canBeExit(exits[getExitName(y)], z, i) || (z === config.rows && i === config.columns);
            console.log('pass '+ pass + ' ' + z + ' ' + i + ' ' + getExitName(y));
            if (pass) {
              config.usedEscapes++;
            }
          }
        }

        if (pass) {
          canGo.push({
            name:getExitName(y),
            code: y
          });
        }
      }
      mapMatrix[z].push(canGo);
    }
  }
};

setupMatrix(3, 3);

console.log('------------------------------------------------------------------')
mapMatrix.forEach(function(array){
  console.log(array.map(function(ele){
    return ele.map(function(direction){
      return direction.name;
    });
  }).join(' | '));
  console.log('------------------------------------------------------------------')
});
