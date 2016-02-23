
var config = {
  columns: 0,
  rows: 0,
  maxEscapeRoutes: 1,
  usedEscapes: 0
};

var exits = {
  left: 1,
  right: 2,
  north: 3,
  south: 4
};

/* Return the exit node name in position <index> */
function getExitName(index) {
  return Object.keys(exits)[index];
}

/* get a random exit node code */
function getRandomExit() {
  return exits[getExitName(Math.floor(Math.random() * (exits.length - 1)))];
}

/* return true if random number from 0 to 10 is >= 5 */
function passFail() {
  return Math.floor(Math.random() * 10) >= 5;
}

/* return true if no constraint */
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

/* returns true if node can be an exit */
function canBeExit(exit, row, column) {

  if (exit === exits.north || exit === exits.right || exit === exits.south) {
    if (column === config.columns || column === Math.ceil((config.columns / 2 ) + 1 )) return true;
  }

  return false;
}

/* setup the map matrix array
 * if no params are given, default is 3x3
 * if only rows are given, columns will have the same value
 * @param rows {Int}        - maximum number of rows
 * @param columns {Int}     - maximum number of columns
 * @return Array            - Array of Objects {name: 'string', code: int}
 */
function setupMatrix(rows, columns) {
  var i = 0, z = 0, y = 0, canGo = [], pass = false, exit;
  var mapMatrix = [];

  if (!rows) {
    rows = 3;
    columns = 3;
  }

  if (rows && !columns) {
    columns = rows;
  }

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

  return mapMatrix;
};

module.exports = setupMatrix;
