// =============================================================================
// महाराष्ट्र पोलीस भरती सराव परीक्षा पोर्टल — सामाईक कॉन्फिगरेशन व API (config.js)
// लाईव्ह करण्यासाठी फक्त इथेच SUPABASE_URL व SUPABASE_ANON_KEY पेस्ट करा.
// =============================================================================
const SUPABASE_URL = 'sb_publishable_pY3CSKr0PFNuYXhZmoXf_g_ziv8MZ4A';
const SUPABASE_ANON_KEY = 'sb_publishable_pY3CSKr0PFNuYXhZmoXf_g_ziv8MZ4A';

const IS_DEMO_MODE = !SUPABASE_URL || !SUPABASE_ANON_KEY;
const sb = (!IS_DEMO_MODE && window.supabase)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const SUBJECTS = [
  { id: 'marathi', name: 'मराठी', short: 'मराठी' },
  { id: 'maths', name: 'गणित', short: 'गणित' },
  { id: 'reasoning', name: 'बुद्धिमत्ता', short: 'बुद्धिमत्ता' },
  { id: 'gk', name: 'जीके (सामान्य ज्ञान)', short: 'जीके' }
];
const OPT_LABELS = ['अ', 'ब', 'क', 'ड'];

const DEMO_DB_KEY = 'pb_portal_multipage_db_v2';
const DEMO_SESSION_KEY = 'pb_portal_demo_session_v2';

function getSubjectShort(id) {
  const f = SUBJECTS.find(s => s.id === id);
  return f ? f.short : id;
}

function formatTime(sec) {
  const s = Math.max(0, Math.floor(sec || 0));
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}

function safeLSGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function safeLSSet(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {}
}

function showToast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-xs sm:text-sm font-medium shadow-lg';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.add('hidden'), 3200);
}

function downloadCSV(filename, rows) {
  const csv = '\uFEFF' + rows.map(r => r.map(c => '"' + String(c ?? '').replace(/"/g, '""') + '"').join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function parseCSV(text) {
  const clean = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const rows = [];
  let row = [], cur = '', inQuotes = false;
  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (inQuotes) {
      if (ch === '"' && clean[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else cur += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ',') { row.push(cur.trim()); cur = ''; }
      else if (ch === '\n') { row.push(cur.trim()); if (row.some(c => c !== '')) rows.push(row); row = []; cur = ''; }
      else cur += ch;
    }
  }
  if (cur !== '' || row.length > 0) {
    row.push(cur.trim());
    if (row.some(c => c !== '')) rows.push(row);
  }
  return rows;
}

function compressImageToWebP(file, maxWidth = 960, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('इमेज वाचता आली नाही'));
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = () => reject(new Error('इमेज लोड झाली नाही'));
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxWidth) { h = Math.round((h * maxWidth) / w); w = maxWidth; }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('कॉम्प्रेस करता आले नाही'));
          resolve({ blob, dataUrl: canvas.toDataURL('image/webp', quality), originalKB: Math.round(file.size / 1024), compressedKB: Math.round(blob.size / 1024) });
        }, 'image/webp', quality);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// =============================================================================
