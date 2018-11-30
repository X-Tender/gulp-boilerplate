(function(){

  function sayHello2(){
    console.log('Hello');
    sayHello3();
  }

  function sayHello3(){
    console.log('Hello');
    sayHello();
  }


  function sayHello(){
    console.log('Hello');
    sayHello2();
    sayHello2();
  }
// Das ist ein test
sayHello();
})();
