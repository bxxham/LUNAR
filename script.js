
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

// --- 2. USER AUTHENTICATION (CLIENT) ---

function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value;
    const displayName = email.split('@')[0];

    const user = {
        name: displayName, 
        email: email
    };
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

// --- 3. BOOKING LOGIC (FIXED) ---

// Global variable to store active booking context
let activeBooking = null;

/**
 * Validates date format YYYY-MM-DD
 * @param {string} dateStr - Date string to validate
 * @returns {boolean} - True if valid
 */
function isValidDate(dateStr) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;

    const date = new Date(dateStr);
    const timestamp = date.getTime();
    if (isNaN(timestamp)) return false;

    // Check if date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return false;

    return true;
}

// --- 2.5 FULL-PAGE HOTEL ROOM SHOWCASE & PAYMENT ---

const HOTEL_ROOMS = {
    'superior': {
        id: 'superior',
        title: 'Superior Room',
        tagline: 'Spacious elegance overlooking the tranquil resort gardens',
        badge: '',
        price: 180,
        description: 'Our Superior Room offers an intimate sanctuary enveloped in contemporary coastal luxury. Featuring an opulent queen-size bed dressed in 400-thread-count Egyptian cotton, fine hand-crafted mahogany furnishings, and oversized picture windows overlooking our fragrant resort gardens and water features. Perfect for discerning travelers seeking serenity, comfort, and restorative repose.',
        images: [
            { src: 'images/superiorroom.jpg', label: 'Suite Bedroom' },
            { src: 'images/lobby1.jpeg', label: 'Grand Lobby' },
            { src: 'images/swimming.jpg', label: 'Resort Pool' },
            { src: 'images/restaurant1.jpg', label: 'Garden Terrace' }
        ],
        specs: [
            { label: 'Capacity', value: '2 Adults' },
            { label: 'Bed Type', value: '1 Queen Bed' },
            { label: 'Suite Size', value: '45 m² / 485 ft²' },
            { label: 'Balcony View', value: 'Resort Gardens' }
        ],
        amenities: [
            'Complimentary High-Speed Fiber Wi-Fi',
            '55" 4K Smart TV with Streaming Hub',
            'Italian Marble En-suite with Rainfall Shower',
            'Nespresso Coffee Bar & Artisan Herbal Teas',
            'Twice-Daily Housekeeping & Evening Turndown',
            'Complimentary Resort Pool & Fitness Access'
        ]
    },
    'deluxe': {
        id: 'deluxe',
        title: 'Deluxe Room',
        tagline: 'Expansive comfort featuring ocean vistas and private sea-breeze terrace',
        badge: 'Popular',
        price: 250,
        description: 'An expansive retreat commanding spectacular panoramic ocean vistas. The Deluxe Room features an ultra-plush king-size bed, a comfortable lounge area with custom designer furnishings, and a private glass-fronted balcony where gentle sea breezes welcome every sunrise. Enjoy deep soaking tubs and artisan bath amenities for the ultimate coastal escape.',
        images: [
            { src: 'images/deluxeroom.jpg', label: 'Deluxe Suite' },
            { src: 'images/jacuzi.jpg', label: 'Spa Jacuzzi' },
            { src: 'images/lobby2.jpeg', label: 'Ocean Reception' },
            { src: 'images/swimming.jpg', label: 'Infinity Pool' }
        ],
        specs: [
            { label: 'Capacity', value: '2-3 Guests' },
            { label: 'Bed Type', value: '1 King Bed' },
            { label: 'Suite Size', value: '60 m² / 645 ft²' },
            { label: 'Balcony View', value: 'Panoramic Ocean' }
        ],
        amenities: [
            'Private Sea-Breeze Balcony with Sun Loungers',
            'Deep Soaking Tub & Dual Marble Vanities',
            'Complimentary Stocked Gourmet Mini-Bar',
            '65" OLED TV & Bang & Olufsen Soundbar',
            'High-Speed Fiber Wi-Fi Throughout',
            'Complimentary Access to Infinity Pool & Spa Deck'
        ]
    },
    'junior-suite': {
        id: 'junior-suite',
        title: 'Junior Suite',
        tagline: 'Harmonious open-concept layout blending sleep, lounge, and sunset views',
        badge: '',
        price: 350,
        description: 'Designed for generous living, our Junior Suite seamlessly fuses a lavish master sleeping quarter with an expansive open-plan lounge. Step onto your private sun terrace equipped with designer loungers, or unwind in your spa-grade soaking tub. Includes personalized in-room dining and dedicated hospitality concierge around the clock.',
        images: [
            { src: 'images/juniorsuite.jpg', label: 'Junior Suite' },
            { src: 'images/jacuzi.jpg', label: 'Hydro Jacuzzi' },
            { src: 'images/swimming.jpg', label: 'Private Lagoon' },
            { src: 'images/lobby1.jpeg', label: 'VIP Lounge' }
        ],
        specs: [
            { label: 'Capacity', value: '3 Guests' },
            { label: 'Bed Type', value: 'King Bed + Daybed' },
            { label: 'Suite Size', value: '80 m² / 860 ft²' },
            { label: 'Balcony View', value: 'Coastline & Ocean' }
        ],
        amenities: [
            'Separate Designer Lounge & Entertainment Area',
            'Private Sunset Balcony with Teak Sunbeds',
            'Hydrotherapy Spa Jacuzzi & Rainforest Shower',
            '24/7 Personalized In-Room Dining Service',
            'Luxury Bathrobes & Acqua di Parma Toiletries',
            'Priority Reservations at All LUNAR Venues'
        ]
    },
    'executive-suite': {
        id: 'executive-suite',
        title: 'Executive Suite',
        tagline: 'Peerless distinction with 24/7 private butler and wraparound terrace',
        badge: '',
        price: 450,
        description: 'Tailored for the ultimate indulgence, the Executive Suite offers refined architectural grandeur. Revel in a grand master bedroom, separate executive meeting & dining salon, and a private wraparound balcony. A dedicated 24/7 private butler attends to every detail, from unpacking your luggage to arranging bespoke resort excursions.',
        images: [
            { src: 'images/executivesuite.jpg', label: 'Executive Suite' },
            { src: 'images/jacuzi.jpg', label: 'Spa & Jacuzzi' },
            { src: 'images/swimming.jpg', label: 'Executive Deck' },
            { src: 'images/lobby2.jpeg', label: 'VIP Concierge' }
        ],
        specs: [
            { label: 'Capacity', value: '4 Guests' },
            { label: 'Bed Type', value: 'Master King Bedroom' },
            { label: 'Suite Size', value: '110 m² / 1,180 ft²' },
            { label: 'Balcony View', value: 'Coastline & Ocean' }
        ],
        amenities: [
            'Dedicated 24/7 Personal Butler Service',
            'Wraparound Panoramic Terrace with Daybed',
            'Executive Lounge Access & Evening Cocktail Hour',
            'Private In-Suite Jacuzzi & Steam Shower',
            'Bang & Olufsen Premium Audio Suite',
            'Complimentary Chauffeur Airport Transfer'
        ]
    },
    'presidential': {
        id: 'presidential',
        title: 'Presidential Suite',
        tagline: 'The absolute zenith of coastal luxury with heated oceanfront jacuzzi terrace',
        badge: 'Elite',
        price: 1200,
        description: 'The epitome of regal seaside indulgence. Spanning multiple grand bedrooms, a lavish formal dining salon, and a private expansive terrace featuring a heated infinity-edge jacuzzi perched over the waves. Complete with dedicated butler service, a private sommelier-curated bar, and chauffeured VIP luxury transfers.',
        images: [
            { src: 'images/presidentialsuite.jpg', label: 'Presidential Suite' },
            { src: 'images/jacuzi.jpg', label: 'Oceanfront Jacuzzi' },
            { src: 'images/swimming.jpg', label: 'VIP Lagoon Pool' },
            { src: 'images/lunarpenthouse.jpg', label: 'Grand Terrace' }
        ],
        specs: [
            { label: 'Capacity', value: '6 Guests' },
            { label: 'Bed Type', value: '2 Master King Suites' },
            { label: 'Suite Size', value: '220 m² / 2,368 ft²' },
            { label: 'Balcony View', value: '270° Ocean Panorama' }
        ],
        amenities: [
            'Private Heated Oceanfront Jacuzzi & Sun Terrace',
            'Full Formal Dining Room & Curated Private Bar',
            '24/7 Dedicated Butler & Private In-Suite Chef Option',
            'Luxury VIP Chauffeur Transfer (Rolls-Royce / Maybach)',
            'Unlimited Spa Treatments & Reserved Private Cabana',
            'Biometric Security & Complete Penthouse Wing Privacy'
        ]
    },
    'penthouse': {
        id: 'penthouse',
        title: 'The Lunar Penthouse',
        tagline: 'Our crowning architectural jewel with rooftop infinity pool and personal chef',
        badge: 'VVIP',
        price: 2500,
        description: 'Perched at the highest peak of LUNAR Resort, this one-of-a-kind penthouse represents the pinnacle of world-class hospitality. Occupying the entire top floor, it features a private glass-bottom rooftop infinity pool, dedicated gourmet personal chef, helicopter pad access, and unrestricted 360° vistas of the sea and coastal hills.',
        images: [
            { src: 'images/lunarpenthouse.jpg', label: 'Rooftop Penthouse' },
            { src: 'images/chopperrides.jpg', label: 'Helipad Transfer' },
            { src: 'images/jacuzi.jpg', label: 'Private Sky Jacuzzi' },
            { src: 'images/swimming.jpg', label: 'Infinity Sky Pool' }
        ],
        specs: [
            { label: 'Capacity', value: '8 Guests' },
            { label: 'Bed Type', value: '3 Grand King Suites' },
            { label: 'Suite Size', value: '450 m² / 4,840 ft²' },
            { label: 'Balcony View', value: '360° Coastal Panorama' }
        ],
        amenities: [
            'Private Rooftop Infinity Pool & Sky Lounge',
            'Dedicated Private Master Chef for Custom Gourmet Dining',
            'Direct Helipad & Helicopter Airport Transfers Included',
            'Unlimited Rare Wine & Champagne Cellar Selection',
            'Private Yacht Sunset Excursion Included',
            'Full Floor Exclusivity & 24/7 Private Security Detail'
        ]
    }
};

