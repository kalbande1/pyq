<!DOCTYPE html>
<html lang="mr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>लॉगिन — पोलीस भरती सराव पोर्टल</title>
  <script src="https://cdn.tailwindcss.com/3.4.17"></script>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.1/dist/umd/supabase.min.js"></script>
  <link rel="stylesheet" href="styles.css" />
</head>
<body class="min-h-screen flex flex-col">

  <header class="bg-white border-b border-slate-200">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
      <a href="index.html" class="text-sm font-bold text-slate-900">← मुख्य पेज (Home)</a>
      <a href="register.html" class="text-xs font-semibold text-blue-900 hover:underline">नवीन नोंदणी करा</a>
    </div>
  </header>

  <main class="flex-1 flex items-center justify-center px-4 py-10">
    <div class="w-full max-w-md space-y-5">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-slate-900">पोर्टल लॉगिन</h1>
        <p class="text-xs text-slate-500 mt-1">तुमचा 10 अंकी मोबाईल नंबर आणि पासवर्ड टाका</p>
      </div>

      <div id="pending-alert" class="hidden bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 text-xs leading-relaxed">
        <strong>अ‍ॅडमिन मंजुरी प्रलंबित आहे:</strong> तुमची नोंदणी पूर्ण झाली आहे. अ‍ॅडमिनने मंजुरी दिल्यानंतरच तुमचे डॅशबोर्ड व पेपर्स सुरू होतील.
      </div>

      <form id="form-login" class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <label for="login-mobile" class="block text-xs font-semibold text-slate-700 mb-1">मोबाईल नंबर (युजरनेम)</label>
          <input id="login-mobile" type="text" required placeholder="उदा. 9876543210" class="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700" />
        </div>
        <div>
          <div class="flex items-center justify-between mb-1">
            <label for="login-password" class="block text-xs font-semibold text-slate-700">पासवर्ड</label>
            <a href="forgot-password.html" class="text-xs font-medium text-blue-900 hover:underline">पासवर्ड विसरलात?</a>
          </div>
          <input id="login-password" type="password" required placeholder="तुमचा पासवर्ड" class="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700" />
        </div>
        <button type="submit" class="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors">
          लॉगिन करा
        </button>

        <div id="demo-box" class="hidden pt-4 border-t border-slate-100 space-y-2">
          <p class="text-[11px] text-slate-500 text-center">डेमो मोड चाचणीसाठी झटपट लॉगिन:</p>
          <div class="grid grid-cols-2 gap-2">
            <button id="btn-demo-stu" type="button" class="py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800">विद्यार्थी डेमो</button>
            <button id="btn-demo-adm" type="button" class="py-2 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200">अ‍ॅडमिन डेमो</button>
          </div>
        </div>
      </form>

      <p class="text-center text-xs text-slate-600">
        नवीन विद्यार्थी आहात का? <a href="register.html" class="font-semibold text-blue-900 hover:underline">इथे नोंदणी करा</a>
      </p>
    </div>
  </main>

  <script src="config.js"></script>
  <script>
    if (IS_DEMO_MODE) document.getElementById('demo-box').classList.remove('hidden');
    if (new URLSearchParams(window.location.search).get('pending') === '1') {
      document.getElementById('pending-alert').classList.remove('hidden');
    }

    document.getElementById('form-login').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const u = await api.login(
          document.getElementById('login-mobile').value,
          document.getElementById('login-password').value
        );
        if (u.role === 'admin') {
          window.location.href = 'admin.html';
        } else if (!u.is_approved) {
          document.getElementById('pending-alert').classList.remove('hidden');
          showToast('अ‍ॅडमिन मंजुरी प्रलंबित आहे.');
        } else {
          window.location.href = 'dashboard.html';
        }
      } catch (err) {
        showToast(err.message);
      }
    });

    document.getElementById('btn-demo-stu').addEventListener('click', () => {
      document.getElementById('login-mobile').value = '9876543210';
      document.getElementById('login-password').value = 'password123';
      document.getElementById('form-login').requestSubmit();
    });
    document.getElementById('btn-demo-adm').addEventListener('click', () => {
      document.getElementById('login-mobile').value = '9999999999';
      document.getElementById('login-password').value = 'password123';
      document.getElementById('form-login').requestSubmit();
    });
  </script>
</body>
</html>
