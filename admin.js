/* ===============================
   2D PLUS ADMIN PANEL - GLOBAL CONTROL
   =============================== */

/* ------------------------- CONFIGURATION ------------------------- */
const CONTROL_BIN_ID = "698c99b9d0ea881f40b26a64";
const CONTROL_BIN_URL = `https://api.jsonbin.io/v3/b/${CONTROL_BIN_ID}`;
const CONTROL_MASTER_KEY = "$2a$10$r6dtpFgoPrqaY.WI7VQspeP1c7R7Xs68OBG57QOmj2bL1.CR0llBa";

const NOTI_BIN_ID = "697ef620d0ea881f4098264a";
const NOTI_BIN_URL = `https://api.jsonbin.io/v3/b/${NOTI_BIN_ID}`;
const NOTI_MASTER_KEY = "$2a$10$ngRVz8VByS63nwoOA42B6us9i9VqZGUHphisiMLr0HZqvA1xoxGN2";

/* ------------------------- ADMIN PASSWORD ------------------------- */
class AdminPassword {
    constructor() {
        this.storageKey = '2d_admin_password';
        this.isAuthenticated = false;
        this.init();
    }
    
    init() {
        if (sessionStorage.getItem('admin_authenticated') === 'true') {
            this.isAuthenticated = true;
            this.showAdminPanel();
            return;
        }
        this.showPasswordScreen();
        this.setupEventListeners();
    }
    
    showPasswordScreen() {
        const pwdScreen = document.getElementById('passwordScreen');
        const adminPanel = document.getElementById('adminPanel');
        if (pwdScreen && adminPanel) {
            pwdScreen.style.display = 'flex';
            adminPanel.style.display = 'none';
            document.getElementById('passwordInput')?.focus();
        }
    }
    
    showAdminPanel() {
        const pwdScreen = document.getElementById('passwordScreen');
        const adminPanel = document.getElementById('adminPanel');
        if (pwdScreen && adminPanel) {
            pwdScreen.style.display = 'none';
            adminPanel.style.display = 'block';
            this.isAuthenticated = true;
            sessionStorage.setItem('admin_authenticated', 'true');
            this.setupLogoutButton();
            setTimeout(() => loadAllFeatures(), 500);
        }
    }
    
    setupEventListeners() {
        const submitBtn = document.getElementById('submitPassword');
        const pwdInput = document.getElementById('passwordInput');
        if (submitBtn && pwdInput) {
            submitBtn.addEventListener('click', () => this.checkPassword());
            pwdInput.addEventListener('keypress', (e) => e.key === 'Enter' && this.checkPassword());
        }
    }
    
    setupLogoutButton() {
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
    }
    
    checkPassword() {
        const input = document.getElementById('passwordInput');
        if (!input) return;
        
        const entered = input.value.trim();
        if (!entered) return this.showError('Please enter a password');
        
        const saved = localStorage.getItem(this.storageKey);
        
        if (!saved) {
            if (confirm('Set this as your admin password?')) {
                localStorage.setItem(this.storageKey, entered);
                this.showAdminPanel();
                alert('✅ Password set successfully!');
            }
        } else if (entered === saved) {
            this.showAdminPanel();
        } else {
            this.showError('Wrong password!');
            input.value = '';
            input.focus();
        }
    }
    
    logout() {
        if (confirm('Logout from admin panel?')) {
            sessionStorage.removeItem('admin_authenticated');
            this.isAuthenticated = false;
            this.showPasswordScreen();
        }
    }
    
    showError(msg) {
        const err = document.createElement('div');
        err.className = 'error-message';
        err.innerHTML = `<i class="fas fa-exclamation-circle"></i><span>${msg}</span>`;
        document.querySelector('.password-form')?.appendChild(err);
        setTimeout(() => err.remove(), 5000);
    }
    
    isAuth() {
        return this.isAuthenticated || sessionStorage.getItem('admin_authenticated') === 'true';
    }
}

/* ------------------------- HELPER FUNCTIONS ------------------------- */
function requireAuth() {
    if (!adminPassword?.isAuth()) {
        alert('Authentication required!');
        adminPassword?.showPasswordScreen();
        return false;
    }
    return true;
}

