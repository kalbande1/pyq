<!DOCTYPE html>
<html lang="mr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>माझे प्रोफाईल — पोलीस भरती पोर्टल</title>
  <script src="https://cdn.tailwindcss.com/3.4.17"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.1/dist/umd/supabase.min.js"></script>
  <link rel="stylesheet" href="styles.css" />
</head>
<body class="min-h-screen flex flex-col">

  <header class="bg-white border-b border-slate-200 sticky top-0 z-30">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
      <div class="truncate">
        <h1 class="text-sm sm:text-base font-bold text-slate-900 truncate">विद्यार्थी प्रोफाईल</h1>
        <p id="user-sub" class="text-xs text-slate-500 truncate"></p>
      </div>
      <nav class="flex items-center gap-2 shrink-0">
        <a href="dashboard.html" class="px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg">सराव पेपर्स</a>
        <a href="profile.html" class="px-3 py-1.5 text-xs sm:text-sm font-semibold text-blue-900 bg-blue-50 rounded-lg">माझे प्रोफाईल</a>
        <a id="admin-link" href="admin.html" class="hidden px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded-lg">अ‍ॅडमिन</a>
        <button id="btn-logout" type="button" class="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-700 border border-slate-200 rounded-lg">लॉगआउट</button>
      </nav>
    </div>
  </header>

  <main class="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
    <!-- Profile Info Card -->
    <section class="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div id="prof-avatar" class="w-14 h-14 rounded-full bg-blue-900 text-white text-xl font-bold flex items-center justify-center shrink-0">
          वि
        </div>
        <div>
          <h2 id="prof-name" class="text-lg sm:text-xl font-bold text-slate-900"></h2>
          <p id="prof-bharti" class="text-xs font-semibold text-blue-800 mt-0.5"></p>
          <p id="prof-contact" class="text-xs text-slate-500 mt-1"></p>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5">
          <p class="text-[11px] text-slate-500">सोडवलेले पेपर</p>
          <p id="kpi-papers" class="text-lg font-bold text-slate-900">0</p>
        </div>
        <div class="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5">
          <p class="text-[11px] text-emerald-700">सरासरी गुण</p>
          <p id="kpi-avg" class="text-lg font-bold text-emerald-700">0%</p>
        </div>
        <div class="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5">
          <p class="text-[11px] text-blue-800">सर्वोत्तम स्कोर</p>
          <p id="kpi-best" class="text-lg font-bold text-blue-900">0%</p>
        </div>
      </div>
    </section>

    <!-- Progress Graphs -->
    <section id="graphs-section" class="hidden grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 class="text-sm font-bold text-slate-900">पेपरनिहाय प्रगती आलेख (टक्केवारी)</h3>
        <p class="text-xs text-slate-500 mb-3">तुमच्या सोडवलेल्या पेपर्सनुसार गुणांचा चढ-उतार</p>
        <div class="relative h-64">
          <canvas id="trend-chart"></canvas>
        </div>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 class="text-sm font-bold text-slate-900">विषयनिहाय सरासरी अचूकता (%)</h3>
        <p class="text-xs text-slate-500 mb-3">मराठी, गणित, बुद्धिमत्ता व जीके मधील सरासरी कामगिरी</p>
        <div class="relative h-64">
          <canvas id="subject-chart"></canvas>
        </div>
      </div>
    </section>

    <div id="graphs-hint" class="hidden bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900">
      किमान <strong>2 किंवा त्यापेक्षा जास्त पेपर</strong> सोडवल्यानंतर इथे तुमचा प्रगती आलेख (Progress Graph) आपोआप दिसेल.
    </div>

    <!-- Solved Papers & Marks History -->
    <section class="space-y-3">
      <h3 class="text-base font-bold text-slate-900">सोडवलेले पेपर्स आणि मार्क्स</h3>
      <div id="attempts-list" class="space-y-3"></div>
    </section>
  </main>

  <script src="config.js"></script>
  <script>
    document.getElementById('btn-logout').addEventListener('click', () => api.logout());

    (async function init() {
      const user = await api.requireAuth();
      if (!user) return;
      document.getElementById('user-sub').textContent = user.full_name + ' • ' + user.bharti_type;
      if (user.role === 'admin') document.getElementById('admin-link').classList.remove('hidden');

      document.getElementById('prof-avatar').textContent = (user.full_name || 'व').charAt(0);
      document.getElementById('prof-name').textContent = user.full_name;
      document.getElementById('prof-bharti').textContent = 'भरती: ' + user.bharti_type;
      document.getElementById('prof-contact').textContent = 'मोबाईल: ' + user.mobile + '  •  ईमेल: ' + user.email;

      const { attempts } = await api.getStudentDashboard(user.id);
      document.getElementById('kpi-papers').textContent = String(attempts.length);

      if (attempts.length > 0) {
        const pcts = attempts.map(a => a.total_questions > 0 ? Math.round((a.correct_count / a.total_questions) * 100) : 0);
        const avg = Math.round(pcts.reduce((s, v) => s + v, 0) / pcts.length);
        const best = Math.max(...pcts);
        document.getElementById('kpi-avg').textContent = avg + '%';
        document.getElementById('kpi-best').textContent = best + '%';
      }

      if (attempts.length >= 2) {
        document.getElementById('graphs-section').classList.remove('hidden');
        const chrono = [...attempts].reverse();
        new Chart(document.getElementById('trend-chart').getContext('2d'), {
          type: 'line',
          data: {
            labels: chrono.map((_, i) => 'पेपर ' + (i + 1)),
            datasets: [{
              label: 'गुण (%)',
              data: chrono.map(a => a.total_questions > 0 ? Math.round((a.correct_count / a.total_questions) * 100) : 0),
              borderColor: '#1e3a8a',
              backgroundColor: 'rgba(30, 58, 138, 0.1)',
              fill: true,
              tension: 0.3,
              pointRadius: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } } },
            plugins: { legend: { display: false } }
          }
        });

        const totals = {};
        SUBJECTS.forEach(s => { totals[s.id] = { c: 0, att: 0 }; });
        attempts.forEach(a => {
          (a.subject_summary || []).forEach(s => {
            if (totals[s.subject]) {
              totals[s.subject].c += Number(s.correct || 0);
              totals[s.subject].att += Number(s.correct || 0) + Number(s.wrong || 0);
            }
          });
        });
        new Chart(document.getElementById('subject-chart').getContext('2d'), {
          type: 'bar',
          data: {
            labels: SUBJECTS.map(s => s.short),
            datasets: [{
              label: 'अचूकता (%)',
              data: SUBJECTS.map(s => totals[s.id].att > 0 ? Math.round((totals[s.id].c / totals[s.id].att) * 100) : 0),
              backgroundColor: ['#1d4ed8', '#059669', '#d97706', '#4f46e5'],
              borderRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } } },
            plugins: { legend: { display: false } }
          }
        });
      } else {
        document.getElementById('graphs-hint').classList.remove('hidden');
      }

      const list = document.getElementById('attempts-list');
      if (attempts.length === 0) {
        list.innerHTML = '<div class="bg-white border border-slate-200 rounded-xl p-8 text-center text-sm text-slate-500">तुम्ही अजून कोणताही पेपर सोडवलेला नाही. <a href="dashboard.html" class="text-blue-900 font-semibold underline">सराव सुरू करा</a></div>';
        return;
      }

      attempts.forEach(a => {
        const dt = new Date(a.submitted_at).toLocaleDateString('mr-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const chips = (a.subject_summary || []).map(s =>
          `<span class="text-[11px] px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700">
            <strong>${getSubjectShort(s.subject)}:</strong> <span class="text-emerald-700">${s.correct}✓</span> <span class="text-rose-700">${s.wrong}✗</span>
          </span>`
        ).join('');
        const div = document.createElement('div');
        div.className = 'bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3';
        div.innerHTML = `
          <div class="space-y-1.5">
            <h4 class="text-sm font-bold text-slate-900">${a.paper_title}</h4>
            <p class="text-xs text-slate-500">${dt} • वेळ: ${formatTime(a.time_taken_sec)} • अचूकता: ${a.accuracy}%</p>
            <div class="flex flex-wrap gap-1.5">${chips}</div>
          </div>
          <div class="flex items-center gap-3">
            <span class="px-3 py-1 rounded-lg text-sm font-bold bg-blue-50 text-blue-900 border border-blue-200">${a.correct_count} / ${a.total_questions}</span>
            <a href="report.html?attempt=${a.id}" class="px-3 py-1.5 text-xs font-semibold bg-blue-900 hover:bg-blue-800 text-white rounded-lg">रिपोर्ट पाहा</a>
          </div>
        `;
        list.appendChild(div);
      });
    })();
  </script>
</body>
</html>
