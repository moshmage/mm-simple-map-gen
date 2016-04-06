'use strict';

var config = {
  columns: 0,
  rows: 0,
  maxEscapeRoutes: 1,
  usedEscapes: 0
};

var exits = {
  west: 1,
  east: 2,
  north: 3,
  south: 4
};

var exitValues = {
  west: {
    col: -1
  },
  east: {
    col: 1
  },
  north: {
    row: -1
  },
  south: {
    row: 1
  }
}

var exitReverse = {
  west: 'east',
  nort: 'south',
  east: 'west',
  south: 'north'
};

function getExitValue(direction) {

}

/* Return the exit node name in position <index> */
function getExitNameByIndex(index) {
  return Object.keys(exits)[index];
}

function getExitCodeByName(name) {
  var found = false;
  Object.keys(exits).some(function (key, index) {
    if (key === name) {
      found = index + 1;
      return true;
    }
  });
  return found;
}

function getExitNameByCode(code) {
  var i, pass = false;
  for (i = Object.keys(exits).length - 1; i >= 0; i--) {
    if (exits[getExitNameByIndex(i)] === code) {
      pass = Object.keys(exits)[i];
      break;
    }
  }
  return pass;
}

/* isReverseDirection */
function isReverseDirection(blockExitCode, testExitName) {
  console.log('testExitName ' + testExitName + ' blockExitCode ' + blockExitCode);
  return exitReverse[getExitNameByCode(blockExitCode)] === exitReverse[testExitName];
}

/* get a random exit node code */
function getRandomExit() {
  return exits[getExitNameByIndex(Math.floor(Math.random() * (exits.length - 1)))];
}

/* return true if random number from 0 to 10 is >= 5 */
function passFail() {
  var max = 1000, min, value;
  value = Math.floor(Math.random() * max)
  min = max - Math.floor(Math.random() * max);
  return value > min;
}

/* return true if no constraint */
function basicRulesPass(exit, row, column) {
  var randomExitAllowed;
  if (exit === exits.west && column === 0) {
    return false;
  }
  if (exit === exits.north && row === 0) {
    return false;
  }
  if (exit === exits.east && column === config.columns) {
    return false;
  }
  if (exit === exits.south && row === config.rows) {
    return false;
  }

  /* If it didn't return until now, we are probably on the middle
   * but we'll still make sure of that and then return passFail()
   * so we can make some randomness on the middle blocks */
  if (row > 0 && row < config.rows &&
      column > 0 && column < config.columns) {
    randomExitAllowed = passFail();
    // console.log('passFail', randomExitAllowed)
    return randomExitAllowed;
  }

  return true;
}

/* returns true if node can be an exit */
function canBeExit(exit, row, column) {

  if (exit === exits.north || exit === exits.right || exit === exits.south) {
    if (column === config.columns || column === Math.ceil((config.columns / 2) + 1)) {
      return true;
    }
  }

  return false;
}

function convertToWaybackCode(exitCode, direction) {
  var codeBreak = exitCode.split(':'), row = codeBreak[0], column = codeBreak[1];

  if (row == 0 && direction === exits.north) {
    return config.rows + ':' + column;
  }
  if (row == config.rows && direction === exits.south) {
    return '0:' + column;
  }

  if (column == 0 && direction === exits.west) {
    return row + ':' + config.columns;
  }
  if (column == config.columns && direction === exits.east) {
    return row + ':0';
  }

  return;
}

function isWayBack(row, column, exit, level, levelBox) {
  var exitCode = row + ':' + column, escapeNode = levelBox[level] && levelBox[level].escapeNode;
  if (escapeNode && escapeNode.code && escapeNode.exit) {
    if (convertToWaybackCode(escapeNode.code, escapeNode.exit) === exitCode) {
      return isReverseDirection(escapeNode.exit, exit);
    }
  }
  return false;
}


/* setup the map matrix array
 * if no params are given, default is 3x3
 * if only rows are given, columns will have the same value
 * @param rows {Int}        - maximum number of rows
 * @param columns {Int}     - maximum number of columns
 * @param levels {Int}      - maximum number of levels;
 * @return Array            - Array of Objects {level: [...], escapeNode: {...}}
 */
function setupMatrix(rows, columns, levels) {
  var i = 0, z = 0, y = 0, l = 0, levelBox = [], columnBox = [], pass = false, escapeNode = {}, rowBox = [];

  if (!rows) {
    rows = 3;
    columns = 3;
  }

  if (rows && !columns) {
    columns = rows;
  }

  if (!levels) {
    levels = 1;
  }

  config.rows = rows - 1;
  config.columns = columns - 1;

  for (l = 1; l <= levels; l++) {
    levelBox[l-1] = {};
    config.usedEscapes = 0;
    for (z = 0; z <= config.rows; z++) {
      rowBox[z] = [];
      for (i = 0; i <= config.columns; i++) {
        columnBox = [];
        for (y = Object.keys(exits).length - 1; y >= 0; y--) {
          pass = basicRulesPass(exits[getExitNameByIndex(y)], z, i) || false;
          if (!pass && passFail()) {
            if (config.usedEscapes < config.maxEscapeRoutes) {
              pass = canBeExit(exits[getExitNameByIndex(y)], z, i) || (z === config.rows && i === config.columns);
              if (pass) {
                config.usedEscapes++;
                escapeNode.exit = exits[getExitNameByIndex(y)];
                escapeNode.code = z + ':' + i;
              }
            }
          }

          if (pass) {
            columnBox.push({
              name: getExitNameByIndex(y),
              code: y
            });
          }
        }
        rowBox[z].push(columnBox);
      }
    }
    levelBox[l-1].level = rowBox;
    levelBox[l-1].escapeNode = escapeNode;
  }

  return levelBox;
}

module.exports = {
  setupMatrix: setupMatrix,
  getExitCodeByName: getExitCodeByName,
  mapExitsValue: exitValues
}
