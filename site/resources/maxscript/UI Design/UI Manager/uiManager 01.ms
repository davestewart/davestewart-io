-------------------------------------------------------------------------------------------------------------------------------
-- 
-- UI Manager
-- A struct containing methods to save and load rollout settings, such as size, position, control states, items, etc 
-- to a preferences file, as well as methods to accomplish UI control tasks for example keeping one spinner higher or lower 
-- than another when editing ranges.
-- 
-------------------------------------------------------------------------------------------------------------------------------
--
-- author:		Dave Stewart
-- website:		www.davestewart.co.uk / www.keyframesandcode.com
-- date:		1st May 2008
-- version:		0.5
-- max version:	not sure, probably all
--
-- updates:		
--
-------------------------------------------------------------------------------------------------------------------------------

struct uiManager
	(
	------------------------------------------------------------------------------------------------------
	-- properties
	------------------------------------------------------------------------------------------------------
	
		dialog			= undefined,
		inifile			= "",
		position		= [0,0],
		size			= [0,0],
		type			= "",
		
		loadPosition	= undefined,
		loadSize		= undefined,

	------------------------------------------------------------------------------------------------------
	-- ini settings
	------------------------------------------------------------------------------------------------------

		function saveSetting section key value =
			(
			setinisetting inifile section key (value as string)
			),
			
		function loadSetting section key =
			(
			getinisetting inifile section key
			),

			
	------------------------------------------------------------------------------------------------------
	-- dialog functions
	------------------------------------------------------------------------------------------------------
	
		function savePosition =
			(
			saveSetting "dialog settings" "position" (getDialogPos dialog)
			),
			
		function loadPosition =
			(
			local pos	= execute (loadSetting "dialog settings" "position")
			if classof pos == Point2 do setDialogPos dialog pos
			position	= getDialogPos dialog
			),
			
		function saveSize =
			(
			saveSetting "dialog settings" "size" (getDialogSize dialog)
			),
			
		function loadSize =
			(
			local size = execute (loadSetting "dialog settings" "size")
			if classof size == Point2 do setDialogSize dialog size
			size		= getDialogSize dialog
			),
			
		function loadRolloutStates =
			(
			),
			
		function saveRolloutStates =
			(
			),
			
		function initialize d =
			(
			dialog		= d
			inifile		= getdir #plugcfg + "\\" + d.title + ".ini"
			loadPosition()
			loadSize()
			),
			
		function deinitialize =
			(
			savePosition()
			saveSize()
			),
			
	------------------------------------------------------------------------------------------------------
	-- control functions
	------------------------------------------------------------------------------------------------------
	
		function updateSpinnerPair spn1 spn2 index offset:1 =
			(
			if index == 1 then
				(
				if spn1.value >= spn2.value do spn2.value = spn1.value + offset
				)
			else(
				if spn2.value <= spn1.value do spn1.value = spn2.value - offset
				)
			),
			
		function getValue c =
			(
			),

		function setValue c value =
			(
			),

	------------------------------------------------------------------------------------------------------
	-- preference functions
	------------------------------------------------------------------------------------------------------
	
		function saveValue c =
			(
			local value = case (classof c) of
				(
				ButtonControl:		c.text
				CheckButtonControl:	c.checked
				ComboBoxControl:	c.selection
				EditTextControl:	c.text
				GroupBoxControl:	c.text
				LabelControl:		c.text
				ProgressBar:		c.value
				SpinnerControl:		c.range
				)
			saveSetting "control values" c.name value
			),
			
		function loadValue c =
			(
			local value = loadSetting "control values" c.name
			if value == undefined do return false
			
			case (classof c) of
				(
				ButtonControl:		c.text			= value
				CheckButtonControl:	c.checked		= if value == "true" then true else false
				ComboBoxControl:	c.selection		= value as integer
				EditTextControl:	c.text			= value
				GroupBoxControl:	c.text			= value
				LabelControl:		c.text			= value
				ProgressBar:		c.value			= value as integer
				SpinnerControl:		c.range			= execute value
				)
			),
			
		function saveAllValues =
			(
			for c in dialog.controls do saveValue c
			),

		function loadAllValues =
			(
			for c in dialog.controls do loadValue c
			)

	)