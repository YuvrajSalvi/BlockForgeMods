import { db } from './firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const cat = params.get('cat');

async function loadData() {
    if(!id || !cat) return;
    
    const docRef = doc(db, cat, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const item = docSnap.data();
        document.getElementById('item-name').innerText = item.name;
        document.getElementById('item-author').innerText = "Created by: " + (item.author || "Unknown");
        document.getElementById('item-desc').innerText = item.desc;
        document.getElementById('main-img').src = item.thumbnail;
        document.getElementById('dl-btn').href = item.download;

        // Screenshots Gallery
        const gallery = document.getElementById('screenshots-gallery');
        if(item.screenshots) {
            item.screenshots.forEach(url => {
                const img = document.createElement('img');
                img.src = url.trim();
                img.style.height = "180px";
                img.style.borderRadius = "10px";
                gallery.appendChild(img);
            });
        }
    }
}

// Share Button logic
document.getElementById('share-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied! Share it with your friends.");
});

loadData();