const formatCurrency = amount => `KSh ${Number(amount).toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})}`;

// --- 1. UI NAVIGATION & TABS ---
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        if (tabcontent[i].id !== 'Auth') {
            tabcontent[i].style.display = "none";
        }
    }
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    const target = document.getElementById(tabName);
    if (target) {
        target.style.display = "block";
    }
    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add("active");
    }
}

function showServices(tabName) {
    if (document.getElementById('welcome-section')) document.getElementById('welcome-section').style.display = 'none';
    if (document.getElementById('brochure-section')) document.getElementById('brochure-section').style.display = 'none';
    if (document.getElementById('dashboard-welcome')) document.getElementById('dashboard-welcome').style.display = 'none';
    if (document.getElementById('services')) document.getElementById('services').style.display = 'block';

    const targetTab = tabName || 'Hotel';
    const tabBtn = document.querySelector(`.tab-link[onclick*="${targetTab}"]`);
    openTab({ currentTarget: tabBtn }, targetTab);
}

function openAuth(evt, mode) {
    if (evt) evt.preventDefault();
    const authSection = document.getElementById('Auth');
    if (authSection) authSection.style.display = 'flex';
    toggleAuth(mode);
}

function closeAuthModal() {
    const authSection = document.getElementById('Auth');
    if (authSection) authSection.style.display = 'none';
}

function toggleAuth(mode) {
    const box = document.getElementById('sliding-box');
    if (mode === 'login') {
        box.classList.add('slide-active');
    } else {
        box.classList.remove('slide-active');
    }
}

// --- 2. USER AUTHENTICATION & SESSION PERSISTENCE ---
function loginUser(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const displayName = email.split('@')[0];
    const user = { name: displayName, email: email };
    localStorage.setItem("currentUser", JSON.stringify(user));
    closeAuthModal();
    updatePostLoginUI();
}

function registerUser(event) {
    event.preventDefault();
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const user = { name: name, email: email };
    localStorage.setItem("currentUser", JSON.stringify(user));
    closeAuthModal();
    updatePostLoginUI();
    alert(`Welcome to LUNAR Sanctuary, ${name}. Your account is activated.`);
}

function updatePostLoginUI() {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) return;
    
    try {
        const user = JSON.parse(storedUser);
        if (document.getElementById('auth-links')) document.getElementById('auth-links').style.display = 'none';
        if (document.getElementById('logout-link')) document.getElementById('logout-link').style.display = 'inline-block';
        if (document.getElementById('dashboard-user-greeting')) {
            document.getElementById('dashboard-user-greeting').innerText = `Welcome Back, ${user.name}`;
        }
        
        // Auto-fill guest checkout forms if logged in
        if (document.getElementById('fp-guest-name')) document.getElementById('fp-guest-name').value = user.name;
        if (document.getElementById('fp-guest-email')) document.getElementById('fp-guest-email').value = user.email;
        if (document.getElementById('univ-guest-name')) document.getElementById('univ-guest-name').value = user.name;
        if (document.getElementById('univ-guest-email')) document.getElementById('univ-guest-email').value = user.email;
    } catch(e) {}
}

function logoutUser(event) {
    if(event) event.preventDefault();
    localStorage.removeItem("currentUser");
    location.reload(); 
}

function ensureSignedIn(actionLabel = 'make a booking') {
    const isSignedIn = !!localStorage.getItem('currentUser');
    if (!isSignedIn) {
        openAuth(null, 'login');
        alert(`Please sign in to ${actionLabel}.`);
        return false;
    }
    return true;
}