let currentHotelRoom = null;
let currentStay = {
    checkin: '',
    checkout: '',
    nights: 1,
    paymentType: 'Deposit',
    paymentMethod: 'M-Pesa'
};

function openHotelDetailPage(roomId, defaultPaymentType) {
    const room = HOTEL_ROOMS[roomId] || HOTEL_ROOMS['superior'];
    currentHotelRoom = room;

    const fullpage = document.getElementById('hotel-fullpage-view');
    if (!fullpage) return;

    // 1. Populate Room Header
    const badgeEl = document.getElementById('fp-badge');
    if (room.badge) {
        badgeEl.innerText = room.badge;
        badgeEl.style.display = 'inline-block';
        if (room.badge === 'VVIP') {
            badgeEl.style.background = '#1a1a1a';
            badgeEl.style.color = 'gold';
            badgeEl.style.border = '1px solid gold';
        } else {
            badgeEl.style.background = 'gold';
            badgeEl.style.color = '#1a1a1a';
            badgeEl.style.border = 'none';
        }
    } else {
        badgeEl.style.display = 'none';
    }

    document.getElementById('fp-title').innerText = room.title;
    document.getElementById('fp-tagline').innerText = room.tagline;
    document.getElementById('fp-rate').innerText = `$${room.price}`;

    // 2. Populate Hero Image & Thumbnails
    const mainImg = document.getElementById('fp-main-img');
    mainImg.src = room.images[0].src;
    mainImg.alt = room.title;
    document.getElementById('fp-photo-counter').innerText = `Photo 1 of ${room.images.length}`;

    const thumbStrip = document.getElementById('fp-thumbnail-strip');
    thumbStrip.innerHTML = room.images.map((img, idx) => `
        <div class="fp-thumb-item ${idx === 0 ? 'active' : ''}" onclick="switchHeroImage('${img.src}', ${idx})">
            <img src="${img.src}" alt="${img.label}">
            <span class="fp-thumb-label">${img.label}</span>
        </div>
    `).join('');

    // 3. Populate Specs & Amenities
    const specsGrid = document.getElementById('fp-specs-grid');
    specsGrid.innerHTML = room.specs.map(s => `
        <div class="fp-spec-pill">
            <div class="fp-spec-info">
                <span class="fp-spec-label">${s.label}</span>
                <span class="fp-spec-val">${s.value}</span>
            </div>
        </div>
    `).join('');

    document.getElementById('fp-description').innerText = room.description;

    const amenitiesList = document.getElementById('fp-amenities-list');
    amenitiesList.innerHTML = room.amenities.map(a => `
        <li>
            <span class="fp-amenity-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
            <span>${a}</span>
        </li>
    `).join('');

    // 4. Setup Default Dates
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const checkinInput = document.getElementById('fp-checkin');
    const checkoutInput = document.getElementById('fp-checkout');

    checkinInput.min = todayStr;
    checkinInput.value = todayStr;

    checkoutInput.min = tomorrowStr;
    checkoutInput.value = tomorrowStr;

    currentStay.checkin = todayStr;
    currentStay.checkout = tomorrowStr;
    currentStay.paymentType = defaultPaymentType === 'Full' ? 'Full' : 'Deposit';

    // 5. Pre-populate Guest Info if logged in
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            if (user.name) document.getElementById('fp-guest-name').value = user.name;
            if (user.email) document.getElementById('fp-guest-email').value = user.email;
        } catch(e) {}
    }

    // 6. Set payment plan UI & payment method
    setStayPaymentType(currentStay.paymentType);
    selectFpPaymentMethod(currentStay.paymentMethod || 'M-Pesa');
    updateStayCalculation();

    // 7. Show the Fullpage view & lock body scroll
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

