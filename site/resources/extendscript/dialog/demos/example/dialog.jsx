var win = new Dialog("Text Slicer", 100, 150);

	win.set.margins(10);
	win.set.spacing(10);

	win.add.panel('Slices');

		win.add.radiobuttons('align', 'Align to', ['Document', 'Layer'], ['document', 'layer']);
		win.add.edittext('prefix', 'Name-prefix', '');
		win.add.edittextbox('story', 'Your life story', '', 5);


	win.add.panel('Generate');

		var dd = win.add.dropdown('states', 'States', ['', '-', 'Over', 'Over, down'], ['', 'over', 'over,down']);

	win.add.panel('CSS', true);

		win.add.panel('Generate Links', true);

			win.add.dropdown('links', 'For', ['', '-', 'Text elements', 'Link elements'], ['', 'text', 'link']);
		
	win.set.panel('parent parent parent');

	win.add.checkbox('zoo', 'Go to the zoo', '');

	win.add.checkboxes('animals', 'And see', ['Jungle animals','Winter animals'],['jungle','winter']);
	win.add.panel('Do something else');

		win.add.radiobuttons('crazy', 'Go crazy with', ['An axe', 'A gun', 'A balloon'], ['axe', 'gun', 'balloon'], 2);
		win.add.separator();
		win.add.dropdown('css', 'For', ['', '-', 'Text elements', 'Link elements'], ['', 'text', 'link']);
		win.add.listbox('numbers', 'Listbox', ['one', 'two', 'three', 'four'],[1, 2, 3, 4], 2);

		
	win.add.panel('Values', null);
	
		var b = win.container.add('button');
		b.preferredSize = win.utils.getSize('panel');
		b.text = 'View now...'
		b.addEventListener ('click', showData)

	win.add.okCancel();

data = win.show();