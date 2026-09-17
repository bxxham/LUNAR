const formatCurrency = amount => `KSh ${Number(amount).toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})}`;

// --- 1. UI NAVIGATION & TABS ---
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
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

function openAuth(evt, mode) {
    const authSection = document.getElementById('Auth');
    if (authSection) authSection.style.display = 'block';
    openTab(evt, 'Auth'); 
    const box = document.getElementById('sliding-box');
    if (mode === 'login') {
        box.classList.add('slide-active'); 
    } else {
        box.classList.remove('slide-active');
    }
}

function toggleAuth() {
    document.getElementById('sliding-box').classList.toggle('slide-active');
}

// --- 2. USER AUTHENTICATION ---
function loginUser(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const displayName = email.split('@')[0];
    const user = { name: displayName, email: email };
    localStorage.setItem("currentUser", JSON.stringify(user));
    updatePostLoginUI();
}

function registerUser(event) {
    event.preventDefault();
    const user = {
        name: document.getElementById("reg-name").value,
        email: document.getElementById("reg-email").value
    };
    localStorage.setItem("currentUser", JSON.stringify(user));
    updatePostLoginUI();
    alert("Account created! Welcome to LUNAR!");
}

function updatePostLoginUI() {
    if(document.getElementById('welcome-section')) document.getElementById('welcome-section').style.display = 'none';
    if(document.getElementById('brochure-section')) document.getElementById('brochure-section').style.display = 'none';
    if(document.getElementById('Auth')) document.getElementById('Auth').style.display = 'none';
    if(document.getElementById('dashboard-welcome')) document.getElementById('dashboard-welcome').style.display = 'flex';
    if(document.getElementById('auth-links')) document.getElementById('auth-links').style.display = 'none';
    if(document.getElementById('logout-link')) document.getElementById('logout-link').style.display = 'inline';
}

function logoutUser(event) {
    if(event) event.preventDefault();
    localStorage.removeItem("currentUser");
    location.reload(); 
}

function showServices() {
    if (document.getElementById('welcome-section')) document.getElementById('welcome-section').style.display = 'none';
    if (document.getElementById('brochure-section')) document.getElementById('brochure-section').style.display = 'none';
    if (document.getElementById('dashboard-welcome')) document.getElementById('dashboard-welcome').style.display = 'none';
    if (document.getElementById('services')) document.getElementById('services').style.display = 'block';

    const hotelButton = document.querySelector('.tab-link[onclick*="Hotel"]') || document.querySelector('.tab-link');
    openTab({ currentTarget: hotelButton }, 'Hotel');
}

