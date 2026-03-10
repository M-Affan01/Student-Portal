// Tailwind Configuration (injected if not present, though better in HTML head)
// We assume Tailwind CDN is loaded in HTML.

const SIDEBAR_HTML = `
    <div class="p-6 text-center border-b border-white/10">
        <div class="h-16 w-16 mx-auto mb-2 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 group cursor-pointer hover:rotate-12 transition-transform duration-300">
            <i class="fa-solid fa-graduation-cap text-3xl text-white"></i>
        </div>
        <h3 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 cursor-pointer" onclick="location.href='index.html'">
            Nexor
        </h3>
    </div>
    <ul class="mt-4 space-y-1">
        <li><a href="index.html" id="nav-dashboard" class="flex items-center px-6 py-4 text-gray-400 hover:bg-white/10 hover:text-white hover:border-l-4 hover:border-purple-500 transition-all border-l-4 border-transparent"><i class="fa-solid fa-gauge w-6"></i> Dashboard</a></li>
        <li><a href="courses.html" id="nav-courses" class="flex items-center px-6 py-4 text-gray-400 hover:bg-white/10 hover:text-white hover:border-l-4 hover:border-purple-500 transition-all border-l-4 border-transparent"><i class="fa-solid fa-book w-6"></i> Courses</a></li>
        <li><a href="timetable.html" id="nav-timetable" class="flex items-center px-6 py-4 text-gray-400 hover:bg-white/10 hover:text-white hover:border-l-4 hover:border-purple-500 transition-all border-l-4 border-transparent"><i class="fa-solid fa-calendar-days w-6"></i> Timetable</a></li>
        <li><a href="history.html" id="nav-history" class="flex items-center px-6 py-4 text-gray-400 hover:bg-white/10 hover:text-white hover:border-l-4 hover:border-purple-500 transition-all border-l-4 border-transparent"><i class="fa-solid fa-clock-rotate-left w-6"></i> History</a></li>
        <li><a href="fees.html" id="nav-fees" class="flex items-center px-6 py-4 text-gray-400 hover:bg-white/10 hover:text-white hover:border-l-4 hover:border-purple-500 transition-all border-l-4 border-transparent"><i class="fa-solid fa-money-bill w-6"></i> Fees</a></li>
        <li><a href="profile.html" id="nav-profile" class="flex items-center px-6 py-4 text-gray-400 hover:bg-white/10 hover:text-white hover:border-l-4 hover:border-purple-500 transition-all border-l-4 border-transparent"><i class="fa-solid fa-user w-6"></i> Profile</a></li>
        <li><a href="#" onclick="logout()" class="flex items-center px-6 py-4 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"><i class="fa-solid fa-right-from-bracket w-6"></i> Logout</a></li>
    </ul>
`;

const HEADER_HTML = (userName) => `
    <div class="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm mb-8 transition-colors duration-300 transform hover:translate-y-1 transition-transform">
        <div class="flex items-center">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Welcome, <span class="text-indigo-600 dark:text-indigo-400 font-bold">${userName}</span></h2>
        </div>
        <div class="flex items-center space-x-6">
            <span class="text-sm text-gray-500 dark:text-gray-400 hidden md:block" id="current-date"></span>
            
            <!-- Theme Toggle -->
            <button id="theme-toggle" class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-yellow-400 hover:scale-110 transition-transform shadow-sm">
                <i class="fa-solid fa-moon dark:hidden"></i>
                <i class="fa-solid fa-sun hidden dark:block"></i>
            </button>

            <div class="flex items-center space-x-3 cursor-pointer group" onclick="location.href='profile.html'">
                <div class="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 border-2 border-indigo-500 flex items-center justify-center overflow-hidden transition-all group-hover:scale-110">
                    <img id="header-avatar-img" src="" class="w-full h-full object-cover hidden">
                    <i id="header-avatar-icon" class="fa-solid fa-circle-user text-indigo-600 dark:text-indigo-400 text-2xl"></i>
                </div>
                <div class="hidden lg:block text-left">
                    <p class="text-xs font-bold text-gray-800 dark:text-white leading-none">${userName}</p>
                    <p class="text-[10px] text-gray-500 dark:text-gray-400">Student Portal</p>
                </div>
            </div>
        </div>
    </div>
`;

