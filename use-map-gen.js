var map = require('./simple-map-gen.js')(3, 3, 2);

console.log('-- level mapping --');
map.forEach(function(levelObj, index){
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
