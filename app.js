// App State
let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
let currentUser = null;
let isAdmin = false;
let isSuperAdmin = false;
let isDoctor = false;
let currentLanguage = localStorage.getItem('language') || 'en';

// Toggle Language
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    localStorage.setItem('language', currentLanguage);
    applyLanguage();
}

// Apply Language
function applyLanguage() {
    const isArabic = currentLanguage === 'ar';
    
    // Toggle language elements
    document.querySelectorAll('.lang-en').forEach(el => {
        el.style.display = isArabic ? 'none' : 'inline';
    });
    document.querySelectorAll('.lang-ar').forEach(el => {
        el.style.display = isArabic ? 'inline' : 'none';
    });
    
    // Set direction
    document.body.dir = isArabic ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl', isArabic);
    
    // Re-populate departments and doctors with new language
    if (departmentSelect) {
        populateDepartments();
    }
    
    // Restart typing animation if on home page
    if (document.getElementById('home-view').classList.contains('active')) {
        initTypingAnimation();
    }
}

// Make functions global
window.toggleLanguage = toggleLanguage;

// Users Database
const users = {
    'superadmin': { password: 'super123', role: 'superadmin', name: 'Super Admin', email: 'superadmin@clinic.com' },
    'admin@clinic.com': { password: 'admin123', role: 'admin', name: 'Admin', email: 'admin@clinic.com' },
    'user@example.com': { password: 'user123', role: 'user', name: 'John Doe', email: 'user@example.com' },
    'rania': { password: 'rania123', role: 'user', name: 'Rania', email: 'rania@example.com' },
    // Doctors logins
    'doctor1': { password: 'doc123', role: 'doctor', name: 'د. أحمد محمود', doctorId: 1 },
    'doctor2': { password: 'doc123', role: 'doctor', name: 'د. فاطمة السيد', doctorId: 2 },
    'doctor3': { password: 'doc123', role: 'doctor', name: 'د. محمد حسن', doctorId: 3 },
    'doctor4': { password: 'doc123', role: 'doctor', name: 'د. خالد عبدالله', doctorId: 4 },
    'doctor5': { password: 'doc123', role: 'doctor', name: 'د. نورا إبراهيم', doctorId: 5 },
    'doctor6': { password: 'doc123', role: 'doctor', name: 'د. عمر الشريف', doctorId: 6 },
    'doctor7': { password: 'doc123', role: 'doctor', name: 'د. سارة أحمد', doctorId: 7 },
    'doctor8': { password: 'doc123', role: 'doctor', name: 'د. يوسف مصطفى', doctorId: 8 }
};

// DOM Elements
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const bookingForm = document.getElementById('booking-form');
const departmentSelect = document.getElementById('department');
const doctorSelect = document.getElementById('doctor');
const dateInput = document.getElementById('appointment-date');
const timeSelect = document.getElementById('appointment-time');
const searchBtn = document.getElementById('search-btn');
const searchEmail = document.getElementById('search-email');
const historyBtn = document.getElementById('history-btn');
const historyEmail = document.getElementById('history-email');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(); // Apply saved language
    checkLogin();
    initNavigation();
    populateDepartments();
    setMinDate();
    
    // Initialize home animations if home view is active
    if (document.getElementById('home-view').classList.contains('active')) {
        setTimeout(() => {
            initHomeAnimations();
        }, 500);
    }
    
    // Event Listeners
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    departmentSelect.addEventListener('change', handleDepartmentChange);
    doctorSelect.addEventListener('change', updateTimeSlots);
    dateInput.addEventListener('change', updateTimeSlots);
    bookingForm.addEventListener('submit', handleBooking);
    searchBtn.addEventListener('click', searchAppointments);
    historyBtn.addEventListener('click', searchHistory);
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Add doctor form
    const addDoctorForm = document.getElementById('add-doctor-form');
    if (addDoctorForm) {
        addDoctorForm.addEventListener('submit', handleAddDoctor);
    }
    
    // Photo preview
    const photoInput = document.getElementById('doctor-photo');
    if (photoInput) {
        photoInput.addEventListener('change', handlePhotoPreview);
    }
    
    // Register form validation
    setupRegisterValidation();
});

// Setup Register Form Validation
function setupRegisterValidation() {
    const nameInput = document.getElementById('register-name');
    const emailInput = document.getElementById('register-email');
    const usernameInput = document.getElementById('register-username');
    const passwordInput = document.getElementById('register-password');
    const confirmPasswordInput = document.getElementById('register-confirm-password');
    const phoneInput = document.getElementById('register-phone');
    
    if (!nameInput) return;
    
    // Name validation (at least 3 parts)
    nameInput.addEventListener('input', () => {
        const nameParts = nameInput.value.trim().split(/\s+/);
        if (nameParts.length >= 3 && nameInput.value.trim().length >= 6) {
            nameInput.classList.remove('invalid');
            nameInput.classList.add('valid');
        } else {
            nameInput.classList.remove('valid');
            nameInput.classList.add('invalid');
        }
    });
    
    // Email validation
    emailInput.addEventListener('input', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(emailInput.value)) {
            emailInput.classList.remove('invalid');
            emailInput.classList.add('valid');
        } else {
            emailInput.classList.remove('valid');
            emailInput.classList.add('invalid');
        }
    });
    
    // Username validation
    usernameInput.addEventListener('input', () => {
        if (usernameInput.value.trim().length >= 3) {
            usernameInput.classList.remove('invalid');
            usernameInput.classList.add('valid');
        } else {
            usernameInput.classList.remove('valid');
            usernameInput.classList.add('invalid');
        }
    });
    
    // Password validation
    passwordInput.addEventListener('input', () => {
        if (passwordInput.value.length >= 6) {
            passwordInput.classList.remove('invalid');
            passwordInput.classList.add('valid');
        } else {
            passwordInput.classList.remove('valid');
            passwordInput.classList.add('invalid');
        }
        
        // Re-validate confirm password if it has value
        if (confirmPasswordInput.value) {
            validateConfirmPassword();
        }
    });
    
    // Confirm Password validation
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);
    
    function validateConfirmPassword() {
        if (confirmPasswordInput.value === passwordInput.value && confirmPasswordInput.value.length >= 6) {
            confirmPasswordInput.classList.remove('invalid');
            confirmPasswordInput.classList.add('valid');
        } else {
            confirmPasswordInput.classList.remove('valid');
            confirmPasswordInput.classList.add('invalid');
        }
    }
    
    // Phone validation
    phoneInput.addEventListener('input', () => {
        const phoneRegex = /^[0-9]{10,15}$/;
        if (phoneRegex.test(phoneInput.value.replace(/\s/g, ''))) {
            phoneInput.classList.remove('invalid');
            phoneInput.classList.add('valid');
        } else {
            phoneInput.classList.remove('valid');
            phoneInput.classList.add('invalid');
        }
    });
}