// --- 3. DYNAMIC PAYMENT METHOD FORM SWAPPING ---
function renderPaymentFields(containerId, method) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (method === 'M-Pesa') {
        container.innerHTML = `
            <div class="fp-input-wrap">
                <label for="${containerId}-phone">M-Pesa Phone Number</label>
                <input type="tel" id="${containerId}-phone" placeholder="e.g. 0712 345 678" required>
            </div>
        `;
    } else if (method === 'Credit/Debit Card') {
        container.innerHTML = `
            <div class="fp-input-wrap">
                <label for="${containerId}-cardnum">Card Number</label>
                <input type="text" id="${containerId}-cardnum" placeholder="XXXX XXXX XXXX XXXX" required>
            </div>
            <div class="fp-guest-grid">
                <div class="fp-input-wrap">
                    <label for="${containerId}-exp">Expiry Date</label>
                    <input type="text" id="${containerId}-exp" placeholder="MM/YY" required>
                </div>
                <div class="fp-input-wrap">
                    <label for="${containerId}-cvv">CVV</label>
                    <input type="password" id="${containerId}-cvv" placeholder="123" required maxlength="4">
                </div>
            </div>
        `;
    } else if (method === 'PayPal') {
        container.innerHTML = `
            <div class="fp-input-wrap">
                <label for="${containerId}-paypal">PayPal Account Email</label>
                <input type="email" id="${containerId}-paypal" placeholder="paypal@example.com" required>
            </div>
        `;
    } else if (method === 'Apple Pay') {
        container.innerHTML = `
            <div class="fp-input-wrap">
                <label>Apple Pay Device Linking</label>
                <input type="text" value="Ready to authorize via Touch ID / Face ID" disabled style="opacity:0.7;">
            </div>
        `;
    } else if (method === 'Cash') {
        container.innerHTML = `
            <div class="fp-input-wrap">
                <label>In-Person Cash Payment</label>
                <input type="text" value="Payable at Reception / Front Desk upon arrival" disabled style="opacity:0.7;">
            </div>
        `;
    }
}

