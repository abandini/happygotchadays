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
    const myPetsSection = document.getElementById('my-pets');
    const profileSection = document.getElementById('profile');

    if (isAuthenticated) {
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        myPetsLink.style.display = 'block';
        profileLink.style.display = 'block';
        if (myPetsSection) myPetsSection.style.display = 'block';
        if (profileSection) profileSection.style.display = 'block';
    } else {
        loginBtn.style.display = 'block';
        signupBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        myPetsLink.style.display = 'none';
        profileLink.style.display = 'none';
        if (myPetsSection) myPetsSection.style.display = 'none';
        if (profileSection) profileSection.style.display = 'none';
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
    // Check if section requires auth
    const authRequiredSections = ['my-pets', 'profile'];
    if (authRequiredSections.includes(section) && !currentUser) {
        showLoginModal();
        return;
    }

    const element = document.getElementById(section);
    if (element) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + section) {
                link.classList.add('active');
            }
        });

        element.scrollIntoView({ behavior: 'smooth' });

        // Load data for specific sections
        if (section === 'my-pets' && currentUser) {
            loadMyPets();
        } else if (section === 'profile' && currentUser) {
            loadUserProfile();
        }
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

    document.getElementById('heroLearnMore')?.addEventListener('click', () => {
        // Scroll to feed section to see success stories
        navigateTo('feed');
        // Trigger confetti to make it celebratory
        setTimeout(() => triggerConfetti(), 300);
    });

    // Search
    document.getElementById('searchBtn')?.addEventListener('click', performSearch);
    document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // Add Pet button
    document.getElementById('addPetBtn')?.addEventListener('click', () => {
        if (!currentUser) {
            showLoginModal();
            return;
        }
        showAddPetModal();
    });
}

