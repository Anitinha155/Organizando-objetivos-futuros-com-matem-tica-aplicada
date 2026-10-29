// Inicialização de Ícones Lucide
lucide.createIcons();

// --- Alternador de Tema (Dark Mode) ---
const themeToggleBtn = document.getElementById('themeToggle');
themeToggleBtn.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
});

// --- Chart.js: Configuração Global para Dark Mode ---
Chart.defaults.font.family = 'Inter, sans-serif';

function getChartTextColor() {
  return document.documentElement.classList.contains('dark') ? '#94a3b8' : '#64748b';
}

// --- 1. CALCULADORA DE JUROS COMPOSTOS ---
let financeChart;

function calculateFinance() {
  const P = parseFloat(document.getElementById('principal').value) || 0;
  const A = parseFloat(document.getElementById('monthly').value) || 0;
  const annualRate = parseFloat(document.getElementById('rate').value) || 0;
  const years = parseInt(document.getElementById('years').value) || 0;

  const months = years * 12;
  const monthlyRate = Math.pow(1 + annualRate / 100, 1 / 12) - 1;

  const labels = [];
  const investedData = [];
  const balanceData = [];

  let currentBalance = P;
  let totalInvested = P;

  for (let m = 0; m <= months; m++) {
    if (m === 0) {
      labels.push('Início');
      investedData.push(P);
      balanceData.push(P);
    } else {
      currentBalance = currentBalance * (1 + monthlyRate) + A;
      totalInvested += A;

      if (m % 12 === 0 || m === months) {
        labels.push(`Ano ${Math.floor(m / 12)}`);
        investedData.push(Math.round(totalInvested));
        balanceData.push(Math.round(currentBalance));
      }
    }
  }

  const interestGained = currentBalance - totalInvested;

  document.getElementById('totalInvested').innerText = totalInvested.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  document.getElementById('totalInterest').innerText = interestGained.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  document.getElementById('finalBalance').innerText = currentBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  updateFinanceChart(labels, investedData, balanceData);
}

function updateFinanceChart(labels, invested, total) {
  const ctx = document.getElementById('financeChart').getContext('2d');
  
  if (financeChart) financeChart.destroy();

  financeChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Montante Total (R$)',
          data: total,
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: true,
          tension: 0.3
        },
        {
          label: 'Total Aportado (R$)',
          data: invested,
          borderColor: '#64748b',
          borderDash: [5, 5],
          fill: false,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: getChartTextColor() } }
      },
      scales: {
        x: { ticks: { color: getChartTextColor() } },
        y: { ticks: { color: getChartTextColor() } }
      }
    }
  });
}

['principal', 'monthly', 'rate', 'years'].forEach(id => {
  document.getElementById(id).addEventListener('input', calculateFinance);
});


// --- 2. GESTÃO DO TEMPO ---
let timeChart;

function updateTimeManagement() {
  const sleep = parseFloat(document.getElementById('sleepTime').value) || 0;
  const work = parseFloat(document.getElementById('workTime').value) || 0;
  const health = parseFloat(document.getElementById('healthTime').value) || 0;
  const leisure = parseFloat(document.getElementById('leisureTime').value) || 0;

  const used = sleep + work + health + leisure;
  const remaining = 24 - used;

  const statusEl = document.getElementById('timeStatus');

  if (remaining < 0) {
    statusEl.className = "p-4 rounded-xl text-sm font-semibold flex items-center gap-2 bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300";
    statusEl.innerHTML = `<i data-lucide="alert-circle" class="w-5 h-5"></i> Alerta: Ultrapassou 24h em ${Math.abs(remaining).toFixed(1)}h!`;
  } else {
    statusEl.className = "p-4 rounded-xl text-sm font-semibold flex items-center gap-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
    statusEl.innerHTML = `<i data-lucide="check-circle" class="w-5 h-5"></i> Tempo Livre Disponível: ${remaining.toFixed(1)} horas/dia`;
  }
  lucide.createIcons();

  const data = [sleep, work, health, leisure];
  const chartLabels = ['Sono', 'Trabalho/Estudo', 'Saúde/Exercício', 'Lazer/Família'];
  
  if (remaining > 0) {
    data.push(remaining);
    chartLabels.push('Tempo Livre');
  }

  const ctx = document.getElementById('timeChart').getContext('2d');
  if (timeChart) timeChart.destroy();

  timeChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: chartLabels,
      datasets: [{
        data: data,
        backgroundColor: ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#94a3b8']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: getChartTextColor() } }
      }
    }
  });
}

