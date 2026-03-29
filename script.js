/* ===============================
   JSONBIN CONFIGURATION
================================ */

// Control Bin (5 Features) - Read-only with Access Key
const CONTROL_BIN_ID = "698c99b9d0ea881f40b26a64";
const CONTROL_BIN_URL = `https://api.jsonbin.io/v3/b/${CONTROL_BIN_ID}`;
const CONTROL_ACCESS_KEY = "$2a$10$mulAbkg2NEqA77Iqrbkudu8wFctyEsNc/ymoso4qQgj62nkOZ8g5i";

// Notification Bin - Read-only with Access Key
const NOTI_BIN_ID = "697ef620d0ea881f4098264a";
const NOTI_BIN_URL = `https://api.jsonbin.io/v3/b/${NOTI_BIN_ID}/latest`;
const NOTI_ACCESS_KEY = "$2a$10$BfDO2ttFllKUpqSPoP3S.u./sQSib4MUGBmBp/kRWW9BSGzwhi9nO";

/* ===============================
   DOM ELEMENTS
================================ */

const currentDateElement = document.getElementById('currentDate');
const currentTimeElement = document.getElementById('currentTime');
const packageCards = document.querySelectorAll('.package-card');
const selectedItemsElement = document.getElementById('selectedItems');
const totalAmountElement = document.getElementById('totalAmount');
const confirmBtn = document.getElementById('confirmBtn');
const paymentSection = document.getElementById('paymentSection');
const sessionText = document.getElementById('sessionText');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileDropdown = document.getElementById('mobileDropdown');

// Notification DOM elements - CORRECTED to match HTML
const bellEl = document.querySelector(".bell");
const box = document.getElementById("notiBox");
const list = document.getElementById("notiList");
const badge = document.getElementById("notiCount");
const sound = document.getElementById("notiSound");
const clearBtn = document.getElementById("clearAllBtn");

/* ===============================
   PACKAGE DATA
================================ */

const packages = [
    { id: 1, name: "2 hot keys", price: 5000 },
    { id: 2, name: "1 hot key", price: 10000 },
    { id: 3, name: "8 pairs", price: 15000 }
];

let selectedPackages = [];

/* ===============================
   DATE & TIME FUNCTIONS
================================ */

function updateDateTime() {
    const now = new Date();
    
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    if (currentDateElement) {
        currentDateElement.textContent = `${day}.${month}.${year}`;
    }
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[now.getDay()];
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    if (currentTimeElement) {
        currentTimeElement.textContent = `${dayName} - ${hours}:${minutes}:${seconds} s`;
    }
}

/* ===============================
   SESSION DETECTION
================================ */

function getSessionType() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    if (currentHour === 0 && currentMinute >= 1) return 'morning';
    if (currentHour >= 1 && currentHour < 12) return 'morning';
    if (currentHour === 12 && currentMinute <= 2) return 'morning';
    return 'evening';
}

function updateSessionEmojis() {
    const isMorning = getSessionType() === 'morning';
    
    if (isMorning) {
        document.body.classList.remove('evening-session');
        document.body.classList.add('morning-session');
    } else {
        document.body.classList.remove('morning-session');
        document.body.classList.add('evening-session');
    }
}

/* ===============================
   FEATURE 1: VIP PACKAGE STATUS (FROM JSONBIN)
================================ */

async function fetchControlData() {
    try {
        const response = await fetch(`${CONTROL_BIN_URL}/latest`, {
            headers: { "X-Access-Key": CONTROL_ACCESS_KEY }
        });
        const json = await response.json();
        return json.record;
    } catch (error) {
        console.error("❌ Control Fetch Error:", error);
        return null;
    }
}

async function saveControlData(data) {
    try {
        await fetch(CONTROL_BIN_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": "$2a$10$r6dtpFgoPrqaY.WI7VQspeP1c7R7Xs68OBG57QOmj2bL1.CR0llBa"
            },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error('Error saving control data:', error);
    }
}

async function applyVIPStatus() {
    const data = await fetchControlData();
    if (!data || !data.vip) return;

    document.querySelectorAll(".package-card").forEach(card => {
        const id = card.dataset.id;
        const overlay = card.querySelector(".unavailable-overlay");
        const checkmark = card.querySelector('.checkmark');
        const wasSelected = checkmark.classList.contains('selected');

        if (data.vip[id] === false) {
            card.style.pointerEvents = "none";
            card.style.opacity = "0.4";
            if (overlay) overlay.style.display = "flex";
            
            if (wasSelected) {
                checkmark.classList.remove('selected');
                card.classList.remove('selected');
                selectedPackages = selectedPackages.filter(p => p.id !== parseInt(id));
                updateSelectionSummary();
            }
        } else {
            card.style.pointerEvents = "auto";
            card.style.opacity = "1";
            if (overlay) overlay.style.display = "none";
        }
    });
}

/* ===============================
   FEATURE 2: NUMBERS AVAILABILITY (SEPARATE)
================================ */

