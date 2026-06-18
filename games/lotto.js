let history = [];

function getRandomNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

function getColorClass(num) {
    if (num <= 10) return 'bg-gradient-to-br from-yellow-400 to-amber-500';
    if (num <= 20) return 'bg-gradient-to-br from-blue-500 to-cyan-500';
    if (num <= 30) return 'bg-gradient-to-br from-red-500 to-rose-500';
    if (num <= 40) return 'bg-gradient-to-br from-green-500 to-emerald-500';
    return 'bg-gradient-to-br from-purple-500 to-violet-500';
}

function generateLotto() {
    const btn = document.getElementById('generateBtn');
    const dice = document.getElementById('diceIcon');
    const resultDiv = document.getElementById('result');

    btn.disabled = true;
    dice.classList.add('fa-spin');
    resultDiv.innerHTML = '<div class="text-4xl text-zinc-600 font-light animate-pulse">번호 추첨중...</div>';

    setTimeout(() => {
        const numbers = getRandomNumbers();
        const bonus = Math.floor(Math.random() * 45) + 1;

        resultDiv.innerHTML = numbers.map((num) =>
            `<div class="lotto-ball ${getColorClass(num)}">${num}</div>`
        ).join('');

        document.getElementById('bonusBall').textContent = bonus;
        document.getElementById('bonusContainer').classList.remove('hidden');

        const date = new Date();
        const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

        history.unshift({ numbers, bonus, time: timeStr });
        if (history.length > 10) history.pop();

        renderHistory();
        btn.disabled = false;
        dice.classList.remove('fa-spin');
    }, 1200);
}

function renderHistory() {
    const historyDiv = document.getElementById('history');

    historyDiv.innerHTML = history.length ? history.map((item) => {
        const numHTML = item.numbers.map((num) =>
            `<span class="inline-block w-8 h-8 text-sm rounded-full ${getColorClass(num)} flex items-center justify-center mx-0.5">${num}</span>`
        ).join('');

        return `
            <div class="bg-zinc-800/70 rounded-2xl p-5 flex items-center justify-between group">
                <div>
                    <div class="text-xs text-zinc-500 mb-2">${item.time}</div>
                    <div class="flex items-center">${numHTML}</div>
                </div>
                <div class="text-right">
                    <div class="text-xs text-amber-400">보너스</div>
                    <div class="text-2xl font-bold text-amber-400">${item.bonus}</div>
                </div>
            </div>
        `;
    }).join('') : `
        <div class="text-center py-12 text-zinc-600">
            아직 생성된 번호가 없습니다.<br>
            버튼을 눌러 행운의 번호를 뽑아보세요!
        </div>
    `;

    document.getElementById('historyCount').textContent = `${history.length}회`;
}

function copyNumbers(button) {
    if (history.length === 0) {
        alert('먼저 번호를 생성해주세요!');
        return;
    }

    const latest = history[0];
    const text = `로또 6/45\n${latest.numbers.join(', ')}\n보너스: ${latest.bonus}\n${latest.time}`;

    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fa-solid fa-check"></i> 복사 완료!';
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    });
}

function clearHistory() {
    if (confirm('모든 생성 기록을 지우시겠습니까?')) {
        history = [];
        renderHistory();
        document.getElementById('result').innerHTML = '';
        document.getElementById('bonusContainer').classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.self !== window.top) {
        document.body.classList.add('modal-embed');
    }

    document.getElementById('generateBtn').addEventListener('click', generateLotto);
    document.getElementById('copyBtn').addEventListener('click', function () {
        copyNumbers(this);
    });
    document.getElementById('clearBtn').addEventListener('click', clearHistory);

    renderHistory();
    setTimeout(generateLotto, 800);
});