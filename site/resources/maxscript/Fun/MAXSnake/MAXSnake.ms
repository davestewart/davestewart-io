-- Script:		MAXSnake!
-- Author:		Dave Stewart
-- Release:		0.5
-- MaxVersion:	Tested on 8, will probably work on lower versions quite happily.
-- Date:		June 6th 2007

-- Description:	Use your mouse to play a variation on the classic Snake game!

-- Instructions:The aim of teh game is to survive as long as possible, or shorten your
--				body by eating power pills. If you accidentally bump a pill without 
--				eating it your body gets longer. If you ru over your own body, your
-- 				body gets longer. Have fun!

-- To do:		Scoring, finish bumpy board (and animate it) probably tinker with gameplay, finish the bumpy course.

clearListener()
try (destroydialog roMAXSnake); catch(err)

rollout roMAXSnake "MAXSnake!" width:160 height:40
(
	local arrSegs		= #()
	local arrPills		= #()
	local arrObjs		= #()
	
	local segCount		= 15
	local timerInterval	= 10
	local mouseObj
	local createPills, eatPill, cleanup
	
	local isColliding	= false
	local counter		= 0
	local counterMax	= 20
	
	local boardSize		= 3000
	local boardIsBumpy	= false
	
	local vptLayout		= viewport.getLayout()
	
	Timer tmr1 "Timer" pos:[8,40] width:24 height:24 interval:100
	checkButton ckbTimer "Active" pos:[8,8] width:72 height:24 checked:true
	button btnRestart "Restart" pos:[80,8] width:74 height:24
	
	fn planeLineIntersect planePoint planeNormal linePoint lineVector =
		(
		local lineVector	= normalize lineVector
		local d1			= dot (planePoint - linePoint) planeNormal
		local d2			= dot lineVector planeNormal
		if abs d2 < 0.0000000754 then
			(
			if abs d1 > 0.0000000754 then 0 else -1
			)
		else(
			linePoint + ( (d1/d2) * lineVector )
			)
		)

	fn moveToSurface src trg =
		( 
		r1	= ray (src.pos + [0,0,10000]) [0,0,-1] 
		r2	= intersectRay trg r1
		z	= if r2 == undefined then 0 else r2.pos.z
		src.pos.z = z
		)
	

	fn getMousePos =
		(
		local p	= mouse.pos
		local r	= mapScreenToWorldRay p
		local p3 = planeLineIntersect [0,0,0] [0,0,1] r.pos r.dir
		p3
		)


	function addSegment trgObj: col: =
		(
		-- create
			local obj		= box()
			if col == unsupplied do col = red
			obj.wirecolor	= col
			obj.pivot		= obj.center

		-- store object
			append arrSegs obj
			
		-- lookat
			if trgObj == unsupplied do trgObj = arrSegs[arrSegs.count]
			obj.target		= trgObj
			obj
		)

	function removeSegment =
		(
		-- object
			local obj = arrSegs[arrSegs.count]
		-- create a dummy target, or else 2 nodes get deleted!
			local d = dummy ishidden:true
			obj.target = d
		-- kill objects
			delete obj
			arrSegs.count = arrSegs.count - 1
		)

	function setup =
		(
		-- new scene
			delete objects
		
		-- create target
			mouseObj = point()
			append arrObjs mouseObj
			hide mouseObj

		-- create objects
			local obj, trgObj = mouseObj
			for i = 1 to segCount do
				(
				trgObj		= addSegment trgObj:trgObj
				trgObj.pos	= [0, -i * 30, 0]
				)
			arrSegs[1].wirecolor = black
				
		-- gameboard
			local mat = standardmaterial name:"Gameboard"
			local map = mat.diffuseMap = Bricks()
			map.coords.V_Tiling = 2
			map.coords.U_Tiling = 2
			showtexturemap mat map on
			
			local p = plane width:boardSize length:boardSize pos:[0,0,-10] material:mat name:"Gameboard" wirecolor:black lengthsegs:30 widthsegs:30
			
			if boardIsBumpy == true do
				(
				p.lengthsegs	= 50
				p.widthsegs		= 50
				
				addModifier p (NoiseModifier())
				n				= p.modifiers[1]
				n.strength		= [0,0,100]
				n.scale			= 300
				)
			
			
			--converttopoly p
			append arrObjs p
			
			when select $Gameboard changes do deselect $Gameboard
				
		-- camera
			local c		= freecamera ishidden:true
			c.pos		= [0,-300,200]
			rotate c (angleaxis 70 [1,0,0])
			c.fov		= 80
			c.parent	= arrSegs[1]
			append arrObjs c
			--hide c
			
		-- lights
			local l1	= omnilight pos: [-2000,2000,-100] multiplier:1.0 color:white ishidden:true
			local l2	= omnilight pos: [2000,-2000,-100] multiplier:0.5 color:(color 150 150 255) ishidden:true
			append arrObjs l1
			append arrObjs l2
			
			local spot	= freespot pos: [0,-100,300] hotspot:50 falloff:120 ishidden:true
			rotate spot (angleaxis 35 [1,0,0])
			spot.parent	= arrSegs[1]
			append arrObjs spot

		-- viewports
			viewport.setLayout #layout_3vl --#layout_2v
			
			viewport.activeViewport = 1
			viewport.setType #view_top
			viewport.SetRenderLevel #flat
			viewport.setGridVisibility 1 false
			
			viewport.activeViewport = 2
			viewport.setType #view_persp_user
			viewport.setTM (matrix3 [0.713251,-0.532976,0.455204] [0.700909,0.54236,-0.463219] [0,0.649448,0.760406] [-24.3243,333.06,-4051.52])
			viewport.SetRenderLevel #smoothhighlights
			viewport.setGridVisibility 2 false
			
			viewport.activeViewport = 3
			viewport.setType #view_camera
			viewport.SetRenderLevel #smoothhighlights
			viewport.setGridVisibility 3 false
			
			max tool zoomextents all
			
		-- new pill
			createPills 10
			
		-- start
			tmr1.active = false
			ckbTimer.checked = tmr1.active = queryBox "Start game!?"
		)
		
	function follow trg src strict:true =
		(
		local p		= trg.pos - src.pos
		local np	= normalize p
		local mp

		local d		= distance [0,0,0] p
		local fd	= src.height * 2

		--format "%\n" p
		if d > fd do
			(
			if strict then
				(
				mp		= p - np * fd
				--mp		= np * fd
				src.pos	+= mp
				)
			else(
				mp		= np * fd
				src.pos	+= mp
				)
			)
		)
		
	function animateObjects =
		(
		-- mouse
			mouseObj.pos	= getMousePos()

		-- move
			follow mouseObj arrSegs[1] strict:false
			--if boardIsBumpy == true do moveToSurface arrSegs[1] $Gameboard
			for i = 1 to arrSegs.count - 1 do
				(
				local trgObj = arrSegs[i]
				local srcObj = arrSegs[i + 1]
				if isValidNode srcObj do
					(
					follow trgObj srcObj
					if boardIsBumpy == true do moveToSurface srcObj $Gameboard
					)
				)
				
		)
		
	function killPill pill =
		(
		deleteItem arrPills (findItem arrPills pill)
		delete pill
		
		)
		
	function eatPill pill =
		(
		removeSegment()
		killPill pill
		createPills 2
		)
		
	function createPills n =
		(
		for i = 1 to n do
			(
			local s		= sphere()
			local v		= boardSize * 0.4
			s.pos		= random [-v, -v, 0] [v, v, 0]
			s.wirecolor	= white
			append arrPills s
			if boardIsBumpy == true do
				(
				moveToSurface s $Gameboard
				s.pos.z += s.radius
				)
			)
		)
		
	function checkPills =
		(
		local endLoop = false
		
		for pill in arrPills do
			(
			-- eat!
				if intersects pill arrSegs[1] do
					(
					eatPill pill
					exit
					)
				
			-- hit!
				for i = 2 to arrSegs.count do
					(
					if intersects arrSegs[i] pill do
						(
						addSegment col:orange
						addSegment col:orange
						killPill pill
						createPills 2
						endLoop = true
						exit
						)
					/*
					*/
					)
			if endLoop do exit
			)
		)
		
	function checkReinstateCollisions =
		(
		if isColliding == true do
			(
			counter += 1
			if counter == counterMax do
				(
				isColliding = false
				counter = 0
				)
			)
		)
		
	function checkCollisions =
		(
		local n = 1
		for i = 1 to arrSegs.count do
			(
			for j = n to arrSegs.count do
				(
				--format "% % %\n" i j n
				if i == j do continue
				if (distance arrSegs[i] arrSegs[j]) < arrSegs[i].width do
					(
					addSegment col:yellow
					addSegment col:yellow
					--print arrSegs[i]
					--print arrSegs[j]
					isColliding = true
					exit
					)
				if isColliding do exit
				)
			if isColliding do exit
			n += 1
			)
		)
		
	function checkBounds =
		(
		/*
		*/
		local p = arrSegs[1].pos
		if p.x > $gameboard.max.x OR p.x < $gameboard.min.x OR p.y > $gameboard.max.y OR p.y < $gameboard.min.y do
			(
			messagebox "You went out of bounds!"
			cleanup()
			setup()
			)
		)
		
	function checkSegs =
		(
		if arrSegs.count == 1 do
			(
			messagebox "Well done! You ate enough pills!"
			cleanup()
			setup()
			)
		)
		
	function cleanup = 
		(
		tmr1.active = false
		delete mouseObj
		for seg in arrSegs do
			(
			try(delete seg);catch(err)
			)
		for pill in arrPills do
			(
			try(delete pill);catch(err)
			)
		for obj in arrObjs do
			(
			try(delete obj);catch(err)
			)
			
		arrSegs		= #()
		arrPills	= #()
		arrObjs		= #()
		
		SetUIColor 41 (GetDefaultUIColor 41)

		)
	
	
	
	
	on roMAXSnake open	do
		(
		SetUIColor 41 [0,0,0]
		colorMan.repaintUI #repaintAll
		setup()
		)
	on roMAXSnake close do
		(
		cleanup()
		colorMan.repaintUI #repaintAll
		viewport.setLayout vptLayout
		)
		
	on ckbTimer changed state do tmr1.active = state
	on tmr1 tick do
		(
		animateObjects()
		checkPills()
		checkCollisions()
		checkReinstateCollisions()
		checkBounds()
		checkSegs()
		)
	on btnRestart pressed do
		(
		cleanup()
		setup()
		)
)

createdialog roMAXSnake
