// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { render } from "ejs";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZqk25SB34puZ4rf4mz-rHD0xzbmOZPQA",
  authDomain: "transitus-brocamp.firebaseapp.com",
  projectId: "transitus-brocamp",
  storageBucket: "transitus-brocamp.appspot.com",
  messagingSenderId: "142825412566",
  appId: "1:142825412566:web:42c688485318863be8b677",
  measurementId: "G-8VXXY3XQND"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
function render(){

  window.recaptchaVerifier = app.auth.recaptchaVerifier('')

}

render();
