// Main Client-Side Controller for Campus Haven
const app = {
    showHome() {
        document.getElementById('view-home').classList.remove('hidden');
        document.getElementById('view-student-reg').classList.add('hidden');
        document.getElementById('view-warden-reg').classList.add('hidden');
        document.getElementById('view-student-dash').classList.add('hidden');
    },

    showStudentRegForm() {
        document.getElementById('view-home').classList.add('hidden');
        document.getElementById('view-student-reg').classList.remove('hidden');
        document.getElementById('view-warden-reg').classList.add('hidden');
        document.getElementById('view-student-dash').classList.add('hidden');
    },

    showWardenRegForm() {
        document.getElementById('view-home').classList.add('hidden');
        document.getElementById('view-student-reg').classList.add('hidden');
        document.getElementById('view-warden-reg').classList.remove('hidden');
        document.getElementById('view-student-dash').classList.add('hidden');
    },

    showToast(message, type = "success") {
        const toast = document.getElementById('toast');
        const msg = document.getElementById('toast-msg');
        if (!toast || !msg) return;

        msg.textContent = message;
        toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
        toast.classList.add('bg-emerald-600', 'text-white', 'shadow-xl');

        setTimeout(() => {
            toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
        }, 3000);
    }
};
