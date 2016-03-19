var mapMatrix = require('./map-matrix.js');
var mapLevelMatrix = [];
var config = {
  rows: 3,
  columns: 3
}

console.log('-- level mapping --');
for (var x = 0; x <= 1; x++) {
  mapLevelMatrix.push(mapMatrix(config.rows, config.columns, 1));
}

mapLevelMatrix.forEach(function(levelObj, index){
  levelObj = levelObj[0];

  if (levelObj && levelObj.level) {
    console.log('')
    console.log('Level: ' + index + ' exit: ' + levelObj.escapeNode.exit + ' code: ' + levelObj.escapeNode.code)

    levelObj.level.forEach(function(array){
      console.log(array.map(function(ele){
        return ele.map(function(direction){
          return direction.name;
        });
      }).join(' | '));
      console.log('------------------------------------------------------------------')
    });
  }
});
