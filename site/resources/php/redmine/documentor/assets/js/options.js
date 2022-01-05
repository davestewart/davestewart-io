var options = 
{
	
}

function toggleBranch(checkbox)
{
	var state	= checkbox.checked;
	var label	= $(checkbox).parents('label');
	var tree	= $(checkbox).parents('li').next('ul');
	
	//console.log(checkbox);

	//label[state ? 'removeClass' : 'addClass']('disabled')
	if(tree)
	{
		var labels = $('label', tree);
		var inputs = $('input', tree);
		
		labels[state ? 'removeClass' : 'addClass']('disabled');
		inputs.attr('disabled', state ? null : 'disabled');
	}
}

function checkboxClick(event)
{
	var checkbox = event.target;
	toggleBranch(checkbox);
	save();
}

function save()
{
	// debug
		//console.log('saving...');
	
	// checkboxes
		var checked = [];
		var unchecked = [];
		
		$('.options input[type=checkbox], .options input[type=radio]').each
		(
			function (i, e)
			{
				(e.checked ? checked : unchecked).push(e.id);
			}
		)
		
	// values
		var values = {};
		$('.options input[type=text]').each
		(
			function (i, e)
			{
				values[e.id] = e.value;
			}
		)
		
	// save
		var options = {checkboxes:{checked:checked, unchecked:unchecked}, inputs:values};
		$.cookie('options', $.toJSON(options));
}

function load()
{
	
	options = $.evalJSON($.cookie('options'));
	
	//console.log($.cookie('options'))
	
	if(options != null)
	{
		// checkboxes
			$('.options input[type=checkbox]').each
			(
				function(i, e)
				{
					e.checked = options.checkboxes.checked.indexOf(e.id) != -1
				}
			)
			
		// inputs
			/*
			$('input[type=text]').each
			(
				function(i, e)
				{
					e.value = options.inputs[e.id];
				}
			)
			*/
	}
}

function initForms()
{
	// load saved options
		load();
		
	// setup text inputs
		//$('input[type=text]').bind('change', save);
		
	// setup clicks
		var checkboxes = $('.options input[type=checkbox]');
		checkboxes.bind('click', checkboxClick);
		
		//console.log(checkboxes)
		
	// set tree enabled / disabled
		for(var i = checkboxes.length - 1; i >= 0; i--)
		{
			if(!checkboxes[i].checked)
			{
				toggleBranch(checkboxes[i]);
			}
		}
}


$(document).ready(initForms);