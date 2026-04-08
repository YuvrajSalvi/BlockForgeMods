import { db, auth } from './firebase.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const form = document.getElementById('upload-form');
const catSelect = document.getElementById('category');
const regFields = document.getElementById('regular-fields');
const srvFields = document.getElementById('server-fields');

// 1. Protect Page
onAuthStateChanged(auth, (user) => {
    if (!user || user.email !== "yuvrajsalvi7737@gmail.com") {
        window.location.href = "login.html";
    }
});

// 2. Toggle Fields
catSelect.onchange = () => {
    if (catSelect.value === 'servers') {
        srvFields.classList.remove('hidden');
        regFields.classList.add('hidden');
    } else {
        srvFields.classList.add('hidden');
        regFields.classList.remove('hidden');
    }
};

// 3. Handle Upload
form.onsubmit = async (e) => {
    e.preventDefault();
    const cat = catSelect.value;
    
    let data = {
        name: document.getElementById('name').value,
        thumbnail: document.getElementById('thumb').value,
        timestamp: serverTimestamp()
    };

    if (cat === 'servers') {
        data.ip = document.getElementById('ip').value;
        data.port = document.getElementById('port').value;
    } else {
        data.author = document.getElementById('author').value;
        data.download = document.getElementById('download').value;
        data.desc = document.getElementById('desc').value;
        // Screenshots ko array mein badle
        const ss = document.getElementById('screenshots').value;
        data.screenshots = ss ? ss.split(',').map(s => s.trim()) : [];
    }

    try {
        await addDoc(collection(db, cat), data);
        alert("Published Successfully!");
        form.reset();
    } catch (err) {
        alert("Error: " + err.message);
    }
};

// 4. Logout
document.getElementById('logout-btn').onclick = () => {
    signOut(auth).then(() => window.location.href = "login.html");
};
