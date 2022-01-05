
// MAIN TRACKING FUNCTION

	// Call this from your pages instead of urchinTracker to get the 
	// added benefit of running any extra code, as well as confirming that 
	// urchinTracker has loaded

	function track(str){
		
		// debug
			//if(window.console && window.console.log)console.log('TRACKING: ' +str)
			
		// track
			if(window.urchinTracker && _uacct != '')urchinTracker(str)
		}


// INITIALIZE SCRIPT LOAD

	// loads the google analytics script dyncmically from a function closure
	// and waits until script has loaded before calling the tracking function

	(
	function(){
		
		// tracking id
			var _uacct		= '' // ADD YOUR TRACKING ID HERE
	
		// DOM variables
			var head		= document.getElementsByTagName('head')[0]
			var script		= document.createElement('script')
			
		// update DOM
			script.setAttribute('id',	'google-analytics')
			script.setAttribute('type',	'text/javascript');
			script.setAttribute('src',	'http://google-analytics.com/urchin.js')
			head.appendChild(script)
			
		// script-load callbacks
			function loaded(){
				if(this.readyState == "loaded"){
					init()
					}
				}
				
			function init(){
				window._uacct = _uacct
				track()
				}
			
		// run urchinTracker() only when script src has fully loaded
			script.addEventListener ? script.addEventListener('load', init, false) : script.onreadystatechange = loaded
			
		}
	)()
