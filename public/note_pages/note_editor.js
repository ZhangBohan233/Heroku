"use strict";
// let numberofnotes = 0;
// class note
const note = function(title,content) {
    // this.username=username;
    this.title = title;
    this.author = null;
    this.date = null;
    this.content = content;
    // this.ID=username+numberofnotes;
    // numberofnotes++;
}
/* if we open a already exist note , we should insert its content and title to
    text_editor from. Since this needs server call to get user's saved note, we
    assume user writes a new note in this page in phase 1.
*/
//server call here
//get note of this user from server
//save text
const saveButton = document.querySelector('#save');
saveButton.addEventListener('click', saveFile);

function getCookie(cname) {
    console.log(document.cookie);
    const name = cname + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i<ca.length; i++)
    {
        const c = ca[i].trim();
        if (c.indexOf(name)===0) return c.substring(name.length,c.length);
    }
    return "";
}

function saveFile() {
    //get title
    const title = document.querySelector('#title').value;
    //get text
    const content = tinyMCE.get('content').getContent();
    console.log(title);
    console.log(content);
    /*if this note already  exists , modify it
     since we don't make server call , we only handle new note
    */
    //Since usser needs to login to open this page, it needs servercall to get username from server
    //hardcode user name
    let newNote = new note(title, content);
    // then save note in server


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
    newNote.date = date.getFullYear() + separator + nowMonth + separator + strDate;

    const username = getCookie("username");
    const url = '/user/' + username;

    newNote.author = username;

    console.log(newNote);
    console.log('save successfully');

    const request = new Request(url, {
        method: 'post',
        body: JSON.stringify(newNote),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request).then(function (res) {
        if (res.status === 200) {
            console.log('Added student')
        } else {
            console.log('error')
        }
        console.log(res)
    }).catch((error) => {
        console.log(error)

    })
}
