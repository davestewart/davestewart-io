
// MAIN TRACKING FUNCTION

	// Call this from your pages instead of urchinTracker to get the 
	// added benefit of piggy-backing extra code, as well as confirming 
	// urchinTracker has loaded

	function track(str){
		
		// debug
			if(window.console && 
			   window.console.log && 
			   window.location.host == 'localhost'
			   )console.log('TRACKING: ' +str)
			
		// track
			if(window.urchinTracker && _uacct != '')urchinTracker(str)
		}


// INITIALIZE SCRIPT LOAD

	// loads the google analytics script dyncmically and waits until loaded
	// before calling the main tracking function

	(
	function(){
		
		// tracking id
			var _uacct		= '' // INSERT YOUR TRACKING ID HERE!
	
		// DOM variables
			var head		= document.getElementsByTagName('head')[0]
			var script		= document.createElement('script')
			
		// update DOM
			script.setAttribute('id',	'google-analytics')
			script.setAttribute('type',	'text/javascript');
			script.setAttribute('src',	'http://www.google-analytics.com/urchin.js')
			head.appendChild(script)
			
		// check if script tag attribute defer is set, and DON'T automatically run the tracking function
		// N.B. the filename variable here MUST match the currently running file!
			var defer		= false
			var filename	= 'google-analytics.js'
			var scripts		= document.getElementsByTagName('script')
			for(var i = 0; i < scripts.length; i++){
				var script	= scripts[i]
				var src		= script.getAttribute('src')
				if(src.indexOf(filename) != -1){
					defer = script.getAttribute('defer') != null
					break
					}
				}
				
		// script-load callbacks
			function init(){
				window._uacct = _uacct
				if(!defer)track()
				}
			
			function loaded(){
				if(this.readyState == "loaded"){
					init()
					}
				}
				
		// run urchinTracker() only when script src has fully loaded
			script.addEventListener ? script.addEventListener('load', init, false) : script.onreadystatechange = loaded
			
		}
	)()