// DEMO DATA FALLBACK (When SUPABASE_URL is empty)
// =============================================================================
function getDemoDB() {
  let db = safeLSGet(DEMO_DB_KEY, null);
  if (db && Array.isArray(db.students)) return db;
  const p1 = 'paper-1', p2 = 'paper-2';
  db = {
    students: [
      { id: 'adm-1', full_name: 'अ‍ॅडमिन सर', mobile: '9999999999', email: 'admin@policeportal.in', bharti_type: 'अ‍ॅडमिन', role: 'admin', is_approved: true, is_active: true, password: 'password123' },
      { id: 'stu-1', full_name: 'राहुल पाटील', mobile: '9876543210', email: 'rahul@example.com', bharti_type: 'जिल्हा पोलीस शिपाई', role: 'student', is_approved: true, is_active: true, password: 'password123' },
      { id: 'stu-2', full_name: 'स्नेहल जाधव', mobile: '9876543211', email: 'snehal@example.com', bharti_type: 'SRPF (राज्य राखीव पोलीस)', role: 'student', is_approved: true, is_active: true, password: 'password123' },
      { id: 'stu-3', full_name: 'अक्षय शिंदे', mobile: '9876543212', email: 'akshay@example.com', bharti_type: 'पोलीस शिपाई चालक', role: 'student', is_approved: false, is_active: true, password: 'password123' }
    ],
    papers: [
      { id: p1, title: 'पोलीस भरती सराव पेपर ०१ (मिश्र)', duration_minutes: 20, allow_multiple_attempts: true, shuffle_questions: false, show_rank: true, is_published: true, created_at: new Date(Date.now() - 86400000 * 4).toISOString() },
      { id: p2, title: 'पोलीस भरती सराव पेपर ०२ (लवचिक प्रश्न)', duration_minutes: 15, allow_multiple_attempts: true, shuffle_questions: false, show_rank: true, is_published: true, created_at: new Date(Date.now() - 86400000 * 1).toISOString() }
    ],
    questions: [
      { id: 'q1', paper_id: p1, subject: 'marathi', question_text: "'सूर्य' या शब्दाचा समानार्थी शब्द कोणता?", image_url: null, options: ['शशी', 'भानू', 'पवन', 'जलद'], correct_option: 1, explanation: "'भानू' म्हणजे सूर्य.", order_index: 1 },
      { id: 'q2', paper_id: p1, subject: 'marathi', question_text: "'कृपण' या शब्दाचा विरुद्धार्थी शब्द ओळखा.", image_url: null, options: ['कंजूस', 'उदार', 'लोभी', 'कठोर'], correct_option: 1, explanation: "'कृपण' चा विरुद्धार्थी 'उदार' होतो.", order_index: 2 },
      { id: 'q3', paper_id: p1, subject: 'maths', question_text: "एका वस्तूची खरेदी किंमत ₹400 व विक्री किंमत ₹500 आहे, तर शेकडा नफा किती?", image_url: null, options: ['20%', '25%', '30%', '15%'], correct_option: 1, explanation: "नफा = ₹100; शेकडा नफा = 25%.", order_index: 3 },
      { id: 'q4', paper_id: p1, subject: 'maths', question_text: "12, 18 आणि 24 यांचा लसावि (LCM) किती?", image_url: null, options: ['36', '48', '72', '96'], correct_option: 2, explanation: "लसावि = 72.", order_index: 4 },
      { id: 'q5', paper_id: p1, subject: 'reasoning', question_text: "पुढील संख्या ओळखा: 4, 9, 16, 25, 36, ?", image_url: null, options: ['42', '45', '49', '54'], correct_option: 2, explanation: "7 चा वर्ग = 49.", order_index: 5 },
      { id: 'q6', paper_id: p1, subject: 'reasoning', question_text: "गटात न बसणारा शब्द ओळखा:", image_url: null, options: ['मुंबई', 'पुणे', 'नागपूर', 'गोवा'], correct_option: 3, explanation: "गोवा हे स्वतंत्र राज्य आहे.", order_index: 6 },
      { id: 'q7', paper_id: p1, subject: 'gk', question_text: "महाराष्ट्र राज्याची स्थापना कधी झाली?", image_url: null, options: ['15 ऑगस्ट 1947', '26 जानेवारी 1950', '1 मे 1960', '1 मे 1962'], correct_option: 2, explanation: "1 मे 1960 (महाराष्ट्र दिन).", order_index: 7 },
      { id: 'q8', paper_id: p1, subject: 'gk', question_text: "महाराष्ट्रातील सर्वात उंच शिखर कोणते?", image_url: null, options: ['महाबळेश्वर', 'कळसूबाई', 'साल्हेर', 'तोरणा'], correct_option: 1, explanation: "कळसूबाई (1646 मीटर).", order_index: 8 },
      { id: 'q9', paper_id: p2, subject: 'marathi', question_text: "'पुस्तक' या शब्दाचे अनेकवचन कोणते?", image_url: null, options: ['पुस्तका', 'पुस्तके', 'पुस्तकी', 'पुस्तकांनी'], correct_option: 1, explanation: "पुस्तक -> पुस्तके.", order_index: 1 },
      { id: 'q10', paper_id: p2, subject: 'maths', question_text: "500 चे 18% किती होतात?", image_url: null, options: ['80', '90', '95', '100'], correct_option: 1, explanation: "500 × 18 / 100 = 90.", order_index: 2 },
      { id: 'q11', paper_id: p2, subject: 'reasoning', question_text: "जर CAT = 24 असेल, तर DOG = किती?", image_url: null, options: ['24', '26', '28', '30'], correct_option: 1, explanation: "4 + 15 + 7 = 26.", order_index: 3 },
      { id: 'q12', paper_id: p2, subject: 'gk', question_text: "लोणार सरोवर कोणत्या जिल्ह्यात आहे?", image_url: null, options: ['अकोला', 'अमरावती', 'बुलढाणा', 'वाशिम'], correct_option: 2, explanation: "बुलढाणा जिल्हा.", order_index: 4 }
    ],
    attempts: [
      {
        id: 'att-1', student_id: 'stu-1', paper_id: p1,
        answers: { q1: 1, q2: 0, q3: 1, q4: 2, q5: 2, q6: 3, q7: 2, q8: 1 },
        subject_summary: [
          { subject: 'marathi', total: 2, correct: 1, wrong: 1, skipped: 0, accuracy: 50 },
          { subject: 'maths', total: 2, correct: 2, wrong: 0, skipped: 0, accuracy: 100 },
          { subject: 'reasoning', total: 2, correct: 2, wrong: 0, skipped: 0, accuracy: 100 },
          { subject: 'gk', total: 2, correct: 2, wrong: 0, skipped: 0, accuracy: 100 }
        ],
        total_questions: 8, correct_count: 7, wrong_count: 1, skipped_count: 0, accuracy: 87.5, time_taken_sec: 320,
        submitted_at: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'att-2', student_id: 'stu-1', paper_id: p2,
        answers: { q9: 1, q10: 1, q11: 1, q12: 2 },
        subject_summary: [
          { subject: 'marathi', total: 1, correct: 1, wrong: 0, skipped: 0, accuracy: 100 },
          { subject: 'maths', total: 1, correct: 1, wrong: 0, skipped: 0, accuracy: 100 },
          { subject: 'reasoning', total: 1, correct: 1, wrong: 0, skipped: 0, accuracy: 100 },
          { subject: 'gk', total: 1, correct: 1, wrong: 0, skipped: 0, accuracy: 100 }
        ],
        total_questions: 4, correct_count: 4, wrong_count: 0, skipped_count: 0, accuracy: 100, time_taken_sec: 145,
        submitted_at: new Date(Date.now() - 86400000 * 1).toISOString()
      }
    ],
    flags: []
  };
  safeLSSet(DEMO_DB_KEY, db);
  return db;
}

