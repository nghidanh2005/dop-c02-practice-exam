(function () {
  'use strict';

  var Q = window.DOP_QUESTIONS || [];
  var byN = {};
  Q.forEach(function (q) { byN[q.n] = q; });
  var LS = 'dop-c02-practice-v1';
  var LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

  /* ---------- storage ---------- */
  function fresh() { return { progress: {}, marks: [], theme: '', session: null }; }
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(LS) || '{}');
      return Object.assign(fresh(), s);
    } catch (e) { return fresh(); }
  }
  var store = load();
  function save() { try { localStorage.setItem(LS, JSON.stringify(store)); } catch (e) { /* ignore */ } }

  /* ---------- helpers ---------- */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? '' : v);
      });
    }
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }
  function append(el, c) {
    if (c === null || c === undefined || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { append(el, x); }); return; }
    el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function sameSet(a, b) {
    if (a.length !== b.length) return false;
    var s = {};
    a.forEach(function (x) { s[x] = 1; });
    return b.every(function (x) { return s[x]; });
  }

  /* Render a small markdown subset (paragraphs, `inline code`, ``` fences) using DOM nodes only. */
  function inline(parent, text) {
    var parts = String(text).split(/(`[^`]+`)/);
    parts.forEach(function (p) {
      if (!p) return;
      if (p.length > 2 && p[0] === '`' && p[p.length - 1] === '`') parent.appendChild(h('code', { text: p.slice(1, -1) }));
      else parent.appendChild(document.createTextNode(p));
    });
  }
  function rich(text, cls) {
    var box = h('div', { class: cls || '' });
    var re = /```[a-zA-Z]*\n([\s\S]*?)```/g;
    var last = 0, m;
    function paras(s) {
      s.split(/\n\s*\n/).forEach(function (p) {
        p = p.trim();
        if (!p) return;
        var el = h('p');
        var lines = p.split('\n');
        lines.forEach(function (ln, i) { if (i) el.appendChild(h('br')); inline(el, ln); });
        box.appendChild(el);
      });
    }
    text = String(text);
    while ((m = re.exec(text))) {
      paras(text.slice(last, m.index));
      box.appendChild(h('pre', null, h('code', { text: m[1].replace(/\n$/, '') })));
      last = re.lastIndex;
    }
    paras(text.slice(last));
    return box;
  }

  /* ---------- progress ---------- */
  function record(n, correct) {
    var p = store.progress[n] || { a: 0, c: 0, l: null };
    p.a += 1;
    if (correct) p.c += 1;
    p.l = correct;
    store.progress[n] = p;
  }
  function isMarked(n) { return store.marks.indexOf(n) >= 0; }
  function toggleMark(n) {
    var i = store.marks.indexOf(n);
    if (i >= 0) store.marks.splice(i, 1); else store.marks.push(n);
    save();
  }
  function graded(q) { return !q.ungraded && q.ans.length > 0; }

  function pool(source, from, to) {
    return Q.filter(function (q) {
      var p = store.progress[q.n];
      if (source === 'range') return q.n >= from && q.n <= to;
      if (source === 'unseen') return !p;
      if (source === 'wrong') return p && p.l === false;
      if (source === 'marked') return isMarked(q.n);
      return true;
    }).map(function (q) { return q.n; });
  }

  /* ---------- app state ---------- */
  var root = document.getElementById('app');
  var timerId = null;
  var S = store.session; // current session or null

  function clearTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }
  function persist() { store.session = S; save(); }

  function startSession(opts) {
    var ids = opts.ids.slice();
    if (opts.random) ids = shuffle(ids);
    if (opts.limit > 0 && ids.length > opts.limit) ids = ids.slice(0, opts.limit);
    if (!opts.random) ids.sort(function (a, b) { return a - b; });
    if (!ids.length) return false;
    S = {
      mode: opts.mode, ids: ids, idx: 0, ans: {}, checked: {}, finished: false,
      start: Date.now(), limitSec: opts.mode === 'exam' ? Math.max(1, opts.minutes) * 60 : 0, resultAt: 0
    };
    persist();
    viewQuiz();
    return true;
  }

  /* ---------- home ---------- */
  function viewHome() {
    clearTimer();
    window.scrollTo(0, 0);
    var done = 0, right = 0;
    Q.forEach(function (q) {
      var p = store.progress[q.n];
      if (p) { done++; if (p.l) right++; }
    });
    var resume = S && !S.finished ? S : null;

    var mode = 'practice', order = 'seq', source = 'all';
    var form = h('div', { class: 'card' });
    form.appendChild(h('h2', { text: 'Bắt đầu làm bài' }));

    function radios(name, items, cur, onchange) {
      var wrap = h('div', { class: 'choices' });
      items.forEach(function (it) {
        var inp = h('input', { type: 'radio', name: name, value: it[0] });
        if (it[0] === cur) inp.checked = true;
        inp.addEventListener('change', function () { onchange(it[0]); });
        wrap.appendChild(h('label', { class: 'choice' }, inp, h('span', { text: it[1] })));
      });
      return wrap;
    }

    var countEl = h('span', { class: 'muted small' });
    var fromI = h('input', { type: 'number', min: '1', max: String(Q.length), value: '1', 'aria-label': 'Từ câu' });
    var toI = h('input', { type: 'number', min: '1', max: String(Q.length), value: String(Q.length), 'aria-label': 'Đến câu' });
    var limitI = h('input', { type: 'number', min: '1', max: String(Q.length), placeholder: 'Tất cả', 'aria-label': 'Số câu tối đa' });
    var minI = h('input', { type: 'number', min: '1', max: '600', value: '180', 'aria-label': 'Số phút' });
    var rangeRow = h('div', { class: 'row', style: 'display:none' }, h('span', { text: 'Từ câu' }), fromI, h('span', { text: 'đến câu' }), toI);
    var minRow = h('div', { class: 'row', style: 'display:none' }, h('span', { text: 'Thời gian (phút)' }), minI);

    function poolIds() { return pool(source, +fromI.value || 1, +toI.value || Q.length); }
    function refresh() {
      rangeRow.style.display = source === 'range' ? '' : 'none';
      minRow.style.display = mode === 'exam' ? '' : 'none';
      var n = poolIds().length;
      countEl.textContent = n + ' câu phù hợp';
      go.disabled = n === 0;
    }
    var go = h('button', { class: 'primary', text: 'Bắt đầu', onclick: function () {
      var lim = parseInt(limitI.value, 10);
      if (mode === 'exam' && !lim) lim = Math.min(75, poolIds().length);
      startSession({
        mode: mode, ids: poolIds(), random: order === 'rand', limit: lim > 0 ? lim : 0,
        minutes: parseInt(minI.value, 10) || 180
      });
    } });

    var f1 = h('fieldset', null, h('legend', { text: 'Chế độ' }),
      radios('mode', [['practice', 'Luyện tập (biết đúng/sai ngay)'], ['exam', 'Thi thử (chấm khi nộp bài, có đồng hồ)']], mode, function (v) { mode = v; refresh(); }));
    var f2 = h('fieldset', null, h('legend', { text: 'Thứ tự câu hỏi' }),
      radios('order', [['seq', 'Theo thứ tự'], ['rand', 'Ngẫu nhiên']], order, function (v) { order = v; }));
    var srcSel = h('select', { 'aria-label': 'Nguồn câu hỏi', onchange: function () { source = srcSel.value; refresh(); } },
      h('option', { value: 'all', text: 'Tất cả ' + Q.length + ' câu' }),
      h('option', { value: 'range', text: 'Một khoảng câu' }),
      h('option', { value: 'unseen', text: 'Câu chưa làm' }),
      h('option', { value: 'wrong', text: 'Câu làm sai gần nhất' }),
      h('option', { value: 'marked', text: 'Câu đã đánh dấu' }));
    var f3 = h('fieldset', null, h('legend', { text: 'Nguồn câu hỏi' }), srcSel, rangeRow);
    var f4 = h('fieldset', null, h('legend', { text: 'Giới hạn' }),
      h('div', { class: 'row' }, h('span', { text: 'Số câu tối đa' }), limitI), minRow);
    [fromI, toI].forEach(function (i) { i.addEventListener('input', refresh); });
    form.appendChild(f1); form.appendChild(f2); form.appendChild(f3); form.appendChild(f4);
    form.appendChild(h('div', { class: 'row' }, go, countEl));
    refresh();

    var theme = h('button', { class: 'ghost', text: document.documentElement.getAttribute('data-theme') === 'dark' ? 'Chế độ sáng' : 'Chế độ tối', onclick: function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      store.theme = next; save(); viewHome();
    } });
    var exportB = h('button', { class: 'ghost', text: 'Xuất tiến độ', onclick: function () {
      var blob = new Blob([JSON.stringify({ progress: store.progress, marks: store.marks }, null, 1)], { type: 'application/json' });
      var a = h('a', { href: URL.createObjectURL(blob), download: 'dop-c02-tien-do.json' });
      document.body.appendChild(a); a.click(); a.remove();
    } });
    var fileI = h('input', { type: 'file', accept: 'application/json', style: 'display:none', onchange: function () {
      var f = fileI.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var d = JSON.parse(r.result);
          if (d && typeof d.progress === 'object') { store.progress = d.progress; store.marks = Array.isArray(d.marks) ? d.marks : []; save(); viewHome(); }
          else alert('File không đúng định dạng.');
        } catch (e) { alert('Không đọc được file.'); }
      };
      r.readAsText(f);
    } });
    var importB = h('button', { class: 'ghost', text: 'Nhập tiến độ', onclick: function () { fileI.click(); } });
    var resetB = h('button', { class: 'ghost', text: 'Xóa tiến độ', onclick: function () {
      if (confirm('Xóa toàn bộ tiến độ và đánh dấu?')) { store.progress = {}; store.marks = []; S = null; store.session = null; save(); viewHome(); }
    } });

    root.replaceChildren(
      h('div', { class: 'topbar' },
        h('div', null,
          h('h1', { text: 'AWS DevOps Engineer - Professional' }),
          h('div', { class: 'muted', text: 'DOP-C02 · Ôn thi trắc nghiệm · ' + Q.length + ' câu' })),
        h('div', { class: 'spacer' }), theme),
      h('div', { class: 'card' },
        h('div', { class: 'stats' },
          h('div', { class: 'stat' }, h('b', { text: String(Q.length) }), 'Tổng số câu'),
          h('div', { class: 'stat' }, h('b', { text: String(done) }), 'Đã làm'),
          h('div', { class: 'stat' }, h('b', { text: String(right) }), 'Đúng ở lần làm gần nhất'),
          h('div', { class: 'stat' }, h('b', { text: String(store.marks.length) }), 'Đã đánh dấu')),
        h('div', { class: 'bar', style: 'margin-top:12px', role: 'progressbar', 'aria-valuenow': String(done), 'aria-valuemin': '0', 'aria-valuemax': String(Q.length) },
          h('span', { style: 'width:' + (Q.length ? Math.round(done * 100 / Q.length) : 0) + '%' }))),
      resume ? h('div', { class: 'card' },
        h('h2', { text: 'Phiên đang làm dở' }),
        h('p', { class: 'muted', text: (resume.mode === 'exam' ? 'Thi thử' : 'Luyện tập') + ' · câu ' + (resume.idx + 1) + '/' + resume.ids.length }),
        h('div', { class: 'row' },
          h('button', { class: 'primary', text: 'Tiếp tục', onclick: function () { viewQuiz(); } }),
          h('button', { text: 'Bỏ phiên này', onclick: function () { S = null; persist(); viewHome(); } }))) : null,
      form,
      h('div', { class: 'row' }, exportB, importB, resetB, fileI),
      h('footer', { class: 'muted small' }, 'Tiến độ được lưu ngay trên trình duyệt của bạn (localStorage). Nội dung dùng cho mục đích tự học.')
    );
  }

  /* ---------- quiz ---------- */
  function cur() { return byN[S.ids[S.idx]]; }
  function answered(n) { return S.ans[n] && S.ans[n].length > 0; }
  function isCorrect(q) { return graded(q) && answered(q.n) && sameSet(S.ans[q.n], q.ans); }
  /* practice: only questions the user has checked count; exam: every graded question counts */
  function counted(n) { return S.mode === 'exam' || !!S.checked[n]; }
  function revealed(q) { return S.finished || (S.mode === 'practice' && S.checked[q.n]); }

  function remaining() { return Math.max(0, S.limitSec - Math.floor((Date.now() - S.start) / 1000)); }
  function fmt(sec) {
    var m = Math.floor(sec / 60), s = sec % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function finish() {
    if (!S || S.finished) return;
    Object.keys(S.checked).forEach(function () { /* practice results already recorded on check */ });
    if (S.mode === 'exam') {
      S.ids.forEach(function (n) {
        var q = byN[n];
        if (graded(q) && answered(n)) record(n, sameSet(S.ans[n], q.ans));
        else if (graded(q)) record(n, false);
      });
    }
    S.finished = true; S.resultAt = Date.now();
    persist();
    clearTimer();
    viewResult();
  }

  function checkNow() {
    var q = cur();
    if (!answered(q.n) || S.checked[q.n]) return;
    S.checked[q.n] = true;
    if (graded(q)) record(q.n, sameSet(S.ans[q.n], q.ans));
    persist();
    viewQuiz(true);
  }

  function toggleOpt(q, letter) {
    if (revealed(q)) return;
    var a = S.ans[q.n] || [];
    var i = a.indexOf(letter);
    if (q.multi > 1) {
      if (i >= 0) a.splice(i, 1); else a.push(letter);
    } else {
      a = i >= 0 ? [] : [letter];
    }
    S.ans[q.n] = a;
    persist();
    viewQuiz(true);
  }

  function go(delta) {
    var n = S.idx + delta;
    if (n < 0) return;
    if (n >= S.ids.length) {
      if (S.finished) { viewResult(); return; }
      if (S.mode === 'practice') { finish(); return; }
      return;
    }
    S.idx = n; persist(); viewQuiz();
  }

  function jump(i) { S.idx = i; persist(); viewQuiz(); }

  function viewQuiz(keepScroll) {
    if (!S) { viewHome(); return; }
    var y = window.scrollY;
    clearTimer();
    var q = cur();
    var rev = revealed(q);
    var multi = q.multi > 1;
    var picked = S.ans[q.n] || [];

    var timer = null;
    if (S.mode === 'exam' && !S.finished) {
      timer = h('span', { class: 'timer', 'aria-label': 'Thời gian còn lại' });
      var tick = function () {
        var r = remaining();
        timer.textContent = 'Còn ' + fmt(r);
        timer.className = 'timer' + (r < 300 ? ' low' : '');
        if (r <= 0) { clearTimer(); alert('Hết giờ. Bài sẽ được nộp.'); finish(); }
      };
      tick();
      timerId = setInterval(tick, 1000);
    }

    var head = h('div', { class: 'topbar' },
      h('button', { class: 'ghost', text: 'Trang chủ', onclick: function () { clearTimer(); viewHome(); } }),
      h('span', { class: 'muted', text: (S.finished ? 'Xem lại · ' : (S.mode === 'exam' ? 'Thi thử · ' : 'Luyện tập · ')) + 'câu ' + (S.idx + 1) + '/' + S.ids.length }),
      h('div', { class: 'spacer' }), timer,
      S.finished ? h('button', { text: 'Kết quả', onclick: viewResult }) : null,
      !S.finished && S.mode === 'practice' ? h('button', { text: 'Kết thúc', onclick: function () { if (confirm('Kết thúc phiên luyện tập và xem kết quả?')) finish(); } }) : null,
      !S.finished && S.mode === 'exam' ? h('button', { class: 'primary', text: 'Nộp bài', onclick: submitExam }) : null);

    var bar = h('div', { class: 'bar', style: 'margin-top:10px' }, h('span', { style: 'width:' + Math.round((S.idx + 1) * 100 / S.ids.length) + '%' }));

    var qhead = h('div', { class: 'qhead' },
      h('span', { class: 'badge', text: 'Câu ' + q.n }),
      multi ? h('span', { class: 'badge multi', text: 'Chọn ' + q.multi + ' đáp án' }) : null,
      q.ungraded ? h('span', { class: 'badge multi', text: 'Không tính điểm' }) : null,
      h('div', { class: 'spacer' }),
      h('button', { class: 'mark' + (isMarked(q.n) ? ' on' : ''), text: isMarked(q.n) ? 'Đã đánh dấu' : 'Đánh dấu', 'aria-pressed': String(isMarked(q.n)), onclick: function () { toggleMark(q.n); viewQuiz(true); } }));

    var opts = h('div', { class: 'opts', role: multi ? 'group' : 'radiogroup', 'aria-label': 'Các lựa chọn' });
    q.opts.forEach(function (o) {
      var sel = picked.indexOf(o.l) >= 0;
      var cls = 'opt' + (sel ? ' sel' : '') + (rev ? ' locked' : '');
      if (rev && graded(q)) {
        var right = q.ans.indexOf(o.l) >= 0;
        if (right && sel) cls = 'opt locked ok';
        else if (right) cls = 'opt locked miss';
        else if (sel) cls = 'opt locked bad';
        else cls = 'opt locked';
      }
      var inp = h('input', { type: multi ? 'checkbox' : 'radio', name: 'opt', value: o.l, disabled: rev });
      inp.checked = sel;
      var lab = h('label', { class: cls }, inp, h('span', { class: 'letter', text: o.l + '.' }), rich(o.t, 'otext'));
      inp.addEventListener('change', function () { toggleOpt(q, o.l); });
      opts.appendChild(lab);
    });

    var canCheck = S.mode === 'practice' && !rev;
    var actions = h('div', { class: 'actions' },
      h('button', { text: 'Câu trước', disabled: S.idx === 0, onclick: function () { go(-1); } }),
      canCheck ? h('button', { class: 'primary', text: 'Kiểm tra', disabled: !picked.length, onclick: checkNow }) : null,
      h('button', { class: (rev || S.mode === 'exam') ? 'primary' : '', text: S.idx === S.ids.length - 1 ? (S.finished ? 'Về kết quả' : (S.mode === 'practice' ? 'Hoàn thành' : 'Câu cuối')) : 'Câu tiếp', disabled: !S.finished && S.mode === 'exam' && S.idx === S.ids.length - 1, onclick: function () { go(1); } }),
      h('span', { class: 'muted small' }, 'Phím tắt: ', h('span', { class: 'kbd', text: 'A-F' }), ' chọn · ', h('span', { class: 'kbd', text: 'Enter' }), ' kiểm tra/tiếp · ', h('span', { class: 'kbd', text: '←' }), h('span', { class: 'kbd', text: '→' }), ' chuyển câu · ', h('span', { class: 'kbd', text: 'M' }), ' đánh dấu'));

    var card = h('div', { class: 'card' }, qhead, rich(q.stem, 'stem'), opts, actions);
    if (q.note) card.appendChild(h('p', { class: 'muted small', text: q.note }));

    var fb = null;
    if (rev) fb = feedback(q);

    var map = h('div', { class: 'card' }, h('h2', { text: 'Bản đồ câu hỏi' }));
    var grid = h('div', { class: 'map' });
    S.ids.forEach(function (n, i) {
      var qq = byN[n], c = '';
      if (i === S.idx) c += ' cur';
      if (isMarked(n)) c += ' flag';
      if (S.finished || (S.mode === 'practice' && S.checked[n])) {
        if (graded(qq)) c += isCorrect(qq) ? ' right' : ' wrong';
        else c += ' done';
      } else if (answered(n)) c += ' done';
      grid.appendChild(h('button', { class: c.trim(), text: String(n), title: 'Câu ' + n + (i === S.idx ? ' (đang xem)' : ''), onclick: function () { jump(i); } }));
    });
    map.appendChild(grid);

    root.replaceChildren(head, bar, card, fb, map);
    if (keepScroll) window.scrollTo(0, y); else window.scrollTo(0, 0);
  }

  function feedback(q) {
    var box = h('div', { class: 'card fb' });
    if (!graded(q)) {
      box.appendChild(h('div', { class: 'banner info', text: 'Câu này không có đáp án xác định nên không tính điểm.' }));
    } else if (!answered(q.n)) {
      box.appendChild(h('div', { class: 'banner bad', text: 'Chưa trả lời. Đáp án đúng: ' + q.ans.join(', ') }));
    } else if (isCorrect(q)) {
      box.appendChild(h('div', { class: 'banner ok', text: 'Chính xác! Đáp án: ' + q.ans.join(', ') }));
    } else {
      box.appendChild(h('div', { class: 'banner bad', text: 'Chưa đúng. Bạn chọn: ' + S.ans[q.n].slice().sort().join(', ') + ' · Đáp án đúng: ' + q.ans.join(', ') }));
    }
    box.appendChild(h('div', { class: 'small muted', text: q.title }));
    box.appendChild(h('h3', { text: 'Giải thích' }));
    q.expl.forEach(function (p) { box.appendChild(rich(p)); });
    if (q.wrong.length) {
      box.appendChild(h('h3', { text: 'Vì sao các đáp án khác sai' }));
      var ul = h('ul');
      q.wrong.forEach(function (w) { ul.appendChild(h('li', null, h('b', { text: w.l + ': ' }), w.t)); });
      box.appendChild(ul);
    }
    if (q.remember) box.appendChild(h('div', { class: 'remember' }, h('b', { text: 'Ghi nhớ: ' }), q.remember));
    box.appendChild(h('details', { style: 'margin-top:12px' }, h('summary', { text: 'Tóm tắt đề (tiếng Anh)' }), h('p', { text: q.summary })));
    return box;
  }

  function submitExam() {
    var un = S.ids.filter(function (n) { return !answered(n); }).length;
    var msg = un ? 'Còn ' + un + ' câu chưa trả lời. Nộp bài?' : 'Nộp bài và xem kết quả?';
    if (confirm(msg)) finish();
  }

  /* ---------- result ---------- */
  function viewResult() {
    clearTimer();
    window.scrollTo(0, 0);
    var total = 0, right = 0, wrongIds = [];
    S.ids.forEach(function (n) {
      var q = byN[n];
      if (!graded(q) || !counted(n)) return;
      total++;
      if (isCorrect(q)) right++; else wrongIds.push(n);
    });
    var pct = total ? Math.round(right * 100 / total) : 0;
    var secs = Math.floor(((S.resultAt || Date.now()) - S.start) / 1000);
    var rows = S.ids.map(function (n, i) {
      var q = byN[n], st, cls;
      if (!graded(q)) { st = 'Không tính điểm'; cls = 'skip'; }
      else if (!counted(n)) { st = 'Chưa làm'; cls = 'skip'; }
      else if (!answered(n)) { st = 'Bỏ trống'; cls = 'bad'; }
      else if (isCorrect(q)) { st = 'Đúng'; cls = 'ok'; }
      else { st = 'Sai'; cls = 'bad'; }
      return h('tr', { class: 'link', tabindex: '0', onclick: function () { jump(i); }, onkeydown: function (e) { if (e.key === 'Enter') jump(i); } },
        h('td', { text: String(n) }), h('td', { text: q.title }),
        h('td', { text: (S.ans[n] || []).join(', ') || '-' }),
        h('td', { text: q.ans.join(', ') || '?' }),
        h('td', null, h('span', { class: 'tag ' + cls, text: st })));
    });
    root.replaceChildren(
      h('div', { class: 'topbar' }, h('h1', { text: 'Kết quả' }), h('div', { class: 'spacer' }),
        h('button', { text: 'Trang chủ', onclick: function () { S = null; persist(); viewHome(); } })),
      h('div', { class: 'card' },
        h('div', { class: 'score', text: pct + '%' }),
        h('p', { text: 'Đúng ' + right + '/' + total + ' câu · Thời gian ' + fmt(secs) }),
        h('div', { class: 'bar' }, h('span', { style: 'width:' + pct + '%' })),
        h('p', { class: 'muted small', text: 'Điểm đạt thực tế của kỳ thi AWS tính theo thang 100-1000 (cần 750), nên tỷ lệ này chỉ mang tính tham khảo.' }),
        h('div', { class: 'row' },
          h('button', { class: 'primary', text: 'Xem lại từng câu', onclick: function () { jump(0); } }),
          wrongIds.length ? h('button', { text: 'Làm lại ' + wrongIds.length + ' câu sai', onclick: function () { startSession({ mode: 'practice', ids: wrongIds, random: false, limit: 0, minutes: 0 }); } }) : null)),
      h('div', { class: 'card' }, h('h2', { text: 'Chi tiết' }),
        h('div', { style: 'overflow-x:auto' }, h('table', null,
          h('thead', null, h('tr', null, h('th', { text: 'Câu' }), h('th', { text: 'Chủ đề' }), h('th', { text: 'Bạn chọn' }), h('th', { text: 'Đáp án' }), h('th', { text: 'Kết quả' }))),
          h('tbody', null, rows))))
    );
  }

  /* ---------- keyboard ---------- */
  document.addEventListener('keydown', function (e) {
    if (!S || !root.querySelector('.opts')) return;
    var t = e.target;
    if (t && (t.tagName === 'SELECT' || (t.tagName === 'INPUT' && t.type === 'number'))) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var q = cur(), k = e.key;
    var idx = /^[1-6]$/.test(k) ? +k - 1 : LETTERS.indexOf(k.toUpperCase());
    if (k.length === 1 && idx >= 0 && idx < q.opts.length && k.toUpperCase() !== 'M') { e.preventDefault(); toggleOpt(q, q.opts[idx].l); return; }
    if (k === 'Enter') {
      if (t && t.tagName === 'BUTTON') return;
      e.preventDefault();
      if (S.mode === 'practice' && !revealed(q) && answered(q.n)) checkNow(); else go(1);
    } else if (k === 'ArrowRight') { go(1); }
    else if (k === 'ArrowLeft') { go(-1); }
    else if (k.toLowerCase() === 'm') { toggleMark(q.n); viewQuiz(true); }
  });

  /* ---------- boot ---------- */
  window.__dop = { questions: Q, sameSet: sameSet, pool: pool, startSession: startSession, state: function () { return S; }, store: function () { return store; } };
  if (!Q.length) {
    root.textContent = 'Không tải được dữ liệu câu hỏi.';
  } else if (S && S.finished) {
    S = null; persist(); viewHome();
  } else {
    if (S && S.mode === 'exam' && remaining() <= 0) { finish(); } else { viewHome(); }
  }
})();