function switchHeroImage(src, index) {
    const mainImg = document.getElementById('fp-main-img');
    if (!mainImg) return;

    mainImg.style.opacity = '0.3';
    setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = '1';
    }, 150);

    const thumbs = document.querySelectorAll('.fp-thumb-item');
    thumbs.forEach((t, i) => {
        if (i === index) t.classList.add('active');
        else t.classList.remove('active');
    });

    const counter = document.getElementById('fp-photo-counter');
    if (counter && currentHotelRoom) {
        counter.innerText = `Photo ${index + 1} of ${currentHotelRoom.images.length}`;
    }
}

function setStayPaymentType(type) {
    currentStay.paymentType = type;

    const depositCard = document.getElementById('plan-card-deposit');
    const fullCard = document.getElementById('plan-card-full');
    const depositRadio = document.getElementById('radio-plan-deposit');
    const fullRadio = document.getElementById('radio-plan-full');

    if (type === 'Deposit') {
        if (depositCard) depositCard.classList.add('active');
        if (fullCard) fullCard.classList.remove('active');
        if (depositRadio) depositRadio.checked = true;
    } else {
        if (fullCard) fullCard.classList.add('active');
        if (depositCard) depositCard.classList.remove('active');
        if (fullRadio) fullRadio.checked = true;
    }

    updateStayCalculation();
}

