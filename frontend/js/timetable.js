async function loadTimetable() {
    const token = checkAuth();
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/student/timetable`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const timetable = await res.json();

        const container = document.getElementById('timetable-container');
        if (!container) return; // Safety check
        container.innerHTML = '';

        // Handle Empty Schedule
        if (!Array.isArray(timetable) || timetable.length === 0) {
            container.innerHTML = `
                <div class="col-span-full flex flex-col items-center justify-center text-center p-12 bg-white/50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
                    <div class="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 text-indigo-400">
                         <i class="fa-regular fa-calendar-xmark text-3xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-700 dark:text-gray-200">No Classes Scheduled</h3>
                    <p class="text-gray-500 dark:text-gray-400 mt-2">
                        You have not registered for any courses, or your registered courses do not have assigned timeslots yet.
                    </p>
                    <a href="courses.html" class="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                        Browse Courses
                    </a>
                </div>
            `;
            return;
        }

        // Group by Day of Week
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const grouped = {};

        days.forEach(day => {
            const classes = timetable.filter(t => t.day_of_week === day);
            if (classes.length > 0) grouped[day] = classes;
        });

        // Render Day Cards
        for (const [day, classes] of Object.entries(grouped)) {
            const dayCard = document.createElement('div');
            // Removed backdrop-blur, added solid white/dark bg with stronger shadow and hover lift
            // 100% Solid Card Style (No Glass/Transparency)
            dayCard.className = "tilt-card relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group z-10";

            // Header Color based on day (High Contrast)
            let headerColor = 'bg-indigo-600';
            if (day === 'Monday') headerColor = 'bg-blue-600';
            if (day === 'Wednesday') headerColor = 'bg-indigo-600'; // Balanced blue for Wednesday
            if (day === 'Friday') headerColor = 'bg-cyan-600';

            // Card Content
            dayCard.innerHTML = `
                <div class="absolute top-0 left-0 w-full h-1.5 ${headerColor} group-hover:h-2 transition-all duration-300"></div>
                <div class="p-6 relative z-10">
                    <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center justify-between tracking-tight">
                        ${day}
                        <span class="text-[10px] font-bold px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 uppercase tracking-widest border border-gray-200 dark:border-gray-600">
                            ${classes.length} Classes
                        </span>
                    </h3>
                    
                    <div class="space-y-4">
                        ${classes.map((t, idx) => `
                            <!-- Class Item with hover glow -->
                            <div class="relative pl-5 border-l-4 border-indigo-600 dark:border-indigo-500 transition-all duration-400 p-4 rounded-r-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 group/item border-y border-r border-transparent hover:border-gray-100 dark:hover:border-gray-700 shadow-sm mb-4 last:mb-0">
                                <div class="flex justify-between items-start mb-1">
                                    <p class="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">
                                        ${t.start_time ? t.start_time.slice(0, 5) : '00:00'} — ${t.end_time ? t.end_time.slice(0, 5) : '00:00'}
                                    </p>
                                </div>
                                <h4 class="font-bold text-lg text-gray-900 dark:text-white leading-tight">${t.course_name}</h4>
                                <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    <i class="fa-solid fa-location-dot mr-1.5 text-indigo-500"></i>
                                    <span class="font-bold uppercase tracking-tighter">${t.room_number || 'Online'}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            container.appendChild(dayCard);
        }

        // Tilt Effect (Optional)
        if (typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
                max: 5,
                speed: 400,
                glare: true,
                "max-glare": 0.1,
            });
        }

        // Initial Display Animation (No opacity fading)
        if (typeof gsap !== 'undefined') {
            gsap.from(".tilt-card", { duration: 0.6, y: 20, stagger: 0.1, ease: "power2.out" });
        }

    } catch (error) {
        console.error("Timetable Error:", error);
        document.getElementById('timetable-container').innerHTML = `<p class="col-span-full text-center text-red-500 py-10">Error loading timetable. Please try again.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', loadTimetable);
