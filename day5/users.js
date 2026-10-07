const loadBtn = document.getElementById('load-users');
const filterInput = document.getElementById('filter-input');
const statusP = document.getElementById('status');
const usersList = document.getElementById('users-list');

let allUsers = [];

// Async function to load users from the API
async function loadUsers() {
    loadBtn.disabled = true;
    statusP.textContent = "Loading users...";
    usersList.innerHTML = "";

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        allUsers = await response.json();
        statusP.textContent = `Successfully loaded ${allUsers.length} users.`;
        renderUsers(allUsers);
    } catch (error) {
        statusP.textContent = "Failed to load users. Please check your connection.";
        console.error("Fetch error:", error);
    } finally {
        loadBtn.disabled = false;
    }
}

// Function to draw any array of users safely using createElement/textContent
function renderUsers(users) {
    usersList.innerHTML = "";

    if (users.length === 0 && allUsers.length > 0) {
        const li = document.createElement('li');
        li.textContent = "No users match your filter.";
        usersList.appendChild(li);
        return;
    }

    users.forEach(user => {
        const li = document.createElement('li');

        const nameStrong = document.createElement('strong');
        nameStrong.textContent = user.name;
        
        const detailsP = document.createElement('p');
        detailsP.textContent = `Email: ${user.email} | City: ${user.address.city} | Company: ${user.company.name}`;

        li.appendChild(nameStrong);
        li.appendChild(detailsP);
        usersList.appendChild(li);
    });
}

// Live filtering event listener
filterInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allUsers.filter(user => user.name.toLowerCase().includes(searchTerm));
    renderUsers(filtered);
});

loadBtn.addEventListener('click', loadUsers);