function updateStayCalculation() {
    if (!currentHotelRoom) return;

    const checkinVal = document.getElementById('fp-checkin').value;
    const checkoutVal = document.getElementById('fp-checkout').value;

    let nights = 1;
    if (checkinVal && checkoutVal) {
        const inDate = new Date(checkinVal);
        const outDate = new Date(checkoutVal);
        const diffMs = outDate - inDate;
        if (diffMs > 0) {
            nights = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
        }
    }

    currentStay.nights = nights;
    currentStay.checkin = checkinVal;
    currentStay.checkout = checkoutVal;

    // Update checkout input min date to checkin + 1 day
    if (checkinVal) {
        const nextDay = new Date(checkinVal);
        nextDay.setDate(nextDay.getDate() + 1);
        document.getElementById('fp-checkout').min = nextDay.toISOString().split('T')[0];
    }

    const durationTag = document.getElementById('fp-duration-tag');
    if (durationTag) durationTag.innerText = `${nights} Night${nights > 1 ? 's' : ''} Stay`;

    const totalCost = nights * currentHotelRoom.price;
    const depositAmount = totalCost * 0.5;
    const fullAmount = totalCost;

    // Update payment plan option calculated amounts
    const depositAmtEl = document.getElementById('fp-plan-deposit-amt');
    const fullAmtEl = document.getElementById('fp-plan-full-amt');
    if (depositAmtEl) depositAmtEl.innerText = `$${depositAmount.toFixed(2)}`;
    if (fullAmtEl) fullAmtEl.innerText = `$${fullAmount.toFixed(2)}`;

    // Update summary column
    document.getElementById('fp-sum-room-name').innerText = currentHotelRoom.title;
    document.getElementById('fp-sum-calc-rate').innerText = `$${currentHotelRoom.price}.00 × ${nights} night${nights > 1 ? 's' : ''}`;

    let payableNow = 0;
    let balanceDue = 0;

    if (currentStay.paymentType === 'Deposit') {
        payableNow = depositAmount;
        balanceDue = totalCost - depositAmount;
        document.getElementById('fp-sum-plan-label').innerText = '50% Deposit';
        document.getElementById('fp-sum-balance-due').innerText = `Balance due at check-in: $${balanceDue.toFixed(2)}`;
        document.getElementById('fp-sum-balance-due').style.display = 'block';
    } else {
        payableNow = fullAmount;
        balanceDue = 0;
        document.getElementById('fp-sum-plan-label').innerText = 'Full Amount';
        document.getElementById('fp-sum-balance-due').innerText = 'Fully Paid (No balance upon check-in)';
        document.getElementById('fp-sum-balance-due').style.display = 'block';
    }

    document.getElementById('fp-sum-now-amount').innerText = `$${payableNow.toFixed(2)}`;
    document.getElementById('fp-book-btn-label').innerText = `Confirm & Pay $${payableNow.toFixed(2)}`;
}

