(function () {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.classList.add('dark');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c마리 미용실 웹페이지가 로드되었습니다.', 'color:#e11d48; font-family:monospace');

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

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    const GAME_LOTTO_PATH = 'games/lotto.html';

    const lottoModal = document.getElementById('lotto-modal');
    const lottoIframe = document.getElementById('lotto-iframe');
    const lottoOpenBtn = document.getElementById('lotto-open-btn');
    const lottoCloseBtn = document.getElementById('lotto-modal-close');
    const lottoBackdrop = document.getElementById('lotto-modal-backdrop');

    function openLottoModal() {
        lottoIframe.src = GAME_LOTTO_PATH;
        lottoModal.classList.remove('hidden');
        lottoModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }

    function closeLottoModal() {
        lottoModal.classList.add('hidden');
        lottoModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        lottoIframe.src = '';
    }

    lottoOpenBtn.addEventListener('click', openLottoModal);
    lottoCloseBtn.addEventListener('click', closeLottoModal);
    lottoBackdrop.addEventListener('click', closeLottoModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lottoModal.classList.contains('hidden')) {
            closeLottoModal();
        }
    });
});