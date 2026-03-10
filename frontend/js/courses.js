async function loadCourses() {
    const token = sessionStorage.getItem('token');
    let registeredIds = new Set();

    // 1. Fetch Registered Courses
    try {
        const res = await fetch(`${API_URL}/courses/my-courses`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const myCourses = await res.json();

        // Track registered IDs for filtering (Ensure String for comparison)
        myCourses.forEach(c => registeredIds.add(String(c.course_id)));

        const myCoursesList = document.getElementById('my-courses-list');
        myCoursesList.innerHTML = '';

        let totalCredits = 0;

        myCourses.forEach(c => {
            totalCredits += parseInt(c.credit_hours || 0);
            const tr = document.createElement('tr');
            tr.className = "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0";
            tr.innerHTML = `
                <td class="p-4 pl-6 font-bold text-gray-900 dark:text-white uppercase tracking-tighter text-xs">
                    <div class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-lg inline-block text-gray-600 dark:text-gray-400">
                        ${c.course_code}
                    </div>
                </td>
                <td class="p-4 text-gray-700 dark:text-gray-300 font-medium">${c.course_name}</td>
                <td class="p-4">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                        ${c.credit_hours} Cr
                    </span>
                </td>
                <td class="p-4 text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                    ${c.instructor_name || 'Prof. TBA'}
                </td>
                <td class="p-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800/50 uppercase tracking-widest">
                        ${c.status}
                    </span>
                </td>
                <td class="p-4 text-right pr-6">
                     <button class="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300" onclick="dropCourse(${c.course_id})">
                        <i class="fa-solid fa-trash-can text-xs"></i>
                     </button>
                </td>
            `;
            myCoursesList.appendChild(tr);
        });

        // Update Credit Badge
        const badge = document.getElementById('credit-count-badge');
        if (badge) {
            badge.innerText = `${totalCredits} / 21`;
            // Color logic
            if (totalCredits >= 18) {
                badge.className = "font-mono font-bold text-red-600 dark:text-red-400 animate-pulse";
            } else if (totalCredits >= 12) {
                badge.className = "font-mono font-bold text-orange-500 dark:text-orange-400";
            } else {
                badge.className = "font-mono font-bold text-indigo-600 dark:text-indigo-400";
            }
        }

    } catch (error) { console.error(error); }

    // 2. Fetch Available Courses
    try {
        const res = await fetch(`${API_URL}/courses`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const allCourses = await res.json();

        console.log(`Loaded ${allCourses.length} courses`); // Debug Log

        // Filter Logic
        let currentFilteredCourses = [...allCourses];

        const renderCourses = () => {
            const tempCourses = [...currentFilteredCourses];
            const deptValue = document.getElementById('dept-filter').value;
            const semValue = document.getElementById('sem-filter').value;
            const searchValue = document.getElementById('course-search').value.toLowerCase();

            // Apply Filters (Including Already Registered Check)
            const filtered = tempCourses.filter(c => {
                const isNotRegistered = !registeredIds.has(String(c.course_id));
                const matchDept = deptValue === 'All' || c.department_code === deptValue;
                const matchSem = semValue === 'All' || c.semester_number.toString() === semValue;
                const matchSearch = c.course_name.toLowerCase().includes(searchValue) || c.course_code.toLowerCase().includes(searchValue);
                return isNotRegistered && matchDept && matchSem && matchSearch;
            });

            const availableList = document.getElementById('available-courses-list');

            if (filtered.length > 0) {
                availableList.innerHTML = '';

                // Sort by Semester then Alphabetically
                filtered.sort((a, b) => a.semester_number - b.semester_number || a.course_name.localeCompare(b.course_name));

                let currentSemester = 0;

                filtered.forEach((c) => {
                    // Insert Semester Header if changed (and sorting allows)
                    // If filtering by specific semester, header is redundant but okay.
                    if (c.semester_number > currentSemester) {
                        currentSemester = c.semester_number;
                        const headerRow = document.createElement('tr');
                        headerRow.className = "bg-gray-100 dark:bg-gray-700/50";
                        headerRow.innerHTML = `
                            <td colspan="5" class="p-3 pl-6 font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider text-xs">
                                Semester ${currentSemester}
                            </td>
                        `;
                        availableList.appendChild(headerRow);
                    }

                    const tr = document.createElement('tr');
                    tr.className = "hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0";

                    tr.innerHTML = `
                        <td class="p-4 pl-6 font-bold text-gray-900 dark:text-white flex items-center">
                            <span class="font-mono text-indigo-600 dark:text-indigo-400 mr-2">${c.course_code}</span>
                        </td>
                        <td class="p-4 text-gray-700 dark:text-gray-300 font-medium">${c.course_name}</td>
                        <td class="p-4">
                            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                ${c.credit_hours} Cr
                            </span>
                        </td>
                        <td class="p-4 text-gray-600 dark:text-gray-400 text-sm">
                            ${c.current_instructor || c.instructor_name || 'TBA'}
                        </td>
                        <td class="p-4 text-right pr-6">
                            <button class="px-4 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-xs font-bold" onclick="registerCourse(${c.course_id})">
                                 Register
                            </button>
                        </td>
                    `;
                    availableList.appendChild(tr);
                });

                gsap.from(availableList.children, { duration: 0.3, y: 5, opacity: 0, stagger: 0.02, ease: "power1.out" });

            } else {
                availableList.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-gray-500 font-medium italic">No courses match your filters.</td></tr>';
            }
        };

        // Initial Render
        renderCourses();

        // Event Listeners
        document.getElementById('dept-filter').addEventListener('change', renderCourses);
        document.getElementById('sem-filter').addEventListener('change', renderCourses);
        document.getElementById('course-search').addEventListener('input', renderCourses);

    } catch (error) {
        console.error(error);
        // Don't wipe list on error, so debug row stays or we append error
        const availableList = document.getElementById('available-courses-list');
        availableList.innerHTML += `<tr><td colspan="5" class="p-4 text-center text-red-500">Error loading courses: ${error.message}</td></tr>`;
    }
}

async function registerCourse(courseId) {
    const token = sessionStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/courses/register`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ courseId })
        });

        const data = await res.json();

        if (res.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Course Registered!',
                customClass: {
                    popup: 'dark:bg-gray-800 dark:text-white'
                }
            });
            loadCourses();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message,
                customClass: {
                    popup: 'dark:bg-gray-800 dark:text-white'
                }
            });
        }
    } catch (error) { console.error(error); }
}

async function dropCourse(courseId) {
    const token = sessionStorage.getItem('token');

    const confirm = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, drop it!',
        customClass: {
            popup: 'dark:bg-gray-800 dark:text-white'
        }
    });

    if (confirm.isConfirmed) {
        try {
            const res = await fetch(`${API_URL}/courses/${courseId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Dropped!',
                    text: 'Course has been dropped.',
                    customClass: {
                        popup: 'dark:bg-gray-800 dark:text-white'
                    }
                });
                loadCourses();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Could not drop course.',
                    customClass: {
                        popup: 'dark:bg-gray-800 dark:text-white'
                    }
                });
            }
        } catch (error) { console.error(error); }
    }
}

document.addEventListener('DOMContentLoaded', loadCourses);