function selectFpPaymentMethod(method) {
    currentStay.paymentMethod = method;

    const hiddenInput = document.getElementById('fp-active-payment-method');
    if (hiddenInput) hiddenInput.value = method;

    document.querySelectorAll('.fp-method-card').forEach(btn => {
        if (btn.getAttribute('data-method') === method) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const fieldsContainer = document.getElementById('fp-method-specific-fields');
    if (!fieldsContainer) return;

    if (method === 'M-Pesa') {
        fieldsContainer.innerHTML = `
            <div class="fp-input-wrap">
                <label for="fp-pay-phone">Safaricom Phone Number</label>
                <input type="tel" id="fp-pay-phone" placeholder="e.g. 0712 345 678 or 254712345678" required>
                <small style="color: #666; font-size: 12px; margin-top: 6px; display: block;">An instant STK Push prompt will be sent directly to your phone for PIN verification.</small>
            </div>
        `;
    } else if (method === 'Credit/Debit Card') {
        fieldsContainer.innerHTML = `
            <div class="fp-input-wrap">
                <label for="fp-card-name">Cardholder Name</label>
                <input type="text" id="fp-card-name" placeholder="Name on card">
            </div>
            <div class="fp-input-wrap">
                <label for="fp-card-num">Card Number</label>
                <input type="text" id="fp-card-num" placeholder="XXXX XXXX XXXX XXXX" maxlength="19">
            </div>
            <div class="fp-input-row">
                <div class="fp-input-wrap">
                    <label for="fp-card-exp">Expiry Date</label>
                    <input type="text" id="fp-card-exp" placeholder="MM/YY" maxlength="5">
                </div>
                <div class="fp-input-wrap">
                    <label for="fp-card-cvv">CVV</label>
                    <input type="password" id="fp-card-cvv" placeholder="123" maxlength="4">
                </div>
            </div>
        `;
    } else if (method === 'PayPal') {
        fieldsContainer.innerHTML = `
            <div class="fp-input-wrap">
                <label for="fp-paypal-email">PayPal Account Email</label>
                <input type="email" id="fp-paypal-email" placeholder="email@paypal.com">
                <small style="color: #666; font-size: 12px; margin-top: 6px; display: block;">You will authorize your payment via PayPal's encrypted luxury portal.</small>
            </div>
        `;
    } else if (method === 'Apple Pay') {
        fieldsContainer.innerHTML = `
            <div class="fp-input-wrap">
                <label for="fp-apple-id">Apple ID / iCloud Email</label>
                <input type="email" id="fp-apple-id" placeholder="id@icloud.com">
                <small style="color: #666; font-size: 12px; margin-top: 6px; display: block;">One-touch biometric authorization enabled for Apple Pay users.</small>
            </div>
        `;
    } else if (method === 'Cash') {
        fieldsContainer.innerHTML = `
            <div style="padding: 10px 0; color: #444; font-size: 14px; line-height: 1.5;">
                <strong>Pay Upon Arrival</strong>
                <p style="margin: 6px 0 0 0; color: #666;">No advance charge required now. Settle your stay upon check-in at the LUNAR front desk with Cash, Card, or Wire Transfer.</p>
            </div>
        `;
    }
}

function submitFullpageBooking() {
    if (!currentHotelRoom) return;

    const guestName = document.getElementById('fp-guest-name').value.trim();
    const guestEmail = document.getElementById('fp-guest-email').value.trim();
    const checkin = document.getElementById('fp-checkin').value;
    const checkout = document.getElementById('fp-checkout').value;
    const paymentMethod = currentStay.paymentMethod;

    if (!guestName) {
        alert("Please enter the primary guest name.");
        document.getElementById('fp-guest-name').focus();
        return;
    }

    if (!guestEmail || !guestEmail.includes('@')) {
        alert("Please provide a valid email address for your booking confirmation voucher.");
        document.getElementById('fp-guest-email').focus();
        return;
    }

    if (!checkin || !checkout) {
        alert("Please select your check-in and check-out dates.");
        return;
    }

    if (new Date(checkout) <= new Date(checkin)) {
        alert("Check-out date must be after check-in date.");
        return;
    }

    // Collect payment details
    let paymentDetail = "";
    if (paymentMethod === 'M-Pesa') {
        paymentDetail = document.getElementById('fp-pay-phone')?.value.trim();
        if (!paymentDetail) {
            alert("Please enter your M-Pesa phone number.");
            document.getElementById('fp-pay-phone')?.focus();
            return;
        }
    } else if (paymentMethod === 'Credit/Debit Card') {
        const cardNum = document.getElementById('fp-card-num')?.value.trim();
        if (!cardNum || cardNum.length < 12) {
            alert("Please provide a valid credit/debit card number.");
            document.getElementById('fp-card-num')?.focus();
            return;
        }
        paymentDetail = "Card ending in " + cardNum.slice(-4);
    } else if (paymentMethod === 'PayPal') {
        paymentDetail = document.getElementById('fp-paypal-email')?.value.trim();
        if (!paymentDetail) {
            alert("Please enter your PayPal email address.");
            return;
        }
    } else if (paymentMethod === 'Apple Pay') {
        paymentDetail = document.getElementById('fp-apple-id')?.value.trim();
        if (!paymentDetail) {
            alert("Please enter your Apple ID email.");
            return;
        }
    } else {
        paymentDetail = "Pay at LUNAR Front Desk";
    }

    const totalCost = currentStay.nights * currentHotelRoom.price;
    const paidNow = (currentStay.paymentType === 'Deposit') ? (totalCost * 0.5) : totalCost;
    const balance = totalCost - paidNow;
    const reservationCode = "LNR-" + Math.floor(100000 + Math.random() * 900000);

    const bookingRecord = {
        booking_id: reservationCode,
        guest_name: guestName,
        guest_email: guestEmail,
        room_type: currentHotelRoom.title,
        checkin: checkin,
        checkout: checkout,
        nights: currentStay.nights,
        payment_method: paymentMethod,
        payment_details: paymentDetail,
        payment_type: currentStay.paymentType === 'Deposit' ? '50% Deposit' : 'Full Amount',
        amount_paid: paidNow.toFixed(2),
        balance_due: balance.toFixed(2),
        created_at: new Date().toISOString()
    };

    // Save to local storage for reference
    try {
        const existing = JSON.parse(localStorage.getItem("lunarBookings") || "[]");
        existing.unshift(bookingRecord);
        localStorage.setItem("lunarBookings", JSON.stringify(existing));
    } catch(e) {}

    const submitBtn = document.querySelector('.fp-book-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
    }

    if (paymentMethod === 'M-Pesa') {
        alert(`STK PUSH SENT!\n\nA payment prompt has been sent to ${paymentDetail}.\nPlease enter your M-Pesa PIN on your phone to complete payment of $${paidNow.toFixed(2)}.`);
        
        setTimeout(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }
            alert(`RESERVATION CONFIRMED!\n\nReference: ${reservationCode}\nRoom: ${currentHotelRoom.title}\nGuest: ${guestName}\nDates: ${checkin} to ${checkout} (${currentStay.nights} nights)\nAmount Paid: $${paidNow.toFixed(2)} (via M-Pesa)\nBalance Due at Check-in: $${balance.toFixed(2)}\n\nA digital voucher has been sent to ${guestEmail}.`);
            closeHotelDetailPage();
        }, 2200);
    } else {
        setTimeout(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }
            alert(`RESERVATION CONFIRMED!\n\nReference: ${reservationCode}\nRoom: ${currentHotelRoom.title}\nGuest: ${guestName}\nDates: ${checkin} to ${checkout} (${currentStay.nights} nights)\nAmount Paid: $${paidNow.toFixed(2)} (${paymentMethod})\nBalance Due at Check-in: $${balance.toFixed(2)}\n\nA digital voucher has been sent to ${guestEmail}.`);
            closeHotelDetailPage();
        }, 500);
    }
}

// Close full-page view on Escape key
window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const fp = document.getElementById('hotel-fullpage-view');
        if (fp && fp.style.display !== 'none') {
            closeHotelDetailPage();
        }
    }
});

// Auto-restore login state if user exists in localStorage
document.addEventListener('DOMContentLoaded', function() {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
        try {
            updatePostLoginUI();
        } catch(e) {}
    }
});

