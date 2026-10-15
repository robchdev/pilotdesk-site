// Types one short session into the Mac on the home page, once. With reduced motion it is shown whole.
(function () {
  var el = document.getElementById("term");
  if (!el) return;
  var prompt = "roberto@MacBook-Pro ~ % ";
  var steps = [
    { out: "Last login: Thu Oct 16 09:41 from iPhone\n", dim: true },
    { cmd: "uptime" },
    { out: " 9:41  up 12 days,  3:02, 1 user, load averages: 1.42 1.61 1.58\n" },
    { cmd: "docker ps --format '{{.Names}}  {{.Status}}'" },
    { out: "website   Up 2 hours\ndatabase  Up 2 hours\n" },
    { cmd: "git -C ~/Projects/website pull" },
    { out: "Already up to date.\n" },
    { cmd: "claude" }
  ];

  function span(cls, text) {
    var s = document.createElement("span");
    if (cls) s.className = cls;
    s.textContent = text;
    el.appendChild(s);
    return s;
  }
  function caret() { var c = document.createElement("span"); c.className = "caret"; el.appendChild(c); return c; }

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    steps.forEach(function (s) {
      if (s.cmd) { span("p", prompt); span("", s.cmd + (s === steps[steps.length - 1] ? "" : "\n")); }
      else span(s.dim ? "dim" : "", s.out);
    });
    caret();
    return;
  }

  var i = 0;
  var c = caret();
  function next() {
    if (i >= steps.length) return;
    var s = steps[i++];
    if (s.out) {
      el.insertBefore(Object.assign(document.createElement("span"), { className: s.dim ? "dim" : "", textContent: s.out }), c);
      setTimeout(next, 380);
      return;
    }
    el.insertBefore(Object.assign(document.createElement("span"), { className: "p", textContent: prompt }), c);
    var typed = document.createElement("span");
    el.insertBefore(typed, c);
    var k = 0;
    (function type() {
      if (k < s.cmd.length) { typed.textContent += s.cmd[k++]; setTimeout(type, 38 + Math.random() * 45); return; }
      if (i < steps.length) { typed.textContent += "\n"; setTimeout(next, 260); }
    })();
  }
  setTimeout(next, 500);
})();
