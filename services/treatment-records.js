const RECORDS = [
    {
        id: 'TR-2026-041',
        date: '2026-06-22',
        time: '14:30',
        customer: '김*진',
        category: 'cut',
        categoryLabel: '컷 & 스타일링',
        service: '레이어드 컷 + 드라이 스타일링',
        stylist: '임*회',
        duration: '60분',
        status: 'done',
        statusLabel: '완료',
        note: '얼굴형 보완 레이어, 앞머리 시스루 뱅 적용'
    },
    {
        id: 'TR-2026-040',
        date: '2026-06-21',
        time: '11:00',
        customer: '박*영',
        category: 'color',
        categoryLabel: '염색 / 탈색',
        service: '애쉬 브라운 톤다운 염색',
        stylist: '임*회',
        duration: '150분',
        status: 'done',
        statusLabel: '완료',
        note: '손상 최소화 케어 포함, 4주 후 리터치 권장'
    },
    {
        id: 'TR-2026-039',
        date: '2026-06-20',
        time: '16:00',
        customer: '이*서',
        category: 'perm',
        categoryLabel: '펌 / 매직',
        service: '볼륨 C컬 디지털 펌',
        stylist: '임*회',
        duration: '180분',
        status: 'done',
        statusLabel: '완료',
        note: '뿌리 볼륨 강조, 자연스러운 웨이브 연출'
    },
    {
        id: 'TR-2026-038',
        date: '2026-06-19',
        time: '10:30',
        customer: '최*우',
        category: 'cut',
        categoryLabel: '컷 & 스타일링',
        service: '남성 가일 컷 + 두피 케어',
        stylist: '임*회',
        duration: '45분',
        status: 'done',
        statusLabel: '완료',
        note: '사이드 라인 정리, 가벼운 스타일링 왁스 사용'
    },
    {
        id: 'TR-2026-037',
        date: '2026-06-18',
        time: '13:00',
        customer: '정*아',
        category: 'color',
        categoryLabel: '염색 / 탈색',
        service: '핑크 베이지 탈색 + 풀컬러',
        stylist: '임*회',
        duration: '240분',
        status: 'done',
        statusLabel: '완료',
        note: '2회 탈색 후 컬러 입혀, 트리트먼트 2회 시행'
    },
    {
        id: 'TR-2026-036',
        date: '2026-06-17',
        time: '15:30',
        customer: '한*비',
        category: 'perm',
        categoryLabel: '펌 / 매직',
        service: '스트레이트 매직 (생머리)',
        stylist: '임*회',
        duration: '200분',
        status: 'done',
        statusLabel: '완료',
        note: '뿌리 매직 포함, 윤기 케어 마무리'
    },
    {
        id: 'TR-2026-035',
        date: '2026-06-16',
        time: '12:00',
        customer: '윤*호',
        category: 'care',
        categoryLabel: '클리닉 / 케어',
        service: '단백질 집중 트리트먼트',
        stylist: '임*회',
        duration: '40분',
        status: 'done',
        statusLabel: '완료',
        note: '손상모 집중 케어, 홈케어 제품 안내'
    },
    {
        id: 'TR-2026-034',
        date: '2026-06-15',
        time: '17:00',
        customer: '송*연',
        category: 'cut',
        categoryLabel: '컷 & 스타일링',
        service: '허쉬컷 + 앞머리 컷',
        stylist: '임*회',
        duration: '70분',
        status: 'done',
        statusLabel: '완료',
        note: '가벼운 텍스처컷, 자연스러운 층감 연출'
    },
    {
        id: 'TR-2026-033',
        date: '2026-06-23',
        time: '11:30',
        customer: '강*민',
        category: 'color',
        categoryLabel: '염색 / 탈색',
        service: '브릿지 하이라이트 염색',
        stylist: '임*회',
        duration: '120분',
        status: 'progress',
        statusLabel: '시술 중',
        note: '앞머리·측면 포인트 브릿지 진행 중'
    },
    {
        id: 'TR-2026-032',
        date: '2026-06-23',
        time: '15:00',
        customer: '오*현',
        category: 'perm',
        categoryLabel: '펌 / 매직',
        service: 'S컬 볼륨펌 예약',
        stylist: '임*회',
        duration: '160분',
        status: 'booked',
        statusLabel: '예약',
        note: '오후 3시 방문 예정, 상담 후 컬 강도 조절'
    }
];

