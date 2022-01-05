
	function initCodeHyperlinks(event)
	{
		// variables
			var body = $(event.currentTarget)

		// check that links have not yet been applied
			if($('a', body).length > 0)
			{
				return false;
			}
		
		// set waiting prompt
			body
				.prepend('<span class="tooltip">Adding hyperlinks...</span>');

			setTimeout
			(
				function()
				{
					// variables
						var html = body.html(), anchor, rx, link;
						
					// search html for keywords
						for(var i = 0; i < anchors.length; i++)
						{
							anchor	= anchors[i];
							rx		= new RegExp("\\b" +anchor+ "\\b", "gm")
							link	= '<a href="#">' +anchor+ '</a>';
							html	= html.replace(rx, link)
						}
						
					// replace
						body.html(html)
						
					// anchor updating function
						function update(i, e)
						{
							$(e)
								.attr('href', '#' + $(e).text())
								.bind('click', openCodeBlock);
						}
						
					// update anchors
						$('a', body).each(update);
					
					// remove waiting prompt
						$('.tooltip', body)
							.delay(100)
							.fadeOut(500);
					
				},
				100
			);
			
	}
		
	function toggleCodeBlock(event, ctrl)
	{
		if(event.target.nodeName != 'A')
		{
			
			// variables
				var block, body, desc;
				block = $(this).parent('.block')
				
				if(event.ctrlKey || ctrl == 'CTRL')
				{
					body	= $('.body', block);
					desc	= $('.desc', block);
				}
				else
				{
					body		=  $('> .body', block);
					desc 		=  $('.desc', block);
				}
				
			// animate
				if($(block.get(0)).hasClass('open'))
				{
					$(block.get(0)).removeClass('open');
					body.slideUp();
					desc.slideUp();
				}
				else
				{
					$(block[0]).addClass('open');
					body.slideDown();
					desc.slideDown();
					//setTitle($('a', block).attr('name'));
				}
		}
	}
	
	function setTitle(name)
	{
		if(name != '')
		{
			document.title = 'jQuery Deconstructed: ' + name;
		}
	}
	
	function openCodeBlock(event)
	{
		// variables
			var name	= $(event.target).text();
			var block	= $('a[name=' +name+ ']').parent('.block');
			var destination = block.offset().top;
			
		// move
			$("html:not(:animated),body:not(:animated)").animate
			(
				{scrollTop: destination}, 
				1000, 
				function() { window.location.hash = name }
			);
			
		// slide
			setTimeout
			(
				function()
				{
					$(block).addClass('open');
					$('> .body', block).slideDown();
					$('.desc', block).slideDown();
					//setTitle(name)
				},
				1100
			);
			
		// cancel link
			return false;
	}
	
	function userClick(event)
	{
		//console.log(event.target)
	}
	
	function changeColors(name)
	{
		$.cookie('colors', name);
		$('#css-theme').attr('href', 'assets/css/themes/' + name+ '.css');
	}
	
	function changeIcons(state)
	{
		$.cookie('icons', state);
		$('body')[state == 'yes' ? 'addClass' : 'removeClass']('icons')
	}
	
	var anchors;
	$(document).ready
	(
		function()
		{
			// interaction
				$('.head')
					.bind('click', toggleCodeBlock);
					
			// grab all anchors
				anchors = $.map($('a[name!=""]'), function(e, i) { return e.name; }).sort();
				
			// code hyperlinks
				$('.body')
					.one('mousemove', initCodeHyperlinks);
					
			// tooltips for blocks
				$('#jquery-container')
					.find('div.section')
					.attr('title', 'Click to toggle nested descriptions. CTRL+click to toggle ALL nested code');
					
				$('#jquery-container')
					.find('div.extend, div.object')
					.attr('title', 'Click to toggle code & nested descriptions. CTRL+click to toggle ALL nested code');
					
				$('#jquery-container')
					.find('div.function')
					.attr('title', 'Click to toggle description & code');
					
				$('#jquery-container')
					.find('div.variables, div.code')
					.attr('title', 'Click to toggle code');
					
			// tooltips for help
				$('div.head a').each
				(
					function(i, e)
					{
						this.title = 'View the documentation for ' + this.innerHTML;
					}
				)
					
			// bodies
				$('.body').hide();
				
			// page title
				//$('div#jquery-container').bind('click', userClick)
				
			// ui
				
				// colors
					var colors = $.cookie('colors') || 'pastel';
					$('select#colors').bind('change', function(event){changeColors($(event.target).val())})
					if(colors && colors != 'default')
					{
						$('#colors')
							.val(colors)
							.trigger('change');
					}
					
				// icons
					var icons = $.cookie('icons') || 'yes'
					$('select#icons').bind('change', function(event){changeIcons($(event.target).val())})
					$('#icons')
						.val(icons)
						.trigger('change');
		}
	)
