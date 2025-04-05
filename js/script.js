// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const initiativeForm = document.getElementById('initiative-form');
const storyForm = document.getElementById('story-form');
const initiativesContainer = document.getElementById('initiatives-container');
const storiesContainer = document.getElementById('stories-container');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Initiative Tracking
let initiatives = JSON.parse(localStorage.getItem('initiatives')) || [];
let stories = JSON.parse(localStorage.getItem('stories')) || [];

function updateStats() {
    const totalHours = initiatives.reduce((sum, init) => sum + (init.hours || 0), 0);
    const totalDonations = initiatives.reduce((sum, init) => sum + (init.amount || 0), 0);
    
    document.getElementById('total-hours').textContent = totalHours;
    document.getElementById('total-donations').textContent = `$${totalDonations.toFixed(2)}`;
    document.getElementById('total-initiatives').textContent = initiatives.length;
}

// Handle Initiative Form Submission
initiativeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const initiative = {
        id: Date.now(),
        type: document.getElementById('initiative-type').value,
        hours: parseFloat(document.getElementById('hours').value) || 0,
        amount: parseFloat(document.getElementById('amount').value) || 0,
        description: document.getElementById('description').value,
        date: new Date().toISOString()
    };
    
    initiatives.push(initiative);
    localStorage.setItem('initiatives', JSON.stringify(initiatives));
    updateStats();
    initiativeForm.reset();
    
    // Show success message
    showNotification('Initiative logged successfully!');
});

// Handle Story Form Submission
storyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const story = {
        id: Date.now(),
        title: document.getElementById('story-title').value,
        content: document.getElementById('story-content').value,
        date: new Date().toISOString()
    };
    
    stories.push(story);
    localStorage.setItem('stories', JSON.stringify(stories));
    displayStories();
    storyForm.reset();
    
    // Show success message
    showNotification('Story shared successfully!');
});

// Display Stories
function displayStories() {
    storiesContainer.innerHTML = stories
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(story => `
            <div class="story-card fade-in">
                <h3>${story.title}</h3>
                <p>${story.content}</p>
                <small>${new Date(story.date).toLocaleDateString()}</small>
            </div>
        `)
        .join('');
}

// Display Initiatives
function displayInitiatives() {
    initiativesContainer.innerHTML = initiatives
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(initiative => `
            <div class="initiative-card fade-in">
                <h3>${initiative.type}</h3>
                ${initiative.hours ? `<p>Hours: ${initiative.hours}</p>` : ''}
                ${initiative.amount ? `<p>Amount: $${initiative.amount.toFixed(2)}</p>` : ''}
                <p>${initiative.description}</p>
                <small>${new Date(initiative.date).toLocaleDateString()}</small>
            </div>
        `)
        .join('');
}

// Search and Filter Functionality
const searchInput = document.querySelector('.search-box input');
const categoryFilter = document.getElementById('category-filter');
const locationFilter = document.getElementById('location-filter');

function filterInitiatives() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const location = locationFilter.value;
    
    const filteredInitiatives = initiatives.filter(initiative => {
        const matchesSearch = initiative.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || initiative.type === category;
        const matchesLocation = !location || initiative.location === location;
        
        return matchesSearch && matchesCategory && matchesLocation;
    });
    
    displayFilteredInitiatives(filteredInitiatives);
}

function displayFilteredInitiatives(filteredInitiatives) {
    initiativesContainer.innerHTML = filteredInitiatives
        .map(initiative => `
            <div class="initiative-card fade-in">
                <h3>${initiative.type}</h3>
                ${initiative.hours ? `<p>Hours: ${initiative.hours}</p>` : ''}
                ${initiative.amount ? `<p>Amount: $${initiative.amount.toFixed(2)}</p>` : ''}
                <p>${initiative.description}</p>
                <small>${new Date(initiative.date).toLocaleDateString()}</small>
            </div>
        `)
        .join('');
}

// Event Listeners for Search and Filters
searchInput.addEventListener('input', filterInitiatives);
categoryFilter.addEventListener('change', filterInitiatives);
locationFilter.addEventListener('change', filterInitiatives);

// Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification fade-in';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    displayInitiatives();
    displayStories();
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}); 