// --- 3. UNIVERSAL SERVICES CATALOG ---
const LUNAR_SERVICES = {
    // RESTAURANT & BAR
    'main-course': { id: 'main-course', title: 'Main Course Dining', category: 'Restaurant & Bar', tagline: 'Exquisite dishes prepared by our world-class chefs', price: 3250, period: '/ Reservation', img: 'images/food1.jpg', desc: 'Enjoy our signature menu featuring Grilled Safari Beef, Lunar Truffle Pasta, and Seared Snapper in an elegant ambient setting.' },
    'drinks-bar': { id: 'drinks-bar', title: 'Drinks & Bar Tasting', category: 'Restaurant & Bar', tagline: 'Fine wines and artisan signature cocktails', price: 3900, period: '/ Reservation', img: 'images/bar2.jpg', desc: 'Sample curated cellars, celestial mocktails, and rare vintage spirits hosted by our master mixologists.' },
    'lunar-club': { id: 'lunar-club', title: 'The Lunar Club Table', category: 'Restaurant & Bar', tagline: 'Live entertainment and late-night culinary bites', price: 2860, period: '/ Table', img: 'images/club1.jpg', desc: 'VIP table reservations featuring live Smooth Jazz, acoustic sessions, or performances by resident DJ Moonlight.' },

    // WELLNESS & SPA
    'body-massage': { id: 'body-massage', title: 'Full Body Massage', category: 'Wellness & Spa', tagline: 'Restorative deep-tissue massage and aromatherapies', price: 15600, period: '/ Session', img: 'images/bodymassage.jpg', desc: 'Release physical stress with targeted muscular alignment, essential oils, and soothing sound therapies.' },
    'barber-services': { id: 'barber-services', title: 'Barber Services', category: 'Wellness & Spa', tagline: 'Premium grooming, haircuts, and hot towel shaves', price: 6500, period: '/ Session', img: 'images/barbershop.jpg', desc: 'Precision haircuts, beard sculpts, and revitalizing facial steams in a private luxury grooming lounge.' },
    'hair-salon': { id: 'hair-salon', title: 'Hair Salon Treatment', category: 'Wellness & Spa', tagline: 'Expert styling, coloring, and hair restoration', price: 10400, period: '/ Session', img: 'images/salon.jpg', desc: 'Tailored hair design using organic restorative serums, glowing blowouts, and specialized conditioning.' },
    'manipedi': { id: 'manipedi', title: 'Manicure / Pedicure', category: 'Wellness & Spa', tagline: 'Complete nail care services for hands and feet', price: 7800, period: '/ Session', img: 'images/manipedi.jpg', desc: 'Relaxing hand and foot therapies with organic oils, cuticle restoration, and premium polish finishes.' },
    'sauna': { id: 'sauna', title: 'Sauna Access', category: 'Wellness & Spa', tagline: 'Wood-fired and steam detox saunas', price: 5200, period: '/ Hour', img: 'images/sauna.jpg', desc: 'Detoxify in high-temperature herbal saunas, followed by cool plunge pool immersion.' },
    'gym': { id: 'gym', title: 'State-of-the-Art GYM Pass', category: 'Wellness & Spa', tagline: 'Full access to high-end fitness facilities', price: 3900, period: '/ Day', img: 'images/gym.jpg', desc: 'Train with modern cardio machinery, free weights, and dedicated personal trainers.' },

    // TRAVELS & ACTIVITIES
    'chopper-ride': { id: 'chopper-ride', title: 'Chopper Ride Aerial Tour', category: 'Travels & Activities', tagline: 'Private aerial flights over the resort coastline', price: 58500, period: '/ Flight', img: 'images/chopperrides.jpg', desc: 'Take off from the private LUNAR helipad for stunning panoramic views of the coastal cliffs and ocean waters.' },
    'guided-safari': { id: 'guided-safari', title: 'Guided Safari Excursion', category: 'Travels & Activities', tagline: 'Open-top Jeep and luxury SUV wildlife tours', price: 26000, period: '/ Vehicle', img: 'images/safaris.jpg', desc: 'Explore coastal wildlife habitats escorted by professional trackers and experienced game guides.' },
    'horse-riding': { id: 'horse-riding', title: 'Trail Horse Riding', category: 'Travels & Activities', tagline: 'Guided coastal trails for all rider skill levels', price: 6500, period: '/ Hour', img: 'images/horseriding.jpg', desc: 'Ride hand-trained thoroughbreds along scenic beachfront paths and nature corridors.' },
    'archery': { id: 'archery', title: 'Professional Archery', category: 'Travels & Activities', tagline: 'Precision archery range experience', price: 3900, period: '/ Session', img: 'images/archery.jpg', desc: 'Test your marksmanship under the guidance of expert archery instructors with custom bows.' },
    'quad-bikes': { id: 'quad-bikes', title: 'Quad Bikes Off-Road', category: 'Travels & Activities', tagline: 'Adrenaline-fueled off-road quad biking tracks', price: 9750, period: '/ Hour', img: 'images/quadbikes.jpg', desc: 'Navigate high-energy dirt tracks and scenic terrain with all-terrain vehicles.' },

    // EVENTS & MEETINGS
    'ballroom': { id: 'ballroom', title: 'The Lunar Ballroom', category: 'Events & Meetings', tagline: 'Grand galas, banquets, and luxury weddings', price: 325000, period: '/ Day', img: 'images/ballroom2.jpg', desc: 'Accommodating up to 1000 guests with crystal chandeliers, full AV setups, and private catering facilities.' },
    'boardroom': { id: 'boardroom', title: 'Executive Boardroom', category: 'Events & Meetings', tagline: 'Private corporate meetings and board retreats', price: 78000, period: '/ Day', img: 'images/boardroom3.jpg', desc: 'State-of-the-art 4K video conferencing, ergonomic seating, and dedicated secretarial services for 20 guests.' }
};

