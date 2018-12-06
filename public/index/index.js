const recentNotes = document.querySelector('#recentNotes');
const addNote = document.querySelector('#add');
const recentNoteList = recentNotes.getElementsByTagName('li');

addNote.addEventListener('click', addRecentNote);

function addRecentNote(e) {
    e.preventDefault();
    console.log(recentNoteList.length);
    const text = document.querySelector('#entry');
    addNoteToList(text);
}

function addNoteToList(text) {
    const note = document.createElement('li');
    const noteContent = document.createElement('a');
    noteContent.setAttribute('href', 'login.html');
    const content = document.createTextNode(text.value);
    noteContent.append(content);
    note.append(noteContent);

    if (recentNoteList.length < 10 ) {
        recentNotes.insertBefore(note, recentNoteList[0]);
    } else {
        recentNotes.removeChild(recentNoteList[9]);
        recentNotes.insertBefore(note, recentNoteList[0]);
    }
}