async function getControlData() {
    try {
        const res = await fetch(CONTROL_BIN_URL, {
            headers: { "X-Master-Key": CONTROL_MASTER_KEY }
        });
        const json = await res.json();
        return json.record;
    } catch (error) {
        console.error('Error getting data:', error);
        return {};
    }
}

async function saveControlData(data) {
    try {
        await fetch(CONTROL_BIN_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": CONTROL_MASTER_KEY
            },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error('Error saving data:', error);
        throw error;
    }
}

function showNotification(msg, type = 'success') {
    const notif = document.createElement('div');
    notif.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i><span>${msg}</span>`;
    Object.assign(notif.style, {
        position: 'fixed', top: '20px', right: '20px', padding: '15px 25px',
        background: type === 'success' ? '#4CAF50' : '#f44336', color: 'white',
        borderRadius: '10px', zIndex: '10000', animation: 'slideIn 0.3s ease',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
    });
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
`;
document.head.appendChild(style);

/* ======================== FEATURE 1: VIP PACKAGES ======================== */
async function togglePackage(id) {
    if (!requireAuth()) return;
    try {
        const data = await getControlData();
        if (!data.vip) data.vip = {};
        data.vip[id] = !data.vip[id];
        await saveControlData(data);
        updateButtonUI(id, data.vip[id]);
        showNotification(`Package ${id} is now ${data.vip[id] ? 'AVAILABLE' : 'NOT AVAILABLE'}`);
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

function updateButtonUI(id, available) {
    const btn = document.getElementById(`control${id}`);
    if (!btn) return;
    btn.className = `control-btn ${available ? 'available-btn' : 'unavailable-btn'}`;
    btn.innerHTML = `<i class="fas fa-box"></i> Package ${id}: ${available ? 'AVAILABLE' : 'NOT AVAILABLE'}`;
}

/* ======================== FEATURE 2: NUMBERS AVAILABILITY ======================== */
async function setKeysAvailable(available) {
    if (!requireAuth()) return;
    try {
        const data = await getControlData();
        if (!data.numbers) data.numbers = {};
        data.numbers.keysAvailable = available;
        await saveControlData(data);
        
        const status = document.getElementById('keysStatus');
        if (status) {
            status.innerHTML = available ? 
                '<i class="fas fa-check-circle"></i> Available' : 
                '<i class="fas fa-clock"></i> "Available soon"';
            status.style.color = available ? '#4CAF50' : '#ffc107';
        }
        showNotification(`Digit Keys ${available ? 'AVAILABLE' : 'UNAVAILABLE'}`);
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

async function setPairsAvailable(available) {
    if (!requireAuth()) return;
    try {
        const data = await getControlData();
        if (!data.numbers) data.numbers = {};
        data.numbers.pairsAvailable = available;
        await saveControlData(data);
        
        const status = document.getElementById('pairsStatus');
        if (status) {
            status.innerHTML = available ? 
                '<i class="fas fa-check-circle"></i> Available' : 
                '<i class="fas fa-hourglass-half"></i> "Not available"';
            status.style.color = available ? '#4CAF50' : '#ffc107';
        }
        showNotification(`Number Pairs ${available ? 'AVAILABLE' : 'UNAVAILABLE'}`);
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

function setBothAvailable() { setKeysAvailable(true); setPairsAvailable(true); }
function setBothUnavailable() { setKeysAvailable(false); setPairsAvailable(false); }

/* ======================== FEATURE 3: QUICK CODE EDITOR ======================== */
async function updateMorningCodeGlobal() {
    if (!requireAuth()) return;
    const input = document.getElementById('morningCodeInput');
    if (!input) return;
    
    const code = input.value.trim();
    if (code !== '--' && !/^\d\s\d$/.test(code)) {
        return showNotification('Use format: "2 4" or "--"', 'error');
    }
    
    try {
        const data = await getControlData();
        if (!data.codes) data.codes = {};
        data.codes.morning = code;
        await saveControlData(data);
        showNotification(`Morning code: ${code}`);
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

async function updateEveningCodeGlobal() {
    if (!requireAuth()) return;
    const input = document.getElementById('eveningCodeInput');
    if (!input) return;
    
    const code = input.value.trim();
    if (code !== '--' && !/^\d\s\d$/.test(code)) {
        return showNotification('Use format: "3 4" or "--"', 'error');
    }
    
    try {
        const data = await getControlData();
        if (!data.codes) data.codes = {};
        data.codes.evening = code;
        await saveControlData(data);
        showNotification(`Evening code: ${code}`);
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

/* ======================== FEATURE 4: KEYS DISPLAY ======================== */
async function setKeysGlobally(enabled) {
    if (!requireAuth()) return;
    try {
        const data = await getControlData();
        data.keys = { enabled, lastUpdated: new Date().toISOString() };
        await saveControlData(data);
        
        const status = document.getElementById('keysGlobalStatus');
        if (status) {
            status.innerHTML = enabled ? 
                '<span style="color:#4CAF50">● ENABLED</span>' : 
                '<span style="color:#f44336">● DISABLED</span>';
        }
        showNotification(`Keys ${enabled ? 'ENABLED' : 'DISABLED'}`);
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

/* ======================== FEATURE 5: CLOSING SYSTEM ======================== */
async function updateClosingGlobally(updates) {
    if (!requireAuth()) return;
    try {
        const data = await getControlData();
        if (!data.closing) data.closing = {};
        Object.assign(data.closing, updates, { lastUpdated: new Date().toISOString() });
        await saveControlData(data);
        await loadClosingConfig();
        showNotification('Closing config updated');
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

async function toggleClosingDayGlobal(day) {
    const data = await getControlData();
    const days = data.closing?.weeklyClosedDays || [];
    const newDays = days.includes(day) ? days.filter(d => d !== day) : [...days, day];
    await updateClosingGlobally({ weeklyClosedDays: newDays });
}

async function addSpecialDateGlobal() {
    const input = document.getElementById('specialDateInput');
    if (!input?.value) return showNotification('Select a date', 'error');
    
    const data = await getControlData();
    const dates = data.closing?.specialClosedDates || [];
    if (!dates.includes(input.value)) {
        dates.push(input.value);
        await updateClosingGlobally({ specialClosedDates: dates });
        input.value = '';
    } else {
        showNotification('Date already exists', 'error');
    }
}

async function removeSpecialDateGlobal(date) {
    const data = await getControlData();
    const dates = data.closing?.specialClosedDates.filter(d => d !== date) || [];
    await updateClosingGlobally({ specialClosedDates: dates });
}

async function forceCloseToday() { await updateClosingGlobally({ forceToday: 'closed' }); }
async function forceOpenToday() { await updateClosingGlobally({ forceToday: 'open' }); }
async function resetForceToday() { await updateClosingGlobally({ forceToday: null }); }

async function loadClosingConfig() {
    const data = await getControlData();
    const closing = data.closing || {};
    
    // Update day buttons
    document.querySelectorAll('.day-btn').forEach(btn => {
        const day = parseInt(btn.dataset.day);
        if (closing.weeklyClosedDays?.includes(day)) {
            btn.classList.add('closed');
            btn.style.background = '#f44336';
        } else {
            btn.classList.remove('closed');
            btn.style.background = '#4CAF50';
        }
    });
    
    // Update special dates list
    const list = document.getElementById('specialDatesList');
    if (list) {
        const dates = closing.specialClosedDates || [];
        list.innerHTML = dates.length ? dates.map(d => `
            <div class="date-item">
                <span>${d}</span>
                <button onclick="removeSpecialDateGlobal('${d}')" class="remove-date">✖</button>
            </div>
        `).join('') : '<div class="no-dates">No special closing dates</div>';
    }
    
    // Update force status
    const forceEl = document.getElementById('forceTodayStatus');
    if (forceEl) {
        const f = closing.forceToday;
        forceEl.innerHTML = f === 'closed' ? '<span style="color:#f44336">FORCE CLOSED</span>' :
                           f === 'open' ? '<span style="color:#4CAF50">FORCE OPEN</span>' :
                           '<span style="color:#aaa">Auto</span>';
    }
}

/* ======================== KEYS & NUMBERS CONTROL ======================== */
class NumbersControl {
    constructor() {
        this.keys = [0, 0, 0, 0];
        this.activeKeys = [true, true, true, true];
        this.numberRows = [
            "12.13.14.15.16",
            "12.13.14.15.16", 
            "12.13.14.15.16",
            "- R👈"
        ];
        this.init();
    }
    
    init() {
        this.loadSavedData();
        this.setupEventListeners();
        this.updateAllPreviews();
    }
    
    loadSavedData() {
        const saved = localStorage.getItem('2d_keys_data');
        if (saved) try { this.keys = JSON.parse(saved); } catch(e) {}
        
        const active = localStorage.getItem('2d_active_keys');
        if (active) try { this.activeKeys = JSON.parse(active); } catch(e) {}
        
        const nums = localStorage.getItem('2d_numbers_data');
        if (nums) try { this.numberRows = JSON.parse(nums); } catch(e) {}
        
        this.updateInputFields();
    }
    
    updateInputFields() {
        for (let i = 0; i < 4; i++) {
            const inp = document.getElementById(`key${i+1}`);
            if (inp) {
                inp.value = this.keys[i];
                inp.disabled = !this.activeKeys[i];
                inp.style.opacity = this.activeKeys[i] ? '1' : '0.5';
            }
        }
        
        for (let i = 0; i < 4; i++) {
            const inp = document.getElementById(`row${i+1}`);
            if (inp) inp.value = this.numberRows[i];
        }
        
        document.querySelectorAll('.key-visibility-toggle').forEach((t, i) => {
            t.textContent = this.activeKeys[i] ? 'Hide' : 'Show';
            t.classList.toggle('active', !this.activeKeys[i]);
        });
    }
    
    setupEventListeners() {
        // Key inputs
        for (let i = 1; i <= 4; i++) {
            document.getElementById(`key${i}`)?.addEventListener('input', (e) => {
                let val = parseInt(e.target.value) || 0;
                if (val < 0) val = 0;
                if (val > 9) val = 9;
                this.keys[i-1] = val;
                this.updateKeyPreviews();
            });
        }
        
        // Number inputs
        for (let i = 1; i <= 4; i++) {
            document.getElementById(`row${i}`)?.addEventListener('input', (e) => {
                this.numberRows[i-1] = e.target.value;
                this.updateNumberPreviews();
            });
        }
        
        // Update buttons
        document.querySelector('.update-keys-btn')?.addEventListener('click', () => this.updateKeys());
        document.querySelector('.update-numbers-btn')?.addEventListener('click', () => this.updateNumbers());
        
        // Quick actions
        document.querySelector('.random-keys-btn')?.addEventListener('click', () => this.generateRandomKeys());
        document.querySelector('.random-numbers-btn')?.addEventListener('click', () => this.generateRandomNumbers());
        document.querySelector('.reset-all-btn')?.addEventListener('click', () => this.resetToDefault());
        
        // Visibility toggles
        document.querySelectorAll('.key-visibility-toggle').forEach((t, i) => {
            t.addEventListener('click', () => {
                this.activeKeys[i] = !this.activeKeys[i];
                t.textContent = this.activeKeys[i] ? 'Hide' : 'Show';
                t.classList.toggle('active', !this.activeKeys[i]);
                
                const inp = document.getElementById(`key${i+1}`);
                if (inp) {
                    inp.disabled = !this.activeKeys[i];
                    inp.style.opacity = this.activeKeys[i] ? '1' : '0.5';
                }
                this.updateKeyPreviews();
            });
        });
        
        // Quick setup
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const num = parseInt(e.target.dataset.keys);
                for (let i = 0; i < 4; i++) this.activeKeys[i] = i < num;
                this.updateInputFields();
                this.updateKeyPreviews();
                document.querySelectorAll('.quick-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }
    
    updateKeyPreviews() {
        for (let i = 1; i <= 4; i++) {
            const prev = document.getElementById(`previewKey${i}`);
            if (prev) {
                prev.textContent = this.activeKeys[i-1] ? this.keys[i-1] : '?';
                prev.style.color = this.activeKeys[i-1] ? '#fff' : '#aaa';
            }
        }
    }
    
    updateNumberPreviews() {
        for (let i = 1; i <= 4; i++) {
            const prev = document.getElementById(`previewRow${i}`);
            if (prev) prev.textContent = this.numberRows[i-1];
        }
    }
    
    updateAllPreviews() { this.updateKeyPreviews(); this.updateNumberPreviews(); }
    
    async saveKeysToJSONBin() {
        try {
            const data = await getControlData();
            if (!data.keys) data.keys = {};
            data.keys.values = this.keys;
            data.keys.active = this.activeKeys;
            data.keys.enabled = true;
            await saveControlData(data);
            console.log('Keys saved:', this.keys, this.activeKeys);
        } catch (e) { console.error('Save error:', e); }
    }
    
    async saveNumbersToJSONBin() {
        try {
            const data = await getControlData();
            if (!data.numbers) data.numbers = {};
            data.numbers.rows = this.numberRows;
            await saveControlData(data);
        } catch (e) { console.error('Save error:', e); }
    }
    
    async updateKeys() {
        localStorage.setItem('2d_keys_data', JSON.stringify(this.keys));
        localStorage.setItem('2d_active_keys', JSON.stringify(this.activeKeys));
        await this.saveKeysToJSONBin();
        this.dispatchUpdate();
        showNotification('Keys updated globally!');
    }
    
    async updateNumbers() {
        localStorage.setItem('2d_numbers_data', JSON.stringify(this.numberRows));
        await this.saveNumbersToJSONBin();
        this.dispatchUpdate();
        showNotification('Numbers updated globally!');
    }
    
    generateRandomKeys() {
        this.keys = Array.from({length:4}, () => Math.floor(Math.random()*10));
        this.updateInputFields();
        this.updateKeyPreviews();
        this.updateKeys();
    }
    
    generateRandomNumbers() {
        for (let i = 0; i < 3; i++) {
            this.numberRows[i] = Array.from({length:5}, () => 
                Math.floor(Math.random()*90+10).toString().padStart(2,'0')
            ).join('.');
        }
        this.numberRows[3] = "- R👈";
        this.updateInputFields();
        this.updateNumberPreviews();
        this.updateNumbers();
    }
    
    resetToDefault() {
        if (!confirm('Reset all keys and numbers to default?')) return;
        this.keys = [0,0,0,0];
        this.activeKeys = [true,true,true,true];
        this.numberRows = ["12.13.14.15.16", "12.13.14.15.16", "12.13.14.15.16", "- R👈"];
        this.updateInputFields();
        this.updateAllPreviews();
        localStorage.setItem('2d_keys_data', JSON.stringify(this.keys));
        localStorage.setItem('2d_active_keys', JSON.stringify(this.activeKeys));
        localStorage.setItem('2d_numbers_data', JSON.stringify(this.numberRows));
        this.saveKeysToJSONBin();
        this.saveNumbersToJSONBin();
        this.dispatchUpdate();
        showNotification('Reset to default!');
    }
    
    dispatchUpdate() {
        window.dispatchEvent(new CustomEvent('numbersUpdated', {
            detail: { keys: this.keys, activeKeys: this.activeKeys, numberRows: this.numberRows }
        }));
    }
}

/* ======================== LOAD ALL FEATURES ======================== */
async function loadAllFeatures() {
    if (!adminPassword?.isAuth()) return;
    const data = await getControlData();
    
    // Feature 1: VIP
    if (data.vip) {
        [1,2,3].forEach(id => {
            if (data.vip[id] !== undefined) updateButtonUI(id, data.vip[id]);
        });
    }
    
    // Feature 2: Numbers
    if (data.numbers) {
        const keys = document.getElementById('keysStatus');
        if (keys && data.numbers.keysAvailable !== undefined) {
            keys.innerHTML = data.numbers.keysAvailable ? 
                '<i class="fas fa-check-circle"></i> Available' : 
                '<i class="fas fa-clock"></i> "Available soon"';
            keys.style.color = data.numbers.keysAvailable ? '#4CAF50' : '#ffc107';
        }
        
        const pairs = document.getElementById('pairsStatus');
        if (pairs && data.numbers.pairsAvailable !== undefined) {
            pairs.innerHTML = data.numbers.pairsAvailable ? 
                '<i class="fas fa-check-circle"></i> Available' : 
                '<i class="fas fa-hourglass-half"></i> "Not available"';
            pairs.style.color = data.numbers.pairsAvailable ? '#4CAF50' : '#ffc107';
        }
    }
    
    // Feature 3: Codes
    if (data.codes) {
        const morn = document.getElementById('morningCodeInput');
        if (morn && data.codes.morning) morn.value = data.codes.morning;
        const eve = document.getElementById('eveningCodeInput');
        if (eve && data.codes.evening) eve.value = data.codes.evening;
    }
    
    // Feature 4: Keys
    if (data.keys) {
        const status = document.getElementById('keysGlobalStatus');
        if (status) {
            status.innerHTML = data.keys.enabled ? 
                '<span style="color:#4CAF50">● ENABLED</span>' : 
                '<span style="color:#f44336">● DISABLED</span>';
        }
    }
    
    // Feature 5: Closing
    if (data.closing) await loadClosingConfig();
}

/* ======================== NOTIFICATION SYSTEM ======================== */
async function sendNotification() {
    if (!requireAuth()) return;
    const input = document.getElementById('msgInput');
    const text = input.value.trim();
    if (!text) return alert('Type a message');
    
    try {
        // FIXED: Get current data first
        const res = await fetch(`${NOTI_BIN_URL}/latest`, {
            headers: { "X-Master-Key": NOTI_MASTER_KEY }
        });
        const json = await res.json();
        const data = json.record;
        
        // Ensure notifications array exists
        if (!data.notifications) data.notifications = [];
        
        // Add new notification
        data.notifications.push({
            id: Date.now().toString(),
            text: text,
            time: Date.now()
        });
        
        // Keep only last 50 notifications to prevent bin from growing too large
        if (data.notifications.length > 50) {
            data.notifications = data.notifications.slice(-50);
        }
        
        // Save back to JSONBin
        const saveRes = await fetch(NOTI_BIN_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": NOTI_MASTER_KEY
            },
            body: JSON.stringify(data)
        });
        
        if (saveRes.ok) {
            input.value = "";
            showNotification("✅ Notification sent!");
            console.log('Notification sent:', text); // Debug log
        } else {
            throw new Error('Save failed');
        }
    } catch (err) {
        console.error('Send error:', err);
        showNotification("❌ Failed to send", "error");
    }
}


/* ======================== INITIALIZATION ======================== */
let adminPassword, numbersControl;

document.addEventListener('DOMContentLoaded', () => {
    adminPassword = new AdminPassword();
    numbersControl = new NumbersControl();
    setInterval(() => adminPassword?.isAuth() && loadAllFeatures(), 5000);
});

// Global exports
window.requireAuth = requireAuth;
window.togglePackage = togglePackage;
window.setKeysAvailable = setKeysAvailable;
window.setPairsAvailable = setPairsAvailable;
window.setBothAvailable = setBothAvailable;
window.setBothUnavailable = setBothUnavailable;
window.updateMorningCodeGlobal = updateMorningCodeGlobal;
window.updateEveningCodeGlobal = updateEveningCodeGlobal;
window.setKeysGlobally = setKeysGlobally;
window.toggleClosingDayGlobal = toggleClosingDayGlobal;
window.addSpecialDateGlobal = addSpecialDateGlobal;
window.removeSpecialDateGlobal = removeSpecialDateGlobal;
window.forceCloseToday = forceCloseToday;
window.forceOpenToday = forceOpenToday;
window.resetForceToday = resetForceToday;
window.sendNotification = sendNotification;