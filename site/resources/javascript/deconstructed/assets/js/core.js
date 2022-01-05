
	/* MAIN FUNCTIONS */
	
		function getCookies()
		{
			var v, obj = {}, matches = document.cookie.split(/; /gim);
			for(var i = 0; i < matches.length; i++)
			{
				v = matches[i].split('=')
				obj[v[0]] = v[1];
			}
			return obj;
		}
		
		function writeColorsStylesheet(path, name)
		{
			path		= path || '';
			name		= name || getCookies()['colors'] || 'pastel';
			document.write('<link href="' +path+ 'assets/css/themes/' +name+ '.css" rel="stylesheet" type="text/css" id="css-theme" />');
		}
	
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
				//body.prepend('<span class="tooltip">Adding hyperlinks...</span>');
	
				setTimeout
				(
					function()
					{
						// variables
							var html	= body.html();
							var rx		= /[$\w][$\w\d.]*?/g;
							var rx		= /[$\w][$\w\d]*(\.[$\w][$\w\d]*)?/g;
							
						// compare function
							function compare(str)
							{
								return anchors[str] != undefined ? '<a href="#' + str + '">' + str + '</a>' : str;
							}
							
						// search and replace in html
							html		= html.replace(rx, compare)

						// replace
							body.html(html)
							
						// anchor updating function
							function update(i, e)
							{
								$(e)
									.attr('href', '#' + $(e).text())
									.bind('click', scrollToAndOpenCodeBlock);
							}
							
						// update anchors
							$('a', body).each(update);
						
						// remove waiting prompt
							/*
							$('.tooltip', body)
								.delay(100)
								.fadeOut(500, function(){$(this).remove()})
							*/

						
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
					}
			}
		}
		
		
		function openCodeBlock(block)
		{
			$(block).addClass('open');
			$('> .body', block).slideDown();
			$('.desc', block).slideDown();
		}
		
		function scrollToAndOpenCodeBlock(event)
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
					function(){openCodeBlock(block)},
					1100
				);
				
			// cancel link
				return false;
		}
		
	/* UTILITIES */
	
		var expires	= new Date()
		expires.setDate(expires.getDate()+90); 
		var cookieProps = {domain:'deconstructed.keyframesandcode.com', path:'/', expires:expires.toUTCString()}
		//var cookieProps = {expires:expires.toUTCString()}
	
		function changeColors(name, setCookie)
		{
			if(setCookie !== false)
			{
				$.cookie('colors', name, cookieProps);
			}
			$('#css-theme').attr('href', '../assets/css/themes/' + name+ '.css');
		}
		
		function changeIcons(state, setCookie)
		{
			if(setCookie !== false)
			{
				$.cookie('icons', state, cookieProps);
			}
			$('#lib')[state == 'yes' ? 'addClass' : 'removeClass']('icons')
		}
		
		function changeHover(state, setCookie)
		{
			if(setCookie !== false)
			{
				$.cookie('hover', state, cookieProps);
			}
			$('#lib')[state == 'yes' ? 'addClass' : 'removeClass']('hover')
		}
		
		function m()
		{
			window.location.href = Base64.decode("bWFpbHRvOmRldkBkYXZlc3Rld2FydC5jby51az9zdWJqZWN0PUpTIExpYnMgRGVjb25zdHJ1Y3RlZA==");
		}
		
	/* MAIN */
	
		var anchors = {};
		$(document).ready
		(
			function()
			{
				// theme ui
					
					// colors
						var colors = $.cookie('colors') || 'pastel';
						$('select#colors').bind('change', function(event){changeColors($(event.target).val())})
						if(colors && colors != 'default')
						{
							$('#colors')
								.val(colors)
								.trigger('change', [false]);
						}
						
					// icons
						var icons = $.cookie('icons') || 'yes'
						$('select#icons').bind('change', function(event){changeIcons($(event.target).val())})
						$('#icons')
							.val(icons)
							.trigger('change', [false]);
							
					// hover
						var hover = $.cookie('hover') || 'no'
						$('select#hover').bind('change', function(event){changeHover($(event.target).val())})
						$('#hover')
							.val(hover)
							.trigger('change', [false]);
							
				// interaction
					$('.head')
						.bind('click', toggleCodeBlock);
						
				// grab all anchors
					$('a[name!=""]').each(function(i, e) { anchors[e.name] = e.name; });
					
				// code hyperlinks
					$('.body')
						.one('mousemove', initCodeHyperlinks);
						
				// tooltips for blocks
					$('#lib')
						.find('div.section .head')
						.attr('title', 'Click to toggle nested descriptions. CTRL+click to toggle ALL nested code');
						
					$('#lib')
						.find('div.extend .head, div.object .head')
						.attr('title', 'Click to toggle code & nested descriptions. CTRL+click to toggle ALL nested code');
						
					$('#lib')
						.find('div.function .head')
						.attr('title', 'Click to toggle description & code');
						
					$('#lib')
						.find('div.variables .head, div.code .head')
						.attr('title', 'Click to toggle code');
						
				// tooltips for help
					$('div.head a').one
					(
						'mouseover', 
						function(event)
						{
							var e				= event.target;
							var name			= this.innerHTML
							var parent			= $(e).parents('.extend, .object').get(0);
							var qualifiedName;
							
							if(parent != undefined)
							{
								parentName		= $(parent).children('.head').find('a').text();
								qualifiedName	= name == parentName || parentName == '' ? name : parentName + '.' + name;
							}
							else
							{
								qualifiedName	= name;
							}
							this.title	= 'View the documentation for ' + qualifiedName;
						}
					)
						
				// hide all code bodies
					$('.body').hide();
					
				// auto open blocks
					$('.auto-open > .body').show()
					
			}
		)
