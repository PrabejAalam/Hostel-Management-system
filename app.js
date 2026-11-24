// Main Client-Side Controller for Campus Haven
const NEARBY_SERVICE_PROVIDERS = [
    {
        role: "ELECTRICIAN BLOCK 1-10",
        name: "ramesh kumar",
        phone: "9811100222"
    },
    {
        role: "PLUMBER BLOCK 1-10",
        name: "rajesh kumar",
        phone: "9811100223"
    },
    {
        role: "ROOM CLEANER BLOCK 1-10",
        name: "kaamti",
        phone: "9811100224"
    },
    {
        role: "DOCTOR CLEANER BLOCK 1-10",
        name: "Aayushman kumar",
        phone: "9811100225"
    },
    {
        role: "RAGGING AWARE BLOCK 1-10",
        name: "Ekbal siddiqi",
        phone: "9811100226"
    }
];

const BLOCKS_BY_HOSTEL = {
    "Om Sai Hostel": ["Block 1", "Block 2", "Block 3", "Block 4", "Block 5"],
    "Comfort World Hostel": ["Block 6", "Block 7", "Block 8", "Block 9", "Block 10"]
};

const app = {
    hideAllViews() {
        ['view-home', 'view-student-reg', 'view-warden-reg', 'view-student-dash', 'view-warden-dash'].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });
    },

    showHome() {
        this.hideAllViews();
        document.getElementById('view-home').classList.remove('hidden');
    },

    showStudentRegForm() {
        this.hideAllViews();
        document.getElementById('view-student-reg').classList.remove('hidden');
        const hostelEl = document.getElementById('sreg-hostel');
        if (hostelEl) this.updateBlockDropdown(hostelEl.value, 'sreg-block');
    },

    showWardenRegForm() {
        this.hideAllViews();
        document.getElementById('view-warden-reg').classList.remove('hidden');
        const hostelEl = document.getElementById('wreg-hostel');
        if (hostelEl) this.updateBlockDropdown(hostelEl.value, 'wreg-block');
    },

    showStudentDash() {
        this.hideAllViews();
        document.getElementById('view-student-dash').classList.remove('hidden');
        this.switchStudentTab('profile');
    },

    showWardenDash() {
        this.hideAllViews();
        document.getElementById('view-warden-dash').classList.remove('hidden');
        this.switchWardenTab('overview');
    },

    updateBlockDropdown(hostelName, targetSelectId) {
        const select = document.getElementById(targetSelectId);
        if (!select) return;
        const blocks = BLOCKS_BY_HOSTEL[hostelName] || ["Block 1", "Block 2"];
        select.innerHTML = blocks.map((b) => `<option value="${b}">${b}</option>`).join('');
    },

    handlePhotoPreview(input, containerId) {
        const container = document.getElementById(containerId);
        if (!container || !input.files || !input.files[0]) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            container.innerHTML = `<img src="${e.target.result}" alt="Preview" class="w-full h-full object-cover">`;
        };
        reader.readAsDataURL(input.files[0]);
    },

    renderNearbyServiceProviders(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = NEARBY_SERVICE_PROVIDERS.map((sp) => `
            <div class="bg-white rounded-2xl p-5 shadow-md border border-slate-100 flex flex-col justify-between space-y-3">
                <div class="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700">
                    ${sp.role}
                </div>
                <div class="text-lg font-extrabold text-slate-900">
                    ${sp.name}
                </div>
                <a href="tel:${sp.phone}" class="inline-flex items-center space-x-2 text-sm font-bold text-emerald-700 hover:text-emerald-800">
                    <i class="fa-solid fa-phone"></i>
                    <span>${sp.phone}</span>
                </a>
            </div>
        `).join('');
    },

    switchStudentTab(tabName) {
        const tabs = ['profile', 'complaint', 'leave', 'services'];
        tabs.forEach((t) => {
            const btn = document.getElementById(`stab-btn-${t}`);
            const panel = document.getElementById(`stab-panel-${t}`);
            const isActive = t === tabName;

            if (btn) {
                btn.classList.toggle('border-indigo-600', isActive);
                btn.classList.toggle('text-indigo-600', isActive);
                btn.classList.toggle('font-bold', isActive);
                btn.classList.toggle('border-transparent', !isActive);
                btn.classList.toggle('text-slate-500', !isActive);
                btn.classList.toggle('font-semibold', !isActive);
            }
            if (panel) {
                panel.classList.toggle('hidden', !isActive);
            }
        });

        if (tabName === 'services') {
            this.renderNearbyServiceProviders('student-service-providers-grid');
        }
    },

    switchWardenTab(tabName) {
        const tabs = ['overview', 'services'];
        tabs.forEach((t) => {
            const btn = document.getElementById(`wtab-btn-${t}`);
            const panel = document.getElementById(`wtab-panel-${t}`);
            const isActive = t === tabName;

            if (btn) {
                btn.classList.toggle('border-purple-600', isActive);
                btn.classList.toggle('text-purple-600', isActive);
                btn.classList.toggle('font-bold', isActive);
                btn.classList.toggle('border-transparent', !isActive);
                btn.classList.toggle('text-slate-500', !isActive);
                btn.classList.toggle('font-semibold', !isActive);
            }
            if (panel) {
                panel.classList.toggle('hidden', !isActive);
            }
        });

        if (tabName === 'services') {
            this.renderNearbyServiceProviders('warden-service-providers-grid');
        }
    },

    async handleStudentReg(event) {
        event.preventDefault();
        const pass = document.getElementById('sreg-pass').value;
        const pass2 = document.getElementById('sreg-pass2').value;
        if (pass !== pass2) {
            this.showToast("Passwords do not match!", "error");
            return;
        }

        const payload = {
            name: document.getElementById('sreg-name').value.trim(),
            usn: document.getElementById('sreg-usn').value.trim().toUpperCase(),
            hostel: document.getElementById('sreg-hostel').value,
            block: document.getElementById('sreg-block').value,
            room: document.getElementById('sreg-room').value.trim(),
            phone: document.getElementById('sreg-phone').value.trim(),
            email: document.getElementById('sreg-email').value.trim(),
            password: pass
        };

        try {
            const res = await fetch('/api/register-student', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                this.showToast(data.error || "Registration failed", "error");
                return;
            }
            this.showToast(data.message || "Student registered successfully!");
            event.target.reset();
            this.showHome();
        } catch (err) {
            this.showToast("Server error while registering student", "error");
        }
    },

    async handleWardenReg(event) {
        event.preventDefault();
        const pass = document.getElementById('wreg-pass').value;
        const pass2 = document.getElementById('wreg-pass2').value;
        if (pass !== pass2) {
            this.showToast("Passwords do not match!", "error");
            return;
        }

        const payload = {
            name: document.getElementById('wreg-name').value.trim(),
            employeeId: document.getElementById('wreg-empid').value.trim().toUpperCase(),
            hostel: document.getElementById('wreg-hostel').value,
            block: document.getElementById('wreg-block').value,
            email: document.getElementById('wreg-email').value.trim(),
            phone: document.getElementById('wreg-phone').value.trim(),
            password: pass
        };

        try {
            const res = await fetch('/api/register-warden', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                this.showToast(data.error || "Warden registration failed", "error");
                return;
            }
            this.showToast(data.message || "Warden registered successfully!");
            event.target.reset();
            this.showHome();
        } catch (err) {
            this.showToast("Server error while registering warden", "error");
        }
    },

    showToast(message, type = "success") {
        const toast = document.getElementById('toast');
        const msg = document.getElementById('toast-msg');
        if (!toast || !msg) return;

        msg.textContent = message;
        toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none', 'bg-emerald-600', 'bg-red-600');
        toast.classList.add(type === 'error' ? 'bg-red-600' : 'bg-emerald-600', 'text-white', 'shadow-xl');

        setTimeout(() => {
            toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
        }, 3000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const sHostel = document.getElementById('sreg-hostel');
    if (sHostel) app.updateBlockDropdown(sHostel.value, 'sreg-block');
    const wHostel = document.getElementById('wreg-hostel');
    if (wHostel) app.updateBlockDropdown(wHostel.value, 'wreg-block');
});