let currentUnivService = null;
let currentUnivBooking = {
    paymentType: 'Deposit',
    paymentMethod: 'M-Pesa'
};

function openServiceDetailPage(serviceId, defaultPaymentType) {
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

    const ballroomEventFields = document.getElementById('ballroom-event-type-fields');
    const ballroomEventType = document.getElementById('ballroom-event-type');
    const ballroomCustomEventWrap = document.getElementById('ballroom-custom-event-wrap');
    const ballroomCustomEvent = document.getElementById('ballroom-custom-event');
    const isBallroom = service.id === 'ballroom';
    if (ballroomEventFields) ballroomEventFields.style.display = isBallroom ? 'grid' : 'none';
    if (ballroomEventType) ballroomEventType.value = 'Wedding';
    if (ballroomCustomEventWrap) ballroomCustomEventWrap.style.display = 'none';
    if (ballroomCustomEvent) ballroomCustomEvent.value = '';

    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            if (user.name) document.getElementById('univ-guest-name').value = user.name;
            if (user.email) document.getElementById('univ-guest-email').value = user.email;
        } catch(e) {}
    }

    setUnivPaymentType(currentUnivBooking.paymentType);
    selectUnivPaymentMethod('M-Pesa');

    fullpage.style.display = 'block';
    fullpage.scrollTop = 0;
    document.body.style.overflow = 'hidden';
}

function closeUniversalDetailPage() {
    const fullpage = document.getElementById('universal-fullpage-view');
    if (fullpage) fullpage.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentUnivService = null;
}

function setUnivPaymentType(type) {
    currentUnivBooking.paymentType = type;
    const depositCard = document.getElementById('univ-plan-deposit');
    const fullCard = document.getElementById('univ-plan-full');

    if (type === 'Deposit') {
        depositCard.classList.add('active');
        fullCard.classList.remove('active');
    } else {
        fullCard.classList.add('active');
        depositCard.classList.remove('active');
    }
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
    const container = document.getElementById('univ-method-specific-fields');
    
    document.querySelectorAll('#universal-fullpage-view .fp-method-card').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-method') === method);
    });

    if (method === 'M-Pesa') {
        container.innerHTML = `<div class="fp-input-wrap"><label>Phone Number</label><input type="tel" id="univ-pay-phone" placeholder="e.g. 0712 345 678" required></div>`;
    } else if (method === 'Credit/Debit Card') {
        container.innerHTML = `<div class="fp-input-wrap"><label>Card Number</label><input type="text" id="univ-card-num" placeholder="XXXX XXXX XXXX XXXX"></div>`;
    } else {
        container.innerHTML = `<div class="fp-input-wrap"><label>${method} Account</label><input type="text" placeholder="Enter account details"></div>`;
    }
}

function submitUniversalBooking() {
    const name = document.getElementById('univ-guest-name').value.trim();
    const email = document.getElementById('univ-guest-email').value.trim();
    const dateVal = document.getElementById('univ-fp-date').value;
    let eventType = '';

    if (currentUnivService?.id === 'ballroom') {
        const selectedEventType = document.getElementById('ballroom-event-type').value;
        const customEventType = document.getElementById('ballroom-custom-event').value.trim();

        if (selectedEventType === 'Other' && !customEventType) {
            alert("Please enter your event type.");
            document.getElementById('ballroom-custom-event').focus();
            return;
        }

        eventType = selectedEventType === 'Other' ? customEventType : selectedEventType;
    }

    if (!name || !email || !dateVal) {
        alert("Please enter your name, email, and scheduled date/time.");
        return;
    }

    const paidNow = currentUnivBooking.paymentType === 'Deposit' ? currentUnivService.price * 0.5 : currentUnivService.price;
    const refCode = "LNR-" + Math.floor(100000 + Math.random() * 900000);

    const eventDetails = eventType ? `\nEvent Type: ${eventType}` : '';
    alert(`RESERVATION CONFIRMED!\n\nReference: ${refCode}\nService: ${currentUnivService.title}${eventDetails}\nGuest: ${name}\nScheduled: ${dateVal}\nAmount Paid: ${formatCurrency(paidNow)}\nMethod: ${currentUnivBooking.paymentMethod}`);
    closeUniversalDetailPage();
}

