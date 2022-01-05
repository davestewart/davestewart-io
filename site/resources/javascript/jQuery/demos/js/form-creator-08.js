
	// ---------------------------------------------------------------------------------------------------------------
	// general utility functions
	// ---------------------------------------------------------------------------------------------------------------

		function escapeHTML(html){
			html = html.replace(/</g,'&lt;').replace(/>/g,'&gt;')
			//html = html.replace(/"/g,'&quot;').replace(/'/g,'&apos;').replace(/&/g,'&amp;')
			return html
			}
	
	
		function getControlValue(obj){
			for(var i = 0; i < obj.length; i++){
				if(obj[i].checked)return obj[i].value
				}
			return obj[0].value
			}
	
		function getControlIndex(obj){
			for(var i = 0; i < obj.length; i++){
				if(obj[i].checked)return i
				}
			}
			
		function indent(html, length, char){
			
			// get the indent
				char		= char || '\t'
				length		= length || 0
				
				var arr 	= new Array(Math.abs(length) + 1)
				var indent	= arr.join(char)
					
			// do the indent / outdent
				if(length > 0){
					var rxStartOfLine			= /([^\n]+)/g
					html	= html.replace(rxStartOfLine, indent + '$1')
					}
				else{
					var rxStartOfLineTabbed		= new RegExp('(^' +indent+ '|(\n)' +indent+ ')', 'gm')
					html	= html.replace(rxStartOfLineTabbed, '$2')
					}
	
			// return
				return html
			}
			
		function wrap(html, tag){
			
			// indent html
				html	= indent(html, 1)
					
			// add end of block linefeed
				var rxEndOfBlockLinefeed	= /(\r|\n)+$/
				if(!html.match(rxEndOfBlockLinefeed)){
					html	+= '\n'
					}
					
			// wrap html
				var rxTag	= /^<([^\s]+)\s+(.+)>/
				if(tag.match(rxTag) != null){
					html	= tag.replace(rxTag, '<$1 $2>\n' + html + '</$1>')
					}
				else{
					html	= '<' +tag+ '>\n' + html + '</' +tag+ '>\n'
					}
				
			// return
				return html
			}
	
		function clean(str, char){
			char	= char || '_'
			str		= str.toLowerCase()
			return str.replace(/[^A-Za-z0-9]/, char)
			}
			
	// ---------------------------------------------------------------------------------------------------------------
	// form utility functions
	// ---------------------------------------------------------------------------------------------------------------

		function getNameOrId(attr, name, subname){
			
			//console.log([name, subname])
			
			// variables
				var f			= document.forms['parameters']
				
				var dataType	= getControlValue(f['data[type]'])
				var strPrefix	= f['data[prefix]'].value
				var strTruncate	= f['data[options][truncate]'].value
				
				var strHier		= f['attributes[' +attr+ '][hierarchy]'].value
				var strSpace	= f['attributes[' +attr+ '][spaces]'].value
				var strIllegal	= f['attributes[' +attr+ '][illegal]'].value
				
			// regular expressions
				var rxSpace		= /[ -]+/g
				var rxIllegal	= /[^\w\s-]+/g
				var rxTrim		= /^[\s_-]+|[\s_-]+$/mg
				var rxTruncate	= new RegExp(strTruncate, 'mg')
				
			// truncation, spaces, illegal characters, trimming
				function clean(attr){
					attr = attr || ''
					if(attr != ''){
						attr			= attr.toLowerCase()
						attr			= strTruncate == '' ? attr : attr.split(rxTruncate)[0]
						attr			= strSpace == ' ' ? attr : attr.replace(rxSpace, strSpace)
						attr			= attr.replace(rxIllegal, strIllegal)
						attr			= attr.replace(rxTrim, '')
						}
					return attr
					}
					
				name			= clean(name)
				subname			= clean(subname)
				strPrefix		= clean(strPrefix)
				
			// variables
				var str				= ''
				var arr				= new Array()
				
			// gat name / id string
				// hierarchy
					if(strPrefix != ''){
						arr.push(strPrefix)
						}
		
				// compound values
					if(subname){
						if(dataType == 'numeric'){
							arr.push(name, '')
							}
						else if(dataType == 'associative'){
							arr.push(name, subname)
							}
						else{
							arr.push(subname)
							}
						}
					else{
						arr.push(name)
						}
					
				// join everything up
					if(strHier == ''){
						str = arr.pop()
						}
					else{
						if(strHier == '[]'){
							str = arr.shift()
							for(var i = 0; i < arr.length; i++){
								str += '[' +arr[i]+ ']'
								}
							}
						else{
							str += arr.join(strHier)
							}
						}
				//console.log(str)
	
	
			// return
				return str
			
			}
			
		function getName(name, subname){
			return getNameOrId('name', name, subname)
			}
			
		function getId(name, subname){
			return getNameOrId('id', name, subname)
			}
	

	// ---------------------------------------------------------------------------------------------------------------
	// UI functions
	// ---------------------------------------------------------------------------------------------------------------

		function selectHTML(){
			var html	= $('#html')
			var i		= document.forms[0]['markup[html][indent]'].value
			var str		= indent(html.val(), i)
			
			var unindent = function(){
				str = indent(html.val(), -i)
				html.val(str)
				html.unbind('blur')
				html.unbind('mousedown')
				}
			
			html.bind('blur',unindent)
			html.bind('mousedown',unindent)
				
			html.val(str)
			html.get(0).select()
			}
	
	// ---------------------------------------------------------------------------------------------------------------
	// update functions
	// ---------------------------------------------------------------------------------------------------------------

		function updateName(){
			var text = getName('element')
			$('#attributes\\[name\\]\\[example\\]').text(text)
			}
			
		function updateId(){
			var text = getId('element')
			$('#attributes\\[id\\]\\[example\\]').text(text)
			}

		function updateAll(){
			updateParameters()
			updateHTML()
			updateForm()
			}
			
		function updateForm(){
			var html	= $('#html')[0].value
			$('#elements').html(html)
			updateValidation()
			}
			
		function updateValidation(){
			$("#preview").validate
				(
				/*{debug:true}*/
				)
			}
	
		function updateParameters(){
			
			// basic variables
				var f		= document.forms['parameters']
				var type	= f['control[type]'].value
				
			// data type
			/*
				var state	= type.match(/^(checkbox)$/)
				var group	= $$('#data[type]-list')
				state ? group.show() : group.hide()
			*/
				
			// control label
				var state	= type.match(/^(checkbox|radio|select|select-multiple)$/)
				var group	= $$('#control[label]-list')
				state ? group.show() : group.hide()
				
			// control options
				var state	= type.match(/^(select)$/)
				var group	= $$('#control[options][select]-list')
				state ? group.show() : group.hide()
				
				var state	= type.match(/^(select-multiple)$/)
				var group	= $$('#control[options][multiple]-list')
				state ? group.show() : group.hide()
				
				var state	= type.match(/^(text)/)
				var group	= $$('#control[options][length]-list')
				state ? group.show() : group.hide()
				
				var state	= type.match(/^(textarea)$/)
				var group	= $$('#control[options][rows]-list')
				state ? group.show() : group.hide()
	
			// validation options
				var state	= type.match(/^(hidden|label)$/)
				var group	= $$('#validation-list input')
				group.attr('disabled', state ? 'disabled' : '')
				
			// tabs / select options
				var state		= f['markup[html][indent]'].value > 0
				var button		= $('#select_and_indent').get(0)
				button.value	= 'Select ' + (state ? '(and indent) ' : '') + 'HTML'
			
	
				
				
			}
	
	// ---------------------------------------------------------------------------------------------------------------
	// main function
	// ---------------------------------------------------------------------------------------------------------------

		function updateHTML(){
		
			// basic variables
				var f				= document.forms['parameters']
				
			// -------------------------------------------------------------------------------------------------------
			// user interface options
			
				// options
					var valRequired		= f['validation[required]'].checked
					var valRequiredClass= f['validation[class]'].checked
					var valErrorClass	= f['validation[error_class]'].value || 'error'
					var valAttribute	= f['validation[attribute]'].value || 'validation'
					
					//var valContext		= f['validation[context]'].checked
		
					var optError		= valRequired// || valContext
					
				// ui type
					//var type			= getControlValue(f['type'])
					var type			= f['control[type]'].value
					
					var isText			= type.match(/^(text|textarea)$/) != null
					var isFieldset		= type.match(/^(checkbox|radio)$/) != null
					var isSelect		= type.match(/^(select|select-multiple)$/) != null
					var isHidden		= type.match(/^hidden$/) != null
					var isLabel			= type.match(/^label$/) != null
	
				// class
					var attrClass		= f['markup[css][control]'].checked ? 'class="' +type+ '"' : ''
					var tagWrap			= f['markup[html][wrap]'].value || false
			// -------------------------------------------------------------------------------------------------------
			// data
			
				// ui data
					// variables
						var rxWhitespace	= /\s+/g
						var rxIndent		= /([^\n]+)/ // replace with /\t$1/
						
					// delimiters
						var strDelimiters = ''
						$(document.forms[0]['data[split]']).each(
							function(){
								strDelimiters += this.checked ? this.value : ''
								}
							)
						var strRegExp		= '[' +strDelimiters+ ']' +(f['data[options][ignore_multiple]'].checked ? '+' : '')+ ' *'
						var rxDelimiters	= new RegExp(strRegExp, 'gm')
						
					// labels
						var labels			= f['content[labels]'].value
						labels				= labels.split(rxDelimiters)
						
					// values
						var values			= f['content[values]'].value
						if(values == '' || values == null){
							if(!isText && !isLabel){
								values			= f['content[labels]'].value
								values			= values.toLowerCase().split(rxDelimiters)
								}
							}
						else{
							values			= values.toLowerCase().split(rxDelimiters)
							}
						
					// names & ids
						var ids				= labels
						var names			= labels
						
					/*
					// group label
						var groupLabel		= f['control[label]'].value
						var groupName		= clean(groupLabel, f['attributes[name][spaces]'])
						var groupId			= clean(groupLabel, f['attributes[id][spaces]'])
						
					// datatype
						var dataType		= getControlValue(f['data[type]'])
						if(dataType == 'numeric' && type=='checkbox'){
							groupName	+= '[]'
							groupId		+= '[]'
							}
					*/
						var groupLabel		= f['control[label]'].value
						var groupName		= getName(groupLabel)
						var groupId			= getId(groupLabel)
							
			// -------------------------------------------------------------------------------------------------------
			// user interface html
			
				// label variables
					var strLabel		= '<label for="$id">$text</label>\n'
					var strLabelReq		= '<label for="$id"><span class="required">$text</span></label>\n'
					var strError		= '<label for="$id" class="$className">This field is required</label>\n'
					
				// UI variables
					var strText			= '<input name="$name" id="$id" type="text" $className maxlength="$length" value="$value" $validation />\n'
					var strTextarea		= '<textarea name="$name" id="$id" $className rows="$rows" maxlength="$length" $validation /></textarea>\n'
	
					var strCheckbox		= '<label><input name="$name" id="$id" type="checkbox" $className value="$value" $validation/> $text</label>\n'
					var strRadio		= '<label><input name="$name" id="$id" type="radio" $className value="$value" $validation /> $text</label>\n'
					
					var strSelectStart	= '<select name="$name" id="$id" $className $options $validation>\n'
					var strSelectEnd	= '</select>\n'
					var strOption		= '<option value="$value">$text</option>\n'
					
					var strHidden		= '<input name="$name" id="$id" type="hidden" value="$value" />\n'
					var strLabelText	= '<label id="$id" class="text">$value</label>\n'
		
					var arrUI			=	{
											text: 		strText, 
											textarea:	strTextarea, 
											checkbox:	strCheckbox, 
											radio:		strRadio, 
											select:		strOption,
											'select-multiple': strOption,
											option:		strOption,
											hidden:		strHidden,
											label:		strLabelText
											}
	
					var strUI			= arrUI[type]
	
	
			// -------------------------------------------------------------------------------------------------------
			// functions
			
				function getLabel(label, id){
					var html	= valRequired ? strLabelReq : strLabel
					html		= html.replace(/\$text/g, label)
					html		= html.replace(/\$id/g, id)
					return html
					}
					
				function parseClassName(html, className){
					var rx	= new RegExp(className == '' ? ' \\$className' : '\\$className', 'gm')
					return html.replace(rx, className)
					}
					
				function parseUiString(html, options){
					for(var i in options){
						var rx = new RegExp('\\$' + i, 'gm')
						html = html.replace(rx, options[i])
						}
					return html;
					}


				function addValidation(html, type, id){
					var strValidation	= valRequired ? valAttribute + '="required:true"' : ''
					
					if(type == 'checkbox'){
						}
					if(type == 'radio'){
						}
					if(type == 'text'){
						}
					if(type == 'textarea'){
						}
					html	= parseUiString(html, {validation:strValidation})
					return html
					}
			// -------------------------------------------------------------------------------------------------------
			// loop for compound elements, or text fields
			
				var html	= ''
				var htmlUI	= ''
	
				for(var i = 0; i < labels.length; i++){
				
					// continue
						if(f['data[options][skip_empty]'].checked && labels[i] == '')continue
						
					// variables
						var htmlTemp		= ''
						
						var name			= getName(names[i])
						var id				= getId(ids[i])
	
					// text
						if(isText){
							var value			= values[i] || ''
							var rows			= f['control[options][rows]'].value
							var length			= f['control[options][length]'].value
							htmlTemp			+= getLabel(labels[i], id)
							htmlTemp			+= parseUiString(strUI, {label:labels[i], value:value, name:name, id:id, rows:rows, length:length})
							htmlTemp			= addValidation(htmlTemp, type, id)
							if(optError){
								htmlTemp		+= parseUiString(strError, {id:id, className:valErrorClass})
								}
							if(tagWrap){
								htmlTemp		= wrap(htmlTemp, tagWrap)
								}
							}
							
					// fieldset
						else if(isFieldset){
							var value			= values[i] || ''
							var name			= getName(groupLabel, names[i])
							var id				= getId(groupLabel, ids[i])
							htmlTemp			+= '	' + parseUiString(strUI, {text:labels[i], value:value, name:name, id:id})
							}
							
					// dropdown
						else if(isSelect){
							var value			= values[i] || ''
							htmlTemp			+= '	' + parseUiString(strUI, {text:labels[i], value:value})
							}
							
					// hidden
						else if(isHidden){
							var value			= values[i] || ''
							htmlTemp			+= '	' + parseUiString(strUI, {value:value, name:name, id:id})
							}
							
					// label
						else if(isLabel){
							valRequired			= false
							var value			= values[i] || '...'
							htmlTemp			+= getLabel(labels[i], id)
							htmlTemp			+= parseUiString(strUI, {value:value, id:id})
							if(tagWrap){
								htmlTemp		= wrap(htmlTemp, tagWrap)
								}
							}
							
					// finish
						htmlUI			+= htmlTemp
						
					} // end loop
	
			// -------------------------------------------------------------------------------------------------------
			// finish off
			
				// for fieldset elements
					if(isFieldset){
						htmlUI			= addValidation(htmlUI, type, groupId)
						html			= '<fieldset id="' +groupId+ '">\n' + htmlUI + '</fieldset>\n'
						}
						
				// dropdown lists
					else if(isSelect){
						var options = ''
						if(f['control[options][select]'].checked && type == 'select'){
							htmlTemp		= ''
							htmlTemp		+= '	<option value="" selected="selected">Select...</option>\n'
							htmlTemp		+= '	<option value="">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - </option>\n'
							htmlUI			= htmlTemp + htmlUI
							}
	
						if(type == 'select-multiple'){
							options = f['control[options][multiple]'].checked ? 'multiple="multiple"' : 'size="' +labels.length+ '"'
							}
						else{
							options = ''
							}
	
						strSelectStart	= parseUiString(strSelectStart, {options:options})
							
						html			= strSelectStart + htmlUI + strSelectEnd
						html			= addValidation(html, type, groupId)
						html			= parseUiString(html, {name:groupName, id:groupId})
						}
						
				// text
					else{
						html			= htmlUI
						}
						
				// add label
					if(isFieldset || isSelect){
						html			= getLabel(groupLabel, groupId) + html
						if(optError){
							html			= html + parseUiString(strError, {id:groupId, className:valErrorClass})
							}
						if(tagWrap){
							html			= wrap(html, tagWrap)
							}
						}
						
				// assign class
					html			= parseClassName(html, attrClass)
					
	
				// final form data
					$('#html')[0].value = html
			}