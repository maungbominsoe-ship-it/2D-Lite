// ===========================================
// 2D PLUS LOTTERY WEBSITE - COMPLETE SYSTEM
// ===========================================

// ===========================================
// DOM ELEMENTS
// ===========================================

// Date & Time
const currentDateElement = document.getElementById('currentDate');
const currentTimeElement = document.getElementById('currentTime');

// Notification System
const bellBtn = document.getElementById('bellBtn');
const notificationToggle = document.getElementById('notificationToggle');
const notifyToggle = document.getElementById('notifyToggle');
const toggleStatus = document.getElementById('toggleStatus');
const closeToggleBtn = notificationToggle ? notificationToggle.querySelector('.close-toggle') : null;

// Mobile Menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileDropdown = document.getElementById('mobileDropdown');

// VIP Packages System
const packageCards = document.querySelectorAll('.package-card');
const selectedItemsElement = document.getElementById('selectedItems');
const totalAmountElement = document.getElementById('totalAmount');
const confirmBtn = document.getElementById('confirmBtn');
const paymentSection = document.getElementById('paymentSection');

// Closing System Elements
const sessionTextElement = document.getElementById('sessionText');
const sessionStatusElement = document.getElementById('sessionStatus');
const giftSection = document.getElementById('giftSection');
const packagesSection = document.getElementById('packagesSection');
const todayStatusElement = document.getElementById('todayStatus');
const nextOpenDayElement = document.getElementById('nextOpenDay');
const specialDateInput = document.getElementById('specialDateInput');
const specialDatesList = document.getElementById('specialDatesList');

// ===========================================
// DATA & CONFIGURATION
// ===========================================

// Package data
const packages = [
    { id: 1, name: "2 hot keys", price: 5000, available: true },
    { id: 2, name: "1 hot key", price: 10000, available: true },
    { id: 3, name: "8 pairs", price: 15000, available: true }
];

// Selected packages array
let selectedPackages = [];

// Closing System Configuration
let closingConfig = {
    // Default: Saturday (6) and Sunday (0) closed
    weeklyClosingDays: [0, 6], // 0=Sunday, 1=Monday, 2=Tuesday, etc.
    specialClosingDates: [], // Format: "2025-12-25"
    alwaysOpenDates: [] // For overriding weekly closures
};

// ===========================================
// DATE & TIME FUNCTIONS
// ===========================================

// Update date and time
function updateDateTime() {
    const now = new Date();
    
    // Format date: DD.MM.YYYY
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    if (currentDateElement) {
        currentDateElement.textContent = `${day}.${month}.${year}`;
    }
    
    // Format time: Day - HH:MM:SS s
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[now.getDay()];
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    if (currentTimeElement) {
        currentTimeElement.textContent = `${dayName} - ${hours}:${minutes}:${seconds} s`;
    }
}

// ===========================================
// SMART SESSION SYSTEM (Morning/Evening/Closed)
// ===========================================

// Check if today is a closing day
function isTodayClosingDay() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sunday, 6=Saturday
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Check if today is in alwaysOpenDates (override)
    if (closingConfig.alwaysOpenDates.includes(todayStr)) {
        return false;
    }
    
    // Check weekly closing days
    if (closingConfig.weeklyClosingDays.includes(dayOfWeek)) {
        return true;
    }
    
    // Check special closing dates
    if (closingConfig.specialClosingDates.includes(todayStr)) {
        return true;
    }
    
    return false;
}

// Get session type based on time
function getSessionType() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Morning session: 12:01 AM to 12:02 PM
    // Evening session: 12:02 PM to 12:01 AM
    
    let isMorningSession = false;
    
    if (currentHour === 0 && currentMinute >= 1) { 
        isMorningSession = true;
    } else if (currentHour >= 1 && currentHour < 12) {
        isMorningSession = true;
    } else if (currentHour === 12 && currentMinute <= 2) {
        isMorningSession = true;
    }
    
    return isMorningSession ? 'morning' : 'evening';
}

// Function to toggle closed state for all sections
function toggleClosedSections(isClosed) {
    if (isClosed) {
        // TODAY IS CLOSED
        
        // Hide all normal content
        document.querySelectorAll('.section-content').forEach(content => {
            content.style.display = 'none';
        });
        
        // Show all closed states
        document.querySelectorAll('.section-closed').forEach(closed => {
            closed.style.display = 'flex';
            closed.classList.add('show');
        });
        
        // Update session text
        updateSessionTextForClosedDay();
        
        // Add closed-day class to body for styling
        document.body.classList.add('closed-day');
        
    } else {
        // TODAY IS OPEN
        
        // Show all normal content
        document.querySelectorAll('.section-content').forEach(content => {
            content.style.display = 'block';
        });
        
        // Hide all closed states
        document.querySelectorAll('.section-closed').forEach(closed => {
            closed.style.display = 'none';
            closed.classList.remove('show');
        });
        
        // Reset session text
        resetSessionText();
        
        // Remove closed-day class from body
        document.body.classList.remove('closed-day');
    }
}

// Update session text when closed
function updateSessionTextForClosedDay() {
    const sessionText = document.getElementById('sessionText');
    if (sessionText) {
        sessionText.textContent = "TODAY 2D CLOSED";
        sessionText.style.color = "#ff6b6b";
       
        
        sessionText.style.fontWeight = "400";
    }
}

// Reset session text when open
function resetSessionText() {
    const sessionText = document.getElementById('sessionText');
    if (sessionText) {
        const sessionType = getSessionType();
        if (sessionType === 'morning') {
            sessionText.textContent = "Morning session";
            sessionText.style.color = "#4ecdc4";
            sessionText.style.background = "rgba(78, 205, 196, 0.1)";
            sessionText.style.border = "1px solid rgba(78, 205, 196, 0.3)";
        } else {
            sessionText.textContent = "Evening session";
            sessionText.style.color = "#ff6b6b";
            sessionText.style.background = "rgba(255, 107, 107, 0.1)";
            sessionText.style.border = "1px solid rgba(255, 107, 107, 0.3)";
        }
        sessionText.style.fontWeight = "400";
    }
}


// ===========================================
// HIDE CODES ON CLOSING DAYS
// ===========================================

function updateCodesForClosingDays() {
    const isClosed = isTodayClosingDay();
    
    // Get the code display elements
    const morningCodeElement = document.querySelector('.morning-code');
    const eveningCodeElement = document.querySelector('.evening-code');
    
    if (isClosed) {
        // Today is CLOSED - show "--"
        if (morningCodeElement) {
            morningCodeElement.textContent = '--';
            morningCodeElement.style.color = '#ddff46';
            morningCodeElement.style.opacity = '1';
        }
        
        if (eveningCodeElement) {
            eveningCodeElement.textContent = '--';
            eveningCodeElement.style.color = '#ddff46';
            eveningCodeElement.style.opacity = '1';
        }
    } else {
        // Today is OPEN - show actual codes
        if (morningCodeElement) {
            const savedMorningCode = localStorage.getItem('2d_morning_code') || '2 4';
            morningCodeElement.textContent = savedMorningCode;
            morningCodeElement.style.color = '#ffd700';
            morningCodeElement.style.opacity = '1';
        }
        
        if (eveningCodeElement) {
            const savedEveningCode = localStorage.getItem('2d_evening_code') || '3 4';
            eveningCodeElement.textContent = savedEveningCode;
            eveningCodeElement.style.color = '#ffd700';
            eveningCodeElement.style.opacity = '1';
        }
    }
}

// Update session display
function updateSessionDisplay() {
    const isClosed = isTodayClosingDay();
    const sessionType = getSessionType();
    
    // Toggle closed sections
    toggleClosedSections(isClosed);
    
    // Update session text
    const sessionTextElement = document.getElementById('sessionText');
    
    if (sessionTextElement) {
        if (isClosed) {
            sessionTextElement.textContent = "TODAY 2D CLOSED";
            sessionTextElement.style.color = "#ffffff";
            sessionTextElement.style.background = "rgba(255, 107, 107, 0.15)";
            sessionTextElement.style.border = "2px solid rgba(255, 107, 107, 0.5)";
            sessionTextElement.style.fontWeight = "500";
        } else {
            if (sessionType === 'morning') {
                sessionTextElement.textContent = "Morning session";
                sessionTextElement.style.color = "#4ecdc4";
                sessionTextElement.style.background = "rgba(78, 205, 196, 0.1)";
                sessionTextElement.style.border = "1px solid rgba(78, 205, 196, 0.3)";
            } else {
                sessionTextElement.textContent = "Evening session";
                sessionTextElement.style.color = "#ffffff";
                sessionTextElement.style.background = "rgba(231, 213, 213, 0.1)";
                sessionTextElement.style.border = "1px solid rgba(216, 210, 210, 0.3)";
            }
            sessionTextElement.style.fontWeight = "500";
        }
    }
     // ✅ ADD THIS LINE: Update codes for closing days
    updateCodesForClosingDays();
}

// ===========================================
// COMPLETE SOLUTION - HIDE/SHOW CLOSED TITLES
// ===========================================

