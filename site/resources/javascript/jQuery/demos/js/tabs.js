
	function initTabs(){
	
		var tabs	= $('#tab-list-main a, #tab-list-preview a')
		tabs.bind
			(
			'click',
			function(e, i){
				showTab(e)
				}
			)
			
		var tabs	= $('#tab-list-main a:first, #tab-list-preview a:first')
		tabs.each(
			function(e, i){
				showTab(this)
				}
			)

		/*tabs.bind
			(
			'mouseover',
			function(e, i){showTab(e, true)}
			).bind
			(
			'mouseout',
			function(e, i){showTab(e, false)}
			)
		*/

		}

	function showTab(element, preview){
		// get element
			
			// DOM event i.e. a click
				if(element.target){
					element = element.target
					}

		// variables
			var tabGroup		= $(element).parents('ul')
			var tab				= $(element).parents('li')
			
			var sectionGroup	= $(tabGroup.attr('section'))
			var sectionName		= tab.attr('section')
			var section			= $(sectionName, sectionGroup)
			
		// preview
			/*
			if(preview != undefined){
				var id = sectionName+ ' h3'
				var previewHeader	= $(id)
				
				if(preview == true){
					$('#section-main-design h3').text(previewHeader.text())
					return
					}
				else if(preview === false){
					return
					}
				}
			*/

		// update tabs
			$('li', tabGroup).removeClass('active').addClass('inactive')
			tab.removeClass('inactive').addClass('active')
			
		// update sections
			$('.section', sectionGroup).hide()
			section.show()
			
		}
		