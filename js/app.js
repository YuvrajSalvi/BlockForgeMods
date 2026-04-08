import { db } from './firebase.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Elements select karein
const grid = document.getElementById('item-grid');
const searchInput = document.getElementById('search-input');

let allItems = []; // Saara data yahan store hoga search ke liye

// 1. URL se Category pata karein (e.g., mods.html -> mods)
const path = window.location.pathname;
let category = "mods"; // Default

if (path.includes("maps")) category = "maps";
else if (path.includes("plugins")) category = "plugins";
else if (path.includes("apks")) category = "apks";
else if (path.includes("texturepack")) category = "texturepack";
else if (path.includes("server-list")) category = "servers";

// 2. Firebase se data fetch karne ka function
async function fetchData() {
    grid.innerHTML = "<p style='text-align:center; width:100%;'>Loading BlockForgeMods Content...</p>";
    
    try {
        // Data ko timestamp ke hisaab se naya pehle dikhayenge
        const q = query(collection(db, category), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        
        allItems = []; // Clear array
        querySnapshot.forEach((doc) => {
            allItems.push({ id: doc.id, ...doc.data() });
        });

        renderItems(allItems);
    } catch (error) {
        console.error("Error fetching data: ", error);
        grid.innerHTML = "<p style='text-align:center; width:100%; color:red;'>Error loading content. Check Firebase Rules.</p>";
    }
}

// 3. Items ko screen par dikhane (Render) ka function
function renderItems(data) {
    grid.innerHTML = ''; // Pehle grid saaf karein

    if (data.length === 0) {
        grid.innerHTML = "<p style='text-align:center; width:100%; color:#888;'>No items found in this category.</p>";
        return;
    }

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';

        // Card ka HTML structure
        // Agar category server hai toh IP dikhayenge, varna Author
        const subText = (category === 'servers') 
            ? `IP: ${item.ip}:${item.port}` 
            : `By ${item.author || 'Unknown'}`;

        card.innerHTML = `
            <img src="${item.thumbnail}" alt="${item.name}" loading="lazy">
            <div class="card-content">
                <h3>${item.name}</h3>
                <p>${subText}</p>
                <div id="card-actions-${item.id}"></div>
            </div>
        `;

        // Card par click karne se View Page par le jaye (Server list ko chhod kar ya copy button ke alawa)
        card.addEventListener('click', (e) => {
            // Agar copy button click hua hai toh redirect na karein
            if (e.target.tagName !== 'BUTTON') {
                window.location.href = `view.html?id=${item.id}&cat=${category}`;
            }
        });

        grid.appendChild(card);

        // 4. SERVER LIST ke liye "Copy IP" button add karna
        if (category === 'servers') {
            const actionDiv = document.getElementById(`card-actions-${item.id}`);
            const copyBtn = document.createElement('button');
            copyBtn.innerText = "Copy IP:Port";
            copyBtn.className = "btn";
            copyBtn.style.width = "100%";
            copyBtn.style.marginTop = "10px";
            copyBtn.style.fontSize = "13px";
            copyBtn.style.padding = "8px";

            copyBtn.onclick = (e) => {
                e.stopPropagation(); // Card click event ko roke
                const fullIP = `${item.ip}:${item.port}`;
                navigator.clipboard.writeText(fullIP).then(() => {
                    copyBtn.innerText = "Copied! ✅";
                    copyBtn.style.background = "#fff";
                    setTimeout(() => {
                        copyBtn.innerText = "Copy IP:Port";
                        copyBtn.style.background = "var(--accent)";
                    }, 2000);
                });
            };
            actionDiv.appendChild(copyBtn);
        }
    });
}

// 5. Real-time Search Feature
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredData = allItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm)
        );
        renderItems(filteredData);
    });
}

// App start karein
fetchData();