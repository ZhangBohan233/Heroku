const userEntries = document.querySelector('#users')
//console.log(userEntries)
userEntries.addEventListener('click', handler)

function handler(e){
    if (e.target.classList.contains('deleteuser')){
        userToDelete = e.target.parentElement
        //console.log(userToDelete)
        //need server call to delete user from data
        userToDelete.parentNode.removeChild(userToDelete)
    }
    if (e.target.classList.contains('deletenote')){
        noteToDelete = e.target.parentElement.parentElement
        //console.log(noteToDelete)
        //need server call to delete note from data
        //userToDelete.parentNode.removeChild(userToDelete)
        noteToDelete.parentNode.removeChild(noteToDelete)
    }
}