function bookService(category, service, amount, paymentType) {
    // Hotel category now uses the dedicated full-page room showcase & payment view
    if (category === 'Hotel') {
        const keyMap = {
            'Superior Room': 'superior',
            'Deluxe Room': 'deluxe',
            'Junior Suite': 'junior-suite',
            'Executive Suite': 'executive-suite',
            'Presidential Suite': 'presidential',
            'The Lunar Penthouse': 'penthouse'
        };
        const roomId = keyMap[service] || 'superior';
        openHotelDetailPage(roomId, paymentType);
        return;
    }

    const storedData = localStorage.getItem("currentUser");
    const currentUser = storedData ? JSON.parse(storedData) : null;

    if (!currentUser) {
        alert("Please log in before making a reservation.");
        openAuth(null, "login");
        return;
    }

    // Store data for the confirmation step
    activeBooking = { category, service, amount, paymentType, currentUser };

    // Open the Modal Card
    openBookingModal(service);
}

// Global helper to handle payment card selection UI
window.selectPaymentMethod = function(method, element) {
    document.querySelectorAll('.payment-card').forEach(card => {
        card.style.borderColor = '#eee';
        card.style.backgroundColor = '#fff';
    });
    if (element) {
        element.style.borderColor = '#1a1a1a';
        element.style.backgroundColor = '#f9f9f9';
    }
    const methodInput = document.getElementById('modal-payment-method');
    if (methodInput) methodInput.value = method;

    const detailsContainer = document.getElementById('payment-details-fields');
    if (!detailsContainer) return;

    let fieldsHtml = '';
    const inputStyle = `width: 100%; padding: 14px; border: 2px solid #f0f0f0; border-radius: 14px; font-size: 15px; font-weight: 600; background: #fafafa; outline: none; transition: all 0.2s; box-sizing: border-box;`;
    const labelStyle = `display: block; font-weight: 700; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; color: #aaa; margin-top: 20px;`;

    if (method === 'M-Pesa') {
        fieldsHtml = `<label style="${labelStyle}">Phone Number</label><input type="tel" id="pay-detail-phone" placeholder="e.g. 0712345678" style="${inputStyle}">`;
    } else if (method === 'PayPal') {
        fieldsHtml = `<label style="${labelStyle}">PayPal Email</label><input type="email" id="pay-detail-email" placeholder="email@paypal.com" style="${inputStyle}">`;
    } else if (method === 'Apple Pay') {
        fieldsHtml = `<label style="${labelStyle}">Apple ID</label><input type="email" id="pay-detail-apple" placeholder="id@icloud.com" style="${inputStyle}">`;
    } else if (method === 'Credit/Debit Card') {
        fieldsHtml = `
            <label style="${labelStyle}">Card Number</label>
            <input type="text" id="pay-detail-card-num" placeholder="XXXX XXXX XXXX XXXX" style="${inputStyle}">
            <div style="display: flex; gap: 15px;">
                <div style="flex: 1;">
                    <label style="${labelStyle}">Expiry</label>
                    <input type="text" id="pay-detail-card-exp" placeholder="MM/YY" style="${inputStyle}">
                </div>
                <div style="flex: 1;">
                    <label style="${labelStyle}">CVV</label>
                    <input type="password" id="pay-detail-card-cvv" placeholder="123" maxlength="3" style="${inputStyle}">
                </div>
            </div>`;
    }

    detailsContainer.innerHTML = fieldsHtml;

    detailsContainer.querySelectorAll('input').forEach(input => {
        input.onfocus = () => input.style.borderColor = '#1a1a1a';
        input.onblur = () => input.style.borderColor = '#f0f0f0';
    });
};