document.addEventListener('DOMContentLoaded', function() {
    const eventTypeSelect = document.getElementById('ballroom-event-type');
    const customEventWrap = document.getElementById('ballroom-custom-event-wrap');
    const customEventInput = document.getElementById('ballroom-custom-event');

    if (!eventTypeSelect || !customEventWrap || !customEventInput) return;

    eventTypeSelect.addEventListener('change', function() {
        const isCustomEvent = eventTypeSelect.value === 'Other';
        customEventWrap.style.display = isCustomEvent ? 'block' : 'none';
        customEventInput.required = isCustomEvent;
        if (!isCustomEvent) customEventInput.value = '';
    });
});

// HANDLE CUSTOM EVENT QUOTE SUBMISSION
function handleEventFormSubmit(event) {
    event.preventDefault();
    const eventType = document.getElementById('event-type-select').value;
    const guestCount = parseInt(document.getElementById('guest-count').value) || 50;
    
    // Dynamic price calculation based on guests
    const calculatedPrice = guestCount * 1300 + 65000;

    LUNAR_SERVICES['event-quote'] = {
        id: 'event-quote',
        title: `${eventType.toUpperCase()} Gathering`,
        category: 'Events & Meetings',
        tagline: `Custom event setup for ${guestCount} estimated guests`,
        price: calculatedPrice,
        period: '/ Event Package',
        img: 'images/ballroom.jpg',
        desc: `Custom package for a ${eventType} including tailored venue configurations, catering provisions, and high-tech AV support.`
    };

    openServiceDetailPage('event-quote', 'Deposit');
}

// RESTORE HOTEL CODE FOR ACCOMMODATIONS TAB
const HOTEL_ROOMS = {
    'superior': { id: 'superior', title: 'Superior Room', tagline: 'Spacious elegance overlooking resort gardens', badge: '', price: 23400, description: 'Intimate sanctuary with queen bed and garden views.', images: [{ src: 'images/superiorroom.jpg', label: 'Suite Bedroom' }], specs: [{ label: 'Capacity', value: '2 Adults' }], amenities: ['Fiber Wi-Fi', 'Marble Bath'] },
    'deluxe': { id: 'deluxe', title: 'Deluxe Room', tagline: 'Expansive comfort featuring ocean vistas', badge: 'Popular', price: 32500, description: 'King bed suite with glass balcony overlooking sea.', images: [{ src: 'images/deluxeroom.jpg', label: 'Deluxe Suite' }], specs: [{ label: 'Capacity', value: '2-3 Guests' }], amenities: ['Balcony', 'Soaking Tub'] },
    'junior-suite': { id: 'junior-suite', title: 'Junior Suite', tagline: 'Open-concept layout blending sleep & lounge', badge: '', price: 45500, description: 'Generous suite with master quarter and lounge terrace.', images: [{ src: 'images/juniorsuite.jpg', label: 'Junior Suite' }], specs: [{ label: 'Capacity', value: '3 Guests' }], amenities: ['Lounge', 'Teak Balcony'] },
    'executive-suite': { id: 'executive-suite', title: 'Executive Suite', tagline: 'Architectural grandeur with 24/7 private butler', badge: '', price: 58500, description: 'Master suite with dining salon and butler service.', images: [{ src: 'images/executivesuite.jpg', label: 'Executive Suite' }], specs: [{ label: 'Capacity', value: '4 Guests' }], amenities: ['Private Butler', 'VIP Lounge'] },
    'presidential': { id: 'presidential', title: 'Presidential Suite', tagline: 'Regal seaside indulgence with heated oceanfront jacuzzi', badge: 'Elite', price: 156000, description: 'Multi-bedroom suite with private heated jacuzzi terrace.', images: [{ src: 'images/presidentialsuite.jpg', label: 'Presidential Suite' }], specs: [{ label: 'Capacity', value: '6 Guests' }], amenities: ['Heated Jacuzzi', 'Rolls-Royce Transfer'] },
    'penthouse': { id: 'penthouse', title: 'The Lunar Penthouse', tagline: 'Crowing jewel with private rooftop infinity pool', badge: 'VVIP', price: 325000, description: 'Entire top floor penthouse with private infinity pool and master chef.', images: [{ src: 'images/lunarpenthouse.jpg', label: 'Rooftop Penthouse' }], specs: [{ label: 'Capacity', value: '8 Guests' }], amenities: ['Rooftop Pool', 'Personal Chef'] }
};

