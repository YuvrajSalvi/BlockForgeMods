import { auth } from './firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;

        if (email !== "yuvrajsalvi7737@gmail.com") {
            alert("This email is not authorized as Admin!");
            return;
        }

        signInWithEmailAndPassword(auth, email, pass)
            .then(() => {
                window.location.href = "admin.html";
            })
            .catch(err => alert("Login Error: " + err.message));
    });
}