const CATEGORY_META = {
    all: { label: '전체', badge: 'badge-etc' },
    cut: { label: '컷 & 스타일링', badge: 'badge-cut' },
    color: { label: '염색 / 탈색', badge: 'badge-color' },
    perm: { label: '펌 / 매직', badge: 'badge-perm' },
    care: { label: '클리닉 / 케어', badge: 'badge-care' }
};

const STATUS_CLASS = {
    done: 'status-done',
    progress: 'status-progress',
    booked: 'status-booked'
};

function getCategoryFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('category') || 'all';
}

function renderFilter(activeCategory) {
    const container = document.getElementById('category-filter');
    const chips = Object.entries(CATEGORY_META).map(([key, meta]) => {
        const isActive = key === activeCategory;
        return `
            <button type="button" data-category="${key}"
                    class="filter-chip shrink-0 px-3 py-2 sm:py-1.5 rounded-full text-xs font-medium transition-colors
                           ${isActive
                               ? 'bg-rose-600 text-white'
                               : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700'}">
                ${meta.label}
            </button>
        `;
    }).join('');

    container.innerHTML = `
        <span class="text-xs text-zinc-500 dark:text-zinc-400 self-center mr-1 shrink-0">시술 분류</span>
        ${chips}
    `;

    container.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const category = chip.dataset.category;
            const url = new URL(window.location.href);
            if (category === 'all') {
                url.searchParams.delete('category');
            } else {
                url.searchParams.set('category', category);
            }
            window.history.replaceState({}, '', url);
            init();
        });
    });
}

function renderRecords(category) {
    const list = document.getElementById('records-list');
    const filtered = category === 'all'
        ? RECORDS
        : RECORDS.filter(r => r.category === category);

    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="text-center py-12 text-zinc-400">
                <i class="fa-solid fa-inbox text-3xl mb-3"></i>
                <p>해당 분류의 시술 기록이 없습니다.</p>
            </div>
        `;
        return;
    }

    list.innerHTML = filtered.map(record => {
        const badgeClass = CATEGORY_META[record.category]?.badge || 'badge-etc';
        const statusClass = STATUS_CLASS[record.status] || '';
        const highlight = category !== 'all' && record.category === category ? 'highlight' : '';

        return `
            <article class="record-card bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 ${highlight}">
                <div class="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-xs font-mono text-zinc-400">${record.id}</span>
                        <span class="badge px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}">
                            ${record.categoryLabel}
                        </span>
                    </div>
                    <span class="text-sm font-semibold ${statusClass}">
                        <i class="fa-solid fa-circle text-[6px] align-middle mr-1"></i>
                        ${record.statusLabel}
                    </span>
                </div>

                <h2 class="font-semibold text-base mb-1">${record.service}</h2>
                <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-4">${record.note}</p>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-sm">
                    <div>
                        <div class="text-xs text-zinc-400 mb-0.5">고객</div>
                        <div class="font-medium">${record.customer}</div>
                    </div>
                    <div>
                        <div class="text-xs text-zinc-400 mb-0.5">담당</div>
                        <div class="font-medium">${record.stylist}</div>
                    </div>
                    <div>
                        <div class="text-xs text-zinc-400 mb-0.5">일시</div>
                        <div class="font-medium text-xs sm:text-sm">${record.date}<br class="sm:hidden"><span class="hidden sm:inline"> </span>${record.time}</div>
                    </div>
                    <div>
                        <div class="text-xs text-zinc-400 mb-0.5">소요</div>
                        <div class="font-medium">${record.duration}</div>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

function updateHeader(category) {
    const title = document.getElementById('records-title');
    const subtitle = document.getElementById('records-subtitle');

    if (category === 'all') {
        title.textContent = '미용시술 기록';
        subtitle.textContent = '최근 시술 내역 샘플 (10건)';
    } else {
        const label = CATEGORY_META[category]?.label || '시술';
        const count = RECORDS.filter(r => r.category === category).length;
        title.textContent = `${label} 기록`;
        subtitle.textContent = `${label} 시술 내역 (${count}건)`;
    }
}

function init() {
    const category = getCategoryFromUrl();
    updateHeader(category);
    renderFilter(category);
    renderRecords(category);
}

document.addEventListener('DOMContentLoaded', init);