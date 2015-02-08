Notes = {

	//url: 'http://rest.localhost',
	//url: 'http://rest-client.localhost',
	url: 'http://janimattiellonen.localhost/app_dev.php',

	loadNotes: function(elementId) {
		$element = $(elementId);
		var self = this;

		$.ajax({
			url: this.url + '/api/v1/notes',
			success: function(data) {
				self.renderNotes(data, $element);
			}
		});
	},

	renderNotes: function(notes, $element) {
		var self = this;
		$element.html("");

		$.map(notes, function(note) {
			$element.append(self.renderNote(note));
		});
	},

	renderNote: function(note) {

		var $p = $('<p></p>').html(note.note);
		var $edit = $('<span><a href="#">Edit</a></span>').addClass("edit").attr('data-id', note.id);
		var $row = $('<div></div>').addClass("row");
		
		$row.append($edit);
		$row.append($p);
		
		return $row;
	},

	postNewNote: function(note) {

		$.ajax({
			url: this.url + '/api/v1/notes',
			cache: false,
			type: 'POST',
			data: {note: note},
			dataType: 'json',
			//contentType: 'application/json',
			//data: "note=note",
			success: function(data) {
				alert(JSON.stringify(data));
				//Notes.loadNotes('#notes');
			},
			error: function(requestObject, error, errorThrown) {
				alert("ERROR: " + JSON.stringify(requestObject) );
			}
		});
	},

	updateNote: function(note, id) {
		$.ajax({
			url: this.url + '/api/v1/notes' + id,
			type: 'PUT',
			data: {note: note},
			success: function(data) {
				alert("UPDATE: " + data);
				//Notes.loadNotes('#notes');
			}
		});
	},

};

$(document).ready(function() {

	Notes.loadNotes('#notes');


	$(document).on('click', 'button', function(e) {
		e.preventDefault();
		var noteId = $('#note-id').val();

		if (is.truthy(noteId)) {
			Notes.updateNote($('#note').val(), noteId);
		} else {
			Notes.postNewNote($('#note').val())
		}
	})

	$(document).on('click', 'a', function(e) {
		e.preventDefault();
		var noteId = $(this).parent().attr('data-id');
		$('#note').val($(this).parent().parent().find('p').html());
		$('#note-id').val(noteId);
	})
})