function openBookingModal(serviceName) {
    let modal = document.getElementById('booking-modal-overlay');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'booking-modal-overlay';
        modal.style.cssText = `
            display: none; position: fixed; z-index: 10000; left: 0; top: 0; 
            width: 100%; height: 100%; background: rgba(0,0,0,0.85);
            backdrop-filter: blur(10px); align-items: center; justify-content: center;
        `;
        document.body.appendChild(modal);
    }

    const today = new Date().toISOString().split('T')[0];

    const methods = [
        { id: 'Cash', icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>` },
        { id: 'M-Pesa', icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#43a047"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/><circle cx="12" cy="17" r="1"/></svg>` },
        { id: 'PayPal', icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#003087"><path d="M20.067 8.478c.492.29.84.846.84 1.488 0 1.25-.97 2.264-2.167 2.264h-1.482l-.442 2.783-.024.15h-2.112l1.01-6.364.024-.15h3.406c.35 0 .684.062.947.179zm-4.782-3.125l-.18.91h2.246c1.196 0 2.167 1.014 2.167 2.264 0 .61-.24 1.162-.628 1.573l-.01.01a2.152 2.152 0 0 1-1.529.68h-3.406l-.744 4.685-.024.15h-2.111l1.452-9.136.024-.15h2.944z"/></svg>` },
        { id: 'Apple Pay', icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#000000"><path d="M17.05 20.28c-.96.95-2.04 1.72-3.23 2.3-1.2.58-2.43.87-3.7.87-1.4 0-2.6-.33-3.6-.98-1-.65-1.78-1.54-2.33-2.67-.55-1.13-.83-2.42-.83-3.87 0-1.6.35-3.03 1.05-4.28.7-1.25 1.66-2.22 2.87-2.9 1.22-.68 2.58-1.03 4.1-1.03 1.1 0 2.1.2 3 .6.9.4 1.6 1 2.1 1.8.1.13.1.28 0 .4l-.7.88c-.1.1-.23.15-.36.15zM12.03 7.25c-.25 0-.48-.05-.7-.15-.13-.06-.2-.2-.17-.35l1.05-4.17c.04-.15.18-.25.33-.25z"/></svg>` },
        { id: 'Credit/Debit Card', icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#37474f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>` }
    ];

    let paymentCardsHtml = `<div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 25px;">`;
    methods.forEach(m => {
        const isDefault = m.id === 'Cash';
        paymentCardsHtml += `
            <div class="payment-card" onclick="selectPaymentMethod('${m.id}', this)" 
                 style="cursor: pointer; display: flex; align-items: center; gap: 15px; padding: 14px 20px; border: 2px solid ${isDefault ? '#1a1a1a' : '#eee'}; border-radius: 16px; transition: all 0.2s ease; background: ${isDefault ? '#f9f9f9' : '#fff'};">
                <div style="width: 32px; height: 32px; display: flex; justify-content: center; align-items: center;">${m.icon}</div>
                <div style="font-size: 15px; font-weight: 700; color: #333;">${m.id}</div>
            </div>
        `;
    });
    paymentCardsHtml += `</div><input type="hidden" id="modal-payment-method" value="Cash">`;

    modal.innerHTML = `
        <div style="background: #fff; border-radius: 30px; width: 95%; max-width: 550px; position: relative; color: #1a1a1a; box-shadow: 0 30px 60px rgba(0,0,0,0.3); font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; overflow: hidden;">
            <button onclick="closeBookingModal()" style="position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 32px; font-weight: 300; color: #aaa; cursor: pointer; z-index: 1000; line-height: 1;">&times;</button>
            <div style="padding: 35px; max-height: 85vh; overflow-y: auto; scrollbar-width: thin;">
                <h2 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Confirm Reservation</h2>
            <p style="color: #777; margin-bottom: 30px; font-size: 16px;">You are booking: <strong style="color: #1a1a1a;">${serviceName}</strong></p>
            
            <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 25px;">
                <div>
                    <label style="display: block; font-weight: 700; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; color: #aaa;">Check-in</label>
                    <input type="date" id="modal-checkin" min="${today}" style="width: 100%; padding: 14px; border: 2px solid #f0f0f0; border-radius: 14px; font-size: 15px; font-weight: 600; background: #fafafa; outline: none; transition: border-color 0.2s;">
                </div>
                <div>
                    <label style="display: block; font-weight: 700; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; color: #aaa;">Check-out</label>
                    <input type="date" id="modal-checkout" min="${today}" style="width: 100%; padding: 14px; border: 2px solid #f0f0f0; border-radius: 14px; font-size: 15px; font-weight: 600; background: #fafafa; outline: none; transition: border-color 0.2s;">
                </div>
            </div>

            <label style="display: block; font-weight: 700; margin-bottom: 12px; font-size: 13px; text-transform: uppercase; color: #aaa;">Payment Method</label>
            ${paymentCardsHtml}

            <div id="payment-details-fields"></div>

            <div style="display: flex; gap: 12px; margin-top: 5px;">
                <button onclick="closeBookingModal()" style="flex: 1; padding: 16px; border: none; background: #f0f0f0; color: #555; border-radius: 16px; cursor: pointer; font-weight: 700; font-size: 15px;">Cancel</button>
                <button onclick="submitBookingForm()" style="flex: 2; padding: 16px; border: none; background: #1a1a1a; color: #fff; border-radius: 16px; cursor: pointer; font-weight: 700; font-size: 15px;">Confirm Booking</button>
            </div>
            </div>
        </div>
    `;
    modal.style.display = "flex";
    
    // Add focus effects to inputs
    const inputs = modal.querySelectorAll('input[type="date"]');
    inputs.forEach(input => {
        input.onfocus = () => input.style.borderColor = '#1a1a1a';
        input.onblur = () => input.style.borderColor = '#f0f0f0';
    });
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal-overlay');
    if (modal) modal.style.display = "none";
    activeBooking = null;
}

function submitBookingForm() {
    const checkin = document.getElementById("modal-checkin").value;
    const checkout = document.getElementById("modal-checkout").value;
    const paymentMethod = document.getElementById("modal-payment-method").value;

    if (!checkin || !checkout) {
        alert("Please select both check-in and check-out dates.");
        return;
    }

    if (new Date(checkout) <= new Date(checkin)) {
        alert("Check-out date must be after check-in date.");
        return;
    }

    const { service, amount, paymentType, currentUser } = activeBooking;
    const baseAmount = parseFloat(amount);
    let balance = 0;
    let paidNow = baseAmount;
    let displayPaymentType = paymentType;

    if (paymentType === "Deposit") {
        balance = baseAmount * 0.5;
        paidNow = baseAmount * 0.5;
    } else {
        displayPaymentType = "Full Amount";
    }

    // Collect payment details
    let paymentDetail = "";
    if (paymentMethod === 'M-Pesa') paymentDetail = document.getElementById('pay-detail-phone')?.value;
    else if (paymentMethod === 'PayPal') paymentDetail = document.getElementById('pay-detail-email')?.value;
    else if (paymentMethod === 'Apple Pay') paymentDetail = document.getElementById('pay-detail-apple')?.value;
    else if (paymentMethod === 'Credit/Debit Card') {
        const card = document.getElementById('pay-detail-card-num')?.value;
        if (card) paymentDetail = "Card ending in " + card.slice(-4);
    }

    if (paymentMethod !== 'Cash' && !paymentDetail) {
        alert(`Please provide your ${paymentMethod} details.`);
        return;
    }

    const bookingDetails = {
        guest_name: currentUser.name,
        room_type: service,
        checkin: checkin,
        checkout: checkout,
        payment_method: paymentMethod,
        payment_details: paymentDetail,
        payment_type: displayPaymentType,
        amount: paidNow.toFixed(2),
        balance: balance.toFixed(2)
    };

    if (paymentMethod === 'M-Pesa') {
        // Simulate the STK Push experience
        alert(`STK Push Sent!\n\nPlease check your phone (${paymentDetail}) and enter your M-Pesa PIN to authorize the payment of $${paidNow.toFixed(2)}.`);
        
        // Simulate a delay for the user to enter their PIN and the network to process
        setTimeout(() => {
            console.log("Booking Processed (M-Pesa Simulation):", bookingDetails);
            alert(`Payment Verified!\n\nSuccess! Booking for ${service} confirmed.\n\nGuest: ${currentUser.name}\nCheck-in: ${checkin}\nAmount Paid: $${paidNow.toFixed(2)}\nPayment via: ${paymentMethod}`);
            closeBookingModal();
        }, 2500);
        return;
    }

    console.log("Booking Processed (Frontend Only):", bookingDetails);
    alert(`Success! Booking for ${service} confirmed.\n\nGuest: ${currentUser.name}\nCheck-in: ${checkin}\nAmount Paid: $${paidNow.toFixed(2)}\nPayment via: ${paymentMethod}`);
    
    closeBookingModal();
}

// --- 4. ADMIN PORTAL LOGIC ---

function toggleAdminAuth() {
    document.getElementById('admin-sliding-box').classList.toggle('slide-active');
}

function adminLogin(event) {
    event.preventDefault();
    const roleSelect = document.getElementById('admin-role');
    if (!roleSelect) return;

    const role = roleSelect.value;

    if(document.getElementById('admin-auth')) document.getElementById('admin-auth').style.display = 'none';
    if(document.getElementById('admin-dashboard')) document.getElementById('admin-dashboard').style.display = 'block';

    if(document.getElementById('admin-welcome-text')) {
        document.getElementById('admin-welcome-text').innerText = `Hi, Manager`;
    }
    if(document.getElementById('admin-dept-tag')) {
        document.getElementById('admin-dept-tag').innerText = role.charAt(0).toUpperCase() + role.slice(1) + " Department";
    }

    setupAdminDashboard(role);

    if (role === 'hotel') {
        loadHotelBookings();
    }
}

function adminRegister(event) {
    event.preventDefault();
    alert("Admin Account Created! You can now enter the portal.");
    toggleAdminAuth();
}

// FIX: Added missing adminLogout function
function adminLogout(event) {
    if (event) event.preventDefault();

    // Clear any admin session data
    localStorage.removeItem("adminUser");

    // Reload to return to login screen
    location.reload();
}

function setupAdminDashboard(role) {
    const tabs = ['bookings', 'reviews', 'checkout', 'premium-travels', 'resort-activities', 'restaurant', 'spa', 'events', 'dashboard-home'];
    tabs.forEach(t => {
        const pane = document.getElementById(t + '-tab');
        const btn = document.getElementById('sidebar-' + t);
        if (pane) pane.style.display = 'none';
        if (btn) btn.style.display = 'none';
    });

    document.getElementById('dashboard-home-tab').style.display = 'block';
    document.getElementById('sidebar-reviews').style.display = 'block';

    if (role === 'hotel') {
        document.getElementById('sidebar-bookings').style.display = 'block';
        document.getElementById('sidebar-checkout').style.display = 'block';
    } else if (role === 'travels') {
        document.getElementById('sidebar-premium-travels').style.display = 'block';
        document.getElementById('sidebar-resort-activities').style.display = 'block';
    } else {
        const deptBtn = document.getElementById('sidebar-' + role);
        if (deptBtn) deptBtn.style.display = 'block';
    }
}

function showAdminTab(tabName) {
    const tabs = ['bookings-tab', 'reviews-tab', 'checkout-tab', 'premium-travels-tab', 'resort-activities-tab', 'dashboard-home-tab', 'restaurant-tab', 'spa-tab', 'events-tab'];
    tabs.forEach(t => {
        const el = document.getElementById(t);
        if (el) el.style.display = (t === tabName + '-tab') ? 'block' : 'none';
    });
}

// FIX: processBooking now actually updates the database via AJAX
function processBooking(id, action, amount, paymentType) {
    const depositLimit = 100;
    const numericAmount = parseFloat(amount);

    if (action === 'accept') {
        if (paymentType === 'Deposit' && numericAmount < depositLimit) {
            alert(`Rejected: ID ${id} deposit $${amount} is below the $${depositLimit} limit.`);
            return;
        }

        alert(`Booking ID ${id} Approved! (Demo Mode)`);
    } else {
        alert(`Booking ID ${id} Rejected. (Demo Mode)`);
    }
    
    // Refreshing the list would normally happen here, but since the backend is gone,
    // we just leave the current UI as is.
}

function loadHotelBookings() {
    const container = document.getElementById("hotel-booking-list");
    if (!container) return;

    // Backend removed: Placeholder message for the admin table
    container.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#666;">Backend connection removed. Live bookings are currently unavailable.</td></tr>';
}

function toggleProfileDropdown() {
    document.getElementById("admin-profile-dropdown").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('#admin-profile-icon')) {
    var dropdowns = document.getElementsByClassName("admin-profile-dropdown");
    for (var i = 0; i < dropdowns.length; i++) {
      if (dropdowns[i].classList.contains('show')) dropdowns[i].classList.remove('show');
    }
  }
}