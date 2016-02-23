var map = require('./simple-map-gen.js')(4, 4);

console.log('------------------------------------------------------------------')
map.forEach(function(array){
  console.log(array.map(function(ele){
    return ele.map(function(direction){
      return direction.name;
    });
  }).join(' | '));
  console.log('------------------------------------------------------------------')
});