function applyNumbersAvailability(data) {
    if (!data || !data.numbers) return;
    
    const keyContainer = document.querySelector('.key-display-container');
    const numbersContainer = document.querySelector('.number-sequence-container');
    const keyNotAvailable = document.querySelector('.key-not-available');
    const numbersNotAvailable = document.querySelector('.numbers-not-available');
    const keyDisplay = document.querySelector('.key-display');
    const numberSequence = document.querySelector('.number-sequence');
    
    if (data.numbers.keysAvailable !== undefined) {
        if (data.numbers.keysAvailable) {
            if (keyContainer) keyContainer.classList.remove('not-available');
            if (keyNotAvailable) keyNotAvailable.style.display = 'none';
            if (keyDisplay) keyDisplay.style.display = 'flex';
            loadKeysFromStorage();
        } else {
            if (keyContainer) keyContainer.classList.add('not-available');
            if (keyNotAvailable) keyNotAvailable.style.display = 'flex';
            if (keyDisplay) keyDisplay.style.display = 'none';
            const keyMsg = keyNotAvailable?.querySelector('.not-available-text');
            if (keyMsg) keyMsg.textContent = 'Available soon . . .';
        }
    }
    
    if (data.numbers.pairsAvailable !== undefined) {
        if (data.numbers.pairsAvailable) {
            if (numbersContainer) numbersContainer.classList.remove('not-available');
            if (numbersNotAvailable) numbersNotAvailable.style.display = 'none';
            if (numberSequence) numberSequence.style.display = 'block';
            loadNumbersFromStorage();
        } else {
            if (numbersContainer) numbersContainer.classList.add('not-available');
            if (numbersNotAvailable) numbersNotAvailable.style.display = 'flex';
            if (numberSequence) numberSequence.style.display = 'none';
            const sessionType = getSessionType();
            const pairsMsg = numbersNotAvailable?.querySelector('.not-available-text');
            if (pairsMsg) {
                pairsMsg.textContent = `Not available for this ${sessionType}`;
            }
        }
    }
}

function loadKeysFromStorage() {
    const savedKeys = localStorage.getItem('2d_keys_data');
    const savedActiveKeys = localStorage.getItem('2d_active_keys');
    
    if (savedKeys) {
        try {
            const keys = JSON.parse(savedKeys);
            const activeKeys = savedActiveKeys ? JSON.parse(savedActiveKeys) : [true, true, true, true];
            
            document.querySelectorAll('.key-digit').forEach((el, i) => {
                if (i < keys.length) {
                    if (activeKeys[i]) {
                        el.textContent = keys[i];
                        el.style.color = '#fff';
                        el.style.opacity = '1';
                    } else {
                        el.textContent = '?';
                        el.style.color = '#aaa';
                        el.style.opacity = '0.7';
                    }
                }
            });
        } catch (e) {}
    }
}

function loadNumbersFromStorage() {
    const savedNumbers = localStorage.getItem('2d_numbers_data');
    if (savedNumbers) {
        try {
            const numberRows = JSON.parse(savedNumbers);
            document.querySelectorAll('.number-row').forEach((el, i) => {
                if (i < numberRows.length) {
                    el.textContent = numberRows[i];
                }
            });
        } catch (e) {}
    }
}

/* ===============================
   FEATURE 3: CODES (UPGRADED)
================================ */

function applyCodes(data) {
    if (!data || !data.codes) return;
    
    const morningEl = document.querySelector('.morning-code');
    const eveningEl = document.querySelector('.evening-code');
    
    if (morningEl && data.codes.morning !== undefined) {
        morningEl.textContent = data.codes.morning;
        localStorage.setItem('2d_morning_code', data.codes.morning);
    }
    
    if (eveningEl && data.codes.evening !== undefined) {
        eveningEl.textContent = data.codes.evening;
        localStorage.setItem('2d_evening_code', data.codes.evening);
    }
}

/* ===============================
   AUTO CODE RESET SYSTEM (UPGRADED)
================================ */

class AutoCodeReset {
    constructor() {
        this.morningCodeKey = '2d_morning_code';
        this.eveningCodeKey = '2d_evening_code';
        this.lastResetDateKey = '2d_last_reset_date';
        this.init();
    }
    
    init() {
        console.log('🔄 Auto Code Reset System Initializing...');
        setInterval(() => this.checkAndReset(), 60000);
        this.checkAndReset();
    }
    
    checkAndReset() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentDate = now.toDateString();
        const lastResetDate = localStorage.getItem(this.lastResetDateKey);
        
        const isAfterNoon = (currentHour > 12) || (currentHour === 12 && currentMinute > 2);
        const isAfterMidnight = (currentHour === 0 && currentMinute >= 0);
        