function hideShowClosedTitles() {
    // Check if today is closing day
    const today = new Date();
    const dayOfWeek = today.getDay();
    const todayStr = today.toISOString().split('T')[0];
    
    // Load closing config from localStorage
    let closingConfig = {
        weeklyClosingDays: [0, 6], // Default: Sunday & Saturday closed
        specialClosingDates: []
    };
    
    const savedConfig = localStorage.getItem('2dClosingConfig');
    if (savedConfig) {
        try {
            closingConfig = JSON.parse(savedConfig);
        } catch (e) {
            console.error('Error loading closing config:', e);
        }
    }
    
    // Check if today is a closing day
    let isClosed = false;
    
    // Check if today is in alwaysOpenDates (override)
    if (closingConfig.alwaysOpenDates && closingConfig.alwaysOpenDates.includes(todayStr)) {
        isClosed = false;
    } else {
        // Check weekly closing days
        if (closingConfig.weeklyClosingDays && closingConfig.weeklyClosingDays.includes(dayOfWeek)) {
            isClosed = true;
        }
        
        // Check special closing dates
        if (closingConfig.specialClosingDates && closingConfig.specialClosingDates.includes(todayStr)) {
            isClosed = true;
        }
    }
    
    // Get the title elements
    const giftTitle = document.querySelector('#giftClosed .closed-title');
    const vipTitle = document.querySelector('#vipClosed .closed-title');
    
    // If elements don't exist, wait a bit and try again
    if (!giftTitle || !vipTitle) {
        setTimeout(hideShowClosedTitles, 100);
        return;
    }
    
    if (isClosed) {
        // TODAY IS CLOSED - SHOW THE TITLES
        giftTitle.style.display = 'block';
        vipTitle.style.display = 'block';
        giftTitle.style.visibility = 'visible';
        vipTitle.style.visibility = 'visible';
        giftTitle.style.opacity = '1';
        vipTitle.style.opacity = '1';
        
        // Make sure emojis are there
        if (!giftTitle.textContent.includes('🎁')) {
            giftTitle.textContent = '🎁 Today Gift';
        }
        if (!vipTitle.textContent.includes('💎')) {
            vipTitle.textContent = '💎 VIP Packages';
        }
    } else {
        // TODAY IS OPEN - HIDE THE TITLES
        giftTitle.style.display = 'none';
        vipTitle.style.display = 'none';
        giftTitle.style.visibility = 'hidden';
        vipTitle.style.visibility = 'hidden';
        giftTitle.style.opacity = '0';
        vipTitle.style.opacity = '0';
    }
    
    console.log('Closed titles updated:', isClosed ? 'SHOWING' : 'HIDDEN');
}

// Run on page load
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for page to fully load
    setTimeout(hideShowClosedTitles, 500);
    
    // Also run every minute to catch changes
    setInterval(hideShowClosedTitles, 60000);
});

// Also run when window loads
window.addEventListener('load', hideShowClosedTitles);

// ===========================================
// CLOSING SYSTEM ADMIN FUNCTIONS
// ===========================================

// Load closing configuration from localStorage
function loadClosingConfig() {
    const savedConfig = localStorage.getItem('2dClosingConfig');
    if (savedConfig) {
        try {
            closingConfig = JSON.parse(savedConfig);
        } catch (e) {
            console.error('Error loading closing config:', e);
        }
    }
}

// Save closing configuration to localStorage
function saveClosingConfig() {
    localStorage.setItem('2dClosingConfig', JSON.stringify(closingConfig));
}

// In your admin functions (closeToday, openToday, toggleClosingDay, etc.)
// Add updateCodesForClosingDays() after saveClosingConfig()

function toggleClosingDay(dayIndex) {
    const index = closingConfig.weeklyClosingDays.indexOf(dayIndex);
    const dayBtn = document.querySelector(`.day-btn[data-day="${dayIndex}"]`);
    
    if (index > -1) {
        closingConfig.weeklyClosingDays.splice(index, 1);
        if (dayBtn) {
            dayBtn.classList.remove('closed');
            dayBtn.style.background = '#4CAF50';
        }
    } else {
        closingConfig.weeklyClosingDays.push(dayIndex);
        if (dayBtn) {
            dayBtn.classList.add('closed');
            dayBtn.style.background = '#f44336';
        }
    }
    
    saveClosingConfig();
    updateSessionDisplay();
    updateDayButtons();
    updateCodesForClosingDays(); // ✅ ADD THIS
}

function closeToday() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    if (!closingConfig.specialClosingDates.includes(todayStr)) {
        closingConfig.specialClosingDates.push(todayStr);
        saveClosingConfig();
        updateSessionDisplay();
        updateSpecialDatesList();
        updateCodesForClosingDays(); // ✅ ADD THIS
        alert("Today has been marked as CLOSED");
    }
}

function openToday() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const dayOfWeek = today.getDay();
    
    // Remove from special closing dates
    removeSpecialDate(todayStr);
    
    // Remove from weekly closing days if it's there
    const weeklyIndex = closingConfig.weeklyClosingDays.indexOf(dayOfWeek);
    if (weeklyIndex > -1) {
        closingConfig.weeklyClosingDays.splice(weeklyIndex, 1);
    }
    
    // Add to always open dates
    if (!closingConfig.alwaysOpenDates.includes(todayStr)) {
        closingConfig.alwaysOpenDates.push(todayStr);
    }
    
    saveClosingConfig();
    updateSessionDisplay();
    updateDayButtons();
    updateSpecialDatesList();
    updateCodesForClosingDays(); // ✅ ADD THIS
    alert("Today has been marked as OPEN");
}

// Toggle weekly closing day
function toggleClosingDay(dayIndex) {
    const index = closingConfig.weeklyClosingDays.indexOf(dayIndex);
    const dayBtn = document.querySelector(`.day-btn[data-day="${dayIndex}"]`);
    
    if (index > -1) {
        // Remove from closing days (make it OPEN)
        closingConfig.weeklyClosingDays.splice(index, 1);
        if (dayBtn) {
            dayBtn.classList.remove('closed');
            dayBtn.style.background = '#4CAF50';
        }
    } else {
        // Add to closing days (make it CLOSED)
        closingConfig.weeklyClosingDays.push(dayIndex);
        if (dayBtn) {
            dayBtn.classList.add('closed');
            dayBtn.style.background = '#f44336';
        }
    }
    
    saveClosingConfig();
    updateSessionDisplay();
    updateDayButtons();
}

// Add special closing date
function addSpecialDate() {
    if (!specialDateInput || !specialDateInput.value) return;
    
    const dateStr = specialDateInput.value;
    
    if (!closingConfig.specialClosingDates.includes(dateStr)) {
        closingConfig.specialClosingDates.push(dateStr);
        specialDateInput.value = '';
        saveClosingConfig();
        updateSessionDisplay();
        updateSpecialDatesList();
    }
}

// Remove special closing date
function removeSpecialDate(dateStr) {
    const index = closingConfig.specialClosingDates.indexOf(dateStr);
    if (index > -1) {
        closingConfig.specialClosingDates.splice(index, 1);
        saveClosingConfig();
        updateSessionDisplay();
        updateSpecialDatesList();
    }
}

// Close today (manual override)
function closeToday() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    if (!closingConfig.specialClosingDates.includes(todayStr)) {
        closingConfig.specialClosingDates.push(todayStr);
        saveClosingConfig();
        updateSessionDisplay();
        updateSpecialDatesList();
        alert("Today has been marked as CLOSED");
    }
}

// Open today (manual override)
function openToday() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const dayOfWeek = today.getDay();
    
    // Remove from special closing dates
    removeSpecialDate(todayStr);
    
    // Remove from weekly closing days if it's there
    const weeklyIndex = closingConfig.weeklyClosingDays.indexOf(dayOfWeek);
    if (weeklyIndex > -1) {
        closingConfig.weeklyClosingDays.splice(weeklyIndex, 1);
    }
    
    // Add to always open dates
    if (!closingConfig.alwaysOpenDates.includes(todayStr)) {
        closingConfig.alwaysOpenDates.push(todayStr);
    }
    
    saveClosingConfig();
    updateSessionDisplay();
    updateDayButtons();
    updateSpecialDatesList();
    alert("Today has been marked as OPEN");
}

// Reset to default (Saturday & Sunday closed)
function resetClosingDays() {
    if (confirm("Reset to default closing days? (Saturday & Sunday closed)")) {
        closingConfig.weeklyClosingDays = [0, 6]; // Sunday & Saturday
        closingConfig.specialClosingDates = [];
        closingConfig.alwaysOpenDates = [];
        saveClosingConfig();
        updateSessionDisplay();
        updateDayButtons();
        updateSpecialDatesList();
        alert("Reset to default: Saturday & Sunday closed");
    }
}

// Update day buttons display
function updateDayButtons() {
    document.querySelectorAll('.day-btn').forEach(btn => {
        const dayIndex = parseInt(btn.getAttribute('data-day'));
        if (closingConfig.weeklyClosingDays.includes(dayIndex)) {
            btn.classList.add('closed');
            btn.style.background = '#f44336';
        } else {
            btn.classList.remove('closed');
            btn.style.background = '#4CAF50';
        }
    });
}

// Update special dates list
function updateSpecialDatesList() {
    if (!specialDatesList) return;
    
    if (closingConfig.specialClosingDates.length === 0) {
        specialDatesList.innerHTML = '<div class="no-dates">No special closing dates set</div>';
        return;
    }
    
    specialDatesList.innerHTML = closingConfig.specialClosingDates.map(date => `
        <div class="date-item">
            <span>${formatDateDisplay(date)}</span>
            <button class="remove-date" onclick="removeSpecialDate('${date}')">
                Remove
            </button>
        </div>
    `).join('');
}

