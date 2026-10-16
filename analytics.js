/* ==========================================================================
   analytics.js — Privacy-friendly, self-hosted analytics client.
   No cookies, no fingerprinting, no PII. Respects Do Not Track / GPC.
   Sends events to POST /api/event (see server.py).
   ========================================================================== */

(function () {
  "use strict";

  var dnt =
    navigator.doNotTrack === "1" ||
    navigator.globalPrivacyControl === true;

  function send(name, props) {
    if (dnt) return;
    var payload = {
      n: name,
      p: location.pathname,
      r: document.referrer
        ? (function () {
            try { return new URL(document.referrer).host; } catch (e) { return ""; }
          })()
        : ""
    };
    if (props) {
      for (var k in props) {
        if (Object.prototype.hasOwnProperty.call(props, k)) payload[k] = props[k];
      }
    }
    try {
      var blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon("/api/event", blob);
    } catch (e) { /* no-op */ }
  }

  // Pageview on load.
  send("pageview");

  // Expose for other scripts (main.js uses window.__track).
  window.__track = send;

  // Declarative click tracking: <a data-track="cta_click" data-track-label="...">
  document.addEventListener("click", function (e) {
    var el = e.target && e.target.closest ? e.target.closest("[data-track]") : null;
    if (el) send(el.getAttribute("data-track"), { label: el.getAttribute("data-track-label") || "" });
  });
})();