        if ((currentDate !== lastResetDate) || (isAfterNoon && lastResetDate !== currentDate)) {
            this.resetCodesForSession();
            localStorage.setItem(this.lastResetDateKey, currentDate);
        }
    }
    
    async resetCodesForSession() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        const isAfterNoon = (currentHour > 12) || (currentHour === 12 && currentMinute > 2);
        const isAfterMidnight = (currentHour === 0 && currentMinute >= 0);
        
        try {
            const data = await fetchControlData();
            if (!data || !data.codes) return;
            
            let updated = false;
            
            if (isAfterNoon && data.codes.morning !== '--') {
                data.codes.morning = '--';
                updated = true;
            }
            
            if (isAfterMidnight) {
                if (data.codes.morning !== '--') {
                    data.codes.morning = '--';
                    updated = true;
                }
                if (data.codes.evening !== '--') {
                    data.codes.evening = '--';
                    updated = true;
                }
            }
            
            if (updated) {
                await saveControlData(data);
                
                localStorage.setItem('2d_morning_code', data.codes.morning);
                localStorage.setItem('2d_evening_code', data.codes.evening);
                
                const morningEl = document.querySelector('.morning-code');
                const eveningEl = document.querySelector('.evening-code');
                
                if (morningEl) morningEl.textContent = data.codes.morning;
                if (eveningEl) eveningEl.textContent = data.codes.evening;
                
                this.showResetNotification();
            }
            
        } catch (error) {
            console.error('Error resetting codes:', error);
        }
    }
    
    showResetNotification() {
        const notification = document.createElement('div');
        notification.className = 'reset-notification';
        notification.innerHTML = `
            <i class="fas fa-sync-alt"></i>
            <span>Codes auto-reset for next session</span>
        `;
        
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#00d4ff',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '10px',
            zIndex: '9999',
            animation: 'slideInUp 0.5s ease',
            boxShadow: '0 5px 15px rgba(0, 212, 255, 0.3)'
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideInUp 0.5s ease reverse forwards';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}

/* ===============================
   FEATURE 4: KEYS DISPLAY (FIXED)
================================ */

function applyKeysDisplay(data) {
    if (!data || !data.keys) return;
    
    const enabled = data.keys.enabled;
    const keyDigits = document.querySelectorAll('.key-digit');
    
    if (enabled) {
        // Show actual keys from localStorage OR from JSONBin
        if (data.keys.values) {
            // Use values from JSONBin
            const values = data.keys.values;
            const active = data.keys.active || [true, true, true, true];
            
            keyDigits.forEach((el, i) => {
                if (i < values.length) {
                    if (active[i]) {
                        el.textContent = values[i];
                        el.style.color = '#fff';
                        el.style.opacity = '1';
                    } else {
                        el.textContent = '?';
                        el.style.color = '#aaa';
                        el.style.opacity = '0.7';
                    }
                }
            });
            
            // Save to localStorage for backup
            localStorage.setItem('2d_keys_data', JSON.stringify(values));
            localStorage.setItem('2d_active_keys', JSON.stringify(active));
        } else {
            // Fallback to localStorage
            loadKeysFromStorage();
        }
    } else {
        // Keys are disabled - show all as "?"
        keyDigits.forEach(el => {
            el.textContent = '?';
            el.style.color = '#aaa';
            el.style.opacity = '0.5';
        });
    }
}

/* ===============================
   FEATURE 5: CLOSING SYSTEM
================================ */

let globalClosingConfig = null;

async function loadGlobalClosingConfig() {
    try {
        const res = await fetch(`${CONTROL_BIN_URL}/latest`, {
            headers: { "X-Access-Key": CONTROL_ACCESS_KEY }
        });
        const data = await res.json();
        if (!data.record || !data.record.closing) {
            console.warn("Closing config missing");
            return;
        }
        globalClosingConfig = data.record.closing;
        applyClosingState();
    } catch (err) {
        console.error("Closing load error:", err);
    }
}

function applyClosingState() {
    if (!globalClosingConfig) return;

    const today = new Date();
    const day = today.getDay();
    const todayStr = today.toISOString().split("T")[0];

    let isClosed = false;

    if (globalClosingConfig.forceToday === "closed") {
        isClosed = true;
    } else if (globalClosingConfig.forceToday === "open") {
        isClosed = false;
    } else {
        if (globalClosingConfig.weeklyClosedDays && globalClosingConfig.weeklyClosedDays.includes(day)) {
            isClosed = true;
        }
        if (globalClosingConfig.specialClosedDates && globalClosingConfig.specialClosedDates.includes(todayStr)) {
            isClosed = true;
        }
    }

    toggleClosedSections(isClosed);
}

function toggleClosedSections(isClosed) {
    const giftSection = document.getElementById('giftSection');
    const packagesSection = document.getElementById('packagesSection');
    const upperGiftTitle = document.querySelector('.upper-gift-title');
    const upperVipTitle = document.querySelector('.upper-vip-title');
    const morningEl = document.querySelector('.morning-code');
    const eveningEl = document.querySelector('.evening-code');
    
    if (isClosed) {
        document.body.classList.add('closed-day');
        
        if (giftSection) giftSection.classList.add('closed');
        if (packagesSection) packagesSection.classList.add('closed');
        
        document.querySelectorAll('.section-closed').forEach(el => el.classList.add('show'));
        document.querySelectorAll('.section-content').forEach(el => el.style.display = 'none');
        
        if (upperGiftTitle) upperGiftTitle.style.display = 'block';
        if (upperVipTitle) upperVipTitle.style.display = 'block';
        
        if (sessionText) {
            sessionText.setAttribute('data-translate', 'today-2d-closed');
            if (window.languageTranslator) {
                sessionText.textContent = window.languageTranslator.translations[window.languageTranslator.currentLang]['today-2d-closed'];
            } else {
                sessionText.textContent = 'TODAY 2D CLOSED';
            }
            sessionText.style.color = '#ff6b6b';
        }
        
        if (morningEl) {
            morningEl.textContent = '--';
            morningEl.style.color = '#ddff46';
        }
        if (eveningEl) {
            eveningEl.textContent = '--';
            eveningEl.style.color = '#ddff46';
        }
        
    } else {
        document.body.classList.remove('closed-day');
        
        if (giftSection) giftSection.classList.remove('closed');
        if (packagesSection) packagesSection.classList.remove('closed');
        
        document.querySelectorAll('.section-closed').forEach(el => el.classList.remove('show'));
        document.querySelectorAll('.section-content').forEach(el => el.style.display = 'block');
        
        if (upperGiftTitle) upperGiftTitle.style.display = 'none';
        if (upperVipTitle) upperVipTitle.style.display = 'none';
        
        const sessionType = getSessionType();
        if (sessionText) {
            if (sessionType === 'morning') {
                sessionText.setAttribute('data-translate', 'morning-session');
                if (window.languageTranslator) {
                    sessionText.textContent = window.languageTranslator.translations[window.languageTranslator.currentLang]['morning-session'];
                } else {
                    sessionText.textContent = 'Morning session';
                }
                sessionText.style.color = '#4ecdc4';
            } else {
                sessionText.setAttribute('data-translate', 'evening-session');
                if (window.languageTranslator) {
                    sessionText.textContent = window.languageTranslator.translations[window.languageTranslator.currentLang]['evening-session'];
                } else {
                    sessionText.textContent = 'Evening session';
                }
                sessionText.style.color = '#ffffff';
            }
        }
        
        const savedMorning = localStorage.getItem('2d_morning_code') || '2 4';
        const savedEvening = localStorage.getItem('2d_evening_code') || '3 4';
        
        if (morningEl) {
            morningEl.textContent = savedMorning;
            morningEl.style.color = '#ffd700';
        }
        if (eveningEl) {
            eveningEl.textContent = savedEvening;
            eveningEl.style.color = '#ffd700';
        }
    }
}

/* ===============================
   POLL CONTROL BIN FOR ALL FEATURES
================================ */

async function pollControlData() {
    try {
        const data = await fetchControlData();
        if (!data) return;
        
        await applyVIPStatus();
        
        if (data && data.numbers) {
            applyNumbersAvailability(data);
        }
        if (data && data.codes) {
            applyCodes(data);
        }
        if (data && data.keys) {
            applyKeysDisplay(data);
        }
        if (data && data.closing) {
            globalClosingConfig = data.closing;
            applyClosingState();
        }
        
    } catch (error) {
        console.error('Poll Error:', error);
    }
}

/* ===============================
   NOTIFICATION SYSTEM - FIXED WITH OVERLAP PREVENTION
================================ */

let lastAutoShownTime = Number(localStorage.getItem("lastAutoShownTime") || 0);
let dismissed = JSON.parse(localStorage.getItem("dismissedNoti") || "[]");
let clearedAt = Number(localStorage.getItem("clearedAt") || 0);
let lastSeenTime = Number(localStorage.getItem("lastSeenTime") || 0);
let autoCloseTimer = null;
let shakeInterval = null;
let shakeTimeout = null;
let bellOpened = false;

function startBellShakeLoop() {
    if (shakeInterval || bellOpened || !bellEl) return;
    
    function shakeOnce() {
        if (bellOpened) return;
        bellEl.classList.add("shake");
        shakeTimeout = setTimeout(() => bellEl.classList.remove("shake"), 4000);
    }
    
    shakeOnce();
    shakeInterval = setInterval(shakeOnce, 14000);
}

function stopBellShakeLoop() {
    if (bellEl) bellEl.classList.remove("shake");
    clearInterval(shakeInterval);
    clearTimeout(shakeTimeout);
    shakeInterval = null;
}

function toggleNoti() {
    if (!box) return;
    
    // Close mobile dropdown if open
    if (mobileDropdown && mobileDropdown.classList.contains('show')) {
        mobileDropdown.classList.remove('show');
        const icon = mobileMenuBtn?.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
    }
    
    box.classList.toggle("show");
    
    if (box.classList.contains("show")) {
        bellOpened = true;
        stopBellShakeLoop();
        if (badge) badge.style.display = "none";
        localStorage.setItem("lastSeenTime", Date.now());
        lastSeenTime = Date.now();
    } else {
        bellOpened = false;
    }
}

function dismiss(id) {
    dismissed.push(id);
    localStorage.setItem("dismissedNoti", JSON.stringify(dismissed));
    loadNotifications();
}

function clearAll() {
    clearedAt = Date.now();
    localStorage.setItem("clearedAt", clearedAt);
    if (list) list.innerHTML = "";
    if (badge) badge.style.display = "none";
    if (clearBtn) clearBtn.style.display = "none";
}

function timeText(ts) {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function isExpired(ts) {
    const d = new Date(ts);
    return d.getHours() >= 22;
}

async function loadNotifications() {
    try {
        const res = await fetch(NOTI_BIN_URL, {
            headers: { "X-Access-Key": NOTI_ACCESS_KEY }
        });
        
        const json = await res.json();
        let items = json.record.notifications || [];
        
        items = items.reverse();
        items = items.filter(n => !dismissed.includes(n.id) && n.time > clearedAt && !isExpired(n.time));
        items = items.slice(0, 5);
        
        const newest = items[0];
        const hasNew = newest && newest.time > lastSeenTime && newest.time > lastAutoShownTime;
        
        if (hasNew && !bellOpened) {
            startBellShakeLoop();
            if (sound) {
                sound.currentTime = 0;
                sound.play().catch(() => {});
            }
            
            if (box) {
                box.classList.add("show");
                clearTimeout(autoCloseTimer);
                autoCloseTimer = setTimeout(() => {
                    box.classList.remove("show");
                    bellOpened = false;
                }, 4000);
            }
            
            if (badge) {
                badge.style.display = "flex";
                badge.innerText = items.length;
            }
            
            localStorage.setItem("lastAutoShownTime", newest.time);
            lastAutoShownTime = newest.time;
        }
        
        if (list) {
            list.innerHTML = "";
            
            if (items.length === 0) {
                list.innerHTML = '<div class="no-notifications" style="text-align:center; padding:20px; color: black;">No notifications</div>';
            } else {
                items.forEach(n => {
                    const div = document.createElement("div");
                    div.className = "noti-item";
                    div.innerHTML = `
                        <span class="noti-text">${n.text}</span>
                        <small class="noti-time">${timeText(n.time)}</small>
                        <button class="noti-close" onclick="dismiss('${n.id}')">✖</button>
                    `;
                    list.appendChild(div);
                });
            }
        }
        
        if (clearBtn) clearBtn.style.display = items.length > 2 ? "block" : "none";
        
    } catch (error) {
        console.error('Notification Error:', error);
    }
}

/* ===============================
   PACKAGE SELECTION SYSTEM
================================ */

function initPackageSelection() {
    packageCards.forEach(card => {
        card.addEventListener('click', function() {
            if (this.classList.contains('unavailable') || document.body.classList.contains('closed-day')) {
                return;
            }
            
            const packageId = parseInt(this.getAttribute('data-id'));
            const packageData = packages.find(p => p.id === packageId);
            
            if (!packageData) return;
            
            const checkmark = this.querySelector('.checkmark');
            const isSelected = checkmark.classList.contains('selected');
            
            if (isSelected) {
                checkmark.classList.remove('selected');
                this.classList.remove('selected');
                selectedPackages = selectedPackages.filter(p => p.id !== packageId);
            } else {
                checkmark.classList.add('selected');
                this.classList.add('selected');
                selectedPackages.push({
                    id: packageId,
                    name: packageData.name,
                    price: packageData.price
                });
            }
            
            updateSelectionSummary();
        });
    });
}

function updateSelectionSummary() {
    if (selectedPackages.length === 0) {
        if (selectedItemsElement) {
            selectedItemsElement.textContent = "You haven't selected any package yet";
        }
        if (totalAmountElement) {
            totalAmountElement.textContent = "Total amount = 0 Ks";
        }
        if (confirmBtn) {
            confirmBtn.style.display = 'none';
            confirmBtn.classList.remove('show');
        }
        hidePaymentSection();
    } else {
        const total = selectedPackages.reduce((sum, pkg) => sum + pkg.price, 0);
        const itemsText = selectedPackages.map(pkg => pkg.name).join(' + ');
        
        if (selectedItemsElement) {
            selectedItemsElement.textContent = `You selected: ${itemsText}`;
        }
        if (totalAmountElement) {
            totalAmountElement.textContent = `Total amount = ${total.toLocaleString()} Ks`;
        }
        if (confirmBtn) {
            confirmBtn.style.display = 'block';
            confirmBtn.classList.add('show');
        }
        hidePaymentSection();
    }
}

function hidePaymentSection() {
    if (paymentSection) {
        paymentSection.classList.remove('show');
        paymentSection.style.display = 'none';
    }
}

function showPaymentSection() {
    if (paymentSection) {
        paymentSection.style.display = 'block';
        setTimeout(() => {
            paymentSection.classList.add('show');
        }, 10);
    }
}

/* ===============================
   PAYMENT SYSTEM
================================ */

function initPaymentSystem() {
    if (!confirmBtn || !paymentSection) return;
    
    confirmBtn.addEventListener('click', function() {
        if (selectedPackages.length === 0) {
            alert('Please select at least one VIP package!');
            return;
        }
        
        if (document.body.classList.contains('closed-day')) {
            alert('2D is closed today. Please come back tomorrow!');
            return;
        }
        
        showPaymentSection();
        paymentSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
}

/* ===============================
   MOBILE MENU - FIXED WITH OVERLAP PREVENTION
================================ */

function initMobileMenu() {
    if (!mobileMenuBtn || !mobileDropdown) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        // Close notification box if open
        if (box && box.classList.contains('show')) {
            box.classList.remove('show');
            bellOpened = false;
        }
        
        mobileDropdown.classList.toggle('show');
        
        const icon = this.querySelector('i');
        if (mobileDropdown.classList.contains('show')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
    
    document.addEventListener('click', function(e) {
        // Close mobile dropdown when clicking outside
        if (mobileDropdown.classList.contains('show') && 
            !mobileDropdown.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            mobileDropdown.classList.remove('show');
            mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
        }
        
        // Close notification box when clicking outside
        if (box && box.classList.contains('show') && 
            !box.contains(e.target) && 
            !bellEl?.contains(e.target)) {
            box.classList.remove('show');
            bellOpened = false;
        }
    });
    
    document.querySelectorAll('.mobile-menu-item, .mobile-menu-item1').forEach(item => {
        item.addEventListener('click', function() {
            mobileDropdown.classList.remove('show');
            mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
        });
    });
}

function handleWindowResize() {
    if (window.innerWidth > 768) {
        if (mobileDropdown && mobileDropdown.classList.contains('show')) {
            mobileDropdown.classList.remove('show');
        }
        if (mobileMenuBtn) {
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        }
    }
}

/* ===============================
   MOBILE TOOLTIPS
================================ */

function initMobileTooltips() {
    const navContainers = document.querySelectorAll('.nav-item-container');
    const mobileContainers = document.querySelectorAll('.mobile-menu-item-container');
    
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        navContainers.forEach(container => {
            let tapTimer;
            let isTapped = false;
            
            container.addEventListener('touchstart', function(e) {
                e.preventDefault();
                clearTimeout(tapTimer);
                navContainers.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                isTapped = true;
                
                tapTimer = setTimeout(() => {
                    this.classList.remove('active');
                    isTapped = false;
                }, 2000);
            });
            
            container.addEventListener('touchend', function(e) {
                if (isTapped) {
                    setTimeout(() => {
                        this.classList.remove('active');
                    }, 1000);
                }
            });
            
            document.addEventListener('touchstart', function(e) {
                if (!container.contains(e.target)) {
                    container.classList.remove('active');
                    clearTimeout(tapTimer);
                }
            });
        });
        
        mobileContainers.forEach(container => {
            let tapTimer;
            let isTapped = false;
            
            container.addEventListener('touchstart', function(e) {
                e.preventDefault();
                clearTimeout(tapTimer);
                mobileContainers.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                isTapped = true;
                
                tapTimer = setTimeout(() => {
                    this.classList.remove('active');
                    isTapped = false;
                }, 2000);
            });
            
            container.addEventListener('touchend', function(e) {
                if (isTapped) {
                    setTimeout(() => {
                        this.classList.remove('active');
                    }, 1000);
                }
            });
            
            document.addEventListener('touchstart', function(e) {
                if (!container.contains(e.target)) {
                    container.classList.remove('active');
                    clearTimeout(tapTimer);
                }
            });
        });
    }
}

/* ===============================
   NUMBERS UPDATE LISTENER
================================ */

function initNumbersUpdateListener() {
    window.addEventListener('numbersUpdated', function(e) {
        const data = e.detail;
        
        if (data.keys && data.activeKeys) {
            const keyDigits = document.querySelectorAll('.key-digit');
            data.keys.forEach((key, i) => {
                if (keyDigits[i]) {
                    if (data.activeKeys[i]) {
                        keyDigits[i].textContent = key;
                        keyDigits[i].style.color = '#fff';
                    } else {
                        keyDigits[i].textContent = '?';
                        keyDigits[i].style.color = '#aaa';
                    }
                }
            });
        }
        
        if (data.numberRows) {
            const numberRows = document.querySelectorAll('.number-row');
            data.numberRows.forEach((row, i) => {
                if (numberRows[i]) {
                    numberRows[i].textContent = row;
                }
            });
        }
    });
}

/* ===============================
   LANGUAGE TRANSLATOR
================================ */

class LanguageTranslator {
    constructor() {
        this.currentLang = 'en';
        this.translations = {
            en: {
                'app-name': '2D Lite',
                'download-app': 'Download App',
                'click-download': 'click to Download App', 
                'messenger': 'Messenger',  
                'viber': 'Viber 09269481221',
                'notifications': 'Notifications',
                'menu': 'Menu',
                'scan-to-chat': 'Scan to chat',
                'change-language': 'Change language',
                'language': 'Language',
                '2d-results': '2D results',
                'intro-text': ' The one trusted website where you can buy winning "2D lucky lottery numbers" online.',
                'morning-session': 'Morning session',
                'evening-session': 'Evening session',
                'today-2d-closed': 'TODAY 2D CLOSED',
                'closed': 'CLOSED 🔒',
                'closed-message': 'Come back in 2D opening days',
                'today-gift': 'Today Gift 🎁 ',
                'gift-for-you': 'Today Gift 🎁',
                'key-label': 'Key -',
                'keys': 'keys -',
                'R': '- R👈',
                'number-pairs': 'number pairs',
                'available-soon': 'Available soon . . .',
                'not-available-session': 'Not available for this morning',
                'motivation-text': 'Tired of searching for 2D lottery winning numbers? Stop searching!',
                'package-info': 'Choose your preferred package from the "VIP Packages" below and win the 2D lottery. 100% reliable. No scams.',
                'vip-packages': '2D VIP Packages 💎',
                '2-hot-keys': '2 hot keys',
                '1-hot-key': '1 hot key',
                '8-pairs': '8 pairs',
                'click-to-get':'click to get',
                'not-available': 'Not available',
                'you-havent-selected': 'You haven\'t selected any package yet',
                'you-selected': 'You selected:',
                'total-amount': 'Total amount =',
                'confirm-payment': 'Complete your payment first ',
                'and-get-vip': 'and we will instantly deliver your VIP 👇',
                'pay': 'pay with Kpay or WavePay',
                'wavepay-not-existed': 'WavePay account is not existed yet. But, you can transfer money using your ID and Password.',               
                'scan-to-pay': 'Scan to Pay',
                'important-instructions': 'Important Instructions:',
                'instruction-1': 'Please check the phone number carefully before transferring money.',
                'instruction-2': 'Your selected VIP package will be sent after the payment is confirmed.',
                'instruction-3': 'Send the payment screenshot via Facebook Messenger or Viber.',
                'business-note': '(This website was built for legitimate business purposes only. No scams or time-wasting intended.)',
                'copyright': '© 2025 2D Lite. All rights reserved. VIP Lottery Numbers Service.',
                'sunday': 'Sun',
                'monday': 'Mon',
                'tuesday': 'Tue',
                'wednesday': 'Wed',
                'thursday': 'Thu',
                'friday': 'Fri',
                'saturday': 'Sat',
            },
            my: {
                'app-name': '2D Lite',
                'download-app': 'အက်ပ်ဒေါင်းလုဒ်',
                'click-download': 'အက်ပ် ဒေါင်းလုဒ်',
                'messenger': 'မက်ဆင်ဂျာ',  
                'viber': 'ဘိုင်ဘာ 09269481221',
                'notifications': 'အသိပေးချက်များ',
                'menu': 'မီနူး',
                'scan-to-chat': 'စကင်ဖတ်ပြီးစကားပြောရန်',
                'change-language': 'ဘာသာစကားပြောင်းရန်',
                'language': 'ဘာသာစကား',
                '2d-results': '2D ရလဒ်များ',
                'intro-text': '" အောင်မြင်သည့် 2D ထီဂဏန်းများ" ကို အွန်လိုင်းမှ ဝယ်ယူရန် သင်ရဲ့ယုံကြည်စိတ်ချရသော တစ်ခုတည်းသော ဝက်ဘ်ဆိုက် "',
                'morning-session': 'မနက်ပိုင်း အကြိမ်',
                'evening-session': 'ညနေပိုင်း အကြိမ်',
                'today-2d-closed': 'ယနေ့ 2D ပိတ်သည်',
                'closed': 'ပိတ်သည် 🔒',
                'closed-message': '2D ဖွင့်ရက်မှ ပြန်လာခဲ့ပါ',
                'today-gift': 'ယနေ့ လက်ဆောင် 🎁',
                'key-label': 'ကီး -',
                'keys': 'ကီး -',
                'R': '- R ထိုးပါ👈',
                'number-pairs': 'ရွေးကွက်များ',
                'available-soon': 'မကြာမီရနိုင်မည် . . .',
                'not-available-session': 'ယနေ့မနက်ပိုင်းအတွက်မရနိုင်ပါ',
                'motivation-text': '2D ထီပေါက်ဖို့ ဂဏန်းရှာရတာ စိတ်ကုန်နေပြီလား။',
                'package-info': 'အောက်ပါ "VIP ပက်ကေ့ချ်" မှ မိမိနှစ်သက်ရာ တစ်ခုခုကို ဝယ်ယူပြီး 2D ထီ ကံထူးလိုက်ပါ။ 100 % စိတ်ချရသည်။ အလိမ်ညာမဟုတ်ပါ။',
                'vip-packages': '2D အထူးပက်ကေ့ချ်များ 💎 ',
                '2-hot-keys': 'ဟော့ကီး ၂ လုံး',
                '1-hot-key': 'အပိုင်ကီး ၁ လုံး',
                '8-pairs': 'ပေါက်ကွက် ၈ ကွက်',
                'click-to-get':'ယူရန်နှိပ်ပါ',
                'not-available': 'မရနိုင်ပါ',
                'you-havent-selected': 'သင် ပက်ကေ့ချ် မရွေးချယ်ရသေးပါ',
                'you-selected': 'သင် ရွေးချယ်ထားသည်:',
                'total-amount': 'စုစုပေါင်းငွေ =',
                'confirm-payment': 'ငွေပေးချေမှု ပြီးတာနဲ့',
                'and-get-vip': 'သင်ရွေးချယ်ထားသော 2D ဂဏန်းအား ချက်ချင်း ပို့ပေးပါမယ် 👇',
                'pay': 'Kpay သို့မဟုတ် WavePay ဖြင့် ငွေပေးချေနိုင်ပါသည်',
                'wavepay-not-existed': 'WavePay အကောင့်မတည်ရှိပါ။ သို့သော် ID နဲ့ password (စကားဝှက်) ကိုအသုံးပြု၍ ငွေလွှဲနိုင်ပါသည်။', 
                'scan-to-pay': 'ငွေပေးချေရန် စကင်ဖတ်ပါ',
                'important-instructions': 'အရေးကြီးညွှန်ကြားချက်များ:',
                'instruction-1': 'ငွေလွှဲမည့်ဖုန်းနံပါတ်ကိုသေချာစစ်ဆေးပါ။',
                'instruction-2': 'ငွေပေးချေမှုအတည်ပြုပြီးနောက် သင်၏ VIP အထူးပက်ကေ့ချ် ကို Facebook Messenger သို့မဟုတ် Viber မှ ပို့ပေးပါမည်။',
                'instruction-3': 'ငွေပေးချေမှုစခရင်ရှော့ကို Facebook Messenger သို့မဟုတ် Viber မှတစ်ဆင့်ပို့ပါ။',
                'business-note': '(ဤဝက်ဘ်ဆိုက်ကို နှစ်ဦးနှစ်ဖက်အကျိုးစီးပွားအတွက် တည်ဆောက်ထားခြင်းသာဖြစ်ပါသည်။ လိမ်လည်ခြင်း သို့မဟုတ် အချိန်ဖြုန်းခြင်းအတွက် မဟုတ်ပါ။)',
                'copyright': '© 2025 2D Lite. အခွင့်အရေးအားလုံးရှိသည်။ VIP ထီဂဏန်းဝန်ဆောင်မှု။',
                'sunday': 'တနင်္ဂနွေ',
                'monday': 'တနင်္လာ',
                'tuesday': 'အင်္ဂါ',
                'wednesday': 'ဗုဒ္ဓဟူး',
                'thursday': 'ကြာသပတေး',
                'friday': 'သောကြာ',
                'saturday': 'စနေ',
            }
        };
        this.init();
    }
    
    init() {
        this.loadSavedLanguage();
        this.setupEventListeners();
        this.applyTranslation();
    }
    
    loadSavedLanguage() {
        const savedLang = localStorage.getItem('2d_language');
        if (savedLang && (savedLang === 'en' || savedLang === 'my')) {
            this.currentLang = savedLang;
        }
    }
    
    saveLanguage() {
        localStorage.setItem('2d_language', this.currentLang);
    }
    
    setupEventListeners() {
        const langBtn = document.getElementById('languageBtn');
        const langDropdown = document.getElementById('languageDropdown');
        
        if (langBtn && langDropdown) {
            langBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                langDropdown.classList.toggle('show');
            });
            
            document.querySelectorAll('.lang-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    const lang = e.currentTarget.getAttribute('data-lang');
                    this.switchLanguage(lang);
                    langDropdown.classList.remove('show');
                });
            });
            
            document.addEventListener('click', (e) => {
                if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
                    langDropdown.classList.remove('show');
                }
            });
        }
        
        document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.currentTarget.getAttribute('data-lang');
                this.switchLanguage(lang);
            });
        });
    }
    
    switchLanguage(lang) {
        if (lang === this.currentLang) return;
        
        this.currentLang = lang;
        this.saveLanguage();
        this.applyTranslation();
        this.updateSessionText();
        
        document.body.classList.remove('lang-en', 'lang-my');
        document.body.classList.add(`lang-${this.currentLang}`);
        
        const notification = document.createElement('div');
        notification.className = 'language-notification';
        notification.innerHTML = `<i class="fas fa-language"></i><span>${lang === 'en' ? 'Language changed to English' : 'ဘာသာစကားကို မြန်မာဘာသာသို့ ပြောင်းလဲပြီး'}</span>`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
    
    applyTranslation() {
        Object.keys(this.translations[this.currentLang]).forEach(key => {
            const elements = document.querySelectorAll(`[data-translate="${key}"]`);
            elements.forEach(element => {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = this.translations[this.currentLang][key];
                } else {
                    element.textContent = this.translations[this.currentLang][key];
                }
            });
        });

        this.updateSessionText();
    }

    updateSessionText() {
        const sessionText = document.getElementById('sessionText');
        if (!sessionText) return;
        
        const translateKey = sessionText.getAttribute('data-translate');
        if (translateKey && this.translations[this.currentLang][translateKey]) {
            sessionText.textContent = this.translations[this.currentLang][translateKey];
        }
    }
}

/* ===============================
   INITIALIZATION
================================ */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 2D Plus Website Initializing...');
    
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    updateSessionEmojis();
    setInterval(updateSessionEmojis, 60000);
    
    initPackageSelection();
    initPaymentSystem();
    initMobileMenu();
    initMobileTooltips();
    initNumbersUpdateListener();
    
    // Initialize auto code reset
    const autoCodeReset = new AutoCodeReset();
    
    // Start polling for control data
    pollControlData();
    setInterval(pollControlData, 3000);
    
    // Load notifications immediately and then every 5 seconds
    loadNotifications();
    setInterval(loadNotifications, 5000);
    
    // Initialize language translator
    window.languageTranslator = new LanguageTranslator();
    
    window.addEventListener('resize', handleWindowResize);
    
    console.log('✅ 2D Plus Website Initialized Successfully!');
});

// Make functions globally available for HTML onclick
window.toggleNoti = toggleNoti;
window.dismiss = dismiss;
window.clearAll = clearAll;