function saveDemoDB(db) { safeLSSet(DEMO_DB_KEY, db); }

// =============================================================================
// SHARED API
// =============================================================================
const api = {
  async getCurrentUser() {
    if (IS_DEMO_MODE) {
      const uid = safeLSGet(DEMO_SESSION_KEY, null);
      if (!uid) return null;
      const db = getDemoDB();
      const u = db.students.find(s => s.id === uid);
      return (u && u.is_active) ? { ...u } : null;
    }
    const { data: { session } } = await sb.auth.getSession();
    if (!session || !session.user) return null;
    const { data: profile } = await sb.from('students').select('*').eq('id', session.user.id).single();
    return (profile && profile.is_active) ? profile : null;
  },

  async requireAuth({ adminOnly = false } = {}) {
    const u = await this.getCurrentUser();
    if (!u) { window.location.href = 'login.html'; return null; }
    if (adminOnly && u.role !== 'admin') { window.location.href = 'dashboard.html'; return null; }
    if (!adminOnly && u.role !== 'admin' && !u.is_approved) { window.location.href = 'login.html?pending=1'; return null; }
    return u;
  },

  async login(identifier, password) {
    const clean = identifier.trim();
    if (IS_DEMO_MODE) {
      const db = getDemoDB();
      const u = db.students.find(s => (s.mobile === clean || s.email.toLowerCase() === clean.toLowerCase()) && s.password === password);
      if (!u) throw new Error('मोबाईल नंबर किंवा पासवर्ड चुकीचा आहे.');
      if (!u.is_active) throw new Error('तुमचे अकाउंट अ‍ॅडमिनने बंद केले आहे.');
      safeLSSet(DEMO_SESSION_KEY, u.id);
      return { ...u };
    }
    let email = clean;
    if (!clean.includes('@')) {
      const { data: found, error } = await sb.rpc('get_email_by_mobile', { p_mobile: clean });
      if (error || !found) throw new Error('हा मोबाईल नंबर नोंदणीकृत नाही.');
      email = found;
    }
    const { data: authData, error: authErr } = await sb.auth.signInWithPassword({ email, password });
    if (authErr) throw new Error('मोबाईल नंबर किंवा पासवर्ड चुकीचा आहे.');
    const { data: profile, error: profErr } = await sb.from('students').select('*').eq('id', authData.user.id).single();
    if (profErr || !profile) throw new Error('विद्यार्थी प्रोफाईल सापडले नाही.');
    if (!profile.is_active) {
      await sb.auth.signOut();
      throw new Error('तुमचे अकाउंट अ‍ॅडमिनने बंद केले आहे.');
    }
    return profile;
  },

  async register({ full_name, mobile, email, bharti_type, password }) {
    if (IS_DEMO_MODE) {
      const db = getDemoDB();
      if (db.students.some(s => s.mobile === mobile)) throw new Error('हा मोबाईल नंबर आधीच नोंदणीकृत आहे.');
      if (db.students.some(s => s.email.toLowerCase() === email.toLowerCase())) throw new Error('हा ईमेल आधीच नोंदणीकृत आहे.');
      const u = { id: 'stu-' + Date.now(), full_name, mobile, email, bharti_type, role: 'student', is_approved: false, is_active: true, password };
      db.students.push(u);
      saveDemoDB(db);
      return u;
    }
    const { data: sData, error: sErr } = await sb.auth.signUp({ email, password });
    if (sErr) throw new Error(sErr.message);
    if (!sData.user) throw new Error('नोंदणी करता आली नाही.');
    const { error: iErr } = await sb.from('students').insert({
      id: sData.user.id, full_name, mobile, email, bharti_type, role: 'student', is_approved: false, is_active: true
    });
    if (iErr) throw new Error('मोबाईल नंबर किंवा ईमेल आधीच नोंदणीकृत असू शकतो.');
    return { id: sData.user.id, full_name, mobile, email, bharti_type, role: 'student', is_approved: false, is_active: true };
  },

  async verifyMobileEmail(mobile, email) {
    if (IS_DEMO_MODE) {
      const db = getDemoDB();
      return db.students.some(s => s.mobile === mobile.trim() && s.email.toLowerCase() === email.trim().toLowerCase() && s.is_active);
    }
    const { data, error } = await sb.rpc('verify_mobile_email', { p_mobile: mobile.trim(), p_email: email.trim() });
    if (error) throw new Error(error.message);
    return !!data;
  },

  async resetPasswordDirect(mobile, email, newPassword) {
    if (IS_DEMO_MODE) {
      const db = getDemoDB();
      const u = db.students.find(s => s.mobile === mobile.trim() && s.email.toLowerCase() === email.trim().toLowerCase() && s.is_active);
      if (!u) throw new Error('मोबाईल नंबर आणि ईमेल जुळत नाहीत.');
      u.password = newPassword;
      saveDemoDB(db);
      return true;
    }
    const { data, error } = await sb.rpc('reset_password_by_mobile_email', {
      p_mobile: mobile.trim(),
      p_email: email.trim(),
      p_new_password: newPassword
    });
    if (error) throw new Error(error.message);
    return !!data;
  },

  async logout() {
    if (IS_DEMO_MODE) {
      try { localStorage.removeItem(DEMO_SESSION_KEY); } catch (e) {}
    } else if (sb) {
      await sb.auth.signOut();
    }
    window.location.href = 'login.html';
  },

  async getStudentDashboard(studentId) {
    if (IS_DEMO_MODE) {
      const db = getDemoDB();
      const papers = db.papers.filter(p => p.is_published).map(p => {
        const qs = db.questions.filter(q => q.paper_id === p.id);
        const counts = {};
        qs.forEach(q => { counts[q.subject] = (counts[q.subject] || 0) + 1; });
        return { ...p, question_counts: counts, total_questions: qs.length };
      });
      const attempts = db.attempts
        .filter(a => a.student_id === studentId)
        .map(a => ({ ...a, paper_title: (db.papers.find(x => x.id === a.paper_id) || {}).title || 'पेपर' }))
        .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
      return { papers, attempts };
    }
    const { data: papersRaw } = await sb.from('papers').select('*').eq('is_published', true).order('created_at', { ascending: false });
    const papers = [];
    for (const p of (papersRaw || [])) {
      const { data: counts } = await sb.rpc('get_paper_question_counts', { p_paper_id: p.id });
      const cObj = counts || {};
      const total = Object.values(cObj).reduce((acc, v) => acc + Number(v || 0), 0);
      papers.push({ ...p, question_counts: cObj, total_questions: total });
    }
    const { data: attemptsRaw } = await sb.from('attempts').select('*, papers(title)').eq('student_id', studentId).order('submitted_at', { ascending: false });
    const attempts = (attemptsRaw || []).map(a => ({ ...a, paper_title: a.papers ? a.papers.title : 'पेपर' }));
    return { papers, attempts };
  },

  async getPaperById(paperId) {
    if (IS_DEMO_MODE) {
      return getDemoDB().papers.find(p => p.id === paperId) || null;
    }
    const { data } = await sb.from('papers').select('*').eq('id', paperId).single();
    return data || null;
  },

  async getExamQuestions(paperId) {
    if (IS_DEMO_MODE) {
      return getDemoDB().questions
        .filter(q => q.paper_id === paperId)
        .sort((a, b) => a.order_index - b.order_index)
        .map(({ id, paper_id, subject, question_text, image_url, options, order_index }) => ({ id, paper_id, subject, question_text, image_url, options, order_index }));
    }
    const { data, error } = await sb.rpc('get_exam_questions', { p_paper_id: paperId });
    if (error) throw new Error(error.message);
    return data || [];
  },

  async submitExam(studentId, paperId, answers, timeTakenSec) {
    if (IS_DEMO_MODE) {
      const db = getDemoDB();
      const qs = db.questions.filter(q => q.paper_id === paperId);
      const subMap = {};
      let correct = 0, wrong = 0, skipped = 0;
      qs.forEach(q => {
        if (!subMap[q.subject]) subMap[q.subject] = { subject: q.subject, total: 0, correct: 0, wrong: 0, skipped: 0 };
        subMap[q.subject].total++;
        const ua = answers[q.id];
        if (ua === undefined || ua === null) { skipped++; subMap[q.subject].skipped++; }
        else if (ua === q.correct_option) { correct++; subMap[q.subject].correct++; }
        else { wrong++; subMap[q.subject].wrong++; }
      });
      const subject_summary = Object.values(subMap).map(s => ({
        ...s, accuracy: (s.correct + s.wrong) > 0 ? Math.round((s.correct / (s.correct + s.wrong)) * 1000) / 10 : 0
      }));
      const attempted = correct + wrong;
      const accuracy = attempted > 0 ? Math.round((correct / attempted) * 1000) / 10 : 0;
      const newAtt = {
        id: 'att-' + Date.now(), student_id: studentId, paper_id: paperId, answers: { ...answers },
        subject_summary, total_questions: qs.length, correct_count: correct, wrong_count: wrong, skipped_count: skipped,
        accuracy, time_taken_sec: timeTakenSec, submitted_at: new Date().toISOString()
      };
      db.attempts.push(newAtt);
      saveDemoDB(db);
      return { attempt_id: newAtt.id };
    }
    const { data, error } = await sb.rpc('submit_exam_attempt', { p_paper_id: paperId, p_answers: answers, p_time_taken_sec: timeTakenSec });
    if (error) throw new Error(error.message);
    return data;
  },

  async getAttemptReview(attemptId) {
    if (IS_DEMO_MODE) {
      const db = getDemoDB();
      const att = db.attempts.find(a => a.id === attemptId);
      if (!att) throw new Error('रिपोर्ट सापडला नाही');
      const paper = db.papers.find(p => p.id === att.paper_id);
      const qs = db.questions.filter(q => q.paper_id === att.paper_id).sort((a, b) => a.order_index - b.order_index)
        .map(q => ({ ...q, user_option: att.answers[q.id] !== undefined ? att.answers[q.id] : null }));
      return { attempt: { ...att, paper_title: paper ? paper.title : 'पेपर', show_rank: paper ? paper.show_rank : false }, questions: qs };
    }
    const { data, error } = await sb.rpc('get_attempt_review', { p_attempt_id: attemptId });
    if (error) throw new Error(error.message);
    return data;
  },

  async getLeaderboard(paperId, currentUserId) {
    if (IS_DEMO_MODE) {
      const db = getDemoDB();
      const best = {};
      db.attempts.filter(a => a.paper_id === paperId).forEach(a => {
        const c = best[a.student_id];
        if (!c || a.correct_count > c.correct_count || (a.correct_count === c.correct_count && a.time_taken_sec < c.time_taken_sec)) best[a.student_id] = a;
      });
      return Object.values(best).map(a => {
        const s = db.students.find(x => x.id === a.student_id);
        return {
          student_name: s ? s.full_name : 'विद्यार्थी', bharti_type: s ? s.bharti_type : '',
          correct_count: a.correct_count, total_questions: a.total_questions, accuracy: a.accuracy,
          time_taken_sec: a.time_taken_sec, is_me: a.student_id === currentUserId
        };
      }).sort((a, b) => b.correct_count - a.correct_count || a.time_taken_sec - b.time_taken_sec);
    }
    const { data } = await sb.rpc('get_paper_leaderboard', { p_paper_id: paperId });
    return (data || []).sort((a, b) => b.correct_count - a.correct_count || a.time_taken_sec - b.time_taken_sec);
  },

  async flagQuestion(studentId, paperId, questionId, note) {
    if (IS_DEMO_MODE) {
      const db = getDemoDB();
      db.flags.push({ id: 'flg-' + Date.now(), student_id: studentId, paper_id: paperId, question_id: questionId, note, is_resolved: false, created_at: new Date().toISOString() });
      saveDemoDB(db);
      return;
    }
    const { error } = await sb.from('question_flags').insert({ student_id: studentId, paper_id: paperId, question_id: questionId, note });
    if (error) throw new Error(error.message);
  },

  async adminGetAll() {
    if (IS_DEMO_MODE) {
      const db = getDemoDB();
      return {
        students: db.students.filter(s => s.role !== 'admin'),
        papers: db.papers.map(p => ({ ...p, q_count: db.questions.filter(q => q.paper_id === p.id).length })),
        attempts: db.attempts.map(a => ({ ...a, student_name: (db.students.find(x => x.id === a.student_id) || {}).full_name || '-', paper_title: (db.papers.find(x => x.id === a.paper_id) || {}).title || '-' })),
        flags: db.flags.map(f => ({ ...f, student_name: (db.students.find(x => x.id === f.student_id) || {}).full_name || '-', paper_title: (db.papers.find(x => x.id === f.paper_id) || {}).title || '-', question_text: (db.questions.find(x => x.id === f.question_id) || {}).question_text || '-' }))
      };
    }
    const [stuRes, papRes, attRes, flgRes] = await Promise.all([
      sb.from('students').select('*').neq('role', 'admin').order('created_at', { ascending: false }),
      sb.from('papers').select('*, questions(count)').order('created_at', { ascending: false }),
      sb.from('attempts').select('*, students(full_name), papers(title)').order('correct_count', { ascending: false }),
      sb.from('question_flags').select('*, students(full_name), papers(title), questions(question_text)').order('created_at', { ascending: false })
    ]);
    return {
      students: stuRes.data || [],
      papers: (papRes.data || []).map(p => ({ ...p, q_count: p.questions && p.questions[0] ? p.questions[0].count : 0 })),
      attempts: (attRes.data || []).map(a => ({ ...a, student_name: a.students ? a.students.full_name : '-', paper_title: a.papers ? a.papers.title : '-' })),
      flags: (flgRes.data || []).map(f => ({ ...f, student_name: f.students ? f.students.full_name : '-', paper_title: f.papers ? f.papers.title : '-', question_text: f.questions ? f.questions.question_text : '-' }))
    };
  },

  async adminUpdateStudent(id, patch) {
    if (IS_DEMO_MODE) {
      const db = getDemoDB();
      const i = db.students.findIndex(s => s.id === id);
      if (i >= 0) db.students[i] = { ...db.students[i], ...patch };
      saveDemoDB(db);
      return;
    }
    const { error } = await sb.from('students').update(patch).eq('id', id);
    if (error) throw new Error(error.message);
  },

  async adminDeleteStudent(id) {
    if (IS_DEMO_MODE) {
      const db = getDemoDB();
      db.students = db.students.filter(s => s.id !== id);
      saveDemoDB(db);
      return;
    }
    const { error } = await sb.from('students').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  async adminCreatePaper(userId, data) {
    if (IS_DEMO_MODE) {
      const db = getDemoDB();
      const np = { id: 'paper-' + Date.now(), ...data, is_published: true, created_at: new Date().toISOString() };
      db.papers.unshift(np);
      saveDemoDB(db);
      return np;
    }
    const { data: res, error } = await sb.from('papers').insert({ ...data, created_by: userId }).select().single();
    if (error) throw new Error(error.message);
    return res;
  },

  async adminUpdatePaper(id, patch) {
    if (IS_DEMO_MODE) {
      const db = getDemoDB();
      const i = db.papers.findIndex(p => p.id === id);
      if (i >= 0) db.papers[i] = { ...db.papers[i], ...patch };
      saveDemoDB(db);
      return;
    }
    const { error } = await sb.from('papers').update(patch).eq('id', id);
    if (error) throw new Error(error.message);
  },

  async adminDeletePaper(id) {
    if (IS_DEMO_MODE) {
      const db = getDemoDB();
      db.papers = db.papers.filter(p => p.id !== id);
      db.questions = db.questions.filter(q => q.paper_id !== id);
      saveDemoDB(db);
      return;
    }
    const { error } = await sb.from('papers').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  async adminGetPaperQuestions(paperId) {
    if (IS_DEMO_MODE) return getDemoDB().questions.filter(q => q.paper_id === paperId).sort((a, b) => a.order_index - b.order_index);
    const { data, error } = await sb.from('questions').select('*').eq('paper_id', paperId).order('order_index', { ascending: true });
    if (error) throw new Error(error.message);
    return data || [];
  },

  async adminAddQuestionsBulk(paperId, list) {
    if (IS_DEMO_MODE) {
      const db = getDemoDB();
      const base = db.questions.filter(q => q.paper_id === paperId).length;
      list.forEach((q, i) => db.questions.push({ id: 'q-' + Date.now() + '-' + i, paper_id: paperId, ...q, image_url: null, order_index: base + i + 1 }));
      saveDemoDB(db);
      return;
    }
    const rows = list.map((q, i) => ({ paper_id: paperId, ...q, order_index: i + 1 }));
    const { error } = await sb.from('questions').insert(rows);
    if (error) throw new Error(error.message);
  },

  async adminDeleteQuestion(qId) {
    if (IS_DEMO_MODE) {
      const db = getDemoDB();
      db.questions = db.questions.filter(q => q.id !== qId);
      saveDemoDB(db);
      return;
    }
    const { error } = await sb.from('questions').delete().eq('id', qId);
    if (error) throw new Error(error.message);
  },

  async adminUploadQuestionImage(qId, file) {
    const comp = await compressImageToWebP(file);
    if (IS_DEMO_MODE) {
      const db = getDemoDB();
      const i = db.questions.findIndex(q => q.id === qId);
      if (i >= 0) db.questions[i].image_url = comp.dataUrl;
      saveDemoDB(db);
      return comp;
    }
    const filePath = 'q_' + qId + '_' + Date.now() + '.webp';
    const { error: uErr } = await sb.storage.from('question-images').upload(filePath, comp.blob, { contentType: 'image/webp', upsert: true });
    if (uErr) throw new Error(uErr.message);
    const { data: pub } = sb.storage.from('question-images').getPublicUrl(filePath);
    const { error: updErr } = await sb.from('questions').update({ image_url: pub.publicUrl }).eq('id', qId);
    if (updErr) throw new Error(updErr.message);
    return comp;
  },

  async adminResolveFlag(id) {
    if (IS_DEMO_MODE) {
      const db = getDemoDB();
      const f = db.flags.find(x => x.id === id);
      if (f) f.is_resolved = true;
      saveDemoDB(db);
      return;
    }
    const { error } = await sb.from('question_flags').update({ is_resolved: true }).eq('id', id);
    if (error) throw new Error(error.message);
  }
};
