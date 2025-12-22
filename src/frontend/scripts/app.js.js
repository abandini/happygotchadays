export const js = `// HappyGotchaDays - Main Application JavaScript
// Playful Celebration Theme

const API_BASE = '/api';
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// Theme colors for consistent animations
const THEME_COLORS = {
    sunshine: '#FFD93D',
    coral: '#FF6B6B',
    mint: '#6BCB77',
    sky: '#4ECDC4',
    lavender: '#9B7EDE',
    peach: '#FFEAA7'
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initNavigation();
    initEventListeners();
    initFilterTags();
    loadInitialData();
    initFloatingElements();
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
            showToast('Welcome back! 🎉', 'success');
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
            triggerConfetti();
            showToast('Welcome to the family! 🐾', 'success');
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
        showToast('See you soon! 👋', 'info');
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

    // Mobile nav toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
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

// Filter Tags
function initFilterTags() {
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Update active state
            filterTags.forEach(t => t.classList.remove('filter-tag--active'));
            tag.classList.add('filter-tag--active');

            // Get filter value
            const filter = tag.dataset.filter;
            filterDiscoverPets(filter);
        });
    });
}

async function filterDiscoverPets(filter) {
    const container = document.getElementById('discoverContainer');
    container.innerHTML = createLoadingState('Finding adorable pets...');

    try {
        let url = \`\${API_BASE}/search/discover?limit=12\`;

        // Add filter parameters
        if (filter === 'dog') {
            url += '&species=dog';
        } else if (filter === 'cat') {
            url += '&species=cat';
        } else if (filter === 'recent') {
            url += '&sort=recent';
        } else if (filter === 'celebrating') {
            url += '&celebrating=true';
        }

        const res = await fetch(url);
        const data = await res.json();

        if (data.pets && data.pets.length > 0) {
            container.innerHTML = data.pets.map(pet => createPetCard(pet)).join('');
        } else {
            container.innerHTML = createEmptyState('🐾', 'No Pets Found', 'Try a different filter or add your own pet!');
        }
    } catch (error) {
        console.error('Filter error:', error);
        container.innerHTML = createEmptyState('😿', 'Oops!', 'Failed to load pets. Please try again.');
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
        navigateTo('feed');
        setTimeout(() => triggerConfetti(), 300);
    });

    // Search
    document.getElementById('searchBtn')?.addEventListener('click', performSearch);
    document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // Add Pet buttons
    document.getElementById('addPetBtn')?.addEventListener('click', handleAddPet);
    document.getElementById('emptyAddPet')?.addEventListener('click', handleAddPet);
    document.getElementById('emptyAddFirstPet')?.addEventListener('click', handleAddPet);

    // Join party button
    document.querySelector('.btn-accent')?.addEventListener('click', () => {
        if (currentUser) {
            navigateTo('my-pets');
        } else {
            showSignupModal();
        }
    });
}

function handleAddPet() {
    if (!currentUser) {
        showLoginModal();
        return;
    }
    showAddPetModal();
}

// Floating Elements Animation
function initFloatingElements() {
    // Add random delays to floating paws
    const floatingPaws = document.querySelectorAll('.floating-paw');
    floatingPaws.forEach((paw, index) => {
        paw.style.animationDelay = \`\${index * 1.5}s\`;
    });

    // Add subtle parallax to hero elements
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroConfetti = document.querySelector('.hero-confetti');
        const polaroidStack = document.querySelector('.polaroid-stack');

        if (heroConfetti && scrollY < 600) {
            heroConfetti.style.transform = \`translateY(\${scrollY * 0.3}px)\`;
        }
        if (polaroidStack && scrollY < 600) {
            polaroidStack.style.transform = \`translateY(\${scrollY * 0.1}px) rotate(-3deg)\`;
        }
    });
}

// Loading State Helper
function createLoadingState(message = 'Loading...') {
    return \`
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p class="loading-text">\${message}</p>
        </div>
    \`;
}

// Empty State Helper
function createEmptyState(icon, title, message, buttonText = null, buttonId = null) {
    return \`
        <div class="empty-state" style="grid-column: 1 / -1;">
            <span class="empty-icon">\${icon}</span>
            <h3 class="empty-title">\${title}</h3>
            <p class="empty-message">\${message}</p>
            \${buttonText ? \`<button class="btn btn-primary" id="\${buttonId}">\${buttonText}</button>\` : ''}
        </div>
    \`;
}

// Photo Placeholder Generator
function createPhotoPlaceholder(species, name, photoUrl = null) {
    if (photoUrl) {
        return \`
            <div class="pet-photo">
                <img src="\${photoUrl}" alt="\${name}" loading="lazy" />
            </div>
        \`;
    }

    const isdog = species === 'dog';
    const emoji = isdog ? '🐶' : '🐱';
    const gradientClass = isdog ? 'photo-placeholder--dog' : 'photo-placeholder--cat';

    return \`
        <div class="photo-placeholder \${gradientClass}">
            <span class="placeholder-emoji">\${emoji}</span>
            <span class="placeholder-text">\${name}</span>
        </div>
    \`;
}

// Add Pet Modal
function showAddPetModal() {
    const modal = \`
        <div class="modal" onclick="closeModal(event)">
            <div class="modal-content modal-content--pet">
                <div class="modal-header">
                    <span class="modal-icon">🐾</span>
                    <h2>Add Your Rescue Pet</h2>
                    <p class="modal-subtitle">Share your pet's gotcha day story!</p>
                </div>
                <form id="addPetForm">
                    <div class="form-group">
                        <label for="petName">Pet Name</label>
                        <input type="text" id="petName" name="name" placeholder="What's your fur baby called?" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="petSpecies">Species</label>
                            <select id="petSpecies" name="species" required>
                                <option value="">Choose...</option>
                                <option value="dog">🐶 Dog</option>
                                <option value="cat">🐱 Cat</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="petBreed">Breed</label>
                            <input type="text" id="petBreed" name="breed" placeholder="Optional">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="gotchaDate">Gotcha Day 🎉</label>
                        <input type="date" id="gotchaDate" name="gotcha_date" required>
                    </div>
                    <div class="form-group">
                        <label for="adoptionStory">Adoption Story</label>
                        <textarea id="adoptionStory" name="adoption_story" placeholder="Tell us how you found each other... (optional)" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn btn-large btn-primary btn-full-width">
                        <span class="btn-icon-left">🎉</span>
                        Add Pet & Celebrate!
                    </button>
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
                triggerHeartBurst();
                loadMyPets();
                showToast(\`🎉 \${petData.name} is now part of the family!\`, 'success');
            } else {
                const error = await res.json();
                showToast('Error: ' + (error.error || 'Failed to add pet'), 'error');
            }
        } catch (error) {
            console.error('Add pet error:', error);
            showToast('Failed to add pet. Please try again.', 'error');
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
    const emptyContainer = document.getElementById('myPetsEmpty');
    if (!container) return;

    container.innerHTML = createLoadingState('Loading your fur family...');
    if (emptyContainer) emptyContainer.style.display = 'none';

    try {
        const res = await fetch(\`\${API_BASE}/pets\`, {
            headers: { 'Authorization': \`Bearer \${authToken}\` }
        });
        const data = await res.json();

        if (data.pets && data.pets.length > 0) {
            container.innerHTML = data.pets.map(pet => createMyPetCard(pet)).join('');
        } else {
            container.innerHTML = '';
            if (emptyContainer) emptyContainer.style.display = 'block';
        }
    } catch (error) {
        console.error('Load pets error:', error);
        container.innerHTML = createEmptyState('😿', 'Oops!', 'Failed to load pets');
    }
}

// Load user profile stats
async function loadUserProfile() {
    if (!authToken || !currentUser) return;

    const container = document.getElementById('profileContainer');
    if (!container) return;

    container.innerHTML = createLoadingState('Loading your profile...');

    try {
        container.innerHTML = \`
            <div class="profile-card">
                <div class="profile-avatar">
                    <div class="avatar avatar--large">\${currentUser.email[0].toUpperCase()}</div>
                    <div class="avatar-badge">🏆</div>
                </div>
                <h3 class="profile-name">\${currentUser.username || currentUser.email}</h3>
                <p class="profile-title">Rescue Pet Champion</p>
                <div class="celebration-badge">
                    <span class="badge-icon">🎉</span>
                    Gotcha Day Hero!
                </div>
                <div class="profile-tags">
                    <span class="hashtag">#RescuePetParent</span>
                    <span class="hashtag">#AdoptDontShop</span>
                    <span class="hashtag">#GotchaDayFam</span>
                </div>
            </div>
        \`;
    } catch (error) {
        console.error('Load profile error:', error);
        container.innerHTML = createEmptyState('😿', 'Oops!', 'Failed to load profile');
    }
}

async function loadFeed() {
    const container = document.getElementById('feedContainer');
    const emptyContainer = document.getElementById('feedEmpty');

    container.innerHTML = createLoadingState('Loading celebrations...');
    if (emptyContainer) emptyContainer.style.display = 'none';

    try {
        const headers = authToken ? { 'Authorization': \`Bearer \${authToken}\` } : {};
        const res = await fetch(\`\${API_BASE}/social/feed?limit=12\`, { headers });
        const data = await res.json();

        if (data.posts && data.posts.length > 0) {
            container.innerHTML = data.posts.map(post => createPostCard(post)).join('');
        } else {
            container.innerHTML = '';
            if (emptyContainer) emptyContainer.style.display = 'block';
        }
    } catch (error) {
        console.error('Load feed error:', error);
        container.innerHTML = createEmptyState('😿', 'Oops!', 'Failed to load celebrations');
    }
}

async function loadDiscoverPets() {
    const container = document.getElementById('discoverContainer');
    const emptyContainer = document.getElementById('discoverEmpty');

    container.innerHTML = createLoadingState('Finding adorable pets...');
    if (emptyContainer) emptyContainer.style.display = 'none';

    try {
        const res = await fetch(\`\${API_BASE}/search/discover?limit=12\`);
        const data = await res.json();

        if (data.pets && data.pets.length > 0) {
            container.innerHTML = data.pets.map(pet => createPetCard(pet)).join('');
        } else {
            container.innerHTML = '';
            if (emptyContainer) emptyContainer.style.display = 'block';
        }
    } catch (error) {
        console.error('Load pets error:', error);
        container.innerHTML = createEmptyState('😿', 'Oops!', 'Failed to load pets');
    }
}

async function loadUpcomingGotchaDays() {
    const container = document.getElementById('upcomingContainer');
    const emptyContainer = document.getElementById('upcomingEmpty');

    container.innerHTML = createLoadingState('Checking the party calendar...');
    if (emptyContainer) emptyContainer.style.display = 'none';

    try {
        const res = await fetch(\`\${API_BASE}/search/upcoming-gotcha-days?limit=8\`);
        const data = await res.json();

        if (data.pets && data.pets.length > 0) {
            container.innerHTML = data.pets.map(pet => createUpcomingCard(pet)).join('');
        } else {
            container.innerHTML = '';
            if (emptyContainer) emptyContainer.style.display = 'block';
        }
    } catch (error) {
        console.error('Load upcoming error:', error);
        container.innerHTML = createEmptyState('📅', 'No Upcoming Parties', 'Add a pet to see celebrations!');
    }
}

// Search
async function performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    if (query.length < 2) {
        showToast('Please enter at least 2 characters', 'warning');
        return;
    }

    const container = document.getElementById('discoverContainer');
    container.innerHTML = createLoadingState('Searching...');

    try {
        const res = await fetch(\`\${API_BASE}/search?q=\${encodeURIComponent(query)}\`);
        const data = await res.json();

        let html = '';
        if (data.pets && data.pets.length > 0) {
            html += data.pets.map(pet => createPetCard(pet)).join('');
        }
        if (data.users && data.users.length > 0) {
            html += data.users.map(user => createUserCard(user)).join('');
        }

        container.innerHTML = html || createEmptyState('🔍', 'No Results', 'Try a different search term');
    } catch (error) {
        console.error('Search error:', error);
        container.innerHTML = createEmptyState('😿', 'Search Failed', 'Please try again');
    }
}

// Card Templates
function createPostCard(post) {
    const isCelebration = post.anniversary_year && post.anniversary_year > 0;
    const trendingBadge = (post.like_count || 0) > 10
        ? '<div class="trending-badge trending-badge--card"><span class="trending-pulse"></span>Trending</div>'
        : '';

    return \`
        <div class="post-card polaroid-card">
            \${trendingBadge}
            <div class="polaroid-photo">
                \${createPhotoPlaceholder(post.species, post.pet_name, post.photo_url)}
                \${isCelebration ? '<div class="celebration-badge celebration-badge--overlay"><span class="badge-icon">🎉</span>Gotcha Day!</div>' : ''}
            </div>
            <div class="polaroid-content">
                <div class="post-header">
                    <div class="avatar">\${post.username[0].toUpperCase()}</div>
                    <div class="post-author">
                        <h3 class="pet-name">\${post.pet_name}</h3>
                        <p class="post-meta">\${post.username} • \${post.species}</p>
                    </div>
                </div>
                <div class="post-content">
                    <p>\${post.content}</p>
                    \${post.anniversary_year ? \`
                        <div class="anniversary-highlight">
                            <span class="anniversary-years">🎊 \${post.anniversary_year} Year\${post.anniversary_year > 1 ? 's' : ''} Together! 🎊</span>
                        </div>
                    \` : ''}
                    <div class="hashtag-container">
                        <span class="hashtag">#GotchaDay</span>
                        <span class="hashtag">#\${post.species === 'dog' ? 'RescueDog' : 'RescueCat'}</span>
                    </div>
                </div>
                <div class="post-actions">
                    <button class="action-btn action-btn--like" onclick="likePost('\${post.id}', this)" id="like-btn-\${post.id}">
                        <span class="action-icon">❤️</span>
                        <span class="action-count">\${post.like_count || 0}</span>
                    </button>
                    <button class="action-btn" onclick="viewComments('\${post.id}')">
                        <span class="action-icon">💬</span>
                        <span class="action-count">\${post.comment_count || 0}</span>
                    </button>
                    <button class="action-btn" onclick="sharePost('\${post.id}', '\${post.pet_name}', '')">
                        <span class="action-icon">🔗</span>
                        <span class="action-label">Share</span>
                    </button>
                </div>
            </div>
        </div>
    \`;
}

function createPetCard(pet) {
    const gotchaDate = new Date(pet.gotcha_date);
    const yearsAgo = new Date().getFullYear() - gotchaDate.getFullYear();

    return \`
        <div class="pet-card polaroid-card">
            <div class="polaroid-photo">
                \${createPhotoPlaceholder(pet.species, pet.name, pet.profile_photo_url)}
            </div>
            <div class="polaroid-content">
                <div class="pet-card-header">
                    <h3 class="pet-name">\${pet.name}</h3>
                    <span class="pet-species">\${pet.species === 'dog' ? '🐶' : '🐱'}</span>
                </div>
                <p class="pet-owner">by \${pet.owner_username}</p>
                \${pet.breed ? \`<p class="pet-breed">\${pet.breed}</p>\` : ''}
                <div class="pet-gotcha-info">
                    <span class="gotcha-icon">🎉</span>
                    <span>\${yearsAgo} year\${yearsAgo !== 1 ? 's' : ''} of love</span>
                </div>
                \${pet.adoption_story ? \`<p class="adoption-story">\${pet.adoption_story.substring(0, 80)}...</p>\` : ''}
            </div>
        </div>
    \`;
}

function createMyPetCard(pet) {
    const gotchaDate = new Date(pet.gotcha_date);
    const yearsAgo = new Date().getFullYear() - gotchaDate.getFullYear();

    return \`
        <div class="pet-card polaroid-card pet-card--owned">
            <div class="polaroid-photo">
                \${createPhotoPlaceholder(pet.species, pet.name, pet.profile_photo_url)}
                <div class="photo-actions">
                    <button class="photo-action-btn" onclick="uploadPetPhoto('\${pet.id}')" title="Add Photo">
                        📷
                    </button>
                </div>
            </div>
            <div class="polaroid-content">
                <div class="pet-card-header">
                    <h3 class="pet-name">\${pet.name}</h3>
                    <span class="pet-species">\${pet.species === 'dog' ? '🐶' : '🐱'}</span>
                </div>
                \${pet.breed ? \`<p class="pet-breed">\${pet.breed}</p>\` : ''}
                <div class="pet-gotcha-info">
                    <span class="gotcha-icon">🎉</span>
                    <span>\${yearsAgo} year\${yearsAgo !== 1 ? 's' : ''} of love</span>
                </div>
                <div class="pet-card-actions">
                    <button class="btn btn-small btn-primary" onclick="createGotchaDayPost('\${pet.id}')">
                        🎉 Create Post
                    </button>
                    <button class="btn btn-small btn-outline" onclick="editPet('\${pet.id}')">
                        ✏️ Edit
                    </button>
                </div>
            </div>
        </div>
    \`;
}

function createUpcomingCard(pet) {
    const daysUntil = pet.days_until_anniversary;
    const isToday = daysUntil === 0;
    const isTomorrow = daysUntil === 1;

    return \`
        <div class="upcoming-card \${isToday ? 'upcoming-card--today' : ''}">
            <div class="upcoming-pet-info">
                <div class="upcoming-emoji">\${pet.species === 'dog' ? '🐶' : '🐱'}</div>
                <div>
                    <h3 class="upcoming-name">\${pet.name}</h3>
                    <p class="upcoming-owner">\${pet.owner_username}</p>
                </div>
            </div>
            <div class="upcoming-countdown">
                \${isToday ? \`
                    <div class="countdown-today">
                        <span class="today-icon">🎂</span>
                        <span class="today-text">Today!</span>
                    </div>
                \` : \`
                    <div class="countdown-timer">
                        <div class="countdown-number">\${daysUntil}</div>
                        <div class="countdown-label">\${isTomorrow ? 'day' : 'days'}</div>
                    </div>
                \`}
                <div class="upcoming-year">Year \${pet.years_with_family} 🎉</div>
            </div>
        </div>
    \`;
}

function createUserCard(user) {
    return \`
        <div class="user-card">
            <div class="avatar avatar--medium">\${user.username[0].toUpperCase()}</div>
            <div class="user-info">
                <h3>\${user.username}</h3>
                \${user.bio ? \`<p class="user-bio">\${user.bio}</p>\` : '<p class="user-bio">Pet lover</p>'}
            </div>
        </div>
    \`;
}

// Modals
function showLoginModal() {
    const modal = \`
        <div class="modal" onclick="closeModal(event)">
            <div class="modal-content">
                <div class="modal-header">
                    <span class="modal-icon">🐾</span>
                    <h2>Welcome Back!</h2>
                    <p class="modal-subtitle">Login to celebrate with your pets</p>
                </div>
                <form id="loginForm">
                    <div class="form-group">
                        <input type="email" placeholder="Email" required>
                    </div>
                    <div class="form-group">
                        <input type="password" placeholder="Password" required>
                    </div>
                    <button type="submit" class="btn btn-large btn-primary btn-full-width">Login</button>
                </form>
                <p class="modal-footer-text">Don't have an account? <a href="#" onclick="event.preventDefault(); closeModal(); showSignupModal();">Sign up</a></p>
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
            showToast(error.message, 'error');
        }
    });
}

function showSignupModal() {
    const modal = \`
        <div class="modal" onclick="closeModal(event)">
            <div class="modal-content">
                <div class="modal-header">
                    <span class="modal-icon">🎉</span>
                    <h2>Join the Party!</h2>
                    <p class="modal-subtitle">Create an account to share your pet's story</p>
                </div>
                <form id="signupForm">
                    <div class="form-group">
                        <input type="email" placeholder="Email" required>
                    </div>
                    <div class="form-group">
                        <input type="text" placeholder="Username" required>
                    </div>
                    <div class="form-group">
                        <input type="password" placeholder="Password (min 8 characters)" required minlength="8">
                    </div>
                    <button type="submit" class="btn btn-large btn-primary btn-full-width">
                        <span class="btn-icon-left">🐾</span>
                        Join the Family
                    </button>
                </form>
                <p class="modal-footer-text">Already have an account? <a href="#" onclick="event.preventDefault(); closeModal(); showLoginModal();">Login</a></p>
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
            showToast(error.message, 'error');
        }
    });
}

function closeModal(event) {
    if (!event || event.target.className === 'modal') {
        document.getElementById('modalContainer').innerHTML = '';
    }
}

// Global functions for onclick handlers
window.viewComments = async function(postId) {
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
            <div class="comment">
                <div class="avatar avatar--small">\${c.username[0].toUpperCase()}</div>
                <div class="comment-content">
                    <div class="comment-author">\${c.username}</div>
                    <div class="comment-text">\${c.content}</div>
                    <div class="comment-date">\${new Date(c.created_at * 1000).toLocaleDateString()}</div>
                </div>
            </div>
        \`).join('')
        : '<div class="empty-state empty-state--small"><span class="empty-icon">💬</span><p>No comments yet. Be the first!</p></div>';

    const addCommentForm = authToken
        ? \`
            <form id="addCommentForm" class="comment-form">
                <input type="text" id="commentInput" placeholder="Add a comment..." required>
                <button type="submit" class="btn btn-primary">Post</button>
            </form>
        \`
        : '<p class="login-prompt">Login to add a comment</p>';

    const modal = \`
        <div class="modal" onclick="closeModal(event)">
            <div class="modal-content modal-content--comments">
                <div class="modal-header">
                    <span class="modal-icon">💬</span>
                    <h2>Comments</h2>
                </div>
                <div id="commentsContainer" class="comments-list">
                    \${commentsHtml}
                </div>
                \${addCommentForm}
            </div>
        </div>
    \`;
    document.getElementById('modalContainer').innerHTML = modal;

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
                    viewComments(postId);
                    loadFeed();
                    showToast('Comment posted! 💬', 'success');
                } else {
                    const error = await res.json();
                    showToast('Error: ' + (error.error || 'Failed to post comment'), 'error');
                }
            } catch (error) {
                console.error('Post comment error:', error);
                showToast('Failed to post comment', 'error');
            }
        });
    }
};

// VIRAL FEATURES

// Confetti Animation - Updated with new theme colors
function triggerConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = Object.values(THEME_COLORS);
    const confettiCount = 60;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confetti.style.width = (Math.random() * 8 + 6) + 'px';
        confetti.style.height = (Math.random() * 8 + 6) + 'px';
        container.appendChild(confetti);

        setTimeout(() => confetti.remove(), 4000);
    }
}

// Heart Burst Animation
function triggerHeartBurst(element = null) {
    const container = element || document.getElementById('heartBurstContainer');
    const hearts = ['❤️', '💕', '💗', '💖', '🧡', '💛'];
    const heartCount = 8;

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-burst';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = (Math.random() * 60 + 20) + '%';
        heart.style.animationDelay = (Math.random() * 0.3) + 's';

        if (element) {
            element.style.position = 'relative';
            element.appendChild(heart);
        } else {
            heart.style.left = (Math.random() * 100) + '%';
            container.appendChild(heart);
        }

        setTimeout(() => heart.remove(), 1500);
    }
}

// Enhanced Like with Animation
window.likePost = async function(postId, element) {
    if (!authToken) {
        showLoginModal();
        return;
    }

    try {
        if (element) {
            element.classList.add('action-btn--liked');
            triggerHeartBurst(element);
        }

        await fetch(\`\${API_BASE}/social/posts/\${postId}/like\`, {
            method: 'POST',
            headers: { 'Authorization': \`Bearer \${authToken}\` }
        });

        loadFeed();

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

    const modal = \`
        <div class="modal" onclick="closeModal(event)">
            <div class="modal-content">
                <div class="modal-header">
                    <span class="modal-icon">🎉</span>
                    <h2>Share This Celebration</h2>
                    <p class="modal-subtitle">Spread the rescue pet love!</p>
                </div>
                <div class="share-buttons">
                    <a href="https://www.instagram.com/" target="_blank" class="share-btn share-btn--instagram">
                        <span>📷</span> Instagram Story
                    </a>
                    <a href="https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(shareUrl)}" target="_blank" class="share-btn share-btn--facebook">
                        <span>👍</span> Facebook
                    </a>
                    <a href="https://twitter.com/intent/tweet?text=\${encodeURIComponent(shareText)}&url=\${encodeURIComponent(shareUrl)}" target="_blank" class="share-btn share-btn--twitter">
                        <span>🐦</span> Twitter
                    </a>
                    <button onclick="copyShareLink('\${shareUrl}')" class="share-btn share-btn--copy">
                        <span>🔗</span> Copy Link
                    </button>
                </div>
                <div class="hashtag-container">
                    <span class="hashtag">#GotchaDay</span>
                    <span class="hashtag">#RescuePet</span>
                    <span class="hashtag">#AdoptDontShop</span>
                </div>
            </div>
        </div>
    \`;
    document.getElementById('modalContainer').innerHTML = modal;
};

window.copyShareLink = function(url) {
    navigator.clipboard.writeText(url).then(() => {
        showToast('Link copied! 🔗', 'success');
        closeModal();
        triggerConfetti();
    });
};

// Toast Notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = \`toast toast--\${type}\`;
    toast.innerHTML = \`
        <span class="toast-message">\${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    \`;
    container.appendChild(toast);

    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.classList.add('toast--hiding');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Placeholder functions for pet actions
window.uploadPetPhoto = function(petId) {
    showToast('Photo upload coming soon! 📷', 'info');
};

window.createGotchaDayPost = function(petId) {
    showToast('Post creation coming soon! 🎉', 'info');
};

window.editPet = function(petId) {
    showToast('Pet editing coming soon! ✏️', 'info');
};

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

// Welcome confetti for new visitors
if (!localStorage.getItem('hasVisited')) {
    setTimeout(() => {
        triggerConfetti();
        localStorage.setItem('hasVisited', 'true');
    }, 1000);
}

window.closeModal = closeModal;
window.showSignupModal = showSignupModal;
window.showLoginModal = showLoginModal;
`;
