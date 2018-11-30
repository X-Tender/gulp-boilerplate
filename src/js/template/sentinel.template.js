(function(){
  var modules = ['###MODULES###'];

  function loadScript(name){
    var js_script = document.createElement('script');
    js_script.type = "text/javascript";
    js_script.src = name + '.js';
    js_script.async = true;
    document.getElementsByTagName('head')[0].appendChild(js_script);
  }

  document.addEventListener("DOMContentLoaded", function(event) {
    var modulesOnPage = modules.map( function(moduleName) {
      var dom = document.querySelector('[data-vhv-module-' + moduleName + ']');
      return dom != null ? null : moduleName;
    })
    .filter( function(moduleName) { return modleName != null });

    modulesOnPage.forEach( function(filename){
      loadScript(filename);
    });

  });

})();