// Check Login Status
function checkLogin() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isAdmin = currentUser.role === 'admin';
        isSuperAdmin = currentUser.role === 'superadmin';
        isDoctor = currentUser.role === 'doctor';
        showApp();
    } else {
        // Show home page without login
        showPublicHome();
    }
}

// Show Public Home Page
function showPublicHome() {
    // Show login and register buttons
    document.getElementById('login-nav-btn').style.display = 'inline-block';
    document.getElementById('register-nav-btn').style.display = 'inline-block';
    document.getElementById('user-name').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'none';
    
    // Hide user-only, admin-only, doctor-only menu items
    document.querySelectorAll('.user-only, .admin-only, .doctor-only, .superadmin-only').forEach(el => {
        el.style.display = 'none';
    });
    
    // Show only public pages
    switchView('home');
}

// Show Login Modal
function showLoginModal() {
    loginModal.style.display = 'flex';
    registerModal.style.display = 'none';
}

// Show Register Modal
function showRegisterModal() {
    registerModal.style.display = 'flex';
    loginModal.style.display = 'none';
}

// Close Modal
function closeModal() {
    loginModal.style.display = 'none';
    registerModal.style.display = 'none';
}

// Make functions global
window.showLoginModal = showLoginModal;
window.showRegisterModal = showRegisterModal;
window.closeModal = closeModal;

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (users[username] && users[username].password === password) {
        currentUser = { username, ...users[username] };
        isAdmin = currentUser.role === 'admin';
        isSuperAdmin = currentUser.role === 'superadmin';
        isDoctor = currentUser.role === 'doctor';
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        loginModal.style.display = 'none';
        showApp();
        showNotification(`Welcome ${currentUser.name}!`, 'success');
        
        // Redirect based on role
        if (isSuperAdmin) {
            switchView('superadmin');
        } else if (isAdmin) {
            switchView('admin');
        } else if (isDoctor) {
            switchView('doctor-appointments');
        } else {
            switchView('booking');
        }
    } else {
        showNotification('Invalid credentials', 'error');
    }
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    isAdmin = false;
    isDoctor = false;
    location.reload();
}

// Show App
function showApp() {
    // Hide login/register buttons, show user info and logout
    document.getElementById('login-nav-btn').style.display = 'none';
    document.getElementById('register-nav-btn').style.display = 'none';
    document.getElementById('user-name').style.display = 'inline-block';
    document.getElementById('user-name').textContent = currentUser.name;
    
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.style.display = 'inline-block';
    logoutBtn.onclick = handleLogout;
    
    if (isSuperAdmin) {
        // SuperAdmin sees everything
        document.querySelectorAll('.superadmin-only, .admin-only').forEach(el => {
            el.style.display = 'block';
        });
        document.querySelectorAll('.user-only, .doctor-only').forEach(el => {
            el.style.display = 'none';
        });
    } else if (isAdmin) {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'block';
        });
        document.querySelectorAll('.user-only, .doctor-only, .superadmin-only').forEach(el => {
            el.style.display = 'none';
        });
    } else if (isDoctor) {
        document.querySelectorAll('.doctor-only').forEach(el => {
            el.style.display = 'block';
        });
        document.querySelectorAll('.admin-only, .user-only, .superadmin-only').forEach(el => {
            el.style.display = 'none';
        });
    } else {
        document.querySelectorAll('.user-only').forEach(el => {
            el.style.display = 'block';
        });
        document.querySelectorAll('.admin-only, .doctor-only, .superadmin-only').forEach(el => {
            el.style.display = 'none';
        });
    }
    
    // Fill booking form with user data (readonly)
    if (currentUser.role === 'user') {
        const nameInput = document.getElementById('patient-name');
        const emailInput = document.getElementById('patient-email');
        const phoneInput = document.getElementById('patient-phone');
        
        if (nameInput) nameInput.value = currentUser.name || '';
        if (emailInput) emailInput.value = currentUser.email || '';
        if (phoneInput) phoneInput.value = currentUser.phone || '';
    }
}

// Toggle Mobile Menu
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewName = link.dataset.view;
            switchView(viewName);
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Close mobile menu
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

