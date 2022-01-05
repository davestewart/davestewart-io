$.extend($.fn, {
        selectRange: function(start, end) {
            // use only the first one since only one input can be focused
			end = end || start;
            if ($(this).get(0).createTextRange) {
                var range = $(this).get(0).createTextRange();
                range.collapse(true);
                range.moveEnd('character',   end);
                range.moveStart('character', start);
                range.select();
            }
            else if ($(this).get(0).setSelectionRange) {
                $(this).focus().get(0).setSelectionRange(start, end);
            }
            return $(this);
        }
});
