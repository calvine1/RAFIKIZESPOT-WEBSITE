/* =========================================
   RAFIKI ZESPÓËL — MAIN JAVASCRIPT
   ========================================= */

document.documentElement.classList.add("js-ready");

/* =========================================
   HEADER SCROLL EFFECT
   ========================================= */

const siteHeader = document.querySelector(".site-header");

function updateHeader() {
    if (!siteHeader) return;

    siteHeader.classList.toggle(
        "scrolled",
        window.scrollY > 30
    );
}

updateHeader();

window.addEventListener("scroll", updateHeader, {
    passive: true
});

/* =========================================
   MOBILE NAVIGATION
   ========================================= */

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

function closeMenu() {
    if (!menuToggle || !navMenu) return;

    navMenu.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
}

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("active");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    document.addEventListener("click", (event) => {
        const clickedInsideMenu = navMenu.contains(event.target);
        const clickedToggle = menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {
            closeMenu();
        }
    });
}

/* =========================================
   SCROLL REVEAL ANIMATIONS
   ========================================= */

const revealElements = document.querySelectorAll(".reveal");

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
}

/* =========================================
   CURRENT YEAR
   Footer elements can use data-current-year
   ========================================= */

document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
});

/* =========================================
   CLOSE MOBILE MENU IF RESIZED TO DESKTOP
   ========================================= */

window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
        closeMenu();
    }
});