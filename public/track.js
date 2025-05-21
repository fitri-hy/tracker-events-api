(function () {
  const TRACK_SITE = window.TRACK_SITE;
  const TRACK_ENDPOINT = "http://localhost:5000";

  if (!TRACK_SITE) {
    console.warn(`
████████╗██████╗  █████╗  ██████╗██╗  ██╗███████╗██████╗ 
╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
   ██║   ██████╔╝███████║██║     █████╔╝ █████╗  ██████╔╝
   ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗
   ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
                                       
Warning: Tracking will not work. "TRACK_SITE" is not set.
ADD script before track.js: %cwindow.TRACK_SITE = your_site_name";`, 'color: orange; font-weight: bold;');
    return;
  }
  
  const validSiteName = /^[a-zA-Z0-9-_]+$/;
  if (!validSiteName.test(TRACK_SITE)) {
    console.warn(`
████████╗██████╗  █████╗  ██████╗██╗  ██╗███████╗██████╗ 
╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
   ██║   ██████╔╝███████║██║     █████╔╝ █████╗  ██████╔╝
   ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗
   ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
                                                         
Warning: Tracking will not work. "TRACK_SITE" contains invalid characters. only letters, numbers, dashes (-), and underscores (_) are allowed.
ERROR: %cwindow.TRACK_SITE = "${TRACK_SITE}";`, 'color: red; font-weight: bold;');
    return;
  }
  
  console.warn(`
████████╗██████╗  █████╗  ██████╗██╗  ██╗███████╗██████╗ 
╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
   ██║   ██████╔╝███████║██║     █████╔╝ █████╗  ██████╔╝
   ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗
   ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝


Visit to view the report: "${TRACK_ENDPOINT}/analytics?site=${TRACK_SITE}"
%cSUCCESS: Tracker event is running!`, 'color: green; font-weight: bold;');
  
  function getDeviceType() {
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) return "mobile";
    if (/tablet/i.test(ua)) return "tablet";
    return "desktop";
  }

  function send(event, data = {}) {
    const payload = {
      site: TRACK_SITE,
      event,
      page: location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      device: getDeviceType(),
      timestamp: new Date().toISOString(),
      ...data,
    };

    const query = encodeURIComponent(JSON.stringify(payload));
    const img = new Image();
    img.src = TRACK_ENDPOINT + "/api/track.gif?data=" + query;
  }

  send("pageview");

  document.addEventListener("click", (e) => {
    const target = e.target.closest("a, button, input");
    if (target) {
      send("click", {
        tag: target.tagName,
        text: target.innerText?.slice(0, 100),
        href: target.href || target.action || null,
      });
    }
  });

  let scrolled = false;
  window.addEventListener("scroll", () => {
    if (!scrolled) {
      scrolled = true;
      send("scroll");
    }
  });

  document.addEventListener("submit", (e) => {
    const form = e.target;
    const inputs = Array.from(form.elements)
      .filter((el) => el.name && el.type !== "password")
      .reduce((obj, el) => {
        obj[el.name] = el.value;
        return obj;
      }, {});

    send("form_submit", { inputs });
  });

  window.trackCustomEvent = (name, data = {}) => {
    send("custom_event", { name, ...data });
  };
})();
