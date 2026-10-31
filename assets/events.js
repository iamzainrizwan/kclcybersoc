// kcl cybersoc events: the one list. add an event here and the /events page,
// the home page's next-event box, the link-in-bio page and the red "live now"
// banner (on every page) all update by themselves.
//
// times are uk local with the offset written out:
//   +01:00 while clocks are on bst (last sun of march -> last sun of october)
//   +00:00 in gmt (the rest of the year)
// url is optional (an event page on this site, or a discord/luma link).
//
// preview any moment by adding ?now=2026-10-28T14:00:00Z to a page's url.
window.CYBERSOC_EVENTS = [
  {
    name: 'patch wednesday',
    kind: 'workshop · blue team',
    start: '2026-10-28T13:00:00+00:00',
    end: '2026-10-28T15:00:00+00:00',
    where: 'bush house (s) 6.03',
    url: '/patch-wednesday/',
    blurb: 'we hand you a broken web app with five real bug classes. you write the fix and ship it.',
  },
  {
    name: 'tech summit: cybersecurity panel',
    kind: 'panel · with kcl tech',
    start: '2026-10-31T16:00:00+00:00',
    end: '2026-10-31T16:45:00+00:00',
    where: 'edmond j. safra lecture theatre, king\'s building',
    url: 'https://techsummit.kcltech.co.uk/',
    blurb: 'the acceleration of ai cyber-threats. kcl tech\'s tech summit panel, run with us: speakers from vodafone, negative zero, kcl and westminster.',
  },
];

(function () {
  const TZ = 'Europe/London';
  const now = () => {
    try { const q = new URLSearchParams(location.search).get('now'); if (q && !isNaN(Date.parse(q))) return new Date(q); } catch {}
    return new Date();
  };
  const fmt = (d, o) => new Intl.DateTimeFormat('en-GB', Object.assign({ timeZone: TZ }, o)).format(d).toLowerCase();
  const time = d => fmt(d, { hour: '2-digit', minute: '2-digit', hour12: false });
  const day = d => fmt(d, { weekday: 'short', day: 'numeric', month: 'short' }).replace(',', '');
  const year = d => fmt(d, { year: 'numeric' });

  const list = () => window.CYBERSOC_EVENTS
    .map(e => Object.assign({}, e, { s: new Date(e.start), e: new Date(e.end) }))
    .sort((a, b) => a.s - b.s);

  // split into live / upcoming (soonest first) / past (most recent first)
  function split() {
    const t = now(), all = list();
    return {
      live: all.filter(e => e.s <= t && t < e.e),
      upcoming: all.filter(e => e.s > t),
      past: all.filter(e => e.e <= t).reverse(),
    };
  }
  // "wed 28 oct · 13:00–15:00" (adds the year when it isn't this year)
  function when(e) {
    const y = year(e.s) !== year(now()) ? ' ' + year(e.s) : '';
    return `${day(e.s)}${y} · ${time(e.s)}–${time(e.e)}`;
  }
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  window.cybersocEvents = { split, when, time, esc };

  // ---- the red live banner, fixed to the top of the screen ----
  const css = `
#live-banner { position:fixed; top:0; left:0; right:0; z-index:100; display:flex; align-items:center; justify-content:center;
  gap:10px; padding:10px 16px; background:#c4141a; color:#fff; font-family:'IBM Plex Mono',monospace; font-size:15px;
  line-height:1.35; text-decoration:none; text-align:center; border-bottom:2px solid #7a0b0f; }
#live-banner b { font-weight:700; }
#live-banner .dot { flex:none; width:10px; height:10px; border-radius:50%; background:#fff; animation:livepulse 1.4s ease-in-out infinite; }
#live-banner .go { text-decoration:underline; text-underline-offset:3px; white-space:nowrap; }
#live-banner:hover .go, #live-banner:focus-visible .go { text-decoration-thickness:2px; }
#live-banner:focus-visible { outline:3px solid #fff; outline-offset:-5px; }
@media (max-width:600px) { #live-banner .where { display:none; } #live-banner { font-size:14px; } }
@keyframes livepulse { 50% { opacity:.25; } }
@media (prefers-reduced-motion: reduce) { #live-banner .dot { animation:none; } }`;

  function banner() {
    const live = split().live[0];
    let el = document.getElementById('live-banner');
    if (!live) { if (el) { el.remove(); document.body.style.paddingTop = ''; } return; }
    if (!document.getElementById('live-banner-css')) {
      const st = document.createElement('style'); st.id = 'live-banner-css'; st.textContent = css; document.head.appendChild(st);
    }
    if (!el) { el = document.createElement(live.url ? 'a' : 'div'); el.id = 'live-banner'; el.setAttribute('role', 'status'); document.body.prepend(el); }
    if (live.url) el.href = live.url;
    el.innerHTML = `<span class="dot" aria-hidden="true"></span><span><b>live now: ${esc(live.name)}</b>` +
      `${live.where ? '<span class="where"> · ' + esc(live.where) + '</span>' : ''} · until ${time(live.e)}` +
      `${live.url ? ' <span class="go">details -&gt;</span>' : ''}</span>`;
    document.body.style.paddingTop = (el.offsetHeight + 24) + 'px';
  }
  const start = () => { banner(); setInterval(banner, 30000); addEventListener('resize', banner); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
