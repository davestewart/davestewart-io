
// ------------------------------------------------------------------------------------------
// UI
// ------------------------------------------------------------------------------------------

	// help
	
		var currentPanel	= null;
		var currentHelp		= null;
		var previewWindow	= null;
		
		function showHelp(id)
		{
			var duration = 500;
			var newHelp = $(id);
			
			if(window.currentHelp && currentHelp[0] == newHelp[0] && newHelp.is(':visible'))
			{
				currentHelp.slideUp(duration);
			}
			else
			{
				if(currentHelp != null)
				{
					currentHelp.slideUp(duration);
				}
				newHelp.slideDown(duration);
			}
			currentHelp = newHelp;
		}
		
		function hideHelp()
		{
			if(window.currentHelp)
			{
				currentHelp.slideUp(500);
				currentHelp = null;
			}
		}
		
	// test code
	
		function testCode(type)
		{
			var date		= new Date();
			var url			= type == 'php' ? 'templates/php/php.template.txt' : 'templates/html/default.template.html';
			url += '?' + date.getMilliseconds();

			var callback	= function(data, success)
			{
				var type = data.indexOf('<!DOCTYPE html') > -1 ? 'html' : 'php';
				$('#' + type + '-text').val(data).focus().selectRange(0);
				//hideHelp();
			};
			
			$.get(url, callback);
		}
		
		function showCode(filename)
		{
			var date		= new Date();
			var url			= 'templates/php/' +filename+ '.txt';
			url += '?' + date.getMilliseconds();

			var callback	= function(data, success)
			{
				$('#php-text').val(data).focus().selectRange(0).trigger('change');
			};
			
			showHelp('#php-options');
			$.get(url, callback);
		}
		
		function panelClick(event)
		{
			var panel = $(event.currentTarget);
			if(currentPanel)
			{
				currentPanel.addClass('lowlight').removeClass('highlight');
			}
			currentPanel = panel;
			currentPanel.removeClass('lowlight').addClass('highlight');
		}
	

// ------------------------------------------------------------------------------------------
// FORMS
// ------------------------------------------------------------------------------------------

	function checkPHP()
	{
		var text = $('#php-text').val().replace(/(^\s+|\s+$)/);
		if(text == '')
		{
			alert('You need to paste some PHP in before you try converting.\n\nClick "See sample code..." if you just want to experiment.');
			return false;
		}
	}
	
	function checkHTML()
	{
		var text = $('#html-text').val().replace(/(^\s+|\s+$)/);
		if(text == '')
		{
			alert('You need to paste some HTML in before you try converting.\n\nClick "See sample code..." if you just want to experiment.');
			return false;
		}
	}

	function updateHTML(responseText, statusText)
	{
		var text = $('#html-text');
		var form = document.forms['php-form'];
		
		text.val(responseText);
		
		var action	= $('input[name="options[build][action]"]:checked').val();
		
		if(action == 'select')
		{
			text.trigger('click').focus().select();
		}
		else if(action == 'preview')
		{
			previewHTML();
		}
	}
	
	function updateWiki(responseText, statusText)
	{
		$('#wiki-text').val(responseText).trigger('click').focus().select();
	}

	function setAutoUpdate(state)
	{
		var form = document.forms['php-form'];
		$('input[id="options[build][action]:preview"]', form).attr('checked', true)
		$('input[id="options[build][update]"]', form).attr('checked', true)
	}
	
	function checkAutoUpdate()
	{
		var form = $('#php-form');
		var action = $('input[name="options[build][action]"]:checked', form).val();
		var update = $('input[name="options[build][update]"]', form)[0].checked;
		if(update)
		{
			form.submit();
		}
	}

	function previewHTML()
	{
		var text	= $('#html-text').val();
		var page	= window.location.toString().replace(/[^/]*?$/, '') + 'blank.html';
		//var win = window.open();//'', '', 'status=yes,scrollbars=yes');
		
		previewWindow = window.previewWindow && !previewWindow.closed ? previewWindow : window.open(page, 'previewWindow', 'status=yes,scrollbars=yes');
		previewWindow.document.open();
		previewWindow.document.write(text);
		previewWindow.document.close();
		previewWindow.focus();
	}
	
// ------------------------------------------------------------------------------------------
// INIT
// ------------------------------------------------------------------------------------------

	function init()
	{
		$('#php-form').submit
		(
			function()
			{ 
				$(this).ajaxSubmit({success:updateHTML,beforeSubmit:checkPHP}); 
				return false; 
			}
		); 
		
		$('#html-form').submit
		(
			function()
			{ 
				$(this).ajaxSubmit({success:updateWiki,beforeSubmit:checkHTML}); 
				return false; 
			}
		); 

		$('#php, #html, #wiki').addClass('lowlight').bind('click', panelClick);
		$('#php-form input, #php-form textarea').bind('change', checkAutoUpdate);
		$('#php-text').trigger('click').focus();
		
		if($.cookie('options'))
		{
			$('#php-intro').hide();
		}
		
		currentHelp = $('#php-options');
		
	}
	
	
	$(document).ready(init);
