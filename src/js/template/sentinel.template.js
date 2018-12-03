(function() {
	var modules = ['###MODULES###'];
	var jsPath = './js/';
	var modulePrefix = 'xt';

	function loadScript(name) {
		var js_script = document.createElement('script');
		js_script.type = 'text/javascript';
		js_script.src = jsPath + name + '.js';
		js_script.async = true;
		document.getElementsByTagName('head')[0].appendChild(js_script);
	}

	document.addEventListener('DOMContentLoaded', function(event) {
		var prefix = modulePrefix !== '' ? modulePrefix + '-' : '';

		var modulesOnPage = modules
			.map(function(moduleName) {
				var dom = document.querySelector('[data-' + prefix + 'module-' + moduleName + ']');
				return dom == null ? null : moduleName;
			})
			.filter(function(moduleName) {
				return moduleName != null;
			});
		modulesOnPage.forEach(function(filename) {
			loadScript(filename);
		});
	});
})();
