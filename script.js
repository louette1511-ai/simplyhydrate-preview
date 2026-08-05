/* StaHua Goodies Digital Services — interactions
   ---------------------------------------------------------------
   EDIT YOUR DETAILS HERE. Everything on the site reads from CONFIG.
   --------------------------------------------------------------- */
var CONFIG = {
  // WhatsApp number in international format, digits only (27 = South Africa, drop the leading 0).
  waNumber: "27823876430",           // 082 387 6430
  email:    "louette@mweb.co.za",
  // Social profile links. Leave "" and the icon will scroll to the contact section.
  socials: {
    facebook:  "",
    instagram: "",
    tiktok:    ""
  }
};

(function () {
  "use strict";

  var DEFAULT_MSG = "Hi StaHua Goodies, I'd like to chat about your digital services.";

  function waLink(msg) {
    return "https://wa.me/" + CONFIG.waNumber + "?text=" + encodeURIComponent(msg || DEFAULT_MSG);
  }

  // --- Wire WhatsApp links ---
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    el.setAttribute("href", waLink(el.getAttribute("data-msg")));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  // --- Wire email links ---
  document.querySelectorAll("[data-email]").forEach(function (el) {
    el.setAttribute("href", "mailto:" + CONFIG.email);
  });
  document.querySelectorAll("[data-email-label]").forEach(function (el) {
    el.textContent = CONFIG.email;
  });

  // --- Wire social links ---
  document.querySelectorAll("[data-social]").forEach(function (el) {
    var key = el.getAttribute("data-social");
    var url = CONFIG.socials[key];
    if (url) {
      el.setAttribute("href", url);
    } else {
      el.setAttribute("href", "#contact");
      el.removeAttribute("target");
    }
  });

  // --- Quote builder ---
  var qbForm = document.getElementById("qbForm");
  var qbTotal = document.getElementById("qbTotal");
  var qbLines = document.getElementById("qbLines");
  var qbSend = document.getElementById("qbSend");

  function fmt(n) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

  function stripTags(s) { return s.replace(/&times;/g, "x").replace(/&amp;/g, "&"); }

  function updateQuote() {
    if (!qbForm) return;
    var total = 0;
    var picks = [];

    var freq = qbForm.querySelector('input[name="freq"]:checked');
    if (freq) {
      total += parseInt(freq.value, 10);
      picks.push({ label: stripTags(freq.getAttribute("data-label")), amt: parseInt(freq.value, 10) });
    }
    qbForm.querySelectorAll('input[type="checkbox"]:checked').forEach(function (cb) {
      total += parseInt(cb.value, 10);
      picks.push({ label: stripTags(cb.getAttribute("data-label")), amt: parseInt(cb.value, 10) });
    });

    if (qbTotal) qbTotal.textContent = fmt(total);
    if (qbLines) {
      qbLines.innerHTML = picks.map(function (p) {
        return "<li><span>" + p.label + "</span><b>R" + fmt(p.amt) + "</b></li>";
      }).join("");
    }
    if (qbSend) {
      var msg = "Hi StaHua Goodies, I'd like this package: " +
        picks.map(function (p) { return p.label + " (R" + fmt(p.amt) + ")"; }).join(", ") +
        ". Estimated total: R" + fmt(total) + " per month.";
      qbSend.setAttribute("href", waLink(msg));
      qbSend.setAttribute("target", "_blank");
      qbSend.setAttribute("rel", "noopener");
    }
  }

  if (qbForm) {
    qbForm.addEventListener("change", updateQuote);
    updateQuote();
  }

  // --- Count-up numbers in the hero card ---
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var dec = parseInt(el.getAttribute("data-dec") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var start = null, dur = 1400;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(dec) + suffix;
    }
    requestAnimationFrame(step);
  }

  // --- Scroll reveal (+ trigger count-up) ---
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });

    var numbers = document.querySelectorAll(".hcard__num[data-count]");
    var nio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); nio.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    numbers.forEach(function (el) { nio.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // --- Nav scrolled state + scroll progress ---
  var nav = document.querySelector(".nav");
  var fill = document.getElementById("scrollfill");
  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 40);
    if (fill) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // --- Mobile menu ---
  var burger = document.querySelector(".nav__burger");
  var links = document.querySelector(".nav__links");
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // --- Consult form (front-end only acknowledgement) ---
  var form = document.querySelector(".signup");
  if (form) {
    form.addEventListener("submit", function () {
      var input = form.querySelector("input");
      var note = form.querySelector(".signup__note");
      if (input && input.value && note) {
        note.hidden = false;
        input.value = "";
      }
    });
  }

  // --- Year stamp ---
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