function switchView(viewName) {
    const views = document.querySelectorAll('.view');
    views.forEach(view => view.classList.remove('active'));
    document.getElementById(`${viewName}-view`).classList.add('active');
    
    if (viewName === 'doctors') {
        loadDoctorsList();
    } else if (viewName === 'appointments') {
        if (currentUser && currentUser.role === 'user') {
            document.getElementById('search-email').value = currentUser.email;
            searchAppointments();
        }
    } else if (viewName === 'admin' && isAdmin) {
        loadAdminDashboard();
    } else if (viewName === 'admin-patients' && isAdmin) {
        loadPatientsList();
    } else if (viewName === 'manage-doctors' && isAdmin) {
        loadManageDoctors();
    } else if (viewName === 'superadmin' && isSuperAdmin) {
        loadSuperAdminDashboard();
    } else if (viewName === 'manage-users' && isSuperAdmin) {
        loadManageUsers();
    } else if (viewName === 'doctor-appointments' && isDoctor) {
        loadDoctorAppointments();
    } else if (viewName === 'doctor-patients' && isDoctor) {
        loadDoctorPatients();
    } else if (viewName === 'history') {
        if (currentUser && currentUser.role === 'user') {
            document.getElementById('history-email').value = currentUser.email;
            searchHistory();
        }
    } else if (viewName === 'booking') {
        if (!currentUser) {
            loginModal.style.display = 'flex';
            return;
        }
    }
}

// Make switchView global for onclick handlers
window.switchView = switchView;

// Populate Departments
function populateDepartments() {
    // Clear existing options except the first one
    departmentSelect.innerHTML = '<option value="">' + 
        (currentLanguage === 'ar' ? 'اختر القسم' : 'Select Department') + 
        '</option>';
    
    clinicData.departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.id;
        option.textContent = currentLanguage === 'ar' ? dept.name : dept.nameEn;
        departmentSelect.appendChild(option);
    });
    
    // Populate in manage doctors form if exists
    const doctorDeptSelect = document.getElementById('doctor-dept');
    if (doctorDeptSelect) {
        doctorDeptSelect.innerHTML = '<option value="">Select Department</option>';
        clinicData.departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.id;
            option.textContent = `${dept.name} - ${dept.nameEn}`;
            doctorDeptSelect.appendChild(option);
        });
    }
}

// Handle Department Change
function handleDepartmentChange() {
    const deptId = parseInt(departmentSelect.value);
    doctorSelect.innerHTML = '<option value="">' + 
        (currentLanguage === 'ar' ? 'اختر الطبيب' : 'Select Doctor') + 
        '</option>';
    
    if (deptId) {
        const doctors = clinicData.doctors.filter(d => d.department === deptId);
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = currentLanguage === 'ar' ? doctor.name : doctor.nameEn;
            doctorSelect.appendChild(option);
        });
        doctorSelect.disabled = false;
    } else {
        doctorSelect.disabled = true;
    }
    
    updateTimeSlots();
}

// Set Minimum Date
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
}

// Update Time Slots
function updateTimeSlots() {
    timeSelect.innerHTML = '<option value="">' + 
        (currentLanguage === 'ar' ? 'اختر الوقت' : 'Select Time') + 
        '</option>';
    
    const doctorId = parseInt(doctorSelect.value);
    const selectedDate = dateInput.value;
    
    if (!doctorId || !selectedDate) {
        timeSelect.disabled = true;
        return;
    }
    
    const doctor = clinicData.doctors.find(d => d.id === doctorId);
    
    if (!doctor) {
        console.error('Doctor not found with ID:', doctorId);
        timeSelect.disabled = true;
        return;
    }
    
    const selectedDay = new Date(selectedDate + 'T00:00:00').getDay();
    
    if (!doctor.availableDays.includes(selectedDay)) {
        const message = currentLanguage === 'ar' ? 
            'الطبيب غير متاح في هذا اليوم' : 
            'Doctor not available on this day';
        showNotification(message, 'error');
        timeSelect.disabled = true;
        return;
    }
    
    const bookedSlots = appointments
        .filter(apt => apt.doctor === doctor.name && apt.date === selectedDate && apt.status !== 'cancelled')
        .map(apt => apt.time);
    
    clinicData.timeSlots.forEach(slot => {
        if (!bookedSlots.includes(slot)) {
            const option = document.createElement('option');
            option.value = slot;
            option.textContent = slot;
            timeSelect.appendChild(option);
        }
    });
    
    // Enable time select if there are available slots
    timeSelect.disabled = timeSelect.options.length <= 1;
    
    if (timeSelect.disabled) {
        const message = currentLanguage === 'ar' ? 
            'لا توجد أوقات متاحة في هذا اليوم' : 
            'No available time slots for this day';
        showNotification(message, 'error');
    }
}

// Handle Booking
function handleBooking(e) {
    e.preventDefault();
    
    const doctorId = parseInt(doctorSelect.value);
    const doctor = clinicData.doctors.find(d => d.id === doctorId);
    const deptId = parseInt(departmentSelect.value);
    const department = clinicData.departments.find(d => d.id === deptId);
    
    const patientName = document.getElementById('patient-name').value;
    const patientEmail = document.getElementById('patient-email').value || 'N/A';
    const patientPhone = document.getElementById('patient-phone').value;
    
    const appointment = {
        id: Date.now(),
        patientName: patientName,
        patientEmail: patientEmail,
        patientPhone: patientPhone,
        department: department.name,
        doctor: doctor.name,
        date: dateInput.value,
        time: timeSelect.value,
        reason: document.getElementById('reason').value,
        status: 'confirmed',
        bookingDate: new Date().toISOString().split('T')[0]
    };
    
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    // Save patient data
    savePatientData(patientName, patientEmail, patientPhone);
    
    const message = currentLanguage === 'ar' ? 
        'تم حجز الموعد بنجاح!' : 
        'Appointment booked successfully!';
    showNotification(message, 'success');
    
    // Reset form
    bookingForm.reset();
    setMinDate();
    doctorSelect.disabled = true;
    timeSelect.disabled = true;
    timeSelect.innerHTML = '<option value="">' + 
        (currentLanguage === 'ar' ? 'اختر الوقت' : 'Select Time') + 
        '</option>';
    
    // Refill user data
    if (currentUser.role === 'user') {
        document.getElementById('patient-name').value = currentUser.name || '';
        document.getElementById('patient-email').value = currentUser.email || '';
        document.getElementById('patient-phone').value = currentUser.phone || '';
    }
    
    // Redirect to My Appointments after 1 second
    setTimeout(() => {
        switchView('appointments');
    }, 1000);
}

