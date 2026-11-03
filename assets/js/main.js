/* =========================================
   RAFIKI ZESPÓËL — MAIN JAVASCRIPT
   ========================================= */

document.documentElement.classList.add("js-ready");

/* LOAD SHARED COMPONENTS */
async function loadSharedComponents() {
    const placeholders = document.querySelectorAll("[data-include]");

    const tasks = Array.from(placeholders).map(async (placeholder) => {
        const component = placeholder.dataset.include;

        if (!["header", "footer"].includes(component)) {
            console.warn(`Unknown shared component: ${component}`);
            return;
        }

        try {
            const response = await fetch(`/components/${component}.html`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            placeholder.innerHTML = await response.text();
        } catch (error) {
            console.error(`Could not load ${component}.html:`, error);
        }
    });

    await Promise.all(tasks);
}

/* HEADER SCROLL EFFECT */
function initHeaderScroll() {
    const siteHeader = document.querySelector(".site-header");

    if (!siteHeader) return;

    function updateHeader() {
        siteHeader.classList.toggle("scrolled", window.scrollY > 30);
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
}

/* MOBILE NAVIGATION */
function initMobileNavigation() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (!menuToggle || !navMenu) return;

    function closeMenu() {
        navMenu.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("active");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
        const clickedInsideMenu = navMenu.contains(event.target);
        const clickedToggle = menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) closeMenu();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 820) closeMenu();
    });
}

/* SCROLL REVEAL */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal");
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if ("IntersectionObserver" in window && !reduceMotion) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        });

        revealElements.forEach((element) => revealObserver.observe(element));
    } else {
        revealElements.forEach((element) => element.classList.add("visible"));
    }
}

/* CURRENT YEAR */
function initCurrentYear() {
    document.querySelectorAll("[data-current-year]").forEach((element) => {
        element.textContent = new Date().getFullYear();
    });
}

/* INITIALIZE WEBSITE */
async function initializeWebsite() {
    await loadSharedComponents();

    initHeaderScroll();
    initMobileNavigation();
    initScrollReveal();
    initCurrentYear();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeWebsite);
} else {
    initializeWebsite();
}
