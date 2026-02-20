// Clinic Data
const clinicData = {
    departments: [
        { id: 1, name: 'الطب العام', nameEn: 'General Medicine' },
        { id: 2, name: 'القلب', nameEn: 'Cardiology' },
        { id: 3, name: 'الأطفال', nameEn: 'Pediatrics' },
        { id: 4, name: 'العظام', nameEn: 'Orthopedics' },
        { id: 5, name: 'الجلدية', nameEn: 'Dermatology' },
        { id: 6, name: 'الأعصاب', nameEn: 'Neurology' }
    ],
    
    doctors: [
        {
            id: 1,
            name: 'د. أحمد محمود',
            nameEn: 'Dr. Ahmed Mahmoud',
            department: 1,
            specialization: 'طبيب عام',
            specializationEn: 'General Physician',
            experience: 'Experienced',
            education: 'دكتوراه في الطب، جامعة القاهرة',
            educationEn: 'MD, Cairo University',
            schedule: 'Sun-Thu: 9:00 AM - 5:00 PM',
            availableDays: [0, 1, 2, 3, 4],
            photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop'
        },
        {
            id: 2,
            name: 'د. فاطمة السيد',
            nameEn: 'Dr. Fatima Al-Sayed',
            department: 2,
            specialization: 'أخصائية قلب',
            specializationEn: 'Cardiologist',
            experience: 'Highly Experienced',
            education: 'دكتوراه في الطب، جامعة الإسكندرية',
            educationEn: 'MD, Alexandria University',
            schedule: 'Sun, Tue, Thu: 10:00 AM - 6:00 PM',
            availableDays: [0, 2, 4],
            photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop'
        },
        {
            id: 3,
            name: 'د. محمد حسن',
            nameEn: 'Dr. Mohamed Hassan',
            department: 3,
            specialization: 'طبيب أطفال',
            specializationEn: 'Pediatrician',
            experience: 'Experienced',
            education: 'دكتوراه في الطب، جامعة عين شمس',
            educationEn: 'MD, Ain Shams University',
            schedule: 'Sun-Thu: 8:00 AM - 4:00 PM',
            availableDays: [0, 1, 2, 3, 4],
            photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop'
        },
        {
            id: 4,
            name: 'د. خالد عبدالله',
            nameEn: 'Dr. Khaled Abdullah',
            department: 4,
            specialization: 'جراح عظام',
            specializationEn: 'Orthopedic Surgeon',
            experience: 'Highly Experienced',
            education: 'دكتوراه في الطب، جامعة الأزهر',
            educationEn: 'MD, Al-Azhar University',
            schedule: 'Sun-Wed: 11:00 AM - 7:00 PM',
            availableDays: [0, 1, 2, 3],
            photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop'
        },
        {
            id: 5,
            name: 'د. نورا إبراهيم',
            nameEn: 'Dr. Nora Ibrahim',
            department: 5,
            specialization: 'أخصائية جلدية',
            specializationEn: 'Dermatologist',
            experience: 'Experienced',
            education: 'دكتوراه في الطب، جامعة المنصورة',
            educationEn: 'MD, Mansoura University',
            schedule: 'Sun, Tue, Thu: 9:00 AM - 5:00 PM',
            availableDays: [0, 2, 4],
            photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop'
        },
        {
            id: 6,
            name: 'د. عمر الشريف',
            nameEn: 'Dr. Omar Al-Sharif',
            department: 6,
            specialization: 'أخصائي أعصاب',
            specializationEn: 'Neurologist',
            experience: 'Highly Experienced',
            education: 'دكتوراه في الطب، جامعة طنطا',
            educationEn: 'MD, Tanta University',
            schedule: 'Mon-Thu: 10:00 AM - 6:00 PM',
            availableDays: [1, 2, 3, 4],
            photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop'
        },
        {
            id: 7,
            name: 'د. سارة أحمد',
            nameEn: 'Dr. Sara Ahmed',
            department: 1,
            specialization: 'طبيبة عامة',
            specializationEn: 'General Physician',
            experience: 'Experienced',
            education: 'دكتوراه في الطب، جامعة أسيوط',
            educationEn: 'MD, Assiut University',
            schedule: 'Sun-Thu: 2:00 PM - 10:00 PM',
            availableDays: [0, 1, 2, 3, 4],
            photo: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=400&fit=crop'
        },
        {
            id: 8,
            name: 'د. يوسف مصطفى',
            nameEn: 'Dr. Youssef Mostafa',
            department: 2,
            specialization: 'أخصائي قلب تداخلي',
            specializationEn: 'Interventional Cardiologist',
            experience: 'Highly Experienced',
            education: 'دكتوراه في الطب، جامعة الزقازيق',
            educationEn: 'MD, Zagazig University',
            schedule: 'Sun, Tue, Thu: 9:00 AM - 5:00 PM',
            availableDays: [0, 2, 4],
            photo: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop'
        }
    ],
    
    timeSlots: [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
        '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
        '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
        '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
    ]
};

// Sample appointments data (stored in localStorage)
const sampleAppointments = [
    {
        id: 1,
        patientName: 'John Doe',
        patientEmail: 'john@example.com',
        patientPhone: '555-0101',
        department: 'الطب العام',
        doctor: 'د. أحمد محمود',
        date: '2026-02-20',
        time: '10:00 AM',
        reason: 'Annual checkup',
        status: 'confirmed',
        bookingDate: '2026-02-16'
    },
    {
        id: 2,
        patientName: 'Jane Smith',
        patientEmail: 'jane@example.com',
        patientPhone: '555-0102',
        department: 'القلب',
        doctor: 'د. فاطمة السيد',
        date: '2026-02-19',
        time: '11:00 AM',
        reason: 'Heart checkup',
        status: 'confirmed',
        bookingDate: '2026-02-15'
    },
    {
        id: 3,
        patientName: 'John Doe',
        patientEmail: 'user@example.com',
        patientPhone: '555-0103',
        department: 'الطب العام',
        doctor: 'د. سارة أحمد',
        date: '2026-01-15',
        time: '02:00 PM',
        reason: 'Flu symptoms',
        status: 'confirmed',
        bookingDate: '2026-01-10'
    },
    {
        id: 4,
        patientName: 'John Doe',
        patientEmail: 'user@example.com',
        patientPhone: '555-0103',
        department: 'العظام',
        doctor: 'د. خالد عبدالله',
        date: '2025-12-20',
        time: '11:30 AM',
        reason: 'Back pain consultation',
        status: 'confirmed',
        bookingDate: '2025-12-15'
    },
    {
        id: 5,
        patientName: 'John Doe',
        patientEmail: 'user@example.com',
        patientPhone: '555-0103',
        department: 'الجلدية',
        doctor: 'د. نورا إبراهيم',
        date: '2025-11-10',
        time: '09:30 AM',
        reason: 'Skin rash',
        status: 'cancelled',
        bookingDate: '2025-11-05'
    }
];

// Initialize localStorage with sample data if empty
if (!localStorage.getItem('appointments')) {
    localStorage.setItem('appointments', JSON.stringify(sampleAppointments));
}