// Save Patient Data
function savePatientData(name, email, phone) {
    let patients = JSON.parse(localStorage.getItem('patients')) || [];
    
    // Check if patient already exists
    const existingPatient = patients.find(p => p.phone === phone);
    
    if (!existingPatient) {
        patients.push({
            id: Date.now(),
            name: name,
            email: email,
            phone: phone,
            registeredDate: new Date().toISOString().split('T')[0]
        });
        localStorage.setItem('patients', JSON.stringify(patients));
    }
}

// Search Appointments
function searchAppointments() {
    let email = searchEmail.value.trim().toLowerCase();
    
    if (!email && currentUser.role === 'user') {
        email = currentUser.email.toLowerCase();
        searchEmail.value = email;
    }
    
    if (!email) {
        showNotification('Please enter an email', 'error');
        return;
    }
    
    const userAppointments = appointments.filter(apt => 
        apt.patientEmail.toLowerCase() === email
    );
    
    displayAppointments(userAppointments);
}

// Display Appointments
function displayAppointments(appointmentsList) {
    const container = document.getElementById('appointments-list');
    container.innerHTML = '';
    
    if (appointmentsList.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-calendar-times" style="font-size: 60px; margin-bottom: 20px; display: block;"></i>No appointments found</div>';
        return;
    }
    
    appointmentsList.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    appointmentsList.forEach(apt => {
        const card = document.createElement('div');
        card.className = 'appointment-card';
        card.innerHTML = `
            <h3>
                <span>Appointment #${apt.id}</span>
                <span class="status ${apt.status}">${apt.status.toUpperCase()}</span>
            </h3>
            <div class="appointment-info">
                <div class="info-item">
                    <span class="info-label">Patient</span>
                    <span class="info-value">${apt.patientName}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Department</span>
                    <span class="info-value">${apt.department}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Doctor</span>
                    <span class="info-value">${apt.doctor}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Date</span>
                    <span class="info-value">${formatDate(apt.date)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Time</span>
                    <span class="info-value">${apt.time}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Phone</span>
                    <span class="info-value">${apt.patientPhone}</span>
                </div>
            </div>
            <div class="info-item" style="margin-top: 15px;">
                <span class="info-label">Reason</span>
                <span class="info-value">${apt.reason}</span>
            </div>
            ${apt.status !== 'cancelled' ? `<button class="btn-cancel" onclick="cancelAppointment(${apt.id})"><i class="fas fa-times"></i> Cancel Appointment</button>` : ''}
        `;
        container.appendChild(card);
    });
}

// Cancel Appointment
function cancelAppointment(id) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        const index = appointments.findIndex(apt => apt.id === id);
        if (index !== -1) {
            appointments[index].status = 'cancelled';
            localStorage.setItem('appointments', JSON.stringify(appointments));
            searchAppointments();
            showNotification('Appointment cancelled', 'success');
            
            if (isAdmin) {
                loadAdminDashboard();
            }
        }
    }
}

// Make cancelAppointment global
window.cancelAppointment = cancelAppointment;