// --- 4. UNIVERSAL SERVICES CATALOG & CHECKOUT ---
const LUNAR_SERVICES = {
    'main-course': { id: 'main-course', title: 'Main Course Dining', category: 'Dining & Lounge', tagline: 'Exquisite dishes prepared by master chefs', price: 3250, period: '/ Reservation', img: 'images/food1.jpg', desc: 'Enjoy signature dishes including Seared Safari Beef, Lunar Truffle Pasta, and Coastal Snapper in an ambient luxury dining room.' },
    'drinks-bar': { id: 'drinks-bar', title: 'The Cellar & Mixology Bar', category: 'Dining & Lounge', tagline: 'Fine vintage wines and artisan cocktails', price: 3900, period: '/ Reservation', img: 'images/bar2.jpg', desc: 'Sample rare cellars and artisan mixology hosted by senior sommeliers.' },
    'lunar-club': { id: 'lunar-club', title: 'The Lunar Lounge & Club', category: 'Dining & Lounge', tagline: 'Live acoustic sessions and VIP tables', price: 2860, period: '/ Table', img: 'images/club1.jpg', desc: 'VIP table reservations featuring smooth live jazz and resident DJ performances.' },
    'body-massage': { id: 'body-massage', title: 'Deep Tissue Body Massage', category: 'Wellness & Spa', tagline: 'Restorative deep-muscle alignment and oils', price: 15600, period: '/ Session', img: 'images/bodymassage.jpg', desc: 'Targeted deep muscle alignment designed to dissolve stress.' },
    'barber-services': { id: 'barber-services', title: 'Gentlemen\'s Barber Services', category: 'Wellness & Spa', tagline: 'Hot towel shaves and luxury haircuts', price: 6500, period: '/ Session', img: 'images/barbershop.jpg', desc: 'Precision cuts and traditional hot towel grooming.' },
    'hair-salon': { id: 'hair-salon', title: 'Couture Hair Styling', category: 'Wellness & Spa', tagline: 'Haute couture styling and treatments', price: 10400, period: '/ Session', img: 'images/salon.jpg', desc: 'Tailored hair restoration, organic treatments, and blowouts.' },
    'manipedi': { id: 'manipedi', title: 'Luxury Manicure & Pedicure', category: 'Wellness & Spa', tagline: 'Nail restoration and organic scrubs', price: 7800, period: '/ Session', img: 'images/manipedi.jpg', desc: 'Complete nail care with restorative botanical oils.' },
    'sauna': { id: 'sauna', title: 'Herbal Sauna & Steam Access', category: 'Wellness & Spa', tagline: 'Cedarwood thermal detox rooms', price: 5200, period: '/ Hour', img: 'images/sauna.jpg', desc: 'High-temperature thermal detoxification and plunge pools.' },
    'gym': { id: 'gym', title: 'Fitness & Health Club Pass', category: 'Wellness & Spa', tagline: 'State-of-the-art gym access', price: 3900, period: '/ Day', img: 'images/gym.jpg', desc: 'Modern fitness machinery and personal trainers.' },
    'chopper-ride': { id: 'chopper-ride', title: 'Private Chopper Aerial Flight', category: 'Experiences', tagline: 'Helicopter flights across coastline', price: 58500, period: '/ Flight', img: 'images/chopperrides.jpg', desc: 'Bespoke helicopter flights over the coastal rift and nature reserves.' },
    'guided-safari': { id: 'guided-safari', title: 'Luxury Guided Game Safari', category: 'Experiences', tagline: 'Private 4x4 wildlife tours', price: 26000, period: '/ Vehicle', img: 'images/safaris.jpg', desc: 'Guided game drives escorted by professional game trackers.' },
    'horse-riding': { id: 'horse-riding', title: 'Beachfront Horse Riding', category: 'Experiences', tagline: 'Coastal equestrian trail', price: 6500, period: '/ Hour', img: 'images/horseriding.jpg', desc: 'Ride thoroughbred horses along scenic white sand beaches.' },
    'archery': { id: 'archery', title: 'Precision Target Archery', category: 'Experiences', tagline: 'Archery range session', price: 3900, period: '/ Session', img: 'images/archery.jpg', desc: 'Target marksmanship with Olympic-grade recurve bows.' },
    'quad-bikes': { id: 'quad-bikes', title: 'Off-Road Quad Biking', category: 'Experiences', tagline: 'Adrenaline ATV tracks', price: 9750, period: '/ Hour', img: 'images/quadbikes.jpg', desc: 'High-energy off-road track navigation on ATVs.' },
    'hiking': { id: 'hiking', title: 'Scenic Mountain Hiking', category: 'Experiences', tagline: 'Guided trail hikes and ridge walks', price: 7800, period: '/ Group', img: 'images/hiking.jpg', desc: 'Guided ridge and valley hikes through lush trails, panoramic viewpoints, and serene wilderness stops.' },
    'team-building': { id: 'team-building', title: 'Team Building Retreat', category: 'Experiences', tagline: 'Leadership and collaboration adventures', price: 18500, period: '/ Session', img: 'images/teambuilding.jpg', desc: 'Collaborative adventure challenges, leadership drills, and strategy sessions hosted in a luxury camp environment.' },
    'swimming': { id: 'swimming', title: 'Private Pool & Swimming', category: 'Experiences', tagline: 'Aqua wellness and private sessions', price: 4600, period: '/ Hour', img: 'images/swimming.jpg', desc: 'Sunlit infinity pool access with private coaching, relaxation zones, and wellness-focused aqua sessions.' },
    'hot-air-balloon': { id: 'hot-air-balloon', title: 'Hot Air Balloon Safari', category: 'Experiences', tagline: 'Sunrise flights over beautiful terrain', price: 42000, period: '/ Flight', img: 'images/hotairballoon.jpg', desc: 'Sunrise balloon journeys above the coastline and open savannah with a luxury champagne breakfast follow-up.' },
    'ballroom': { id: 'ballroom', title: 'Amethyst Grand Ballroom', category: 'Events & Galas', tagline: 'Grand galas, banquets, and weddings', price: 325000, period: '/ Day', img: 'images/ballroom.jpg', desc: 'Pillarless ballroom accommodating up to 1000 guests.' },
    'boardroom': { id: 'boardroom', title: 'Executive Boardroom Suite', category: 'Events & Galas', tagline: 'Confidential strategy meetings', price: 78000, period: '/ Day', img: 'images/boardroom.jpg', desc: '4K video conferencing and secretarial support for 20.' }
};

let currentUnivService = null;
let currentUnivBooking = { paymentType: 'Deposit', paymentMethod: 'M-Pesa' };

