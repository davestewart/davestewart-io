
	/**
	 * Assign a random heading
	 */
	function initHeading()
	{
		// assign random heading
			/*
			var lines =
			[
				'Web Developer + Open Source Advocate',
				'Creative Web Developer + Entrepreneur'
			];
			var line = lines[Math.floor(Math.random() * lines.length)];
			$('#tagline').text(line);
			*/
			
		// assign lorm ipsum to empty posts
			$('.entry-content').each(function(i, e){
				var $e = $(e);
				if(/^\s+$/.test($e.text()))
				{
					$e.html('<p>Project copy coming shortly...</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>');
				}
			})
			
	}
	
	/**
	 * Initialize Isotope
	 */
	var isotopeOptions =
	{
		filter				:'.post',
		transformsEnabled	:false,
		animationEngine		:'css',
		animationOptions:
		{
			duration		:400,
			easing			:'swing',
			queue			:true
		}
	};
	
	function initIsotope()
	{
		$isotope	= $('.isotope-container').isotope(isotopeOptions);
	}
	
	/**
	 * Initialize the footer navigation on the home page
	 */
	function initFooterNav()
	{
		// bottom nav
		
			// handler
				function onFilterClick(event){
					$('#filter-nav a.active').removeClass('active');
					$(this).addClass('active');
					var category	= $(event.currentTarget).attr('href').substr(1);
					isotopeOptions.filter = category == 'all' ? '.post': '.category-' + category;
					$isotope.isotope(isotopeOptions);
					$(window).trigger('scroll');
				}
				
			// assign clicks
				$('#filter-nav-container')
					.insertAfter('#content')
					.hide()
					.find('a')
					.on('click', onFilterClick)
					.filter(':eq(0)')
					.addClass('active')
					
			// trigger if the page has been refreshed on an anchor
				if(window.location.hash)
				{
					$('#filter-nav-container a[href="' +window.location.hash+ '"]')
						.trigger('click');
				}
					
				$(window).on('load', function(){
					$('#filter-nav-container')
						.delay(2000)
						.slideDown(500, function(){
							})
					})
				
			
		// sticky headers
			$('.main-navigation')
				.wrap('<div class="sticky-nav" />');
				
			$('body:not(.single) .main-navigation')
				.parent()
				.sticky({topSpacing:0});
				
		// sticky footer hack
			$(window).on('scroll resize', function(event){
				var top				= $(document).scrollTop();
				var pageHeight		= $(document).height();
				var clientHeight	= $(window).height();
				var height			= $('#footer').height();
				var bottom			= pageHeight - top - clientHeight;
				var y				= bottom < height ? height - bottom: 0
				$('#filter-nav-container').css('bottom', y  + 'px');
			});
	
	}
	
	/**
	 * interaction on browse by tag page
	 */
	function initBrowseByTag()
	{
		if($('body').hasClass('page-posts-by-tag'))
		{
			$('h3').on('click', function(event)
			{
				// hide active item
					$('.entry-content ul.active').hide(200)
			
				// find next item
					var $ul = $(this).next().find('ul');
					
				// show or hide
					var visible = $ul.is(':visible')
					$ul[visible ? 'hide' : 'show'](200)
						.addClass('active');
						
				// cancel default action
					return false;
			})
			
			$('.entry-content ul').hide()
		}
	}
	
	/**
	 * Initialize site
	 */
	function init()
	{
		// other
			initBrowseByTag();

		// update search box with placeholder text
			$('#searchform input').attr('placeholder', 'Search...');
			
		// allow isotope container enough room so that filter can sit on the bottom of the screen
			var height =	$(window).height() - 390; // header + footer height
			$('.isotope-container').css('min-height', height);
			
		// update active menu item if viewing a post
			var matches = window.location.pathname.match(/\b(work|play|tools)\b/, '');
			if(matches)
			{
				var segment = matches.pop();
				$('#primary-nav a').each(function(){
					var segments = $(this).attr('href').match(/\w+/g);
					if(segments)
					{
						if(segments.pop() == segment)
						{
							$(this).parent().addClass('current-menu-item');
						}
					}
				});
			}
	}
	
	$ = jQuery;
	$(init);