document.querySelectorAll('.time-input').forEach(input => {
  input.addEventListener('input', updateTimeManagement);
});


// --- 3. REGRA DO 1% (CRESCIMENTO EXPONENCIAL) ---
function renderGrowthChart() {
  const labels = Array.from({length: 12}, (_, i) => `Mês ${(i+1)}`);
  const growth1Percent = [];
  const decay1Percent = [];

  for (let m = 1; m <= 12; m++) {
    const days = m * 30;
    growth1Percent.push(Math.pow(1.01, days).toFixed(2));
    decay1Percent.push(Math.pow(0.99, days).toFixed(2));
  }

  const ctx = document.getElementById('growthChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: '+1% ao dia (1.01^t)',
          data: growth1Percent,
          borderColor: '#10b981',
          tension: 0.3
        },
        {
          label: '-1% ao dia (0.99^t)',
          data: decay1Percent,
          borderColor: '#f43f5e',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: getChartTextColor() } }
      },
      scales: {
        x: { ticks: { color: getChartTextColor() } },
        y: { ticks: { color: getChartTextColor() } }
      }
    }
  });
}


// --- 4. PLANNER DE OBJETIVOS (LOCALSTORAGE) ---
let goals = JSON.parse(localStorage.getItem('my_life_goals')) || [
  { id: 1, title: 'Reserva de Emergência', term: 'Curto Prazo (< 1 ano)', metric: 'R$ 5.000', completed: false },
  { id: 2, title: 'Aprender Programação/Matemática', term: 'Médio Prazo (1 a 5 anos)', metric: '300 Horas de Estudo', completed: true }
];

function saveAndRenderGoals() {
  localStorage.setItem('my_life_goals', JSON.stringify(goals));
  const listEl = document.getElementById('goalsList');
  listEl.innerHTML = '';

  let completedCount = 0;

  goals.forEach(goal => {
    if (goal.completed) completedCount++;

    const card = document.createElement('div');
    card.className = `goal-card p-4 rounded-xl border ${goal.completed ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'} flex flex-col justify-between`;
    
    card.innerHTML = `
      <div>
        <div class="flex justify-between items-start mb-2">
          <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            ${goal.term}
          </span>
          <button onclick="deleteGoal(${goal.id})" class="text-slate-400 hover:text-rose-500 transition">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
        <h3 class="font-bold text-lg mb-1 ${goal.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}">${goal.title}</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Alvo: ${goal.metric}</p>
      </div>

      <button onclick="toggleGoal(${goal.id})" class="w-full py-2 px-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${goal.completed ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}">
        <i data-lucide="${goal.completed ? 'check-circle' : 'circle'}" class="w-4 h-4"></i>
        ${goal.completed ? 'Concluída' : 'Marcar Concluída'}
      </button>
    `;

    listEl.appendChild(card);
  });

  const progressPct = goals.length === 0 ? 0 : Math.round((completedCount / goals.length) * 100);
  document.getElementById('overallProgressBar').style.width = `${progressPct}%`;
  document.getElementById('overallProgressText').innerText = `${progressPct}%`;

  lucide.createIcons();
}

document.getElementById('goalForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('goalTitle').value;
  const term = document.getElementById('goalTerm').value;
  const metric = document.getElementById('goalMetric').value;

  goals.push({
    id: Date.now(),
    title,
    term,
    metric,
    completed: false
  });

  document.getElementById('goalTitle').value = '';
  document.getElementById('goalMetric').value = '';

  saveAndRenderGoals();
});

function toggleGoal(id) {
  goals = goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g);
  saveAndRenderGoals();
}

function deleteGoal(id) {
  goals = goals.filter(g => g.id !== id);
  saveAndRenderGoals();
}

// Inicialização Geral das Funções
window.addEventListener('DOMContentLoaded', () => {
  calculateFinance();
  updateTimeManagement();
  renderGrowthChart();
  saveAndRenderGoals();
});