function openServiceDetailPage(serviceId, defaultPaymentType) {
    if (!ensureSignedIn('make a reservation')) return;

    const service = LUNAR_SERVICES[serviceId];
    if (!service) return;

    currentUnivService = service;
    currentUnivBooking.paymentType = defaultPaymentType || 'Deposit';

    const fullpage = document.getElementById('universal-fullpage-view');
    if (!fullpage) return;

    document.getElementById('univ-fp-dept-tag').innerText = service.category;
    document.getElementById('univ-fp-category').innerText = service.category;
    document.getElementById('univ-fp-title').innerText = service.title;
    document.getElementById('univ-fp-tagline').innerText = service.tagline;
    document.getElementById('univ-fp-rate').innerText = formatCurrency(service.price);
    document.getElementById('univ-fp-period').innerText = service.period;
    document.getElementById('univ-fp-main-img').src = service.img;
    document.getElementById('univ-fp-description').innerText = service.desc;

    // Default datetime value (tomorrow at 12:00)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0);
    setDateInputValue('univ-fp-date', `${tomorrow.toISOString().split('T')[0]}T12:00`);

    updatePostLoginUI();
    setUnivPaymentType(currentUnivBooking.paymentType);
    selectUnivPaymentMethod('M-Pesa');

    fullpage.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeUniversalDetailPage() {
    const fullpage = document.getElementById('universal-fullpage-view');
    if (fullpage) fullpage.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function setUnivPaymentType(type) {
    currentUnivBooking.paymentType = type;
    document.getElementById('univ-plan-deposit').classList.toggle('active', type === 'Deposit');
    document.getElementById('univ-plan-full').classList.toggle('active', type === 'Full');
    updateUnivCalculation();
}

function updateUnivCalculation() {
    if (!currentUnivService) return;
    const total = currentUnivService.price;
    const paidNow = currentUnivBooking.paymentType === 'Deposit' ? total * 0.5 : total;
    const balance = total - paidNow;

    document.getElementById('univ-plan-deposit-amt').innerText = formatCurrency(total * 0.5);
    document.getElementById('univ-plan-full-amt').innerText = formatCurrency(total);
    document.getElementById('univ-sum-service-name').innerText = currentUnivService.title;
    document.getElementById('univ-sum-rate').innerText = formatCurrency(total);
    document.getElementById('univ-sum-plan-label').innerText = currentUnivBooking.paymentType === 'Deposit' ? '50% Deposit' : 'Full Amount';
    document.getElementById('univ-sum-balance-due').innerText = `Balance due: ${formatCurrency(balance)}`;
    document.getElementById('univ-sum-now-amount').innerText = formatCurrency(paidNow);
    document.getElementById('univ-book-btn-label').innerText = `Confirm & Pay ${formatCurrency(paidNow)}`;
}

function selectUnivPaymentMethod(method) {
    currentUnivBooking.paymentMethod = method;
    document.querySelectorAll('#universal-fullpage-view .fp-method-card').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-method') === method);
    });
    renderPaymentFields('univ-payment-fields-dynamic', method);
}

function submitUniversalBooking() {
    if (!ensureSignedIn('complete a service booking')) return;

    const name = document.getElementById('univ-guest-name').value.trim();
    const email = document.getElementById('univ-guest-email').value.trim();
    const dateVal = getIsoDateValue('univ-fp-date');

    if (!name || !email || !dateVal) {
        alert("Please complete guest name, email, and scheduled date/time.");
        return;
    }

    const paidNow = currentUnivBooking.paymentType === 'Deposit' ? currentUnivService.price * 0.5 : currentUnivService.price;
    const refCode = "LNR-" + Math.floor(100000 + Math.random() * 900000);

    alert(`RESERVATION CONFIRMED!\n\nReference: ${refCode}\nService: ${currentUnivService.title}\nGuest: ${name}\nScheduled: ${new Date(dateVal).toLocaleString()}\nAmount Paid: ${formatCurrency(paidNow)} (${currentUnivBooking.paymentMethod})`);
    closeUniversalDetailPage();
}

