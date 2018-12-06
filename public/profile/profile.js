/* Javascript of profile page */
const log = console.log;

// Selectors
const editClick = document.querySelector("#editInfo");
const birthdaySpan = document.querySelector("#birthdaySpan");
const addNewNote = document.querySelector("#addNewNote");
const notes = document.querySelector("#notes");
const iconBig = document.querySelector('#userPicBig');
const icon = document.querySelector('#userPic');
// TODO: need to get information of notes wrote in the note_editor from server.

// Event listener
editClick.addEventListener('click', editInfo);
addNewNote.addEventListener('click', addNote);
notes.addEventListener('click', handler);
iconBig.addEventListener('click', changeIcon);

// Global variables
let birthdayText = "";
let isEditing = false;
let inputBox = null;


/*** Functions that do not edit DOM ***/
function editInfo(e) {
    e.preventDefault();

    if (!isEditing) {
        changeTextToInput()
    } else {
        changeInputToText()
    }

    isEditing = !isEditing
}

function addNote(e) {
    e.preventDefault();
    addNewNoteEntry();
}

// Handler that handles the icon change
function changeIcon(e) {
    e.preventDefault();

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.jpg, .jpeg, .png, .bmp, .gif';
    // fileInput.onchange = iconHandler();
    fileInput.click();

    fileInput.addEventListener('change', iconHandler);

}

function handler(e) {
    if (e.target.classList.contains('delete')) {
        userToDelete = e.target.parentElement;
        //console.log(userToDelete)
        //need server call to delete user from data
        userToDelete.parentNode.removeChild(userToDelete)
    }
}


/*** DOM functions ***/

// Changes the birthday text to a input box
function changeTextToInput() {
    birthdaySpan.innerHTML = '';
    inputBox = document.createElement('input');
    inputBox.placeholder = "yyyy-mm-dd";
    birthdaySpan.appendChild(inputBox);

    editClick.textContent = "Save";
}

// Changes and save the newly input birthday
function changeInputToText() {
    birthdayText = inputBox.value;
    inputBox = null;
    const textNode = document.createTextNode(birthdayText);
    birthdaySpan.innerHTML = '';
    birthdaySpan.appendChild(textNode);

    editClick.textContent = "Edit";
    saveBirthday(birthdayText);
}

// Change the icon of user
function iconHandler(e) {
    iconBig.setAttribute('src', e.target.files[0].name);
    icon.setAttribute('src', e.target.files[0].name);
    // TODO : Change the user data and upload the new user icon to server
}

// Adds a new note to the list of notes
// This is only for the test button.
// The real function needs the response of the "save" button in note_editor.
function addNewNoteEntry() {
    const noteList = notes.getElementsByTagName('div');

    const newNote = document.createElement('div');
    newNote.className = 'note';

    const title = document.createElement('a');
    title.setAttribute('href', 'note_viewer_owner.html');
    const titleText = document.createElement('h2');
    const titleText_ = document.createTextNode('New note');
    // titleText_ will be the tile record from the note_editor.
    titleText.append(titleText_);
    title.append(titleText);

    const dateStr = document.createElement('p');
    dateStr.className = 'date';

    const date = new Date();
    let nowMonth = date.getMonth() + 1;
    let strDate = date.getDate();
    const separator = "-";
    if (nowMonth >= 1 && nowMonth <= 9) {
        nowMonth = "0" + nowMonth;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    const nowDate = date.getFullYear() + separator + nowMonth + separator + strDate;

    const dateStr_ = document.createTextNode(nowDate);
    dateStr.append(dateStr_);

    const content = document.createElement('p');
    content.className = 'noteTexts';
    const content_ = document.createTextNode('New content');
    // content_ will be the content record from the note_editor.
    content.append(content_);

    const edit = document.createElement('a');
    edit.setAttribute('href', '../note_pages/note_editor.html');
    const editButton = document.createElement('button');
    editButton.className = 'edit';
    const editButton_ = document.createTextNode('Edit');
    editButton.append(editButton_);
    edit.append(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete';
    const deleteButton_ = document.createTextNode('Delete');
    deleteButton.append(deleteButton_);

    newNote.append(title);
    newNote.append(dateStr);
    newNote.append(content);
    newNote.append(edit);
    newNote.append(deleteButton);
    notes.insertBefore(newNote, noteList[1]);
}

// Saves the birthday to user info
function saveBirthday(birthday) {
    // TODO : SERVER CALL
}
