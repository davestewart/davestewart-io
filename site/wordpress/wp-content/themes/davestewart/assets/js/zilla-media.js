Zilla =
{
	// --------------------------------------------------------------------------------
	// defaults - these will be updated by the php as the page loads
	
		defaults:
		{
			gallery:
			{
				slideshow		:false,
				controlNav		:false,
				smoothHeight	:true,
				namespace		:'zilla-',
				prevText		:'Prev',
				nextText		:'Next',
				animationSpeed	:450
			},
			
			video:
			{
				swfPath			:'',
				preload			:'auto'
			}
			
		},
		
	// --------------------------------------------------------------------------------
	// gallery
				
		gallery:
		{
			options:
			{
				start:function(slider)
				{
					slider.container.click(function(event)
					{
						if( ! slider.animating )
						{
							slider.flexAnimate( slider.getTarget('next'));
						}
					});
				},
				
				after:function(slider)
				{
					if ( ! $(slider).data('initialized') )
					{
						$(slider)
							.data('initialized', true)
							.find('img')
							.each(function(i, e){
								var $e = $(e);
								$e
									.attr('src', $e.data('src'))
									.removeAttr('data-src');
								});
					}

				}

			},
			
			init:function()
			{
				this.options = jQuery.extend(this.options, Zilla.defaults.gallery);
				$('.zilla-slider')
					.imagesLoaded(this.onLoad);
			},
			
			onLoad:function()
			{
				$(this).flexslider(Zilla.gallery.options);
			}
		},
		
	// --------------------------------------------------------------------------------
	// video
				
		video:
		{
			players:{ },
			
			add:function(id, params)
			{
				this.players[id] = params;
			},
			
			init:function()
			{
				if ($().jPlayer)
				{
					var player, options;
					for(var id in this.players)
					{
						player			= this.players[id];
						options			= jQuery.extend(player.options, Zilla.defaults.video);
						options.ready	= function()
						{
							$(id).jPlayer('setMedia', player.media);
							//console.log(options)
						};
						$(id).jPlayer(options);
					}
				}
			}
		},
		
		onReady:function()
		{
			Zilla.gallery.init.call(Zilla.gallery);
			Zilla.video.init.call(Zilla.video);
		}
		
}

jQuery(Zilla.onReady);
