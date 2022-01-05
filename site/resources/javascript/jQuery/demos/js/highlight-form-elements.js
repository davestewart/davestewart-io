	$(document).ready(function() {
	
		var elements = $("input[type!='submit']").add("textarea").add("select")
			
		elements.bind
			(
			'focus', 
			function(){
				$(this).parents('li').addClass('highlight')
				}
			)
			
		elements.bind
			(
			'blur', 
			function(){
				$(this).parents('li').removeClass('highlight')
				}
			)

	});
