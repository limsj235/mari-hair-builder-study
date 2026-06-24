(function () {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.classList.add('dark');
    }
})();

const SALON_PHONE = '0317269790';

function isMobileDevice() {
    const ua = navigator.userAgent || '';
    const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
    const touchPrimary = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    return mobileUA || touchPrimary;
}

function dialSalon() {
    window.location.href = `tel:${SALON_PHONE}`;
}

function initPhoneReservation() {
    const mobile = isMobileDevice();

    document.querySelectorAll('.js-phone-call').forEach(el => {
        if (mobile) {
            el.href = `tel:${SALON_PHONE}`;
            el.classList.remove('hidden', 'pointer-events-none', 'opacity-60', 'cursor-default');
            el.removeAttribute('aria-disabled');
        } else {
            el.removeAttribute('href');
            el.classList.add('hidden');
            el.setAttribute('aria-disabled', 'true');
        }
    });

    document.querySelectorAll('.js-phone-display').forEach(el => {
        el.classList.toggle('hidden', mobile);
    });

    document.querySelectorAll('.js-phone-hint-mobile').forEach(el => {
        el.classList.toggle('hidden', !mobile);
    });

    document.querySelectorAll('.js-phone-hint-desktop').forEach(el => {
        el.classList.toggle('hidden', mobile);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c마리 미용실 웹페이지가 로드되었습니다.', 'color:#e11d48; font-family:monospace');

    initPhoneReservation();

    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;

    function setTheme(theme) {
        const isDark = theme === 'dark';
        root.classList.toggle('dark', isDark);
        localStorage.setItem('theme', theme);
    }

    themeToggle.addEventListener('click', () => {
        const nextTheme = root.classList.contains('dark') ? 'light' : 'dark';
        setTheme(nextTheme);
    });

    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuIconOpen = document.getElementById('mobile-menu-icon-open');
    const mobileMenuIconClose = document.getElementById('mobile-menu-icon-close');

    function closeMobileMenu() {
        if (!mobileMenu || mobileMenu.classList.contains('hidden')) return;
        mobileMenu.classList.add('hidden');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-label', '메뉴 열기');
        mobileMenuIconOpen.classList.remove('hidden');
        mobileMenuIconClose.classList.add('hidden');
        document.body.classList.remove('mobile-menu-open');
    }

    function openMobileMenu() {
        mobileMenu.classList.remove('hidden');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        mobileMenuToggle.setAttribute('aria-label', '메뉴 닫기');
        mobileMenuIconOpen.classList.add('hidden');
        mobileMenuIconClose.classList.remove('hidden');
        document.body.classList.add('mobile-menu-open');
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            if (mobileMenu.classList.contains('hidden')) {
                openMobileMenu();
            } else {
                closeMobileMenu();
            }
        });
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            closeMobileMenu();
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            if (this.getAttribute('href') === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (this.classList.contains('js-reserve-call') && isMobileDevice()) {
                dialSalon();
            } else {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
            closeMobileMenu();
        });
    });

    const TREATMENT_RECORDS_PATH = 'services/treatment-records.html';

    const servicesModal = document.getElementById('services-modal');
    const servicesIframe = document.getElementById('services-iframe');
    const servicesCloseBtn = document.getElementById('services-modal-close');
    const servicesBackdrop = document.getElementById('services-modal-backdrop');

    function openServicesModal(category = 'all') {
        const query = category && category !== 'all' ? `?category=${category}` : '';
        servicesIframe.src = `${TREATMENT_RECORDS_PATH}${query}`;
        servicesModal.classList.remove('hidden');
        servicesModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }

    function closeServicesModal() {
        servicesModal.classList.add('hidden');
        servicesModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        servicesIframe.src = '';
    }

    document.querySelectorAll('.service-open-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            openServicesModal(btn.dataset.serviceCategory);
        });
    });

    const allServicesBtn = document.getElementById('all-services-open-btn');
    if (allServicesBtn) {
        allServicesBtn.addEventListener('click', () => {
            openServicesModal(allServicesBtn.dataset.serviceCategory);
        });
    }

    servicesCloseBtn.addEventListener('click', closeServicesModal);
    servicesBackdrop.addEventListener('click', closeServicesModal);

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (!servicesModal.classList.contains('hidden')) {
            closeServicesModal();
        } else {
            closeMobileMenu();
        }
    });
});