let currentHotelRoom = null;
let currentStay = { checkin: '', checkout: '', nights: 1, paymentType: 'Deposit', paymentMethod: 'M-Pesa' };

function openHotelDetailPage(roomId, defaultPaymentType) {
    const room = HOTEL_ROOMS[roomId] || HOTEL_ROOMS['superior'];
    currentHotelRoom = room;

    const fullpage = document.getElementById('hotel-fullpage-view');
    if (!fullpage) return;

    document.getElementById('fp-title').innerText = room.title;
    document.getElementById('fp-tagline').innerText = room.tagline;
    document.getElementById('fp-rate').innerText = formatCurrency(room.price);
    document.getElementById('fp-main-img').src = room.images[0].src;
    document.getElementById('fp-description').innerText = room.description;

    setStayPaymentType(defaultPaymentType === 'Full' ? 'Full' : 'Deposit');
    selectFpPaymentMethod('M-Pesa');
    updateStayCalculation();

    fullpage.style.display = 'block';
    fullpage.scrollTop = 0;
    document.body.style.overflow = 'hidden';
}

function closeHotelDetailPage() {
    const fullpage = document.getElementById('hotel-fullpage-view');
    if (fullpage) fullpage.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentHotelRoom = null;
}

function setStayPaymentType(type) {
    currentStay.paymentType = type;
    document.getElementById('plan-card-deposit').classList.toggle('active', type === 'Deposit');
    document.getElementById('plan-card-full').classList.toggle('active', type === 'Full');
    updateStayCalculation();
}

function updateStayCalculation() {
    if (!currentHotelRoom) return;
    const totalCost = currentHotelRoom.price;
    const depositAmount = totalCost * 0.5;

    document.getElementById('fp-plan-deposit-amt').innerText = formatCurrency(depositAmount);
    document.getElementById('fp-plan-full-amt').innerText = formatCurrency(totalCost);
    document.getElementById('fp-sum-room-name').innerText = currentHotelRoom.title;

    const payableNow = (currentStay.paymentType === 'Deposit') ? depositAmount : totalCost;
    document.getElementById('fp-sum-now-amount').innerText = formatCurrency(payableNow);
    document.getElementById('fp-book-btn-label').innerText = `Confirm & Pay ${formatCurrency(payableNow)}`;
}

function selectFpPaymentMethod(method) {
    currentStay.paymentMethod = method;
    document.querySelectorAll('#hotel-fullpage-view .fp-method-card').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-method') === method);
    });
}

function submitFullpageBooking() {
    const name = document.getElementById('fp-guest-name').value.trim();
    const email = document.getElementById('fp-guest-email').value.trim();

    if (!name || !email) {
        alert("Please fill in your name and email address.");
        return;
    }

    const totalCost = currentHotelRoom.price;
    const paidNow = (currentStay.paymentType === 'Deposit') ? totalCost * 0.5 : totalCost;
    const refCode = "LNR-" + Math.floor(100000 + Math.random() * 900000);

    alert(`RESERVATION CONFIRMED!\n\nReference: ${refCode}\nRoom: ${currentHotelRoom.title}\nGuest: ${name}\nAmount Paid: ${formatCurrency(paidNow)} (${currentStay.paymentMethod})`);
    closeHotelDetailPage();
}

