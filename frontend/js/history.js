async function loadHistory() {
    const token = localStorage.getItem('token');

    try {
        const res = await fetch(`${API_URL}/student/history`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const history = await res.json();

        const list = document.getElementById('history-list');
        list.innerHTML = '';

        if (history.length === 0) {
            list.innerHTML = '<tr><td colspan="6" class="p-6 text-center text-gray-500 dark:text-gray-400">No academic history found.</td></tr>';
            return;
        }

        history.forEach(h => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors";

            // Color grade based on value
            let gradeColor = 'text-gray-800 dark:text-white';
            if (['A', 'A-'].includes(h.grade)) gradeColor = 'text-green-600 dark:text-green-400 font-bold';
            else if (['F'].includes(h.grade)) gradeColor = 'text-red-600 dark:text-red-400 font-bold';

            tr.innerHTML = `
                <td class="p-4">${h.semester}</td>
                <td class="p-4 font-semibold text-gray-900 dark:text-white">${h.course_code}</td>
                <td class="p-4">${h.course_title}</td>
                <td class="p-4">${h.credits}</td>
                <td class="p-4 ${gradeColor}">${h.grade}</td>
                <td class="p-4 font-mono text-gray-600 dark:text-gray-300">${h.grade_point}</td>
            `;
            list.appendChild(tr);
        });

    } catch (error) { console.error(error); }
}

document.addEventListener('DOMContentLoaded', loadHistory);