// Format date for display
function formatDateDisplay(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Find next open day
function getNextOpenDay() {
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        const nextDayStr = nextDate.toISOString().split('T')[0];
        const nextDayOfWeek = nextDate.getDay();
        
        // Check if it's open
        const isAlwaysOpen = closingConfig.alwaysOpenDates.includes(nextDayStr);
        const isWeeklyClosed = closingConfig.weeklyClosingDays.includes(nextDayOfWeek);
        const isSpecialClosed = closingConfig.specialClosingDates.includes(nextDayStr);
        
        if (isAlwaysOpen || (!isWeeklyClosed && !isSpecialClosed)) {
            const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][nextDayOfWeek];
            return `${dayName}, ${nextDate.getDate()}/${nextDate.getMonth()+1}/${nextDate.getFullYear()}`;
        }
    }
    
    return "No open days found";
}

// Update closing status display
function updateClosingStatusDisplay() {
    const isClosed = isTodayClosingDay();
    const nextOpenDay = getNextOpenDay();
    
    if (todayStatusElement) {
        todayStatusElement.textContent = isClosed ? "CLOSED" : "OPEN";
        todayStatusElement.className = isClosed ? "closed" : "open";
    }
    
    if (nextOpenDayElement) {
        nextOpenDayElement.textContent = isClosed ? nextOpenDay : "Today is open";
    }
}

// ===========================================
// NOTIFICATION SYSTEM
// ===========================================

function initNotificationSystem() {
    if (!bellBtn || !notificationToggle) return;
    
    bellBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationToggle.classList.toggle('show');
    });
    
    if (closeToggleBtn) {
        closeToggleBtn.addEventListener('click', function() {
            notificationToggle.classList.remove('show');
        });
    }
    
    document.addEventListener('click', function(e) {
        if (notificationToggle.classList.contains('show') && 
            !notificationToggle.contains(e.target) && 
            !bellBtn.contains(e.target)) {
            notificationToggle.classList.remove('show');
        }
    });
    
    if (notifyToggle && toggleStatus) {
        notifyToggle.addEventListener('change', function() {
            const isOn = this.checked;
            toggleStatus.textContent = isOn ? 'ON' : 'OFF';
            toggleStatus.style.color = isOn ? '#00d4ff' : '#fff';
            alert(`Notifications turned ${isOn ? 'ON' : 'OFF'}. You will ${isOn ? 'receive' : 'not receive'} updates from Admin.`);
        });
    }
}

// ===========================================
// MOBILE NOTIFICATION TOGGLE SYSTEM
// ===========================================

function initMobileNotificationToggle() {
    const mobileNotificationHeader = document.querySelector('.mobile-notification-header');
    const mobileNotificationToggle = document.querySelector('.mobile-notification-toggle');
    const closeMobileToggle = document.querySelector('.close-mobile-toggle');
    const mobileNotifyToggle = document.getElementById('mobileNotifyToggle');
    const mobileToggleStatus = document.getElementById('mobileToggleStatus');
    
    if (!mobileNotificationHeader || !mobileNotificationToggle) return;
    
    // Toggle notification panel when clicking header
    mobileNotificationHeader.addEventListener('click', function(e) {
        // Don't trigger if clicking the settings cog button
        if (!e.target.closest('.mobile-notification-toggle-btn')) {
            mobileNotificationToggle.classList.toggle('show');
        }
    });
    
    // Open notification panel when clicking settings cog
    const settingsCog = document.querySelector('.mobile-notification-toggle-btn');
    if (settingsCog) {
        settingsCog.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent header click
            mobileNotificationToggle.classList.toggle('show');
        });
    }
    
    // Close notification panel
    if (closeMobileToggle) {
        closeMobileToggle.addEventListener('click', function() {
            mobileNotificationToggle.classList.remove('show');
        });
    }
    
    // Close notification panel when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileNotificationToggle.classList.contains('show') && 
            !mobileNotificationToggle.contains(e.target) && 
            !mobileNotificationHeader.contains(e.target)) {
            mobileNotificationToggle.classList.remove('show');
        }
    });
    
    // Handle mobile toggle switch
    if (mobileNotifyToggle && mobileToggleStatus) {
        // Sync with desktop toggle if it exists
        const desktopToggle = document.getElementById('notifyToggle');
        if (desktopToggle) {
            mobileNotifyToggle.checked = desktopToggle.checked;
            mobileToggleStatus.textContent = desktopToggle.checked ? 'ON' : 'OFF';
            mobileToggleStatus.style.color = desktopToggle.checked ? '#00d4ff' : '#fff';
        }
        
        mobileNotifyToggle.addEventListener('change', function() {
            const isOn = this.checked;
            mobileToggleStatus.textContent = isOn ? 'ON' : 'OFF';
            mobileToggleStatus.style.color = isOn ? '#00d4ff' : '#fff';
            
            // Sync with desktop toggle
            if (desktopToggle) {
                desktopToggle.checked = isOn;
                const desktopStatus = document.getElementById('toggleStatus');
                if (desktopStatus) {
                    desktopStatus.textContent = isOn ? 'ON' : 'OFF';
                    desktopStatus.style.color = isOn ? '#00d4ff' : '#fff';
                }
            }
            
            alert(`Notifications turned ${isOn ? 'ON' : 'OFF'}. You will ${isOn ? 'receive' : 'not receive'} updates from Admin.`);
        });
    }
}

// ===========================================
// MOBILE MENU
// ===========================================

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDropdown = document.getElementById('mobileDropdown');
    
    if (!mobileMenuBtn || !mobileDropdown) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileDropdown.classList.toggle('show');
        
        // Toggle hamburger icon
        const icon = this.querySelector('i');
        if (mobileDropdown.classList.contains('show')) {
            icon.className = 'fas fa-times'; // X icon when open
        } else {
            icon.className = 'fas fa-bars'; // Hamburger when closed
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileDropdown.classList.contains('show') && 
            !mobileDropdown.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            mobileDropdown.classList.remove('show');
            mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
        }
    });
    
    // Close dropdown when clicking a menu item
    document.querySelectorAll('.mobile-menu-item').forEach(item => {
        item.addEventListener('click', function() {
            mobileDropdown.classList.remove('show');
            mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
        });
    });
}

// ===========================================
// VIP PACKAGE SELECTION SYSTEM
// ===========================================