function handleEventFormSubmit(event) {
    if (!ensureSignedIn('request an event booking')) return;

    event.preventDefault();
    const eventType = document.getElementById('event-type-select').value;
    const guestCount = parseInt(document.getElementById('guest-count').value) || 50;
    const calculatedPrice = guestCount * 1300 + 65000;

    LUNAR_SERVICES['event-quote'] = {
        id: 'event-quote',
        title: `${eventType.toUpperCase()} Gala Package`,
        category: 'Events & Galas',
        tagline: `Custom event setup for ${guestCount} guests`,
        price: calculatedPrice,
        period: '/ Package',
        img: 'images/ballroom.jpg',
        desc: `Custom banquet setup including full AV technology, catering, and venue access for ${guestCount} guests.`
    };

    openServiceDetailPage('event-quote', 'Deposit');
}

// --- 5. ACCOMMODATIONS & NIGHT CALCULATIONS ---
const HOTEL_ROOMS = {
    'superior': { 
        id: 'superior', 
        title: 'Superior Room', 
        tagline: 'Elegance with garden vistas', 
        price: 23400, 
        description: 'Sanctuary featuring queen bed and garden balcony.', 
        images: ['images/superiorroom.jpg', 'images/deluxeroom.jpg', 'images/juniorsuite.jpg'] 
    },
    'deluxe': { 
        id: 'deluxe', 
        title: 'Deluxe Ocean Room', 
        tagline: 'Spacious ocean vistas', 
        price: 32500, 
        description: 'King bed suite with glass balcony overlooking ocean.', 
        images: ['images/deluxeroom.jpg', 'images/superiorroom.jpg', 'images/executivesuite.jpg'] 
    },
    'junior-suite': { 
        id: 'junior-suite', 
        title: 'Junior Suite', 
        tagline: 'Open lounge design', 
        price: 45500, 
        description: 'Spacious suite with master quarter and lounge terrace.', 
        images: ['images/juniorsuite.jpg', 'images/executivesuite.jpg', 'images/presidentialsuite.jpg'] 
    },
    'executive-suite': { 
        id: 'executive-suite', 
        title: 'Executive Suite', 
        tagline: '24/7 Butler Service', 
        price: 58500, 
        description: 'Master suite with dining salon and dedicated butler.', 
        images: ['images/executivesuite.jpg', 'images/presidentialsuite.jpg', 'images/lunarpenthouse.jpg'] 
    },
    'presidential': { 
        id: 'presidential', 
        title: 'Presidential Suite', 
        tagline: 'Private heated jacuzzi terrace', 
        price: 156000, 
        description: 'Grand residence with multiple master rooms and heated jacuzzi.', 
        images: ['images/presidentialsuite.jpg', 'images/lunarpenthouse.jpg', 'images/executivesuite.jpg'] 
    },
    'penthouse': { 
        id: 'penthouse', 
        title: 'The Lunar Penthouse', 
        tagline: 'Rooftop infinity pool', 
        price: 325000, 
        description: 'Top floor penthouse with private pool and master chef.', 
        images: ['images/lunarpenthouse.jpg', 'images/presidentialsuite.jpg', 'images/executivesuite.jpg'] 
    }
};

let currentHotelRoom = null;
let currentStay = { nights: 1, paymentType: 'Deposit', paymentMethod: 'M-Pesa' };