// Add Pet Modal
function showAddPetModal() {
    const modal = \`
        <div class="modal" onclick="closeModal(event)">
            <div class="modal-content">
                <h2>Add Your Rescue Pet 🐾</h2>
                <p style="color: var(--text-light); margin-bottom: 1.5rem;">Share your pet's gotcha day story!</p>
                <form id="addPetForm">
                    <input type="text" name="name" placeholder="Pet Name" required>
                    <select name="species" required>
                        <option value="">Select Species</option>
                        <option value="dog">Dog 🐶</option>
                        <option value="cat">Cat 🐱</option>
                    </select>
                    <input type="text" name="breed" placeholder="Breed (optional)">
                    <input type="date" name="gotcha_date" placeholder="Gotcha Day" required>
                    <textarea name="adoption_story" placeholder="Tell us about your rescue story... (optional)" rows="3" style="padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--radius); font-family: inherit; font-size: 1rem; resize: vertical;"></textarea>
                    <button type="submit" class="btn btn-primary">Add Pet 🎉</button>
                </form>
            </div>
        </div>
    \`;
    document.getElementById('modalContainer').innerHTML = modal;

    document.getElementById('addPetForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const petData = {
            name: formData.get('name'),
            species: formData.get('species'),
            breed: formData.get('breed') || null,
            gotcha_date: formData.get('gotcha_date'),
            adoption_story: formData.get('adoption_story') || null
        };

        try {
            const res = await fetch(\`\${API_BASE}/pets\`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': \`Bearer \${authToken}\`
                },
                body: JSON.stringify(petData)
            });

            if (res.ok) {
                closeModal();
                triggerConfetti();
                loadMyPets();
                alert('🎉 Pet added successfully! Welcome to the family!');
            } else {
                const error = await res.json();
                alert('Error: ' + (error.error || 'Failed to add pet'));
            }
        } catch (error) {
            console.error('Add pet error:', error);
            alert('Failed to add pet. Please try again.');
        }
    });
}

// Data Loading
async function loadInitialData() {
    await loadFeed();
    await loadDiscoverPets();
    await loadUpcomingGotchaDays();

    // Load user-specific data if authenticated
    if (currentUser) {
        loadMyPets();
        loadUserProfile();
    }
}

// Load user's pets
async function loadMyPets() {
    if (!authToken) return;

    const container = document.getElementById('myPetsContainer');
    if (!container) return;

    container.innerHTML = '<div class="loading">Loading your pets...</div>';

    try {
        const res = await fetch(\`\${API_BASE}/pets\`, {
            headers: { 'Authorization': \`Bearer \${authToken}\` }
        });
        const data = await res.json();

        if (data.pets && data.pets.length > 0) {
            container.innerHTML = data.pets.map(pet => createPetCard(pet)).join('');
        } else {
            container.innerHTML = \`
                <div style="text-align: center; padding: 3rem; grid-column: 1 / -1;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🐾</div>
                    <h3>No pets added yet!</h3>
                    <p style="color: var(--text-light); margin: 1rem 0;">Share your rescue pet's story with the world</p>
                    <button class="btn btn-primary" onclick="document.getElementById('addPetBtn').click()">Add Your First Pet</button>
                </div>
            \`;
        }
    } catch (error) {
        console.error('Load pets error:', error);
        container.innerHTML = '<p class="text-center">Failed to load pets</p>';
    }
}

// Load user profile stats
async function loadUserProfile() {
    if (!authToken || !currentUser) return;

    const container = document.getElementById('profileContainer');
    if (!container) return;

    container.innerHTML = '<div class="loading">Loading profile...</div>';

    try {
        // In a real implementation, you'd fetch user stats from an API
        // For now, show user info
        container.innerHTML = \`
            <div style="background: white; padding: 2rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-soft);">
                <div class="avatar" style="width: 80px; height: 80px; font-size: 2rem; margin: 0 auto 1rem;">
                    \${currentUser.email[0].toUpperCase()}
                </div>
                <h3 style="text-align: center; margin-bottom: 0.5rem;">\${currentUser.email}</h3>
                <p style="text-align: center; color: var(--text-light);">Rescue Pet Lover</p>
                <div class="celebration-badge" style="margin: 1.5rem auto; display: flex; justify-content: center;">
                    🎉 Gotcha Day Champion!
                </div>
                <div class="hashtag-container" style="justify-content: center;">
                    <span class="hashtag">#RescuePetParent</span>
                    <span class="hashtag">#AdoptDontShop</span>
                </div>
            </div>
        \`;
    } catch (error) {
        console.error('Load profile error:', error);
        container.innerHTML = '<p class="text-center">Failed to load profile</p>';
    }
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
    const isCelebration = post.anniversary_year && post.anniversary_year > 0;
    const trendingBadge = (post.like_count || 0) > 10 ? '<div class="trending-badge" style="position: absolute; top: 10px; right: 10px;">Trending</div>' : '';

    return \`
        <div class="post-card" style="position: relative;">
            \${trendingBadge}
            <div class="post-header">
                <div class="avatar">\${post.username[0].toUpperCase()}</div>
                <div class="post-author">
                    <h3>\${post.username}</h3>
                    <p>\${post.pet_name} • \${post.species}</p>
                </div>
                \${isCelebration ? '<div class="celebration-badge" style="margin-left: auto;">🎉 Gotcha Day!</div>' : ''}
            </div>
            <div class="post-content">
                <p>\${post.content}</p>
                \${post.anniversary_year ? \`
                    <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-light); border-radius: var(--radius); text-align: center;">
                        <strong style="font-size: 1.3rem; color: var(--primary-color);">🎊 \${post.anniversary_year} Year\${post.anniversary_year > 1 ? 's' : ''} Together! 🎊</strong>
                    </div>
                \` : ''}
                <div class="hashtag-container">
                    <span class="hashtag">#GotchaDay</span>
                    <span class="hashtag">#\${post.species === 'dog' ? 'RescueDog' : 'RescueCat'}</span>
                    <span class="hashtag">#AdoptDontShop</span>
                </div>
            </div>
            <div class="post-actions">
                <button class="action-btn" onclick="likePost('\${post.id}', this)" id="like-btn-\${post.id}">
                    ❤️ <span>\${post.like_count || 0}</span>
                </button>
                <button class="action-btn" onclick="viewComments('\${post.id}')">
                    💬 <span>\${post.comment_count || 0}</span>
                </button>
                <button class="action-btn" onclick="sharePost('\${post.id}', '\${post.pet_name}', '')">
                    🔗 <span>Share</span>
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
            <h3>\${pet.name} 🐾</h3>
            <p>\${pet.species}\${pet.breed ? \` • \${pet.breed}\` : ''}</p>
            <div style="margin: 1rem 0;">
                <div class="countdown-timer" style="font-size: 0.9rem; padding: 0.75rem 1rem;">
                    <div>
                        <div class="number">\${pet.days_until_anniversary}</div>
                        <div class="label">\${pet.days_until_anniversary === 1 ? 'day' : 'days'}</div>
                    </div>
                    <span>until year \${pet.years_with_family}! 🎉</span>
                </div>
            </div>
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

window.viewComments = async function(postId) {
    // Fetch comments
    let comments = [];
    try {
        const res = await fetch(\`\${API_BASE}/social/posts/\${postId}/comments\`);
        const data = await res.json();
        comments = data.comments || [];
    } catch (error) {
        console.error('Fetch comments error:', error);
    }

    const commentsHtml = comments.length > 0
        ? comments.map(c => \`
            <div class="comment" style="display: flex; gap: 0.75rem; padding: 0.75rem; border-bottom: 1px solid var(--border-color);">
                <div class="avatar" style="width: 36px; height: 36px; font-size: 0.9rem; flex-shrink: 0;">\${c.username[0].toUpperCase()}</div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 0.9rem;">\${c.username}</div>
                    <div style="color: var(--text-color); margin-top: 0.25rem;">\${c.content}</div>
                    <div style="color: var(--text-light); font-size: 0.75rem; margin-top: 0.25rem;">\${new Date(c.created_at).toLocaleDateString()}</div>
                </div>
            </div>
        \`).join('')
        : '<p style="text-align: center; color: var(--text-light); padding: 2rem;">No comments yet. Be the first!</p>';

    const addCommentForm = authToken
        ? \`
            <form id="addCommentForm" style="display: flex; gap: 0.5rem; padding: 1rem; border-top: 1px solid var(--border-color); background: var(--bg-light);">
                <input type="text" id="commentInput" placeholder="Add a comment..." required style="flex: 1; padding: 0.5rem 0.75rem; border: 1px solid var(--border-color); border-radius: var(--radius);">
                <button type="submit" class="btn btn-primary" style="padding: 0.5rem 1rem;">Post</button>
            </form>
        \`
        : '<p style="text-align: center; padding: 1rem; background: var(--bg-light); color: var(--text-light);">Login to add a comment</p>';

    const modal = \`
        <div class="modal" onclick="closeModal(event)">
            <div class="modal-content" style="max-height: 80vh; display: flex; flex-direction: column;">
                <h2 style="padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">💬 Comments</h2>
                <div id="commentsContainer" style="flex: 1; overflow-y: auto; max-height: 50vh;">
                    \${commentsHtml}
                </div>
                \${addCommentForm}
            </div>
        </div>
    \`;
    document.getElementById('modalContainer').innerHTML = modal;

    // Add comment form handler
    const form = document.getElementById('addCommentForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('commentInput');
            const content = input.value.trim();
            if (!content) return;

            try {
                const res = await fetch(\`\${API_BASE}/social/posts/\${postId}/comment\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': \`Bearer \${authToken}\`
                    },
                    body: JSON.stringify({ content })
                });

                if (res.ok) {
                    input.value = '';
                    // Refresh comments
                    viewComments(postId);
                    loadFeed(); // Update comment count in feed
                } else {
                    const error = await res.json();
                    alert('Error: ' + (error.error || 'Failed to post comment'));
                }
            } catch (error) {
                console.error('Post comment error:', error);
                alert('Failed to post comment. Please try again.');
            }
        });
    }
};

// VIRAL FEATURES

// Confetti Animation
function triggerConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = ['#FF6B4A', '#A78BFA', '#FFC107', '#FF6B9D', '#10B981'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(confetti);

        setTimeout(() => confetti.remove(), 4000);
    }
}

// Heart Burst Animation
function triggerHeartBurst(element) {
    const heart = document.createElement('div');
    heart.className = 'heart-burst';
    heart.textContent = '❤️';
    heart.style.left = '50%';
    heart.style.top = '50%';
    element.style.position = 'relative';
    element.appendChild(heart);

    setTimeout(() => heart.remove(), 1000);
}

// Enhanced Like with Animation
window.likePost = async function(postId, element) {
    if (!authToken) {
        showLoginModal();
        return;
    }

    try {
        // Trigger heart animation
        if (element) {
            triggerHeartBurst(element);
        }

        await fetch(\`\${API_BASE}/social/posts/\${postId}/like\`, {
            method: 'POST',
            headers: { 'Authorization': \`Bearer \${authToken}\` }
        });
        loadFeed();

        // Random confetti on milestone likes (every 10th like)
        if (Math.random() > 0.7) {
            triggerConfetti();
        }
    } catch (error) {
        console.error('Like error:', error);
    }
};

// Share Functionality
window.sharePost = function(postId, petName, imageUrl) {
    const shareUrl = window.location.origin + '/post/' + postId;
    const shareText = \`🎉 Celebrating \${petName}'s Gotcha Day! Check out this rescue pet's journey! #GotchaDay #RescuePet #AdoptDontShop\`;

    // Create share modal
    const modal = \`
        <div class="modal" onclick="closeModal(event)">
            <div class="modal-content">
                <h2>Share This Celebration 🎉</h2>
                <p style="margin-bottom: 1.5rem; color: var(--text-light);">Spread the rescue pet love!</p>
                <div class="share-buttons">
                    <a href="https://www.instagram.com/" target="_blank" class="share-btn instagram">
                        <span>📷</span> Instagram Story
                    </a>
                    <a href="https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(shareUrl)}" target="_blank" class="share-btn facebook">
                        <span>👍</span> Facebook
                    </a>
                    <a href="https://twitter.com/intent/tweet?text=\${encodeURIComponent(shareText)}&url=\${encodeURIComponent(shareUrl)}" target="_blank" class="share-btn twitter">
                        <span>🐦</span> Twitter
                    </a>
                    <button onclick="copyShareLink('\${shareUrl}')" class="share-btn copy-link">
                        <span>🔗</span> Copy Link
                    </button>
                </div>
                <div class="hashtag-container">
                    <span class="hashtag">#GotchaDay</span>
                    <span class="hashtag">#RescuePet</span>
                    <span class="hashtag">#AdoptDontShop</span>
                    <span class="hashtag">#RescueDog</span>
                    <span class="hashtag">#AdoptedPet</span>
                </div>
            </div>
        </div>
    \`;
    document.getElementById('modalContainer').innerHTML = modal;
};

window.copyShareLink = function(url) {
    navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard! 🎉');
        closeModal();
        triggerConfetti();
    });
};

// Countdown Timer Utility
function calculateDaysUntil(dateString) {
    const target = new Date(dateString);
    const now = new Date();
    const diff = target - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
}

function createCountdownTimer(daysUntil, label) {
    return \`
        <div class="countdown-timer">
            <div>
                <div class="number">\${daysUntil}</div>
                <div class="label">\${daysUntil === 1 ? 'day' : 'days'}</div>
            </div>
            <span>until \${label}</span>
        </div>
    \`;
}

// Animate Stats on Load
function animateStats() {
    const stats = [
        { id: 'totalCelebrations', target: 1247 },
        { id: 'totalPets', target: 892 },
        { id: 'celebrationsToday', target: 34 },
        { id: 'totalHearts', target: 12500, format: 'K' }
    ];

    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (!element) return;

        let current = 0;
        const increment = stat.target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= stat.target) {
                current = stat.target;
                clearInterval(timer);
            }

            if (stat.format === 'K') {
                element.textContent = (current / 1000).toFixed(1) + 'K';
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 30);
    });
}

// Trigger celebration on page load
setTimeout(() => {
    animateStats();
}, 500);

// Random confetti for new visitors (first time only)
if (!localStorage.getItem('hasVisited')) {
    setTimeout(() => {
        triggerConfetti();
        localStorage.setItem('hasVisited', 'true');
    }, 1000);
}

window.closeModal = closeModal;
`;
