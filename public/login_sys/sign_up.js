/* Javascript of sign up page */

/* Selectors */
const buttonForm = document.querySelector('#buttonForm');
const usernameBox = document.querySelector('#usernameInput');
const emailBox = document.querySelector('#emailInput');
const passwordBox = document.querySelector('#passwordInput');
const passwordConfirmBox = document.querySelector('#passwordInputConfirm');

const messageLabel = document.querySelector('#message');

buttonForm.addEventListener('submit', signUpAction);

/*** Functions that don't edit DOM.
 ***/

// Event that happens when sign up button be clicked
function signUpAction(e) {
    e.preventDefault();

    const username = usernameBox.value;
    const email = emailBox.value;
    const password = passwordBox.value;
    const passwordConfirm = passwordConfirmBox.value;

    if (!checkValidUsername(username)) {
        showMessage("Invalid username.");
    } else if (!checkValidEmail(email)) {
        showMessage("Invalid email address.");
    } else if (!checkValidPassword(password, passwordConfirm)) {
        showMessage("Passwords do not match");
    } else {
        // TODO : SERVER CALL
        // Successfully signed up
    }

}

// Return true iff the username is valid.
function checkValidUsername(username) {
    // TODO : SERVER CALL
    return true;
}

// Return true iff the email is valid.
function checkValidEmail(email) {
    // TODO : SERVER CALL
    return true;
}

// Return true iff the password is valid.
function checkValidPassword(password1, password2) {
    return password1 === password2;
}

/*** DOM functions ***/

// Show message to the page
function showMessage(text) {
    messageLabel.innerHTML = "";
    const textNode = document.createTextNode(text);
    messageLabel.appendChild(textNode);
}
