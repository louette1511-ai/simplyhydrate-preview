/* Simply Hydrate — interactions + product rendering (elevation pass) */
(function () {
  "use strict";

  var WA = "27828887397";
  var IMG = "assets/products/";

  /* Verified catalogue (names, sizes, prices scraped + confirmed from simplyhydrate.co.za) */
  var PRODUCTS = [
    { c: "water", img: "designer-1l.jpg", name: "Designer Water", size: "1L x 12", price: "R195", tag: "pH 10" },
    { c: "water", img: "designer-750ml.jpg", name: "Designer Water", size: "750ml x 12", price: "R195", tag: "pH 10" },
    { c: "water", img: "designer-500ml.jpg", name: "Designer Water", size: "500ml x 24", price: "R260", tag: "pH 10" },
    { c: "water", img: "designer-330ml.jpg", name: "Designer Water", size: "330ml x 24", price: "R240", tag: "pH 10" },
    { c: "water", img: "designer-alkaline-5l.jpg", name: "Designer Alkaline Water", size: "5L x 4", price: "R200", tag: "pH 10" },
    { c: "water", img: "designer-10l.jpg", name: "Designer Water", size: "10L", price: "R90", tag: "pH 10" },
    { c: "water", img: "puresafe-1-5l.jpg", name: "Pure Safe Still Water", size: "1.5L x 12", price: "R195", tag: "pH 8" },
    { c: "water", img: "puresafe-500ml.jpg", name: "Pure Safe Still Water", size: "500ml x 20", price: "R160", tag: "pH 8" },
    { c: "water", img: "thirsti-5l.jpg", name: "Thirsti Still Spring Water", size: "5L", price: "R100" },
    { c: "water", img: "aquelle-sparkling-500ml.png", name: "aQuellé Sparkling", size: "500ml x 6", price: "R46", tag: "Sparkling" },
    { c: "water", img: "aquelle-sparkling-1-5l.jpg", name: "aQuellé Sparkling", size: "1.5L x 6", price: "R75", tag: "Sparkling" },
    { c: "water", img: "h2glo-flavoured.jpg", name: "H2Glo Flavoured Sparkling", size: "500ml x 12", price: "R170", tag: "Flavoured" },
    { c: "water", img: "aquelle-flavoured-still.png", name: "aQuellé Flavoured Still", size: "750ml", price: "R80", tag: "Low kJ" },

    { c: "beverage", img: "hydrade-zero.png", name: "NPL Hydrade Zero", size: "500ml x 6", price: "R85", tag: "Zero sugar" },
    { c: "beverage", img: "hydrade-fuel-bar.webp", name: "Hydrade Fuel Bar", size: "Energised oats", price: "R260" },
    { c: "beverage", img: "milky-mix.png", name: "Milky Mix Chocolate Drink", size: "Choc or Choc-chai", price: "R105", tag: "Dairy free" },
    { c: "beverage", img: "flavour-enhancer.png", name: "Flavour Water Enhancer", size: "Assorted flavours", price: "R46", tag: "Zero sugar" },
    { c: "beverage", img: "thirsti-sport.png", name: "Thirsti Sport", size: "500ml x 6", price: "R70" },
    { c: "beverage", img: "aquelle-viv-sport.png", name: "aQuellé ViV Sport", size: "500ml x 6", price: "R70" },

    { c: "vitamin", img: "electrolytes.jpg", name: "Biogen Electrolytes+", size: "Effervescent", price: "R150" },
    { c: "vitamin", img: "pure-energy.jpg", name: "Pure Energy+", size: "Recovery drink", price: "R115", tag: "Caffeine free" },
    { c: "vitamin", img: "omega3.jpg", name: "Biogen Platinum Omega 3", size: "60 & 90 tabs", price: "R160 to R220" },
    { c: "vitamin", img: "immuno-boost.jpg", name: "Biogen Immuno Boost", size: "20 effervescents", price: "R130", tag: "Vitamin C" },
    { c: "vitamin", img: "multivitamin.jpg", name: "Biogen Multivitamin", size: "30 to 60 tabs", price: "R100 to R160" },

    { c: "dispenser", img: "midea-freestanding.png", name: "Midea Freestanding Dispenser", size: "Cold & ambient", note: "excl. bottle & water", price: "R2100" },
    { c: "dispenser", img: "midea-countertop.jpg", name: "Midea Countertop Dispenser", size: "Compact", note: "add 20L bottle +R250", price: "R1900" },
    { c: "dispenser", img: "manual-20l.jpg", name: "20L Manual Dispenser", size: "BPA free, with tap", price: "R165" },
    { c: "dispenser", img: "reusable-20l.png", name: "Reusable 20L + Purified Water", size: "Cap & handle", price: "R270" }
  ];

  var WA_ICO = '<svg class="ico-wa" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2Zm5.1 14.1c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3.2-.8-2.7-1.1-4.4-3.9-4.5-4.1-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .6l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.6-.1l.9-1c.2-.2.4-.2.6-.1l1.8.9c.5.2.5.4.5.6 0 .1 0 .5-.1.9Z"/></svg>';

  function waLink(p) {
    var msg = "Hi Simply Hydrate, I'd like to order: " + p.name + " (" + p.size + ") at " + p.price + ".";
    return "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg);
  }

  function tileHTML(p) {
    var sizeLine = p.note ? p.size + " &middot; " + p.note : p.size;
    var tag = p.tag ? '<span class="tile__tag">' + p.tag + "</span>" : "";
    return '' +
      '<article class="tile">' +
        '<div class="tile__stage">' + tag +
          '<img class="tile__img" src="' + IMG + p.img + '" alt="' + p.name + ", " + p.size + '" loading="lazy" />' +
        "</div>" +
        '<div class="tile__info">' +
          '<div class="tile__name">' + p.name + "</div>" +
          '<div class="tile__size">' + sizeLine + "</div>" +
          '<div class="tile__foot">' +
            '<span class="tile__price">' + p.price + "</span>" +
            '<a class="tile__order" href="' + waLink(p) + '" target="_blank" rel="noopener" aria-label="Order ' + p.name + ' on WhatsApp">' + WA_ICO + "Order</a>" +
          "</div>" +
        "</div>" +
      "</article>";
  }

  // Render products into their category rails / grids
  document.querySelectorAll("[data-cat]").forEach(function (box) {
    var cat = box.getAttribute("data-cat");
    box.innerHTML = PRODUCTS.filter(function (p) { return p.c === cat; }).map(tileHTML).join("");
  });

  // Rail arrow buttons
  document.querySelectorAll(".railbtn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var block = btn.closest(".catblock");
      var rail = block && block.querySelector(".rail");
      if (!rail) return;
      var tile = rail.querySelector(".tile");
      var step = tile ? tile.offsetWidth + 20 : rail.clientWidth * 0.8;
      rail.scrollBy({ left: Number(btn.dataset.dir) * step * 1.4, behavior: "smooth" });
    });
  });

  // Drag-to-scroll on rails
  document.querySelectorAll(".rail").forEach(function (rail) {
    var down = false, moved = false, startX = 0, startLeft = 0;
    rail.addEventListener("pointerdown", function (e) {
      down = true; moved = false; startX = e.clientX; startLeft = rail.scrollLeft;
    });
    rail.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 6 && !moved) { moved = true; rail.classList.add("dragging"); rail.setPointerCapture(e.pointerId); }
      if (moved) rail.scrollLeft = startLeft - dx;
    });
    function end() { down = false; if (moved) setTimeout(function () { rail.classList.remove("dragging"); }, 0); }
    rail.addEventListener("pointerup", end);
    rail.addEventListener("pointercancel", end);
    rail.addEventListener("click", function (e) { if (moved) e.preventDefault(); }, true);
  });

  // Scroll reveal
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // Nav scrolled state + scroll progress bar
  var nav = document.querySelector(".nav");
  var fill = document.getElementById("scrollfill");
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 40);
    if (fill) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  var burger = document.querySelector(".nav__burger");
  var links = document.querySelector(".nav__links");
  if (burger) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); });
    });
  }

  // Year stamp
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
