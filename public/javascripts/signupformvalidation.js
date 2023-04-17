var nameError = document.getElementById("name-error");
var emailError = document.getElementById("email-error");
var phoneError = document.getElementById("phone-error");
var submitError = document.getElementById("submit-error");
var subjectError = document.getElementById("subject-error");

function validateName() {
  var name = document.getElementById("name").value;
  var nameInput = document.getElementById("name");

  if (name.length == 0) {
    nameError.innerHTML = "Name is required";
    nameError.style.color = "red";
    nameInput.style.border = "solid 2px red";
    return false;
  }
  if (!name.match(/^[A-Za-z]+ [A-Za-z]+$/)) {
    nameError.innerHTML = "Write full name";
    nameError.style.color = "red";
    nameInput.style.border = "solid 2px red";

    return false;
  }
  nameError.innerHTML = "";
  // nameError.innerHTML = "Valid Name";
  nameError.style.color = "green";
  nameInput.style.border = "solid 2px green";

  return true;
}

function validateEmail() {
  var email = document.getElementById("email").value;
  var emailInput = document.getElementById("email");

  if (email.length == 0) {
    emailError.innerHTML = "Email is required";
    emailError.style.color = "red";
    emailInput.style.border = "solid 2px red";

    return false;
  }
  if (!email.match(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/)) {
    emailError.innerHTML = "Email invalid";
    emailError.style.color = "red";
    emailInput.style.border = "solid 2px red";

    return false;
  }
  emailError.innerHTML = "";
  emailError.style.color = "green";
  emailInput.style.border = "solid 2px green";
  return true;
}

function validatePhone() {
  var number= document.getElementById("contactNumber").value;
  var numberInput = document.getElementById("numberInput");
  var required = 10;
  var left = required - number.length;

  if (left > 0) {
    messageError.innerHTML = left + " more characters required.";
  numberInput.style.border = "solid 2px red";
    return false;
  } else {
    messageError.innerHTML = "Enter a valid message";
    numberInput.style.border = "solid 2px red";
  }

  numberError.innerHTML = "";
  messageInput.style.border = "solid 2px green";
  return true;
}



function validateForm() {
  if (
    !validateName() ||
    !validateEmail() ||
    !validatePhone() 
    )
   {
    submitError.style.display = "block";
    submitError.innerHTML = "Please fix all errors to submit.";
    setTimeout(function () {
      submitError.style.display = "none";
    }, 3000);
    return false;
  }

}
