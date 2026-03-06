function animateValues(id, start, end, duration) {
    // GSAP handles number tweening beautifully
    const obj = { val: start };
    gsap.to(obj, {
        val: end,
        duration: duration / 1000,
        ease: "power2.out",
        onUpdate: () => {
            document.getElementById(id).textContent = Math.floor(obj.val); // or toFixed for floats
        }
    });
}

function animateFloat(id, start, end, duration) {
    const obj = { val: start };
    gsap.to(obj, {
        val: end,
        duration: duration / 1000,
        ease: "power2.out",
        onUpdate: () => {
            document.getElementById(id).textContent = obj.val.toFixed(2);
        }
    });
}

async function loadDashboard() {
    const token = localStorage.getItem('token');

    // GSAP Entrance
    gsap.to(".main-content", { duration: 1, opacity: 1, ease: "power2.inOut" });

    // Stagger stats
    gsap.from(".tilt-card", {
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: "back.out(1.7)"
    });

    try {
        const res = await fetch(`${API_URL}/student/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 401 || res.status === 403) {
            window.location.href = 'login.html';
            return;
        }

        const data = await res.json();

        // Animate Numbers
        animateFloat('cgpa-val', 0, data.cgpa ? parseFloat(data.cgpa) : 0, 2000);
        animateValues('credits-val', 0, data.credits || 0, 1500);

        // Fees formatter
        const feeObj = { val: 0 };
        gsap.to(feeObj, {
            val: data.pendingFees || 0,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
                document.getElementById('fees-val').textContent = '$' + Math.floor(feeObj.val);
            }
        });

        animateValues('courses-val', 0, data.registeredCourses || 0, 1000);

        // Chart
        renderChart(data.cgpa, data.cgpaHistory);

        // Notifications
        const notifList = document.getElementById('notifications-list');
        notifList.innerHTML = '';
        if (data.notifications && data.notifications.length > 0) {
            data.notifications.forEach((n, index) => {
                const li = document.createElement('li');
                const isUrgent = n.is_urgent || n.type === 'Administrative';
                const borderColor = isUrgent ? 'border-red-500' : 'border-indigo-500';
                const bgColor = isUrgent ? 'bg-red-50/50 dark:bg-red-900/10' : 'bg-gray-50 dark:bg-gray-700';

                li.className = `p-4 ${bgColor} rounded-xl border-l-4 ${borderColor} shadow-sm animate__animated animate__fadeInLeft`;
                li.innerHTML = `
                    <div class="flex items-start gap-3">
                        <div class="${isUrgent ? 'text-red-500' : 'text-indigo-500'} mt-1">
                            <i class="fa-solid ${isUrgent ? 'fa-circle-exclamation' : 'fa-circle-info'}"></i>
                        </div>
                        <div>
                            <div class="font-bold text-gray-800 dark:text-white mb-1 flex items-center gap-2">
                                ${n.title}
                                ${isUrgent ? '<span class="text-[8px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full uppercase font-black">Urgent</span>' : ''}
                            </div>
                            <div class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">${n.message}</div>
                        </div>
                    </div>
                `;
                notifList.appendChild(li);
            });

            // Stagger notifications
            gsap.from("#notifications-list li", {
                duration: 0.5,
                x: -30,
                opacity: 0,
                stagger: 0.1,
                delay: 1
            });

        } else {
            notifList.innerHTML = '<li class="text-gray-400">No new notifications</li>';
        }

        // Animate charts/lists
        gsap.from(".gs-reveal", {
            duration: 0.8,
            y: 30,
            opacity: 0,
            delay: 0.5,
            stagger: 0.2
        });


    } catch (error) {
        console.error(error);
    }
}

function renderChart(currentCgpa, history = []) {
    const ctx = document.getElementById('cgpaChart').getContext('2d');

    // Theme colors
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#fff' : '#333';
    const gridColor = isDark ? 'rgba(156, 163, 175, 0.1)' : 'rgba(0,0,0,0.05)';

    // Prepare Data
    let labels = [];
    let dataPoints = [];

    if (history && history.length > 0) {
        history.forEach(h => {
            labels.push(`Sem ${h.semester}`);
            dataPoints.push(parseFloat(h.gpa));
        });
        // Add current point if it's the next sem
        labels.push('Current');
        dataPoints.push(parseFloat(currentCgpa));
    } else {
        // Fallback for demo if no history exists
        labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Current'];
        dataPoints = [3.2, 3.4, 3.5, parseFloat(currentCgpa) || 3.5];
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'CGPA',
                data: dataPoints,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 4,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#6366f1',
                pointBorderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 9,
                pointHoverBackgroundColor: '#6366f1',
                pointHoverBorderColor: '#fff',
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: isDark ? '#1f2937' : '#fff',
                    titleColor: isDark ? '#fff' : '#000',
                    bodyColor: isDark ? '#ccc' : '#666',
                    borderColor: '#667eea',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 2.0,
                    max: 4.0,
                    grid: { color: gridColor },
                    ticks: { color: textColor }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: textColor }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', loadDashboard);