// LAYOUT_API_URL and LAYOUT_BASE_URL are provided by config.js
const LAYOUT_API_URL = API_URL;
const LAYOUT_BASE_URL = BASE_URL;


async function syncUserProfile() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const res = await fetch(`${LAYOUT_API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) return;

        const user = await res.json();

        // Update Header Name
        const nameEl = document.querySelector('.header-user-name'); // Need to add class to HEADER_HTML first? 
        // Or just search by structure. Better to add class/id.
        // Let's use specific selector based on existing structure or update HEADER_HTML in next step.
        // Using existing structure: 
        const nameContainer = document.querySelector('.flex.items-center .font-bold.text-indigo-600');
        if (nameContainer) nameContainer.textContent = user.full_name;

        // Update Sidebar/Header Small Text
        const smallName = document.querySelector('.hidden.lg\\:block .font-bold.text-gray-800');
        if (smallName) smallName.textContent = user.full_name;

        // Update Avatar
        const imgEl = document.getElementById('header-avatar-img');
        const iconEl = document.getElementById('header-avatar-icon');

        if (imgEl && iconEl && user.profile_image) {
            imgEl.src = `${LAYOUT_BASE_URL}/${user.profile_image}?t=${Date.now()}`;
            imgEl.classList.remove('hidden');
            iconEl.classList.add('hidden');
        }

        // Update LocalStorage to keep it fresh for next load
        const lsUser = JSON.parse(localStorage.getItem('user')) || {};
        lsUser.name = user.full_name;
        lsUser.email = user.email;
        // lsUser.rollNumber = user.roll_number; // if needed
        localStorage.setItem('user', JSON.stringify(lsUser));

    } catch (e) { console.error("Profile sync error:", e); }
}

async function loadLayout() {
    // Inject Sidebar
    const sidebar = document.createElement('div');
    sidebar.className = 'w-64 bg-[#1a1a2e] text-white fixed top-0 left-0 h-full z-50 shadow-xl overflow-y-auto hidden md:block transition-all duration-300';
    sidebar.innerHTML = SIDEBAR_HTML;
    const container = document.querySelector('.app-container');
    if (container) container.prepend(sidebar);

    // Inject Header
    // Initially use localStorage as placeholder/optimistic UI
    const localUser = JSON.parse(localStorage.getItem('user'));
    const initialName = localUser ? localUser.name : 'Student';

    const mainContent = document.querySelector('.main-content');

    if (mainContent) {
        mainContent.className += ' md:ml-64 w-full p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300';

        const headerContainer = document.createElement('div');
        headerContainer.innerHTML = HEADER_HTML(initialName);
        mainContent.prepend(headerContainer.firstElementChild);

        // Fetch fresh user data (Name + Avatar)
        await syncUserProfile();
    }

    // Active Link
    const currentPage = window.location.pathname.split('/').pop();
    const navId = 'nav-' + (currentPage === 'index.html' || currentPage === '' ? 'dashboard' : currentPage.replace('.html', ''));
    const activeLink = document.getElementById(navId);
    if (activeLink) {
        activeLink.classList.remove('text-gray-400', 'border-transparent');
        activeLink.classList.add('bg-white/10', 'text-white', 'border-purple-500', 'shadow-inner');
    }

    // Date
    const dateDisplay = document.getElementById('current-date');
    if (dateDisplay) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
    }

    // Theme Logic
    initTheme();

    // Auto-init Vanilla Tilt
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
        });
    }
}

function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Check saved
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            html.classList.toggle('dark');
            localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');

            // Re-render chart if it exists
            const chartCanvas = document.getElementById('cgpaChart');
            if (chartCanvas && typeof loadDashboard === 'function') {
                loadDashboard();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadLayout();
});