function formatDateForDisplay(date) {
    return new Intl.DateTimeFormat('en-KE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(date);
}

function normalizeIsoDate(value) {
    if (!value) return '';
    const trimmed = String(value).trim();
    if (!trimmed || trimmed === 'Invalid Date') return '';

    if (trimmed.includes('T')) {
        const [datePart, timePart] = trimmed.split('T');
        if (datePart && datePart.includes('-')) return `${datePart}T${timePart || '12:00'}`;
    }

    if (trimmed.includes('-')) return trimmed;

    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().split('T')[0];
    return '';
}

function getIsoDateValue(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return '';
    if (input.dataset.iso) return input.dataset.iso;
    return normalizeIsoDate(input.value);
}

function getDateTimeParts(value) {
    const normalized = normalizeIsoDate(value);
    if (!normalized) return { date: '', time: '12:00' };

    const [datePart, timePart] = String(normalized).split('T');
    return {
        date: datePart || '',
        time: timePart || '12:00'
    };
}

function getDateOnlyValue(inputId) {
    const raw = getIsoDateValue(inputId);
    if (!raw) return new Date().toISOString().split('T')[0];
    return String(raw).split('T')[0];
}

function getFullDateTimeValue(inputId) {
    const raw = getIsoDateValue(inputId);
    if (!raw) return `${new Date().toISOString().split('T')[0]}T12:00`;
    return raw.includes('T') ? raw : `${raw}T12:00`;
}

function buildJavaScriptDateFromValue(value) {
    const safeValue = String(value || '').trim();
    if (!safeValue) return new Date();

    if (safeValue.includes('T')) {
        const date = new Date(safeValue);
        if (!Number.isNaN(date.getTime())) return date;
    }

    const date = new Date(`${safeValue}T12:00:00`);
    if (!Number.isNaN(date.getTime())) return date;

    return new Date();
}

function setDateInputValue(inputId, isoDateString) {
    const input = document.getElementById(inputId);
    if (!input || !isoDateString) return;

    const { date, time } = getDateTimeParts(isoDateString);
    const normalizedDate = date || isoDateString;
    const normalizedTime = time || '12:00';

    if (inputId === 'univ-fp-date') {
        const dateObj = buildJavaScriptDateFromValue(`${normalizedDate}T${normalizedTime}`);
        input.value = new Intl.DateTimeFormat('en-KE', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        }).format(dateObj);
    } else {
        const dateObj = buildJavaScriptDateFromValue(`${normalizedDate}T12:00`);
        input.value = formatDateForDisplay(dateObj);
    }

    input.dataset.iso = `${normalizedDate}T${normalizedTime}`;
}

function buildCalendarMatrix(year, month) {
    const firstDay = new Date(year, month, 1);
    const start = new Date(firstDay);
    start.setDate(firstDay.getDate() - firstDay.getDay());

    const calendarDays = [];
    for (let i = 0; i < 42; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        calendarDays.push(date);
    }
    return calendarDays;
}

