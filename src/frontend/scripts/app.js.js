export const js = `// HappyGotchaDays - Main Application JavaScript

const API_BASE = '/api';
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initNavigation();
    initEventListeners();
    loadInitialData();
});

// Authentication
function initAuth() {
    if (authToken) {
        // Verify token is still valid
        fetch(\`\${API_BASE}/auth/verify\`, {
            headers: { 'Authorization': \`Bearer \${authToken}\` }
        })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
            if (data) {
                currentUser = data.user;
                updateUIForAuth(true);
            } else {
                logout();
            }
        })
        .catch(() => logout());
    }
}

function updateUIForAuth(isAuthenticated) {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const myPetsLink = document.getElementById('myPetsLink');
    const profileLink = document.getElementById('profileLink');

    if (isAuthenticated) {
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        myPetsLink.style.display = 'block';
        profileLink.style.display = 'block';
    } else {
        loginBtn.style.display = 'block';
        signupBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        myPetsLink.style.display = 'none';
        profileLink.style.display = 'none';
    }
}

function login(email, password) {
    return fetch(\`\${API_BASE}/auth/login\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            updateUIForAuth(true);
            return true;
        }
        throw new Error(data.error || 'Login failed');
    });
}

function signup(email, username, password) {
    return fetch(\`\${API_BASE}/auth/register\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            updateUIForAuth(true);
            return true;
        }
        throw new Error(data.error || 'Signup failed');
    });
}

function logout() {
    fetch(\`\${API_BASE}/auth/logout\`, {
        method: 'POST',
        headers: { 'Authorization': \`Bearer \${authToken}\` }
    }).finally(() => {
        authToken = null;
        currentUser = null;
        localStorage.removeItem('authToken');
        updateUIForAuth(false);
        loadInitialData();
    });
}

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target.getAttribute('href').substring(1);
            navigateTo(target);
        });
    });
}

function navigateTo(section) {
    const element = document.getElementById(section);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Event Listeners
function initEventListeners() {
    // Auth buttons
    document.getElementById('loginBtn')?.addEventListener('click', showLoginModal);
    document.getElementById('signupBtn')?.addEventListener('click', showSignupModal);
    document.getElementById('logoutBtn')?.addEventListener('click', logout);

    // Hero buttons
    document.getElementById('heroGetStarted')?.addEventListener('click', () => {
        if (currentUser) {
            navigateTo('my-pets');
        } else {
            showSignupModal();
        }
    });

    // Search
    document.getElementById('searchBtn')?.addEventListener('click', performSearch);
    document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

// Data Loading
async function loadInitialData() {
    await loadFeed();
    await loadDiscoverPets();
    await loadUpcomingGotchaDays();
}

async function loadFeed() {
    const container = document.getElementById('feedContainer');
    container.innerHTML = '<div class="loading">Loading celebrations...</div>';

    try {
        const headers = authToken ? { 'Authorization': \`Bearer \${authToken}\` } : {};
        const res = await fetch(\`\${API_BASE}/social/feed?limit=12\`, { headers });
        const data = await res.json();

        if (data.posts && data.posts.length > 0) {
            container.innerHTML = data.posts.map(post => createPostCard(post)).join('');
        } else {
            container.innerHTML = '<p class="text-center">No celebrations yet. Be the first to share!</p>';
        }
    } catch (error) {
        console.error('Load feed error:', error);
        container.innerHTML = '<p class="text-center">Failed to load celebrations</p>';
    }
}

async function loadDiscoverPets() {
    const container = document.getElementById('discoverContainer');
    container.innerHTML = '<div class="loading">Loading pets...</div>';

    try {
        const res = await fetch(\`\${API_BASE}/search/discover?limit=12\`);
        const data = await res.json();

        if (data.pets && data.pets.length > 0) {
            container.innerHTML = data.pets.map(pet => createPetCard(pet)).join('');
        } else {
            container.innerHTML = '<p class="text-center">No pets found</p>';
        }
    } catch (error) {
        console.error('Load pets error:', error);
        container.innerHTML = '<p class="text-center">Failed to load pets</p>';
    }
}

async function loadUpcomingGotchaDays() {
    const container = document.getElementById('upcomingContainer');
    container.innerHTML = '<div class="loading">Loading upcoming celebrations...</div>';

    try {
        const res = await fetch(\`\${API_BASE}/search/upcoming-gotcha-days?limit=8\`);
        const data = await res.json();

        if (data.pets && data.pets.length > 0) {
            container.innerHTML = data.pets.map(pet => createUpcomingCard(pet)).join('');
        } else {
            container.innerHTML = '<p class="text-center">No upcoming celebrations</p>';
        }
    } catch (error) {
        console.error('Load upcoming error:', error);
        container.innerHTML = '<p class="text-center">Failed to load upcoming celebrations</p>';
    }
}

// Search
async function performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    if (query.length < 2) return;

    const container = document.getElementById('discoverContainer');
    container.innerHTML = '<div class="loading">Searching...</div>';

    try {
        const res = await fetch(\`\${API_BASE}/search?q=\${encodeURIComponent(query)}\`);
        const data = await res.json();

        let html = '';
        if (data.pets && data.pets.length > 0) {
            html += '<h3>Pets</h3>' + data.pets.map(pet => createPetCard(pet)).join('');
        }
        if (data.users && data.users.length > 0) {
            html += '<h3>Users</h3>' + data.users.map(user => createUserCard(user)).join('');
        }

        container.innerHTML = html || '<p class="text-center">No results found</p>';
    } catch (error) {
        console.error('Search error:', error);
        container.innerHTML = '<p class="text-center">Search failed</p>';
    }
}

// Card Templates
function createPostCard(post) {
    return \`
        <div class="post-card">
            <div class="post-header">
                <div class="avatar">\${post.username[0].toUpperCase()}</div>
                <div class="post-author">
                    <h3>\${post.username}</h3>
                    <p>\${post.pet_name} • \${post.species}</p>
                </div>
            </div>
            <div class="post-content">
                <p>\${post.content}</p>
                \${post.anniversary_year ? \`<p class="mt-2"><strong>🎉 \${post.anniversary_year} years together!</strong></p>\` : ''}
            </div>
            <div class="post-actions">
                <button class="action-btn" onclick="likePost('\${post.id}')">
                    ❤️ <span>\${post.like_count || 0}</span>
                </button>
                <button class="action-btn" onclick="viewComments('\${post.id}')">
                    💬 <span>Comments</span>
                </button>
            </div>
        </div>
    \`;
}

function createPetCard(pet) {
    const gotchaDate = new Date(pet.gotcha_date);
    const yearsAgo = new Date().getFullYear() - gotchaDate.getFullYear();

    return \`
        <div class="pet-card">
            <div class="pet-header">
                <div class="avatar">\${pet.owner_username[0].toUpperCase()}</div>
                <div class="pet-owner">
                    <h3>\${pet.name}</h3>
                    <p>\${pet.owner_username}</p>
                </div>
            </div>
            <div class="pet-content">
                <p><strong>Species:</strong> \${pet.species}</p>
                \${pet.breed ? \`<p><strong>Breed:</strong> \${pet.breed}</p>\` : ''}
                <p><strong>Gotcha Day:</strong> \${gotchaDate.toLocaleDateString()}</p>
                <p><strong>Years with family:</strong> \${yearsAgo}</p>
                \${pet.adoption_story ? \`<p class="mt-2">\${pet.adoption_story}</p>\` : ''}
            </div>
        </div>
    \`;
}

function createUpcomingCard(pet) {
    return \`
        <div class="upcoming-card">
            <h3>\${pet.name}</h3>
            <p>\${pet.species}\${pet.breed ? \` • \${pet.breed}\` : ''}</p>
            <p class="days-until">\${pet.days_until_anniversary} days until \${pet.years_with_family} year anniversary!</p>
            <p class="mt-1"><small>Owner: \${pet.owner_username}</small></p>
        </div>
    \`;
}

function createUserCard(user) {
    return \`
        <div class="pet-card">
            <div class="pet-header">
                <div class="avatar">\${user.username[0].toUpperCase()}</div>
                <div class="pet-owner">
                    <h3>\${user.username}</h3>
                    \${user.bio ? \`<p>\${user.bio}</p>\` : ''}
                </div>
            </div>
        </div>
    \`;
}

// Modals
function showLoginModal() {
    const modal = \`
        <div class="modal" onclick="closeModal(event)">
            <div class="modal-content">
                <h2>Login</h2>
                <form id="loginForm">
                    <input type="email" placeholder="Email" required>
                    <input type="password" placeholder="Password" required>
                    <button type="submit" class="btn btn-primary">Login</button>
                </form>
            </div>
        </div>
    \`;
    document.getElementById('modalContainer').innerHTML = modal;

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const [email, password] = [...e.target.querySelectorAll('input')].map(i => i.value);
        try {
            await login(email, password);
            closeModal();
            loadInitialData();
        } catch (error) {
            alert(error.message);
        }
    });
}

function showSignupModal() {
    const modal = \`
        <div class="modal" onclick="closeModal(event)">
            <div class="modal-content">
                <h2>Sign Up</h2>
                <form id="signupForm">
                    <input type="email" placeholder="Email" required>
                    <input type="text" placeholder="Username" required>
                    <input type="password" placeholder="Password (min 8 characters)" required>
                    <button type="submit" class="btn btn-primary">Sign Up</button>
                </form>
            </div>
        </div>
    \`;
    document.getElementById('modalContainer').innerHTML = modal;

    document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const [email, username, password] = [...e.target.querySelectorAll('input')].map(i => i.value);
        try {
            await signup(email, username, password);
            closeModal();
            loadInitialData();
        } catch (error) {
            alert(error.message);
        }
    });
}

function closeModal(event) {
    if (!event || event.target.className === 'modal') {
        document.getElementById('modalContainer').innerHTML = '';
    }
}

// Global functions
window.likePost = async function(postId) {
    if (!authToken) {
        showLoginModal();
        return;
    }

    try {
        await fetch(\`\${API_BASE}/social/posts/\${postId}/like\`, {
            method: 'POST',
            headers: { 'Authorization': \`Bearer \${authToken}\` }
        });
        loadFeed();
    } catch (error) {
        console.error('Like error:', error);
    }
};

window.viewComments = function(postId) {
    // TODO: Implement comments modal
    console.log('View comments for', postId);
};

window.closeModal = closeModal;
`;
