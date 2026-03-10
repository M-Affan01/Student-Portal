let currentUser = null;
const BASE_URL = window.BASE_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://student-portal-alpha-seven.vercel.app');

async function loadProfile() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const res = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const user = await res.json();
        currentUser = user;

        document.getElementById('p-name').textContent = user.full_name;
        document.getElementById('p-roll').textContent = user.roll_number;
        document.getElementById('p-email').textContent = user.email;

        document.getElementById('p-dept').textContent = user.department_name || 'General';
        document.getElementById('p-sem').textContent = `Semester ${user.current_semester}`;
        document.getElementById('p-phone').textContent = user.phone || 'Not provided';

        // Populate Department Details
        document.getElementById('p-hod').textContent = user.head_of_department || 'N/A';
        document.getElementById('p-building').textContent = `Building ${user.building}` || 'N/A';
        document.getElementById('p-dept-email').textContent = user.dept_email || 'N/A';
        document.getElementById('p-dept-phone').textContent = user.dept_phone || 'N/A';

        // Handle Profile Image
        const imgEl = document.getElementById('p-img');
        const iconEl = document.getElementById('p-icon');
        if (user.profile_image) {
            const isBase64 = user.profile_image.startsWith('data:');
            imgEl.src = isBase64 ? user.profile_image : `${BASE_URL}/${user.profile_image}?t=${Date.now()}`;
            imgEl.classList.remove('hidden');
            iconEl.classList.add('hidden');
        } else {
            imgEl.classList.add('hidden');
            iconEl.classList.remove('hidden');
        }

    } catch (error) {
        console.error(error);
        Swal.fire({ icon: 'error', title: 'Data Load Error', text: 'Could not fetch your profile data.', background: '#1f2937', color: '#fff' });
    }
}

// Image Upload Handling
const avatarContainer = document.getElementById('profile-avatar-container');
const fileInput = document.getElementById('profile-upload-input');

avatarContainer.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        Swal.fire('Error', 'File size must be less than 2MB', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('profilePic', file);

    const token = sessionStorage.getItem('token');

    Swal.fire({
        title: 'Uploading...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        background: '#1f2937',
        color: '#fff'
    });

    try {
        const res = await fetch(`${API_URL}/student/profile/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        const data = await res.json();

        if (res.ok) {
            Swal.fire({ icon: 'success', title: 'Uploaded!', text: 'Profile picture updated.', background: '#1f2937', color: '#fff' });
            loadProfile();
            if (typeof refreshHeaderAvatar === 'function') refreshHeaderAvatar();
        } else {
            Swal.fire({ icon: 'error', title: 'Upload Failed', text: data.message, background: '#1f2937', color: '#fff' });
        }
    } catch (error) {
        console.error(error);
        Swal.fire({ icon: 'error', title: 'Error', text: 'Connection failed during upload', background: '#1f2937', color: '#fff' });
    }
});

// Restricted Edit Profile Handler
document.getElementById('edit-profile-btn').addEventListener('click', async () => {
    const { value: formValues } = await Swal.fire({
        title: 'Edit Personal Details',
        html:
            `<div class="swal-form-group">
                <label class="swal-label">Email Address</label>
                <input id="swal-email" class="swal2-input" style="margin-top: 5px;" value="${currentUser.email}">
            </div>` +
            `<div class="swal-form-group">
                <label class="swal-label">Phone Number</label>
                <input id="swal-phone" class="swal2-input" style="margin-top: 5px;" value="${currentUser.phone || ''}">
            </div>`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Save Changes',
        confirmButtonColor: '#4f46e5',
        background: '#1f2937',
        color: '#fff',
        preConfirm: () => {
            const email = document.getElementById('swal-email').value;
            const phone = document.getElementById('swal-phone').value;
            if (!email) { Swal.showValidationMessage('Email is required'); return false; }
            return { email, phone };
        }
    });

    if (formValues) {
        const token = sessionStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/student/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formValues)
            });
            const data = await res.json();
            if (res.ok) {
                Swal.fire({ icon: 'success', title: 'Updated!', text: 'Profile updated successfully.', background: '#1f2937', color: '#fff' });
                loadProfile();
            } else {
                Swal.fire({ icon: 'error', title: 'Update Error', text: data.message, background: '#1f2937', color: '#fff' });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'Request Failed', text: 'Check your internet connection.', background: '#1f2937', color: '#fff' });
        }
    }
});

// Change Password Handler
document.getElementById('change-password-btn').addEventListener('click', async () => {
    const { value: formValues } = await Swal.fire({
        title: 'Security Sync',
        html:
            '<input id="swal-old" type="password" class="swal2-input" placeholder="Current Password">' +
            '<input id="swal-new" type="password" class="swal2-input" placeholder="New Password">' +
            '<input id="swal-confirm" type="password" class="swal2-input" placeholder="Confirm New Password">',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Update Password',
        confirmButtonColor: '#4f46e5',
        background: '#1f2937',
        color: '#fff',
        preConfirm: () => {
            const oldPass = document.getElementById('swal-old').value;
            const newPass = document.getElementById('swal-new').value;
            const confirmPass = document.getElementById('swal-confirm').value;
            if (!oldPass || !newPass || !confirmPass) { Swal.showValidationMessage('All fields are required'); return false; }
            if (newPass !== confirmPass) { Swal.showValidationMessage('New passwords do not match'); return false; }
            if (newPass.length < 6) { Swal.showValidationMessage('Password must be at least 6 characters'); return false; }
            return { oldPassword: oldPass, newPassword: newPass };
        }
    });

    if (formValues) {
        const token = sessionStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/student/change-password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formValues)
            });
            const data = await res.json();
            if (res.ok) {
                Swal.fire({ icon: 'success', title: 'Security Updated', text: 'Your password has been changed successfully.', background: '#1f2937', color: '#fff' });
            } else {
                Swal.fire({ icon: 'error', title: 'Verification Failed', text: data.message, background: '#1f2937', color: '#fff' });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'Request Failed', text: 'Check your internet connection.', background: '#1f2937', color: '#fff' });
        }
    }
});

document.addEventListener('DOMContentLoaded', loadProfile);