// Load Doctors List
function loadDoctorsList() {
    const container = document.getElementById('doctors-list');
    container.innerHTML = '';
    
    clinicData.doctors.forEach(doctor => {
        const dept = clinicData.departments.find(d => d.id === doctor.department);
        const card = document.createElement('div');
        card.className = 'doctor-card';
        card.innerHTML = `
            <img src="${doctor.photo}" alt="${doctor.name}" class="doctor-photo">
            <h3>${doctor.name}</h3>
            <div class="doctor-name-en">${doctor.nameEn}</div>
            <div class="doctor-specialization">${doctor.specialization}</div>
            <div class="doctor-specialization-en">${doctor.specializationEn}</div>
            <div class="doctor-info">
                <div class="info-item">
                    <span class="info-label">Department</span>
                    <span class="info-value">${dept.name}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Experience</span>
                    <span class="info-value">${doctor.experience}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Education</span>
                    <span class="info-value">${doctor.education}</span>
                </div>
            </div>
            <div class="doctor-schedule">
                <span class="info-label">Schedule</span>
                <span class="info-value">${doctor.schedule}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// Search Patient History
function searchHistory() {
    let email = document.getElementById('history-email').value.trim().toLowerCase();
    
    if (!email && currentUser.role === 'user') {
        email = currentUser.email.toLowerCase();
        document.getElementById('history-email').value = email;
    }
    
    if (!email) {
        showNotification('Please enter an email', 'error');
        return;
    }
    
    const patientHistory = appointments.filter(apt => 
        apt.patientEmail.toLowerCase() === email
    );
    
    displayHistory(patientHistory);
}

// Display Patient History
function displayHistory(historyList) {
    const container = document.getElementById('history-list');
    const statsContainer = document.getElementById('history-stats');
    container.innerHTML = '';
    
    if (historyList.length === 0) {
        statsContainer.style.display = 'none';
        container.innerHTML = '<div class="empty-state"><i class="fas fa-history" style="font-size: 60px; margin-bottom: 20px; display: block;"></i>No medical history found</div>';
        return;
    }
    
    // Show stats
    statsContainer.style.display = 'block';
    const today = new Date();
    const upcoming = historyList.filter(apt => new Date(apt.date) >= today && apt.status === 'confirmed').length;
    const completed = historyList.filter(apt => new Date(apt.date) < today && apt.status === 'confirmed').length;
    const cancelled = historyList.filter(apt => apt.status === 'cancelled').length;
    
    document.getElementById('total-visits').textContent = historyList.length;
    document.getElementById('upcoming-visits').textContent = upcoming;
    document.getElementById('completed-visits').textContent = completed;
    document.getElementById('cancelled-visits').textContent = cancelled;
    
    // Sort by date (newest first)
    historyList.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Group by year
    const groupedByYear = {};
    historyList.forEach(apt => {
        const year = new Date(apt.date).getFullYear();
        if (!groupedByYear[year]) {
            groupedByYear[year] = [];
        }
        groupedByYear[year].push(apt);
    });
    
    // Display grouped history
    Object.keys(groupedByYear).sort((a, b) => b - a).forEach(year => {
        const yearSection = document.createElement('div');
        yearSection.className = 'history-year-section';
        yearSection.innerHTML = `<h3 class="year-title"><i class="fas fa-calendar-alt"></i> ${year}</h3>`;
        
        groupedByYear[year].forEach(apt => {
            const isPast = new Date(apt.date) < today;
            const card = document.createElement('div');
            card.className = 'history-card';
            card.innerHTML = `
                <div class="history-header">
                    <div>
                        <h4>${apt.department}</h4>
                        <p class="history-doctor"><i class="fas fa-user-md"></i> ${apt.doctor}</p>
                    </div>
                    <span class="status ${apt.status}">${apt.status.toUpperCase()}</span>
                </div>
                <div class="history-details">
                    <div class="history-item">
                        <i class="fas fa-calendar"></i>
                        <span>${formatDate(apt.date)}</span>
                    </div>
                    <div class="history-item">
                        <i class="fas fa-clock"></i>
                        <span>${apt.time}</span>
                    </div>
                    <div class="history-item">
                        <i class="fas fa-notes-medical"></i>
                        <span>${apt.reason}</span>
                    </div>
                </div>
                ${isPast && apt.status === 'confirmed' ? '<div class="completed-badge"><i class="fas fa-check-circle"></i> Completed</div>' : ''}
            `;
            yearSection.appendChild(card);
        });
        
        container.appendChild(yearSection);
    });
}

// Load Patients List (Admin)
function loadPatientsList() {
    const patients = JSON.parse(localStorage.getItem('patients')) || [];
    const container = document.getElementById('patients-list');
    container.innerHTML = '';
    
    if (patients.length === 0) {
        container.innerHTML = '<div class="empty-state">No patients registered yet</div>';
        return;
    }
    
    patients.sort((a, b) => new Date(b.registeredDate) - new Date(a.registeredDate));
    
    patients.forEach(patient => {
        const patientAppointments = appointments.filter(apt => apt.patientPhone === patient.phone);
        const card = document.createElement('div');
        card.className = 'patient-card';
        card.innerHTML = `
            <div class="patient-header">
                <div>
                    <h3><i class="fas fa-user"></i> ${patient.name}</h3>
                    <p class="patient-registered">Registered: ${formatDate(patient.registeredDate)}</p>
                </div>
                <div class="patient-stats-mini">
                    <span class="stat-badge"><i class="fas fa-calendar"></i> ${patientAppointments.length} visits</span>
                </div>
            </div>
            <div class="patient-info">
                <div class="info-item">
                    <span class="info-label">Phone</span>
                    <span class="info-value">${patient.phone}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Email</span>
                    <span class="info-value">${patient.email}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Last Visit</span>
                    <span class="info-value">${patientAppointments.length > 0 ? formatDate(patientAppointments[0].date) : 'No visits'}</span>
                </div>
            </div>
            <button class="btn-view-history" onclick="viewPatientHistory('${patient.phone}')">
                <i class="fas fa-history"></i> View History
            </button>
        `;
        container.appendChild(card);
    });
}

// View Patient History
function viewPatientHistory(phone) {
    const patientAppointments = appointments.filter(apt => apt.patientPhone === phone);
    
    if (patientAppointments.length === 0) {
        showNotification('No appointments found for this patient', 'error');
        return;
    }
    
    // Switch to admin appointments view and filter
    switchView('admin');
    
    const container = document.getElementById('admin-appointments-list');
    container.innerHTML = '';
    
    patientAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    patientAppointments.forEach(apt => {
        const card = document.createElement('div');
        card.className = 'appointment-card';
        card.innerHTML = `
            <h3>
                <span>Appointment #${apt.id}</span>
                <span class="status ${apt.status}">${apt.status.toUpperCase()}</span>
            </h3>
            <div class="appointment-info">
                <div class="info-item">
                    <span class="info-label">Patient</span>
                    <span class="info-value">${apt.patientName}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Email</span>
                    <span class="info-value">${apt.patientEmail}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Phone</span>
                    <span class="info-value">${apt.patientPhone}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Department</span>
                    <span class="info-value">${apt.department}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Doctor</span>
                    <span class="info-value">${apt.doctor}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Date</span>
                    <span class="info-value">${formatDate(apt.date)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Time</span>
                    <span class="info-value">${apt.time}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Booked On</span>
                    <span class="info-value">${formatDate(apt.bookingDate)}</span>
                </div>
            </div>
            <div class="info-item" style="margin-top: 15px;">
                <span class="info-label">Reason</span>
                <span class="info-value">${apt.reason}</span>
            </div>
            ${apt.status !== 'cancelled' ? `<button class="btn-cancel" onclick="cancelAppointment(${apt.id})"><i class="fas fa-times"></i> Cancel Appointment</button>` : ''}
        `;
        container.appendChild(card);
    });
}

// Make viewPatientHistory global
window.viewPatientHistory = viewPatientHistory;

// Load Admin Dashboard
function loadAdminDashboard() {
    // Update stats
    document.getElementById('total-appointments').textContent = appointments.length;
    document.getElementById('pending-appointments').textContent = 
        appointments.filter(apt => apt.status === 'confirmed').length;
    document.getElementById('cancelled-appointments').textContent = 
        appointments.filter(apt => apt.status === 'cancelled').length;
    
    // Display all appointments
    const container = document.getElementById('admin-appointments-list');
    container.innerHTML = '';
    
    if (appointments.length === 0) {
        container.innerHTML = '<div class="empty-state">No appointments yet</div>';
        return;
    }
    
    const sortedAppointments = [...appointments].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedAppointments.forEach(apt => {
        const card = document.createElement('div');
        card.className = 'appointment-card';
        card.innerHTML = `
            <h3>
                <span>Appointment #${apt.id}</span>
                <span class="status ${apt.status}">${apt.status.toUpperCase()}</span>
            </h3>
            <div class="appointment-info">
                <div class="info-item">
                    <span class="info-label">Patient</span>
                    <span class="info-value">${apt.patientName}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Email</span>
                    <span class="info-value">${apt.patientEmail}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Phone</span>
                    <span class="info-value">${apt.patientPhone}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Department</span>
                    <span class="info-value">${apt.department}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Doctor</span>
                    <span class="info-value">${apt.doctor}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Date</span>
                    <span class="info-value">${formatDate(apt.date)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Time</span>
                    <span class="info-value">${apt.time}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Booked On</span>
                    <span class="info-value">${formatDate(apt.bookingDate)}</span>
                </div>
            </div>
            <div class="info-item" style="margin-top: 15px;">
                <span class="info-label">Reason</span>
                <span class="info-value">${apt.reason}</span>
            </div>
            ${apt.status !== 'cancelled' ? `<button class="btn-cancel" onclick="cancelAppointment(${apt.id})"><i class="fas fa-times"></i> Cancel Appointment</button>` : ''}
        `;
        container.appendChild(card);
    });
}

// Utility Functions
function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}


// Load Manage Doctors View
function loadManageDoctors() {
    populateDepartments();
    displayManageDoctorsList();
}

// Display Doctors List for Management
function displayManageDoctorsList() {
    const container = document.getElementById('manage-doctors-list');
    container.innerHTML = '';
    
    clinicData.doctors.forEach(doctor => {
        const dept = clinicData.departments.find(d => d.id === doctor.department);
        const card = document.createElement('div');
        card.className = 'doctor-manage-card';
        card.innerHTML = `
            <div class="doctor-manage-header">
                <img src="${doctor.photo}" alt="${doctor.name}" class="doctor-photo-small">
                <div class="doctor-manage-info">
                    <h4>${doctor.name} - ${doctor.nameEn}</h4>
                    <p>${doctor.specialization} - ${doctor.specializationEn}</p>
                    <p class="dept-badge">${dept.name}</p>
                </div>
            </div>
            <div class="doctor-manage-details">
                <p><i class="fas fa-calendar"></i> ${doctor.experience}</p>
                <p><i class="fas fa-clock"></i> ${doctor.schedule}</p>
            </div>
            <button class="btn-delete" onclick="deleteDoctor(${doctor.id})">
                <i class="fas fa-trash"></i> Delete
            </button>
        `;
        container.appendChild(card);
    });
}

// Handle Add Doctor
function handleAddDoctor(e) {
    e.preventDefault();
    
    const availableDays = [];
    document.querySelectorAll('.day-checkbox input:checked').forEach(checkbox => {
        availableDays.push(parseInt(checkbox.value));
    });
    
    if (availableDays.length === 0) {
        showNotification('Please select at least one available day', 'error');
        return;
    }
    
    const photoInput = document.getElementById('doctor-photo');
    const photoFile = photoInput.files[0];
    
    if (!photoFile) {
        showNotification('Please select a photo', 'error');
        return;
    }
    
    // Convert image to base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const newDoctor = {
            id: Date.now(),
            name: document.getElementById('doctor-name-ar').value,
            nameEn: document.getElementById('doctor-name-en').value,
            department: parseInt(document.getElementById('doctor-dept').value),
            specialization: document.getElementById('doctor-spec-ar').value,
            specializationEn: document.getElementById('doctor-spec-en').value,
            experience: document.getElementById('doctor-exp').value,
            education: document.getElementById('doctor-edu-ar').value,
            educationEn: document.getElementById('doctor-edu-en').value,
            schedule: document.getElementById('doctor-schedule').value,
            photo: e.target.result, // Base64 image data
            availableDays: availableDays
        };
        
        clinicData.doctors.push(newDoctor);
        localStorage.setItem('doctors', JSON.stringify(clinicData.doctors));
        
        showNotification('Doctor added successfully!', 'success');
        document.getElementById('add-doctor-form').reset();
        document.getElementById('photo-preview').classList.remove('show');
        document.getElementById('photo-preview').innerHTML = '';
        displayManageDoctorsList();
    };
    
    reader.readAsDataURL(photoFile);
}

// Delete Doctor
function deleteDoctor(id) {
    if (confirm('Are you sure you want to delete this doctor?')) {
        const index = clinicData.doctors.findIndex(d => d.id === id);
        if (index !== -1) {
            clinicData.doctors.splice(index, 1);
            localStorage.setItem('doctors', JSON.stringify(clinicData.doctors));
            showNotification('Doctor deleted successfully', 'success');
            displayManageDoctorsList();
        }
    }
}

// Make deleteDoctor global
window.deleteDoctor = deleteDoctor;

// Handle Photo Preview
function handlePhotoPreview(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const preview = document.getElementById('photo-preview');
            preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
            preview.classList.add('show');
        };
        reader.readAsDataURL(file);
    }
}

// Load doctors from localStorage on init
const savedDoctors = localStorage.getItem('doctors');
if (savedDoctors) {
    clinicData.doctors = JSON.parse(savedDoctors);
}


// Load Doctor Appointments
function loadDoctorAppointments() {
    if (!currentUser || !currentUser.doctorId) return;
    
    const doctor = clinicData.doctors.find(d => d.id === currentUser.doctorId);
    if (!doctor) return;
    
    const doctorAppointments = appointments.filter(apt => apt.doctor === doctor.name);
    
    // Calculate stats
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = doctorAppointments.filter(apt => apt.date === today && apt.status === 'confirmed');
    const upcomingAppointments = doctorAppointments.filter(apt => new Date(apt.date) >= new Date() && apt.status === 'confirmed');
    
    document.getElementById('doctor-total-appointments').textContent = doctorAppointments.length;
    document.getElementById('doctor-today-appointments').textContent = todayAppointments.length;
    document.getElementById('doctor-upcoming-appointments').textContent = upcomingAppointments.length;
    
    // Display appointments
    const container = document.getElementById('doctor-appointments-list');
    container.innerHTML = '';
    
    if (doctorAppointments.length === 0) {
        container.innerHTML = '<div class="empty-state">No appointments yet</div>';
        return;
    }
    
    doctorAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    doctorAppointments.forEach(apt => {
        const card = document.createElement('div');
        card.className = 'appointment-card';
        card.innerHTML = `
            <h3>
                <span>Appointment #${apt.id}</span>
                <span class="status ${apt.status}">${apt.status.toUpperCase()}</span>
            </h3>
            <div class="appointment-info">
                <div class="info-item">
                    <span class="info-label">Patient</span>
                    <span class="info-value">${apt.patientName}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Phone</span>
                    <span class="info-value">${apt.patientPhone}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Email</span>
                    <span class="info-value">${apt.patientEmail}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Date</span>
                    <span class="info-value">${formatDate(apt.date)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Time</span>
                    <span class="info-value">${apt.time}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Department</span>
                    <span class="info-value">${apt.department}</span>
                </div>
            </div>
            <div class="info-item" style="margin-top: 15px;">
                <span class="info-label">Reason</span>
                <span class="info-value">${apt.reason}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// Load Doctor Patients
function loadDoctorPatients() {
    if (!currentUser || !currentUser.doctorId) return;
    
    const doctor = clinicData.doctors.find(d => d.id === currentUser.doctorId);
    if (!doctor) return;
    
    const doctorAppointments = appointments.filter(apt => apt.doctor === doctor.name);
    
    // Get unique patients
    const patientsMap = new Map();
    doctorAppointments.forEach(apt => {
        if (!patientsMap.has(apt.patientPhone)) {
            patientsMap.set(apt.patientPhone, {
                name: apt.patientName,
                phone: apt.patientPhone,
                email: apt.patientEmail,
                visits: []
            });
        }
        patientsMap.get(apt.patientPhone).visits.push(apt);
    });
    
    const container = document.getElementById('doctor-patients-list');
    container.innerHTML = '';
    
    if (patientsMap.size === 0) {
        container.innerHTML = '<div class="empty-state">No patients yet</div>';
        return;
    }
    
    patientsMap.forEach(patient => {
        const lastVisit = patient.visits.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        const card = document.createElement('div');
        card.className = 'patient-card';
        card.innerHTML = `
            <div class="patient-header">
                <div>
                    <h3><i class="fas fa-user"></i> ${patient.name}</h3>
                </div>
                <div class="patient-stats-mini">
                    <span class="stat-badge"><i class="fas fa-calendar"></i> ${patient.visits.length} visits</span>
                </div>
            </div>
            <div class="patient-info">
                <div class="info-item">
                    <span class="info-label">Phone</span>
                    <span class="info-value">${patient.phone}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Email</span>
                    <span class="info-value">${patient.email}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Last Visit</span>
                    <span class="info-value">${formatDate(lastVisit.date)}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}


// Load SuperAdmin Dashboard
function loadSuperAdminDashboard() {
    const allUsers = Object.keys(users).length;
    const admins = Object.values(users).filter(u => u.role === 'admin' || u.role === 'superadmin').length;
    const doctors = clinicData.doctors.length;
    
    document.getElementById('total-users').textContent = allUsers;
    document.getElementById('total-admins').textContent = admins;
    document.getElementById('superadmin-total-doctors').textContent = doctors;
    document.getElementById('superadmin-total-appointments').textContent = appointments.length;
}

// Load Manage Users
function loadManageUsers() {
    displayUsersList();
    
    const addUserForm = document.getElementById('add-user-form');
    if (addUserForm) {
        addUserForm.removeEventListener('submit', handleAddUser);
        addUserForm.addEventListener('submit', handleAddUser);
    }
}

// Display Users List
function displayUsersList() {
    const container = document.getElementById('users-list');
    container.innerHTML = '';
    
    Object.entries(users).forEach(([username, userData]) => {
        const card = document.createElement('div');
        card.className = 'user-card';
        
        const roleColor = {
            'superadmin': '#dc3545',
            'admin': '#0066cc',
            'doctor': '#28a745',
            'user': '#6c757d'
        };
        
        card.innerHTML = `
            <div class="user-header">
                <div>
                    <h4><i class="fas fa-user"></i> ${userData.name}</h4>
                    <p class="user-username">@${username}</p>
                </div>
                <span class="role-badge" style="background: ${roleColor[userData.role]}">
                    ${userData.role.toUpperCase()}
                </span>
            </div>
            <div class="user-info">
                <div class="info-item">
                    <span class="info-label">Email</span>
                    <span class="info-value">${userData.email || 'N/A'}</span>
                </div>
                ${userData.doctorId ? `
                <div class="info-item">
                    <span class="info-label">Doctor ID</span>
                    <span class="info-value">#${userData.doctorId}</span>
                </div>
                ` : ''}
            </div>
            ${userData.role !== 'superadmin' ? `
            <button class="btn-delete" onclick="deleteUser('${username}')">
                <i class="fas fa-trash"></i> Delete User
            </button>
            ` : ''}
        `;
        container.appendChild(card);
    });
}

// Handle Add User
function handleAddUser(e) {
    e.preventDefault();
    
    const username = document.getElementById('user-username').value;
    const password = document.getElementById('user-password').value;
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const role = document.getElementById('user-role').value;
    
    if (users[username]) {
        showNotification('Username already exists', 'error');
        return;
    }
    
    users[username] = {
        password: password,
        role: role,
        name: name,
        email: email
    };
    
    localStorage.setItem('users', JSON.stringify(users));
    
    showNotification('User added successfully!', 'success');
    document.getElementById('add-user-form').reset();
    displayUsersList();
    loadSuperAdminDashboard();
}

// Delete User
function deleteUser(username) {
    if (username === 'superadmin') {
        showNotification('Cannot delete SuperAdmin account', 'error');
        return;
    }
    
    if (confirm(`Are you sure you want to delete user: ${username}?`)) {
        delete users[username];
        localStorage.setItem('users', JSON.stringify(users));
        showNotification('User deleted successfully', 'success');
        displayUsersList();
        loadSuperAdminDashboard();
    }
}

// Make deleteUser global
window.deleteUser = deleteUser;

// Load users from localStorage on init
const savedUsers = localStorage.getItem('users');
if (savedUsers) {
    Object.assign(users, JSON.parse(savedUsers));
}


// Handle Book Now Click
function handleBookNowClick() {
    if (!currentUser) {
        showLoginModal();
        showNotification('Please login to book an appointment', 'error');
    } else {
        switchView('booking');
    }
}

// Handle Register
function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    
    // Check full name (at least 3 parts)
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length < 3) {
        showNotification('Please enter full name (at least 3 parts)', 'error');
        return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    // Check password length
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Check if username already exists
    if (users[username]) {
        showNotification('Username already exists', 'error');
        return;
    }
    
    // Check if email already exists
    const emailExists = Object.values(users).some(u => u.email === email);
    if (emailExists) {
        showNotification('Email already registered', 'error');
        return;
    }
    
    // Create new user
    users[username] = {
        password: password,
        role: 'user',
        name: name,
        email: email,
        phone: phone
    };
    
    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after registration
    currentUser = { username, ...users[username] };
    isAdmin = false;
    isSuperAdmin = false;
    isDoctor = false;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    registerModal.style.display = 'none';
    showApp();
    showNotification('Registration successful! Welcome ' + currentUser.name, 'success');
    switchView('booking');
}

// Make handleBookNowClick global
window.handleBookNowClick = handleBookNowClick;


// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        // Skip if already animated
        if (counter.classList.contains('animated')) return;
        
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
                counter.classList.add('animated');
            }
        };
        
        updateCounter();
    });
}

// Intersection Observer for animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe all cards
    document.querySelectorAll('.service-card, .feature-card, .testimonial-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
}

// Typing Animation
function initTypingAnimation() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;
    
    const wordsEn = [
        'Expert Medical Care',
        'Compassionate Treatment',
        'Modern Healthcare',
        'Trusted Professionals'
    ];
    
    const wordsAr = [
        'رعاية طبية متميزة',
        'علاج بعناية فائقة',
        'رعاية صحية حديثة',
        'أطباء موثوقون'
    ];
    
    let wordIndex = 0;
    
    function changeWord() {
        const words = currentLanguage === 'ar' ? wordsAr : wordsEn;
        
        // Fade out
        typingText.style.opacity = '0';
        typingText.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            // Change word
            wordIndex = (wordIndex + 1) % words.length;
            typingText.textContent = words[wordIndex];
            
            // Fade in
            typingText.style.opacity = '1';
            typingText.style.transform = 'translateY(0)';
        }, 500);
    }
    
    // Set initial word
    const words = currentLanguage === 'ar' ? wordsAr : wordsEn;
    typingText.textContent = words[0];
    typingText.style.transition = 'all 0.5s ease';
    
    // Change word every 5 seconds (slower)
    setInterval(changeWord, 5000);
}

// Initialize animations when home view is shown
function initHomeAnimations() {
    animateCounters();
    initScrollAnimations();
    initTypingAnimation();
}

// Call animations when switching to home
const originalSwitchView = switchView;
switchView = function(viewName) {
    originalSwitchView(viewName);
    if (viewName === 'home') {
        setTimeout(initHomeAnimations, 100);
    }
};