function formatTimeLabel(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const normalizedHour = ((hours + 11) % 12) + 1;
    return `${normalizedHour}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

function renderCalendar(targetInputId, year, month) {
    const popover = document.querySelector(`.fp-calendar-popover[data-target="${targetInputId}"]`);
    if (!popover) return;

    const safeYear = Number(year) || new Date().getFullYear();
    const safeMonth = Number(month) || new Date().getMonth();
    const input = document.getElementById(targetInputId);
    const selectedIso = getIsoDateValue(targetInputId) || `${new Date().toISOString().split('T')[0]}T12:00`;
    const selectedDate = getDateTimeParts(selectedIso);
    const monthStart = new Date(safeYear, safeMonth, 1);
    const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(monthStart);

    const prevButton = '<button type="button" class="fp-calendar-nav" data-action="prev" data-target="' + targetInputId + '">‹</button>';
    const nextButton = '<button type="button" class="fp-calendar-nav" data-action="next" data-target="' + targetInputId + '">›</button>';

    const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const calendarDays = buildCalendarMatrix(safeYear, safeMonth);

    const gridHtml = calendarDays.map(date => {
        const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const isCurrentMonth = date.getMonth() === safeMonth;
        const isSelected = iso === selectedDate.date;
        const isToday = iso === new Date().toISOString().split('T')[0];

        return `
            <button
                type="button"
                class="fp-day ${isCurrentMonth ? '' : 'muted'} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}"
                data-date="${iso}"
                data-target="${targetInputId}"
            >${date.getDate()}</button>
        `;
    }).join('');

    let timeSectionHtml = '';
    if (targetInputId === 'univ-fp-date') {
        const timeSlots = ['09:00', '12:00', '15:00', '18:00', '20:00'];
        timeSectionHtml = `
            <div class="fp-calendar-time-picker">
                ${timeSlots.map(slot => `
                    <button type="button" class="fp-time-slot ${selectedDate.time === slot ? 'selected' : ''}" data-time="${slot}" data-target="${targetInputId}">${formatTimeLabel(slot)}</button>
                `).join('')}
            </div>
        `;
    }

    popover.innerHTML = `
        <div class="fp-calendar-header">
            ${prevButton}
            <span>${monthLabel}</span>
            ${nextButton}
        </div>
        <div class="fp-calendar-weekdays">
            ${weekdayLabels.map(day => `<span>${day}</span>`).join('')}
        </div>
        <div class="fp-calendar-grid">
            ${gridHtml}
        </div>
        ${timeSectionHtml}
    `;

    popover.dataset.viewYear = safeYear;
    popover.dataset.viewMonth = safeMonth;
}

function toggleCalendar(targetInputId) {
    const popover = document.querySelector(`.fp-calendar-popover[data-target="${targetInputId}"]`);
    if (!popover) return;

    const isOpen = popover.classList.contains('show');
    document.querySelectorAll('.fp-calendar-popover').forEach(panel => panel.classList.remove('show'));

    if (!isOpen) {
        const currentDate = buildJavaScriptDateFromValue(getFullDateTimeValue(targetInputId));
        renderCalendar(targetInputId, currentDate.getFullYear(), currentDate.getMonth());
        popover.classList.add('show');
    }
}

function closeAllCalendars() {
    document.querySelectorAll('.fp-calendar-popover').forEach(panel => panel.classList.remove('show'));
}

function applySelectedDate(targetInputId, dateString) {
    const existing = getDateTimeParts(getIsoDateValue(targetInputId));
    const timeValue = targetInputId === 'univ-fp-date' ? (existing.time || '12:00') : '12:00';

    if (targetInputId === 'univ-fp-date') {
        setDateInputValue(targetInputId, `${dateString}T${timeValue}`);
        updateUnivCalculation();
    } else {
        setDateInputValue(targetInputId, dateString);
        updateStayCalculation();
    }

    closeAllCalendars();
}

function handleCalendarNavigation(button) {
    const targetInputId = button.dataset.target;
    const popover = document.querySelector(`.fp-calendar-popover[data-target="${targetInputId}"]`);
    if (!popover) return;

    const year = Number(popover.dataset.viewYear);
    const month = Number(popover.dataset.viewMonth);
    const nextMonth = button.dataset.action === 'next' ? month + 1 : month - 1;
    const nextDate = new Date(year, nextMonth, 1);
    renderCalendar(targetInputId, nextDate.getFullYear(), nextDate.getMonth());
}

function openHotelDetailPage(roomId, defaultPaymentType) {
    if (!ensureSignedIn('make a reservation')) return;

    const room = HOTEL_ROOMS[roomId] || HOTEL_ROOMS['superior'];
    currentHotelRoom = room;

    const fullpage = document.getElementById('hotel-fullpage-view');
    if (!fullpage) return;

    document.getElementById('fp-title').innerText = room.title;
    document.getElementById('fp-tagline').innerText = room.tagline;
    document.getElementById('fp-rate').innerText = formatCurrency(room.price);
    document.getElementById('fp-main-img').src = room.images[0];
    document.getElementById('fp-description').innerText = room.description;

    // Generate thumbnails
    const thumbStrip = document.getElementById('fp-thumbnail-strip');
    thumbStrip.innerHTML = '';
    room.images.forEach((imgSrc, idx) => {
        const thumb = document.createElement('img');
        thumb.src = imgSrc;
        thumb.className = `fp-thumb ${idx === 0 ? 'active' : ''}`;
        thumb.onclick = () => {
            document.getElementById('fp-main-img').src = imgSrc;
            document.querySelectorAll('.fp-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        };
        thumbStrip.appendChild(thumb);
    });

    // Default dates setup (Today & Tomorrow)
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    setDateInputValue('fp-checkin', today.toISOString().split('T')[0]);
    setDateInputValue('fp-checkout', tomorrow.toISOString().split('T')[0]);

    updatePostLoginUI();
    setStayPaymentType(defaultPaymentType === 'Full' ? 'Full' : 'Deposit');
    selectFpPaymentMethod('M-Pesa');
    updateStayCalculation();

    fullpage.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeHotelDetailPage() {
    const fullpage = document.getElementById('hotel-fullpage-view');
    if (fullpage) fullpage.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function setStayPaymentType(type) {
    currentStay.paymentType = type;
    document.getElementById('plan-card-deposit').classList.toggle('active', type === 'Deposit');
    document.getElementById('plan-card-full').classList.toggle('active', type === 'Full');
    updateStayCalculation();
}

function updateStayCalculation() {
    if (!currentHotelRoom) return;

    const checkinVal = getDateOnlyValue('fp-checkin');
    const checkoutVal = getDateOnlyValue('fp-checkout');

    let nights = 1;
    if (checkinVal && checkoutVal) {
        const d1 = new Date(`${checkinVal}T12:00:00`);
        const d2 = new Date(`${checkoutVal}T12:00:00`);
        const diffTime = d2 - d1;
        nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (nights <= 0) nights = 1;
    }
    currentStay.nights = nights;

    const totalCost = currentHotelRoom.price * nights;
    const depositAmount = totalCost * 0.5;

    document.getElementById('fp-nights-count-badge').innerText = `Duration: ${nights} Night${nights > 1 ? 's' : ''}`;
    document.getElementById('fp-plan-deposit-amt').innerText = formatCurrency(depositAmount);
    document.getElementById('fp-plan-full-amt').innerText = formatCurrency(totalCost);
    document.getElementById('fp-sum-room-name').innerText = `${currentHotelRoom.title} (${nights} Night${nights > 1 ? 's' : ''})`;
    document.getElementById('fp-sum-calc-rate').innerText = formatCurrency(totalCost);

    const payableNow = (currentStay.paymentType === 'Deposit') ? depositAmount : totalCost;
    const balanceDue = totalCost - payableNow;

    document.getElementById('fp-sum-plan-label').innerText = currentStay.paymentType === 'Deposit' ? '50% Deposit' : 'Full Amount';
    document.getElementById('fp-sum-balance-due').innerText = `Balance due: ${formatCurrency(balanceDue)}`;
    document.getElementById('fp-sum-now-amount').innerText = formatCurrency(payableNow);
    document.getElementById('fp-book-btn-label').innerText = `Confirm & Pay ${formatCurrency(payableNow)}`;
}

function selectFpPaymentMethod(method) {
    currentStay.paymentMethod = method;
    document.querySelectorAll('#hotel-fullpage-view .fp-method-card').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-method') === method);
    });
    renderPaymentFields('fp-payment-fields-dynamic', method);
}

function submitFullpageBooking() {
    if (!ensureSignedIn('complete a hotel booking')) return;

    const name = document.getElementById('fp-guest-name').value.trim();
    const email = document.getElementById('fp-guest-email').value.trim();

    if (!name || !email) {
        alert("Please provide guest name and email address.");
        return;
    }

    const totalCost = currentHotelRoom.price * currentStay.nights;
    const paidNow = (currentStay.paymentType === 'Deposit') ? totalCost * 0.5 : totalCost;
    const refCode = "LNR-" + Math.floor(100000 + Math.random() * 900000);

    alert(`RESERVATION CONFIRMED!\n\nRef: ${refCode}\nRoom: ${currentHotelRoom.title}\nNights: ${currentStay.nights}\nGuest: ${name}\nAmount Paid: ${formatCurrency(paidNow)} (${currentStay.paymentMethod})`);
    closeHotelDetailPage();
}

function downloadBrochurePDF() {
    alert("Downloading LUNAR Resort 2026 Official Digital Brochure (PDF)...");
}

document.addEventListener('click', function(event) {
    const navButton = event.target.closest('.fp-calendar-nav');
    if (navButton) {
        handleCalendarNavigation(navButton);
        return;
    }

    const timeSlot = event.target.closest('.fp-time-slot');
    if (timeSlot) {
        const targetInputId = timeSlot.dataset.target;
        const dateValue = getIsoDateValue(targetInputId);
        const datePart = getDateTimeParts(dateValue).date || new Date().toISOString().split('T')[0];
        setDateInputValue(targetInputId, `${datePart}T${timeSlot.dataset.time}`);
        if (targetInputId === 'univ-fp-date') updateUnivCalculation();
        closeAllCalendars();
        return;
    }

    const dateCell = event.target.closest('.fp-day');
    if (dateCell) {
        applySelectedDate(dateCell.dataset.target, dateCell.dataset.date);
        return;
    }

    if (!event.target.closest('.fp-date-field')) {
        closeAllCalendars();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
        try { updatePostLoginUI(); } catch(e) {}
    }
});