function initPackageSelection() {
    packageCards.forEach(card => {
        card.addEventListener('click', function() {
            if (this.classList.contains('unavailable') || isTodayClosingDay()) {
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
        selectedItemsElement.textContent = "You haven't selected any package yet";
        totalAmountElement.textContent = "Total amount = 0 Ks";
        confirmBtn.style.display = 'none';
        confirmBtn.classList.remove('show');
        hidePaymentSection();
    } else {
        const total = selectedPackages.reduce((sum, pkg) => sum + pkg.price, 0);
        const itemsText = selectedPackages.map(pkg => pkg.name).join(' + ');
        
        selectedItemsElement.textContent = `You selected: ${itemsText}`;
        totalAmountElement.textContent = `Total amount = ${total.toLocaleString()} Ks`;
        
        confirmBtn.style.display = 'block';
        confirmBtn.classList.add('show');
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

// ===========================================
// PAYMENT SYSTEM
// ===========================================

function initPaymentSystem() {
    if (!confirmBtn || !paymentSection) return;
    
    confirmBtn.addEventListener('click', function() {
        if (selectedPackages.length === 0) {
            alert('Please select at least one VIP package!');
            return;
        }
        
        if (isTodayClosingDay()) {
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

// ===========================================
// AUTO-CLOSE MOBILE MENU ON DESKTOP RESIZE
// =========================================== 

function handleWindowResize() {
    const mobileDropdown = document.getElementById('mobileDropdown');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    // If window is wider than 768px (desktop), close mobile dropdown
    if (window.innerWidth > 768) {
        if (mobileDropdown && mobileDropdown.classList.contains('show')) {
            mobileDropdown.classList.remove('show');
        }
        
        // Reset hamburger icon to bars
        if (mobileMenuBtn) {
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        }
    }
}

// ===========================================
// ADMIN CONTROLS FOR VIP PACKAGES
// ===========================================

function togglePackage(packageId) {
    const packageCard = document.querySelector(`.package-card[data-id="${packageId}"]`);
    const controlBtn = document.getElementById(`control${packageId}`);
    
    if (!packageCard) return;
    
    if (packageCard.classList.contains('unavailable')) {
        packageCard.classList.remove('unavailable');
        packageCard.style.cursor = 'pointer';
        
        if (controlBtn) {
            controlBtn.classList.remove('unavailable-btn');
            controlBtn.classList.add('available-btn');
            controlBtn.innerHTML = `<i class="fas fa-check-circle"></i> Package ${packageId}: Available`;
        }
    } else {
        packageCard.classList.add('unavailable');
        packageCard.style.cursor = 'not-allowed';
        
        const checkmark = packageCard.querySelector('.checkmark');
        if (checkmark) checkmark.classList.remove('selected');
        packageCard.classList.remove('selected');
        
        selectedPackages = selectedPackages.filter(p => p.id !== packageId);
        updateSelectionSummary();
        
        if (controlBtn) {
            controlBtn.classList.remove('available-btn');
            controlBtn.classList.add('unavailable-btn');
            controlBtn.innerHTML = `<i class="fas fa-times-circle"></i> Package ${packageId}: Not Available`;
        }
    }
}

function initAdminControls() {
    [1, 2, 3].forEach(id => {
        const packageCard = document.querySelector(`.package-card[data-id="${id}"]`);
        const controlBtn = document.getElementById(`control${id}`);
        
        if (packageCard && controlBtn) {
            if (packageCard.classList.contains('unavailable')) {
                controlBtn.classList.add('unavailable-btn');
                controlBtn.innerHTML = `<i class="fas fa-times-circle"></i> Package ${id}: Not Available`;
            } else {
                controlBtn.classList.add('available-btn');
                controlBtn.innerHTML = `<i class="fas fa-check-circle"></i> Package ${id}: Available`;
            }
        }
    });
}

// ===========================================
// MANUAL TEST FUNCTIONS (for console)
// ===========================================

// Test: Close all sections
function testCloseAllSections() {
    toggleClosedSections(true);
    console.log("✅ All sections closed");
}

// Test: Open all sections
function testOpenAllSections() {
    toggleClosedSections(false);
    console.log("✅ All sections opened");
}

// Test: Toggle single section
function toggleSingleSection(sectionId, closeIt) {
    const closedElement = document.getElementById(sectionId + 'Closed');
    const contentElement = document.getElementById(sectionId + 'Content');
    
    if (closeIt) {
        if (closedElement) closedElement.classList.add('show');
        if (contentElement) contentElement.style.display = 'none';
    } else {
        if (closedElement) closedElement.classList.remove('show');
        if (contentElement) contentElement.style.display = 'block';
    }
}

// ===========================================
// MAIN INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 2D Plus Website Initializing...');
    
    // Load configurations
    loadClosingConfig();
    
    // Initialize systems
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    initNotificationSystem();
    initMobileMenu();
    initPackageSelection();
    initPaymentSystem();
    initAdminControls();
    
    // Initialize mobile notification toggle
    initMobileNotificationToggle();
    
    // Initialize closing system
    updateSessionDisplay();
    updateDayButtons();
    updateSpecialDatesList();
    updateClosingStatusDisplay();

     // ✅ ADD THIS: Update codes initially
    updateCodesForClosingDays();
    
    // Update closing status every minute
    setInterval(updateSessionDisplay, 60000);
    
    // Add package hover effects
    packageCards.forEach(card => {
        if (!card.classList.contains('unavailable')) {
            card.addEventListener('mouseenter', function() {
                if (!isTodayClosingDay()) {
                    this.style.transform = 'translateY(-5px)';
                    this.style.boxShadow = '0 10px 20px rgba(0, 212, 255, 0.3)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                if (!this.classList.contains('selected')) {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'none';
                }
            });
        }
    });
    
    // Check closing status on load
    const isClosed = isTodayClosingDay();
    toggleClosedSections(isClosed);
    
    console.log('✅ 2D Plus Website Initialized Successfully!');
});

// Add resize event listener
window.addEventListener('resize', handleWindowResize);

// Also check on page load
window.addEventListener('DOMContentLoaded', function() {
    handleWindowResize();
});

// ===========================================
// HELPER FUNCTIONS (Console Commands)
// ===========================================

function resetAllPackagesToAvailable() {
    [1, 2, 3].forEach(id => {
        const packageCard = document.querySelector(`.package-card[data-id="${id}"]`);
        const controlBtn = document.getElementById(`control${id}`);
        
        if (packageCard) {
            packageCard.classList.remove('unavailable');
            packageCard.style.cursor = 'pointer';
            const checkmark = packageCard.querySelector('.checkmark');
            if (checkmark) checkmark.classList.remove('selected');
            packageCard.classList.remove('selected');
        }
        
        if (controlBtn) {
            controlBtn.classList.remove('unavailable-btn');
            controlBtn.classList.add('available-btn');
            controlBtn.innerHTML = `<i class="fas fa-check-circle"></i> Package ${id}: Available`;
        }
    });
    
    selectedPackages = [];
    updateSelectionSummary();
    console.log('✅ All packages reset to AVAILABLE');
}

function testNotification() {
    if (notificationToggle) {
        notificationToggle.classList.add('show');
        console.log('🔔 Notification panel shown');
    }
}

function getClosingInfo() {
    console.log('📅 Closing Configuration:', closingConfig);
    console.log('🔍 Today is closed:', isTodayClosingDay());
    console.log('⏰ Current session:', getSessionType());
}


// ===========================================
// CONTROL UPPER TITLES VISIBILITY
// ===========================================

function controlUpperTitles() {
    const isClosed = isTodayClosingDay();
    const giftTitle = document.querySelector('.upper-gift-title');
    const vipTitle = document.querySelector('.upper-vip-title');
    
    console.log('Upper Titles - Is closed:', isClosed);
    console.log('Gift title:', giftTitle);
    console.log('VIP title:', vipTitle);
    
    if (!giftTitle || !vipTitle) {
        console.error('Upper titles not found! Check HTML structure.');
        return;
    }
    
    // Remove any inline styles first
    giftTitle.removeAttribute('style');
    vipTitle.removeAttribute('style');
    
    if (isClosed) {
        // ADD closed-day class to body
        document.body.classList.add('closed-day');
        
        // SHOW the titles
        giftTitle.style.cssText = `
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: relative !important;
            margin: 20px auto !important;
            text-align: center !important;
        `;
        
        vipTitle.style.cssText = `
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: relative !important;
            margin: 20px auto !important;
            text-align: center !important;
        `;
        
        console.log('Upper titles: VISIBLE');
    } else {
        // REMOVE closed-day class from body
        document.body.classList.remove('closed-day');
        
        // HIDE the titles
        giftTitle.style.cssText = `
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
        `;
        
        vipTitle.style.cssText = `
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
        `;
        
        console.log('Upper titles: HIDDEN');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Run after a short delay to ensure DOM is ready
    setTimeout(controlUpperTitles, 300);
    
    // Also update when your closing system updates
    const originalUpdateSessionDisplay = updateSessionDisplay;
    if (typeof originalUpdateSessionDisplay === 'function') {
        updateSessionDisplay = function() {
            originalUpdateSessionDisplay();
            setTimeout(controlUpperTitles, 100);
        };
    }
    
});

// Run when page fully loads
window.addEventListener('load', function() {
    setTimeout(controlUpperTitles, 500);
});

// Update periodically
setInterval(controlUpperTitles, 30000);


// ===========================================
// DYNAMIC NUMBERS AVAILABILITY SYSTEM
// ===========================================

class NumbersAvailability {
    constructor() {
        this.keyDisplay = document.querySelector('.key-display');
        this.numberSequence = document.querySelector('.number-sequence');
        this.keyNotAvailable = document.querySelector('.key-not-available');
        this.numbersNotAvailable = document.querySelector('.numbers-not-available');
        this.sessionMessage = document.getElementById('sessionMessage');
        
        this.isMorningSession = this.getSessionType() === 'morning';
        this.init();
    }
    
    init() {
        this.checkAvailability();
        this.setupAutoCheck();
        this.setupAdminControls();
    }
    
    // Check if numbers are available
    checkAvailability() {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        
        // Check from localStorage if admin has set availability
        const keysAvailable = localStorage.getItem('keys_available') === 'true';
        const numbersAvailable = localStorage.getItem('numbers_available') === 'true';
        
        // Auto-disable during session transition times
        // Morning: 12:01 AM to 12:02 PM
        // Evening: 12:02 PM to 12:01 AM
        
        let autoKeysAvailable = true;
        let autoNumbersAvailable = true;
        
        if (this.isMorningSession) {
            // Morning session logic
            if (currentHour === 12 && currentMinute <= 5) {
                // First 5 minutes of 12 PM - numbers might not be ready
                autoNumbersAvailable = false;
            }
        } else {
            // Evening session logic
            if (currentHour === 0 && currentMinute <= 5) {
                // First 5 minutes after midnight - numbers might not be ready
                autoNumbersAvailable = false;
            }
        }
        
        // Apply availability
        this.setKeysAvailable(keysAvailable && autoKeysAvailable);
        this.setNumbersAvailable(numbersAvailable && autoNumbersAvailable);
        
        // Update session message
        this.updateSessionMessage();
    }
    
    // Set keys availability
    setKeysAvailable(isAvailable) {
        const container = document.querySelector('.key-display-container');
        
        if (isAvailable) {
            container.classList.remove('not-available');
            if (this.keyNotAvailable) this.keyNotAvailable.style.display = 'none';
            if (this.keyDisplay) this.keyDisplay.style.display = 'flex';
        } else {
            container.classList.add('not-available');
            if (this.keyNotAvailable) this.keyNotAvailable.style.display = 'flex';
            if (this.keyDisplay) this.keyDisplay.style.display = 'none';
        }
    }
    
    // Set numbers availability
    setNumbersAvailable(isAvailable) {
        const container = document.querySelector('.number-sequence-container');
        
        if (isAvailable) {
            container.classList.remove('not-available');
            if (this.numbersNotAvailable) this.numbersNotAvailable.style.display = 'none';
            if (this.numberSequence) this.numberSequence.style.display = 'block';
        } else {
            container.classList.add('not-available');
            if (this.numbersNotAvailable) this.numbersNotAvailable.style.display = 'flex';
            if (this.numberSequence) this.numberSequence.style.display = 'none';
        }
    }
    
    // Update session-specific message
    updateSessionMessage() {
        if (!this.sessionMessage) return;
        
        const sessionType = this.isMorningSession ? 'morning' : 'evening';
        this.sessionMessage.textContent = `Not available for this ${sessionType}`;
    }
    
    // Setup auto-check every minute
    setupAutoCheck() {
        setInterval(() => {
            this.checkAvailability();
        }, 60000); // Check every minute
    }
    
    // Setup admin controls (for your admin panel)
    setupAdminControls() {
        // Create admin controls if in admin panel
        if (window.location.pathname.includes('admin')) {
            this.createAdminControls();
        }
    }
    
    // Create admin control buttons
    createAdminControls() {
        const controlsHTML = `
            <div class="admin-numbers-control">
                <h4><i class="fas fa-cogs"></i> Numbers Availability Controls</h4>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button onclick="window.numbersAvailability.setKeysAvailable(true)" 
                            class="admin-btn" style="background: #4CAF50;">
                        <i class="fas fa-check"></i> Show Keys
                    </button>
                    <button onclick="window.numbersAvailability.setKeysAvailable(false)" 
                            class="admin-btn" style="background: #f44336;">
                        <i class="fas fa-times"></i> Hide Keys
                    </button>
                    <button onclick="window.numbersAvailability.setNumbersAvailable(true)" 
                            class="admin-btn" style="background: #4CAF50;">
                        <i class="fas fa-check"></i> Show Numbers
                    </button>
                    <button onclick="window.numbersAvailability.setNumbersAvailable(false)" 
                            class="admin-btn" style="background: #f44336;">
                        <i class="fas fa-times"></i> Hide Numbers
                    </button>
                </div>
                <div style="margin-top: 10px; font-size: 12px; color: #aaa;">
                    <i class="fas fa-info-circle"></i> 
                    This controls the "Available soon" messages on main site
                </div>
            </div>
        `;
        
        // Add to admin panel if exists
        const adminContainer = document.querySelector('.admin-container');
        if (adminContainer) {
            adminContainer.insertAdjacentHTML('beforeend', controlsHTML);
        }
    }
    
    // Get session type (same as your existing function)
    getSessionType() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        let isMorningSession = false;
        
        if (currentHour === 0 && currentMinute >= 1) { 
            isMorningSession = true;
        } else if (currentHour >= 1 && currentHour < 12) {
            isMorningSession = true;
        } else if (currentHour === 12 && currentMinute <= 2) {
            isMorningSession = true;
        }
        
        return isMorningSession ? 'morning' : 'evening';
    }
    
    // Countdown timer for "available soon"
    startCountdown(minutes) {
        const countdownElement = document.querySelector('.countdown-timer');
        if (!countdownElement) return;
        
        let timeLeft = minutes * 60;
        
        const timer = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timer);
                countdownElement.textContent = 'Available now!';
                setTimeout(() => {
                    this.setKeysAvailable(true);
                    this.setNumbersAvailable(true);
                }, 2000);
                return;
            }
            
            const minutesLeft = Math.floor(timeLeft / 60);
            const secondsLeft = timeLeft % 60;
            
            countdownElement.textContent = 
                `Available in: ${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`;
            
            timeLeft--;
        }, 1000);
    }
}

// Initialize the system
let numbersAvailability;

document.addEventListener('DOMContentLoaded', function() {
    numbersAvailability = new NumbersAvailability();
    window.numbersAvailability = numbersAvailability; // Make it globally accessible
    
    // Auto-hide numbers during first 5 minutes of each session
    setTimeout(() => {
        numbersAvailability.checkAvailability();
    }, 1000);
    
});

// ===========================================
// MOBILE TOUCH TOOLTIP SYSTEM
// ===========================================

function initMobileTooltips() {
    const navContainers = document.querySelectorAll('.nav-item-container');
    const mobileContainers = document.querySelectorAll('.mobile-menu-item-container');
    
    // For desktop/laptop - hover works natively
    
    // For mobile/touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        // Add touch events for nav items
        navContainers.forEach(container => {
            let tapTimer;
            let isTapped = false;
            
            container.addEventListener('touchstart', function(e) {
                e.preventDefault();
                clearTimeout(tapTimer);
                
                // Remove active class from all containers
                navContainers.forEach(c => c.classList.remove('active'));
                
                // Add active class to this container
                this.classList.add('active');
                isTapped = true;
                
                // Hide after 2 seconds
                tapTimer = setTimeout(() => {
                    this.classList.remove('active');
                    isTapped = false;
                }, 2000);
            });
            
            container.addEventListener('touchend', function(e) {
                // If user tapped without dragging
                if (isTapped) {
                    // Keep active for a moment, then hide
                    setTimeout(() => {
                        this.classList.remove('active');
                    }, 1000);
                }
            });
            
            // Hide tooltip when tapping elsewhere
            document.addEventListener('touchstart', function(e) {
                if (!container.contains(e.target)) {
                    container.classList.remove('active');
                    clearTimeout(tapTimer);
                }
            });
        });
        
        // Add touch events for mobile menu items
        mobileContainers.forEach(container => {
            let tapTimer;
            let isTapped = false;
            
            container.addEventListener('touchstart', function(e) {
                e.preventDefault();
                clearTimeout(tapTimer);
                
                // Remove active class from all containers
                mobileContainers.forEach(c => c.classList.remove('active'));
                
                // Add active class to this container
                this.classList.add('active');
                isTapped = true;
                
                // Hide after 2 seconds
                tapTimer = setTimeout(() => {
                    this.classList.remove('active');
                    isTapped = false;
                }, 2000);
            });
            
            container.addEventListener('touchend', function(e) {
                // If user tapped without dragging
                if (isTapped) {
                    // Keep active for a moment, then hide
                    setTimeout(() => {
                        this.classList.remove('active');
                    }, 1000);
                }
            });
            
            // Hide tooltip when tapping elsewhere
            document.addEventListener('touchstart', function(e) {
                if (!container.contains(e.target)) {
                    container.classList.remove('active');
                    clearTimeout(tapTimer);
                }
            });
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initMobileTooltips();
});


// ===========================================
// SIMPLE CODE EDITOR FUNCTIONS
// ===========================================

// Initialize the code editor
function initCodeEditor() {
    console.log('🛠️ Initializing Code Editor...');
    
    // Load saved codes from localStorage
    loadSavedCodes();
    
    // Set up auto-save when user types
    setupAutoSave();
}

// Load saved codes from localStorage
function loadSavedCodes() {
    const savedMorningCode = localStorage.getItem('2d_morning_code');
    const savedEveningCode = localStorage.getItem('2d_evening_code');
    
    const morningInput = document.getElementById('morningCodeInput');
    const eveningInput = document.getElementById('eveningCodeInput');
    
    // Update input fields if saved codes exist
    if (savedMorningCode && morningInput) {
        morningInput.value = savedMorningCode;
    }
    
    if (savedEveningCode && eveningInput) {
        eveningInput.value = savedEveningCode;
    }
    
    // Also update the display
    updateDisplayedCodes();
}

// Update displayed morning code
function updateMorningCode() {
    const input = document.getElementById('morningCodeInput');
    const code = input.value.trim();
    
    if (!code) {
        alert('Please enter a morning code!');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('2d_morning_code', code);
    
    // Update the display
    updateDisplayedCodes();
    
    // Show success feedback
    showCodeUpdateSuccess('morning');
    
    console.log('✅ Morning code updated:', code);
}

// Update displayed evening code
function updateEveningCode() {
    const input = document.getElementById('eveningCodeInput');
    const code = input.value.trim();
    
    if (!code) {
        alert('Please enter an evening code!');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('2d_evening_code', code);
    
    // Update the display
    updateDisplayedCodes();
    
    // Show success feedback
    showCodeUpdateSuccess('evening');
    
    console.log('✅ Evening code updated:', code);
}

// Update the displayed codes on the page
function updateDisplayedCodes() {
    const morningCode = localStorage.getItem('2d_morning_code') || '2 4';
    const eveningCode = localStorage.getItem('2d_evening_code') || '3 4';
    
    // Find the code display elements
    const morningDisplay = document.querySelector('.morning-code');
    const eveningDisplay = document.querySelector('.evening-code');
    
    // Update if elements exist
    if (morningDisplay) {
        morningDisplay.textContent = morningCode;
    }
    
    if (eveningDisplay) {
        eveningDisplay.textContent = eveningCode;
    }
}

// Show success feedback
function showCodeUpdateSuccess(session) {
    const buttons = document.querySelectorAll('.update-btn');
    const button = session === 'morning' ? buttons[0] : buttons[1];
    
    // Add success animation
    button.classList.add('update-success');
    
    // Change button text temporarily
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Updated!';
    
    // Revert after 1.5 seconds
    setTimeout(() => {
        button.classList.remove('update-success');
        button.innerHTML = originalText;
    }, 1500);
}

// Setup auto-save on input (optional)
function setupAutoSave() {
    const morningInput = document.getElementById('morningCodeInput');
    const eveningInput = document.getElementById('eveningCodeInput');
    
    let saveTimer;
    
    // Auto-save morning code 1 second after typing stops
    if (morningInput) {
        morningInput.addEventListener('input', function() {
            clearTimeout(saveTimer);
            saveTimer = setTimeout(() => {
                if (this.value.trim()) {
                    localStorage.setItem('2d_morning_code', this.value.trim());
                    updateDisplayedCodes();
                }
            }, 1000);
        });
    }
    
    // Auto-save evening code 1 second after typing stops
    if (eveningInput) {
        eveningInput.addEventListener('input', function() {
            clearTimeout(saveTimer);
            saveTimer = setTimeout(() => {
                if (this.value.trim()) {
                    localStorage.setItem('2d_evening_code', this.value.trim());
                    updateDisplayedCodes();
                }
            }, 1000);
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize code editor
    initCodeEditor();
    
    // Also update codes when the page loads
    updateDisplayedCodes();
});

// SUN & MOON EMOJI SYSTEM
function updateSessionEmojis() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Check if morning session (12:01 AM to 12:02 PM)
    let isMorningSession = false;
    if (currentHour === 0 && currentMinute >= 1) { 
        isMorningSession = true;
    } else if (currentHour >= 1 && currentHour < 12) {
        isMorningSession = true;
    } else if (currentHour === 12 && currentMinute <= 2) {
        isMorningSession = true;
    }
    
    // Update body class
    if (isMorningSession) {
        document.body.classList.remove('evening-session');
        document.body.classList.add('morning-session');
    } else {
        document.body.classList.remove('morning-session');
        document.body.classList.add('evening-session');
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', function() {
    updateSessionEmojis();
    setInterval(updateSessionEmojis, 60000); // Update every minute
});

// ===========================================
// FOOTER VISITOR COUNTER
// =========================================== 

class FooterVisitorCounter {
    constructor() {
        this.storageKey = '2d_footer_visitors';
        this.visitorId = this.generateVisitorId();
        this.stats = this.loadStats();
        this.init();
    }
    
    generateVisitorId() {
        // Create a more persistent visitor ID
        let visitorId = localStorage.getItem('2d_visitor_id');
        
        if (!visitorId) {
            // Create new ID based on browser + time
            const seed = [
                navigator.userAgent.substring(0, 50),
                navigator.language,
                new Date().getTime().toString(36)
            ].join('-');
            
            // Simple hash
            let hash = 0;
            for (let i = 0; i < seed.length; i++) {
                const char = seed.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            
            visitorId = 'vis_' + Math.abs(hash).toString(36).substring(0, 8);
            localStorage.setItem('2d_visitor_id', visitorId);
        }
        
        return visitorId;
    }
    
    loadStats() {
        const saved = localStorage.getItem(this.storageKey);
        const today = this.getTodayDate();
        
        if (saved) {
            try {
                const data = JSON.parse(saved);
                
                // Reset if it's a new day
                if (data.date !== today) {
                    // Save yesterday to history
                    if (data.today > 0) {
                        data.history = data.history || [];
                        data.history.push({
                            date: data.date,
                            visits: data.today,
                            unique: data.uniqueToday
                        });
                        
                        // Keep only 7 days history
                        if (data.history.length > 7) {
                            data.history.shift();
                        }
                    }
                    
                    // Reset for new day
                    data.date = today;
                    data.today = 0;
                    data.uniqueToday = 0;
                    data.todayVisitors = [];
                }
                
                return data;
            } catch (e) {
                console.error('Error loading visitor stats:', e);
            }
        }
        
        // Default data
        return {
            date: today,
            total: 0,
            today: 0,
            uniqueToday: 0,
            todayVisitors: [],
            history: [],
            lastUpdated: Date.now()
        };
    }
    
    saveStats() {
        this.stats.lastUpdated = Date.now();
        localStorage.setItem(this.storageKey, JSON.stringify(this.stats));
    }
    
    getTodayDate() {
        const date = new Date();
        return date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
    }
    
    init() {
        console.log('📊 Footer Visitor Counter Initializing...');
        
        // Check if this is a new visit (not same session)
        const sessionKey = '2d_session_' + this.getTodayDate();
        const currentSession = sessionStorage.getItem(sessionKey);
        
        // Count visit if:
        // 1. No session for today
        // 2. Session is older than 2 hours
        const shouldCountVisit = !currentSession || 
                               (Date.now() - parseInt(currentSession)) > (2 * 60 * 60 * 1000);
        
        if (shouldCountVisit) {
            this.countVisit();
        }
        
        // Update current session
        sessionStorage.setItem(sessionKey, Date.now().toString());
        
        // Update display
        this.updateFooterDisplay();
        
        // Auto-update every 30 seconds
        this.startAutoUpdate();
        
        // Handle page visibility
        this.handleVisibility();
        
        console.log('✅ Footer Visitor Counter Ready');
    }
    
    countVisit() {
        const today = this.getTodayDate();
        const visitorId = this.visitorId;
        
        // Check if unique visitor today
        const isUniqueToday = !this.stats.todayVisitors.includes(visitorId);
        
        // Update counters
        this.stats.total++;
        this.stats.today++;
        
        if (isUniqueToday) {
            this.stats.uniqueToday++;
            this.stats.todayVisitors.push(visitorId);
            
            // Keep only today's unique visitors
            this.stats.todayVisitors = this.stats.todayVisitors.slice(-100);
        }
        
        // Save
        this.saveStats();
        
        console.log(`📊 Visit counted: Today=${this.stats.today}, Unique=${this.stats.uniqueToday}, Total=${this.stats.total}`);
    }
    
    updateFooterDisplay() {
        // Update footer elements
        const todayEl = document.getElementById('footerToday');
        const totalEl = document.getElementById('footerTotal');
        const onlineEl = document.getElementById('footerOnline');
        const updateEl = document.getElementById('footerUpdateTime');
        
        if (todayEl) {
            this.updateCounter(todayEl, this.stats.today);
        }
        
        if (totalEl) {
            this.updateCounter(totalEl, this.stats.total);
        }
        
        if (onlineEl) {
            // Estimate online users (1-5 based on recent activity)
            let onlineEstimate = 1;
            if (this.stats.today > 10) onlineEstimate = 2;
            if (this.stats.today > 30) onlineEstimate = 3;
            if (this.stats.today > 50) onlineEstimate = 4;
            if (this.stats.today > 100) onlineEstimate = 5;
            
            onlineEl.textContent = onlineEstimate;
        }
        
        if (updateEl) {
            const now = new Date();
            const lastUpdate = new Date(this.stats.lastUpdated);
            const diffMinutes = Math.floor((now - lastUpdate) / (1000 * 60));
            
            if (diffMinutes < 1) {
                updateEl.textContent = 'Just now';
            } else if (diffMinutes < 60) {
                updateEl.textContent = `${diffMinutes}m ago`;
            } else {
                updateEl.textContent = lastUpdate.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
            }
        }
    }
    
    updateCounter(element, targetValue) {
        const current = parseInt(element.textContent) || 0;
        
        if (current === targetValue) return;
        
        // Simple animation
        let count = current;
        const step = Math.ceil(Math.abs(targetValue - current) / 10);
        
        const timer = setInterval(() => {
            if (count < targetValue) {
                count = Math.min(targetValue, count + step);
            } else if (count > targetValue) {
                count = Math.max(targetValue, count - step);
            }
            
            element.textContent = count;
            
            if (count === targetValue) {
                clearInterval(timer);
                
                // Add animation effect
                element.classList.add('footer-counter-updating');
                setTimeout(() => {
                    element.classList.remove('footer-counter-updating');
                }, 500);
            }
        }, 30);
    }
    
    startAutoUpdate() {
        // Update display every 30 seconds
        setInterval(() => {
            this.updateFooterDisplay();
            this.checkNewDay();
        }, 30000);
    }
    
    checkNewDay() {
        const today = this.getTodayDate();
        if (this.stats.date !== today) {
            console.log('🔄 New day detected, resetting today counter');
            
            // Save yesterday to history
            this.stats.history.push({
                date: this.stats.date,
                visits: this.stats.today,
                unique: this.stats.uniqueToday
            });
            
            // Keep only 7 days
            if (this.stats.history.length > 7) {
                this.stats.history.shift();
            }
            
            // Reset for new day
            this.stats.date = today;
            this.stats.today = 0;
            this.stats.uniqueToday = 0;
            this.stats.todayVisitors = [];
            
            this.saveStats();
            this.updateFooterDisplay();
        }
    }
    
    handleVisibility() {
        // When user returns to tab after 30+ minutes, count as new visit
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                const lastVisible = localStorage.getItem('2d_last_visible');
                const now = Date.now();
                
                if (lastVisible && (now - parseInt(lastVisible)) > (30 * 60 * 1000)) {
                    this.countVisit();
                    this.updateFooterDisplay();
                }
                
                localStorage.setItem('2d_last_visible', now.toString());
            }
        });
    }
    
    // Get stats for admin
    getStats() {
        return {
            ...this.stats,
            weekAverage: this.getWeekAverage(),
            yesterday: this.getYesterdayStats()
        };
    }
    
    getWeekAverage() {
        if (this.stats.history.length === 0) return 0;
        const sum = this.stats.history.reduce((total, day) => total + day.visits, 0);
        return Math.round(sum / this.stats.history.length);
    }
    
    getYesterdayStats() {
        if (this.stats.history.length === 0) return { visits: 0, unique: 0 };
        return this.stats.history[this.stats.history.length - 1];
    }
}

// Initialize footer counter
let footerVisitorCounter;

document.addEventListener('DOMContentLoaded', function() {
    footerVisitorCounter = new FooterVisitorCounter();
    
    // Add admin reset button to existing admin panel
    addFooterCounterAdmin();
});

function addFooterCounterAdmin() {
    const adminPanel = document.querySelector('.admin-controls');
    if (!adminPanel) return;
    
    const adminBtn = document.createElement('button');
    adminBtn.className = 'control-btn';
    adminBtn.style.background = '#2196F3';
    adminBtn.style.marginTop = '10px';
    adminBtn.innerHTML = '<i class="fas fa-chart-bar"></i> Visitor Stats';
    adminBtn.onclick = showVisitorStats;
    
    adminPanel.appendChild(adminBtn);
}

function showVisitorStats() {
    if (!footerVisitorCounter) return;
    
    const stats = footerVisitorCounter.getStats();
    const history = stats.history.map(day => 
        `${new Date(day.date).toLocaleDateString()}: ${day.visits} visits (${day.unique} unique)`
    ).join('\n');
    
    alert(`📊 VISITOR STATISTICS\n
Today: ${stats.today} visits (${stats.uniqueToday} unique)
Total: ${stats.total} visits
Yesterday: ${stats.yesterday.visits} visits (${stats.yesterday.unique} unique)
7-day Average: ${stats.weekAverage} visits/day

LAST 7 DAYS:\n${history || 'No history yet'}

[Close to refresh counters]`);
    
    // Refresh display
    footerVisitorCounter.updateFooterDisplay();
}

// Export function
function exportVisitorStats() {
    if (!footerVisitorCounter) return;
    
    const stats = footerVisitorCounter.getStats();
    const data = {
        exportDate: new Date().toISOString(),
        ...stats
    };
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitor-stats-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Hide visitor counter from users, show only for admin
function setupVisitorCounterVisibility() {
    const visitorCounter = document.querySelector('.footer-visitor-counter');
    
    if (!visitorCounter) return;
    
    // Check URL for admin parameter
    const urlParams = new URLSearchParams(window.location.search);
    const isAdmin = urlParams.has('admin');
    
    // Or check localStorage for admin mode
    const savedAdminMode = localStorage.getItem('2d_admin_mode') === 'true';
    
    // Show only if admin
    if (isAdmin || savedAdminMode) {
        visitorCounter.style.display = 'block';
        console.log('👑 Admin mode: Visitor counter visible');
    } else {
        visitorCounter.style.display = 'none';
    }
}

// Add to your DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    setupVisitorCounterVisibility();
});


// ===========================================
// ENGLISH/MYANMAR LANGUAGE TRANSLATION SYSTEM
// ===========================================

class LanguageTranslator {
    constructor() {
        this.currentLang = 'en';
        this.translations = this.getTranslations();
        this.init();
    }
    
    init() {
        console.log('🌐 Language Translator Initializing...');
        
        // Load saved language
        this.loadSavedLanguage();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Apply initial translation
        this.applyTranslation();
        
        console.log('✅ Language Translator Ready');
    }
    
    getTranslations() {
        return {
            en: {
                // Header & Navigation
                'app-name': '2D Lite',
                'download-app': 'Download App',
                'notifications': 'Notifications',
                'menu': 'Menu',
                'scan-to-chat': 'Scan to chat',
                
                // Main Content
                '2d-results': '2D results',
                'intro-text': ' The one trusted website where you can buy winning "2D lucky lottery numbers" online 😍',
                'morning-session': 'Morning session',
                'evening-session': 'Evening session',
                'today-2d-closed': 'TODAY 2D CLOSED',
                
                // Gift Section
                'today-gift': '🎁 Today Gift',
                'gift-for-you': 'Gift for You 🎁',
                'key-label': 'Key :',
                'keys': 'keys',
                'number-pairs': 'number pairs',
                'available-soon': 'Available soon . . .',
                'not-available-for': 'Not available for this morning',
                'motivation-text': 'No more worry for your lucky lottery numbers. Let us help you win the 2D game using our hardworking results.',
                'package-info': 'You can select your favorite VIP package one or more. No scam.',
                
                // VIP Packages
                'vip-packages': '💎 VIP Packages',
                '2-hot-keys': '2 hot keys',
                '1-hot-key': '1 hot key',
                '8-pairs': '8 pairs',
                'not-available': 'Not available',
                'you-havent-selected': 'You haven\'t selected any package yet',
                'you-selected': 'You selected:',
                'total-amount': 'Total amount =',
                'confirm-payment': 'Confirm the Payment',
                'get-the-vip': 'and get the VIP package',
                
                // Payment Section
                'pay': 'pay with Kpay or WavePay',
                'scan-to-pay': 'Scan to Pay',
                'important-instructions': 'Important Instructions:',
                'instruction-1': 'Please check the phone number carefully before transferring money.',
                'instruction-2': 'Your selected VIP package will be sent after the payment is confirmed.',
                'instruction-3': 'Send the payment screenshot via Facebook Messenger or Viber.',
                'business-note': '(This site is developed for real business only. No scamming or time wasting.)',
                
                // Footer
                'copyright': '© 2025 2D Lite. All rights reserved. VIP Lottery Numbers Service.',
                'admin-controls': 'Admin Controls - VIP Package Status',
                'available': 'Available',
                'not-available': 'Not Available',
                'click-to-toggle': 'Click any button to toggle package availability',
                
                // 2D Closing System
                '2d-closing-system': '2D Closing System',
                'today': 'Today:',
                'next-open': 'Next Open:',
                'weekly-closing-days': 'Weekly Closing Days',
                'special-closing-dates': 'Special Closing Dates',
                'add-date': 'Add Date',
                'quick-actions': 'Quick Actions',
                'close-today': 'Close Today',
                'open-today': 'Open Today',
                'reset-to-default': 'Reset to Default',
                'closing-note': 'When 2D is closed: Each section shows "Closed" with lock icon.',
                
                // Days
                'sunday': 'Sun',
                'monday': 'Mon',
                'tuesday': 'Tue',
                'wednesday': 'Wed',
                'thursday': 'Thu',
                'friday': 'Fri',
                'saturday': 'Sat',
                
                // Status
                'open': 'OPEN',
                'closed': 'CLOSED 🔒',
                'checking': 'Checking...',
                'today-is-open': 'Today is open',
                
                // Visitor Counter
                'live-visitors': 'Live Visitors',
                'todays-visitors': 'Today',
                'total-visitors': 'Total',
                'online-now': 'Online',
                'updated': 'Updated:',
                'just-now': 'Just now',
                'min-ago': 'min ago'
            },
            
            my: {
                // Header & Navigation
                'app-name': '2D Lite',
                'download-app': 'အက်ပ်ဒေါင်းလုဒ်',
                'notifications': 'အသိပေးချက်များ',
                'menu': 'မီနူး',
                'scan-to-chat': 'စကင်ဖတ်ပြီးစကားပြောရန်',
                
                // Main Content
                '2d-results': '2D ရလဒ်များ',
                'intro-text': '"အောင်မြင်သည့် 2D ထီဂဏန်းများ" ကို အွန်လိုင်းမှ ဝယ်ယူရန် သင်ရဲ့ယုံကြည်စိတ်ချရသော တစ်ခုတည်းသောနေရာ 😍',
                'morning-session': 'မနက်ပိုင်း',
                'evening-session': 'ညနေပိုင်း',
                'today-2d-closed': 'ယနေ့ 2D ပိတ်သည်',
                
                // Gift Section
                'today-gift': '🎁 ယနေ့လက်ဆောင်',
                'gift-for-you': 'လက်ဆောင် 🎁',
                'key-label': 'ကီး :',
                'keys': 'ကီး',
                'number-pairs': 'ရွေးကွက်များ',
                'available-soon': 'မကြာမီရနိုင်မည် . . .',
                'not-available-for': 'ယနေ့မနက်ပိုင်းအတွက်မရနိုင်ပါ',
                'motivation-text': 'သင်ရဲ့ 2D ထီဂဏန်းများအတွက် စိတ်မပူပါနဲ့တော့။ ကျွန်နော်တို့ရဲ့ ကြိုးစားအားထုတ်ထားတဲ့ ရလဒ်တွေနဲ့ 2D ထီပေါက်အောင် ကူညီပေးပါမယ်။',
                'package-info': 'သင်နှစ်သက်ရာ VIP package တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုရွေးချယ်နိုင်ပါသည်။ လိမ်လည်မှုမရှိပါ။',
                
                // VIP Packages
                'vip-packages': '💎 VIP အထူးပက်ကေ့ချ်များ',
                '2-hot-keys': 'ဟော့ကီး ၂ လုံး',
                '1-hot-key': 'အပိုင်ကီး ၁ လုံး',
                '8-pairs': 'ပေါက်ကွက် ၈ ကွက်',
                'not-available': 'မရနိုင်ပါ',
                'you-havent-selected': 'သင် package မရွေးချယ်ရသေးပါ',
                'you-selected': 'သင် ရွေးချယ်ထားသည်:',
                'total-amount': 'စုစုပေါင်းငွေ =',
                'confirm-payment': 'ငွေပေးချေမှုအတည်ပြုရန်',
                'and-get-vip': 'ပြီးလျှင် VIP package ရယူရန်',
                '0-ks': '0 ကျပ်',
                
                
                // Payment Section
                'pay': 'Kapy သို့မဟုတ် WavePay ဖြင့် ငွေပေးချေနိုင်ပါသည်',
                'scan-to-pay': 'ငွေပေးချေရန် စကင်ဖတ်ပါ',
                'important-instructions': 'အရေးကြီးညွှန်ကြားချက်များ:',
                'instruction-1': 'ငွေလွှဲမည့်ဖုန်းနံပါတ်ကိုသေချာစစ်ဆေးပါ။',
                'instruction-2': 'ငွေပေးချေမှုအတည်ပြုပြီးနောက် သင်၏ VIP package ကိုပို့ပေးပါမည်။',
                'instruction-3': 'ငွေပေးချေမှုစခရင်ရှော့ကို Facebook Messenger သို့မဟုတ် Viber မှတစ်ဆင့်ပို့ပါ။',
                'business-note': '(ဤဝက်ဘ်ဆိုက်ကိုစီးပွားရေးအတွက်သာတည်ဆောက်ထားခြင်းဖြစ်သည်။ လိမ်လည်ခြင်း သို့မဟုတ် အချိန်ဖြုန်းခြင်းအတွက် မဟုတ်ပါ။)',
                
                // Footer
                'copyright': '© 2025 2D Lite. အခွင့်အရေးအားလုံးရှိသည်။ VIP ထီဂဏန်းဝန်ဆောင်မှု။',
                'admin-controls': 'စီမံခန့်ခွဲမှု - VIP Package အခြေအနေ',
                'available': 'ရနိုင်သည်',
                'not-available': 'မရနိုင်ပါ',
                'click-to-toggle': 'Package ရနိုင်မှုပြောင်းရန်ခလုတ်ကိုနှိပ်ပါ',
                
                // 2D Closing System
                '2d-closing-system': '2D ပိတ်ရက်စနစ်',
                'today': 'ယနေ့:',
                'next-open': 'နောက်တစ်ကြိမ်ဖွင့်မည့်နေ့:',
                'weekly-closing-days': 'အပတ်စဉ်ပိတ်ရက်များ',
                'special-closing-dates': 'အထူးပိတ်ရက်များ',
                'add-date': 'ရက်စွဲထည့်ရန်',
                'quick-actions': 'အမြန်လုပ်ဆောင်ချက်များ',
                'close-today': 'ယနေ့ပိတ်ရန်',
                'open-today': 'ယနေ့ဖွင့်ရန်',
                'reset-to-default': 'မူလအတိုင်းပြန်သတ်မှတ်ရန်',
                'closing-note': '2D ပိတ်လျှင်: ကဏ္ဍတိုင်းတွင် "ပိတ်သည်" နှင့် သော့ပုံပြမည်။',
                
                // Days (Burmese days)
                'sunday': 'တနင်္ဂနွေ',
                'monday': 'တနင်္လာ',
                'tuesday': 'အင်္ဂါ',
                'wednesday': 'ဗုဒ္ဓဟူး',
                'thursday': 'ကြာသပတေး',
                'friday': 'သောကြာ',
                'saturday': 'စနေ',
                
                // Status
                'open': 'ဖွင့်သည် ',
                'closed': 'ပိတ်သည် 🔒',
                'checking': 'စစ်ဆေးနေသည်...',
                'today-is-open': 'ယနေ့ဖွင့်သည်',
                'closed-message': '2D ဖွင့်ရက်မှပြန်လာခဲ့ပါ',
                
                // Visitor Counter
                'live-visitors': 'လာရောက်ကြည့်ရှုသူများ',
                'todays-visitors': 'ယနေ့',
                'total-visitors': 'စုစုပေါင်း',
                'online-now': 'လက်ရှိအွန်လိုင်း',
                'updated': 'နောက်ဆုံးအပ်ဒိတ်:',
                'just-now': 'ခုနက',
                'min-ago': 'မိနစ်က'
            }
        };
    }
    
    loadSavedLanguage() {
        const savedLang = localStorage.getItem('2d_language');
        if (savedLang && (savedLang === 'en' || savedLang === 'my')) {
            this.currentLang = savedLang;
        } else {
            // Detect browser language
            const browserLang = navigator.language || navigator.userLanguage;
            if (browserLang.startsWith('my')) {
                this.currentLang = 'my';
            }
        }
    }
    
    saveLanguage() {
        localStorage.setItem('2d_language', this.currentLang);
    }
    
    setupEventListeners() {
        // Desktop language dropdown
        const langBtn = document.getElementById('languageBtn');
        const langDropdown = document.getElementById('languageDropdown');
        
        if (langBtn && langDropdown) {
            langBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                langDropdown.classList.toggle('show');
            });
            
            // Language options
            document.querySelectorAll('.lang-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    const lang = e.currentTarget.getAttribute('data-lang');
                    this.switchLanguage(lang);
                    langDropdown.classList.remove('show');
                });
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
                    langDropdown.classList.remove('show');
                }
            });
        }
        
        // Mobile language switcher
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
        
        // Update UI
        this.updateLanguageUI();
        
        console.log(`🌐 Language switched to: ${lang === 'en' ? 'English' : 'မြန်မာ'}`);
        
        // Show notification
        this.showLanguageChangedNotification();
    }
    
    applyTranslation() {
        // Update all translatable elements
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
        
        // Update body class for CSS
        document.body.classList.remove('lang-en', 'lang-my');
        document.body.classList.add(`lang-${this.currentLang}`);
        
        // Update session message
        this.updateSessionMessage();
        
        // Update day names
        this.updateDayNames();
    }
    
    updateLanguageUI() {
        // Update current language display
        const currentLangElement = document.getElementById('currentLang');
        if (currentLangElement) {
            currentLangElement.textContent = this.currentLang === 'en' ? 'ENG' : 'MY';
        }
        
        // Update active states
        document.querySelectorAll('.lang-option').forEach(option => {
            const lang = option.getAttribute('data-lang');
            const checkIcon = option.querySelector('i');
            
            if (lang === this.currentLang) {
                option.classList.add('active');
                if (checkIcon) checkIcon.style.display = 'block';
            } else {
                option.classList.remove('active');
                if (checkIcon) checkIcon.style.display = 'none';
            }
        });
        
        // Update mobile buttons
        document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            if (lang === this.currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    updateSessionMessage() {
        const sessionMessage = document.getElementById('sessionMessage');
        if (sessionMessage && sessionMessage.hasAttribute('data-translate')) {
            const session = this.getSessionType();
            const key = 'not-available-for';
            sessionMessage.textContent = this.translations[this.currentLang][key].replace('morning', session === 'morning' ? 
                (this.currentLang === 'en' ? 'morning' : 'မနက်ပိုင်း') : 
                (this.currentLang === 'en' ? 'evening' : 'ညနေပိုင်း'));
        }
    }
    
    updateDayNames() {
        // Update day buttons in closing system
        const days = {
            en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            my: ['တနင်္ဂနွေ', 'တနင်္လာ', 'အင်္ဂါ', 'ဗုဒ္ဓဟူး', 'ကြာသပတေး', 'သောကြာ', 'စနေ']
        };
        
        document.querySelectorAll('.day-btn').forEach((btn, index) => {
            if (this.currentLang === 'my') {
                btn.textContent = days.my[index];
            } else {
                btn.textContent = days.en[index];
            }
        });
    }
    
    getSessionType() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        let isMorningSession = false;
        
        if (currentHour === 0 && currentMinute >= 1) { 
            isMorningSession = true;
        } else if (currentHour >= 1 && currentHour < 12) {
            isMorningSession = true;
        } else if (currentHour === 12 && currentMinute <= 2) {
            isMorningSession = true;
        }
        
        return isMorningSession ? 'morning' : 'evening';
    }
    
    showLanguageChangedNotification() {
        const message = this.currentLang === 'en' 
            ? 'Language changed to English' 
            : 'ဘာသာစကားကို မြန်မာဘာသာသို့ ပြောင်းလဲပြီး';
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'language-notification';
        notification.innerHTML = `
            <i class="fas fa-language"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .language-notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: rgba(0, 212, 255, 0.9);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 10000;
                animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
                animation-fill-mode: forwards;
                box-shadow: 0 10px 25px rgba(0, 212, 255, 0.3);
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes fadeOut {
                to { opacity: 0; transform: translateX(100%); }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
    
    // Add data-translate attributes to new elements
    translateElement(element, key) {
        element.setAttribute('data-translate', key);
        if (this.translations[this.currentLang][key]) {
            element.textContent = this.translations[this.currentLang][key];
        }
    }
}

// Initialize language translator
let languageTranslator;

document.addEventListener('DOMContentLoaded', function() {
    languageTranslator = new LanguageTranslator();
    
    // Make available globally
    window.switchLanguage = function(lang) {
        if (languageTranslator) {
            languageTranslator.switchLanguage(lang);
        }
    };
});