(function () {
    'use strict';

    var pages = document.querySelectorAll('.page');
    var currentPage = 0;
    var isAnimating = false;
    var ANIMATION_DURATION = 1200;
    var MOBILE_ANIM_DURATION = 500;
    var indicatorContainer = document.getElementById('pageIndicator');
    var MOBILE_BREAKPOINT = 900;

    /* ===== MOBILE FACES ===== */

    var faces = [];
    pages.forEach(function (page) {
        var front = page.querySelector('.front');
        var back = page.querySelector('.back');
        if (front) faces.push(front);
        if (back) faces.push(back);
    });
    var mobileIndex = 0;

    function isMobile() {
        return window.innerWidth <= MOBILE_BREAKPOINT;
    }

    function updateMobileFaces() {
        faces.forEach(function (face, i) {
            face.classList.remove('mobile-active', 'mobile-prev');
            if (i === mobileIndex) {
                face.classList.add('mobile-active');
            } else if (i < mobileIndex) {
                face.classList.add('mobile-prev');
            }
        });
        updateMobileIndicator();
    }

    function mobileNext() {
        if (isAnimating || mobileIndex >= faces.length - 1) return;
        isAnimating = true;
        mobileIndex++;
        updateMobileFaces();
        setTimeout(function () { isAnimating = false; }, MOBILE_ANIM_DURATION);
    }

    function mobilePrev() {
        if (isAnimating || mobileIndex <= 0) return;
        isAnimating = true;
        mobileIndex--;
        updateMobileFaces();
        setTimeout(function () { isAnimating = false; }, MOBILE_ANIM_DURATION);
    }

    function mobileGoTo(target) {
        if (isAnimating || target === mobileIndex) return;
        if (target < 0 || target >= faces.length) return;
        isAnimating = true;
        mobileIndex = target;
        updateMobileFaces();
        setTimeout(function () { isAnimating = false; }, MOBILE_ANIM_DURATION);
    }

    /* ===== PAGE INDICATOR ===== */

    function buildIndicator() {
        if (!indicatorContainer) return;
        indicatorContainer.innerHTML = '';
        var count = isMobile() ? faces.length : pages.length + 1;
        for (var i = 0; i < count; i++) {
            var dot = document.createElement('span');
            dot.className = 'indicator-dot' + (i === 0 ? ' active' : '');
            dot.dataset.page = i;
            (function (target) {
                dot.addEventListener('click', function () {
                    if (isMobile()) {
                        mobileGoTo(target);
                    } else {
                        goToPage(target);
                    }
                });
            })(i);
            indicatorContainer.appendChild(dot);
        }
    }

    function updateIndicator() {
        if (!indicatorContainer) return;
        var dots = indicatorContainer.querySelectorAll('.indicator-dot');
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === currentPage);
        });
    }

    function updateMobileIndicator() {
        if (!indicatorContainer) return;
        var dots = indicatorContainer.querySelectorAll('.indicator-dot');
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === mobileIndex);
        });
    }

    /* ===== BOOK STATE (DESKTOP) ===== */

    function updateBookState() {
        if (isMobile()) return;

        faces.forEach(function (face) {
            face.classList.remove('mobile-active', 'mobile-prev');
        });

        pages.forEach(function (page, index) {
            var depth = 0;
            var zIndex = 0;
            var transform = '';

            if (index < currentPage) {
                depth = (currentPage - 1) - index;
                page.classList.add('flipped');
                zIndex = 100 - depth;
                transform = 'rotateY(-180deg) translateZ(' + depth + 'px)';
            } else {
                depth = index - currentPage;
                page.classList.remove('flipped');
                zIndex = 100 - depth;
                transform = 'rotateY(0deg) translateZ(' + (-depth) + 'px)';
            }

            page.style.zIndex = zIndex;
            page.style.transform = transform;
        });

        updateIndicator();
        updateSideNav();
    }

    /* ===== SIDE NAV ===== */

    var sideNav = document.getElementById('sideNav');

    function updateSideNav() {
        if (!sideNav) return;
        if (currentPage === 0) {
            sideNav.classList.remove('hidden');
        } else {
            sideNav.classList.add('hidden');
        }
    }

    if (sideNav) {
        var sideNavBtns = sideNav.querySelectorAll('.side-nav-btn');
        sideNavBtns.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                var target = parseInt(btn.dataset.target, 10);
                if (!isNaN(target)) {
                    goToPage(target);
                }
            });
        });
    }

    /* ===== NAVIGATION WITH ANIMATION LOCK ===== */

    function next() {
        if (isAnimating) return;
        if (isMobile()) { mobileNext(); return; }
        if (currentPage < pages.length) {
            isAnimating = true;
            currentPage++;
            updateBookState();
            setTimeout(function () { isAnimating = false; }, ANIMATION_DURATION);
        }
    }

    function prev() {
        if (isAnimating) return;
        if (isMobile()) { mobilePrev(); return; }
        if (currentPage > 0) {
            isAnimating = true;
            currentPage--;
            updateBookState();
            setTimeout(function () { isAnimating = false; }, ANIMATION_DURATION);
        }
    }

    function goToPage(target) {
        if (isAnimating || target === currentPage) return;
        if (isMobile()) { mobileGoTo(target); return; }
        if (target < 0 || target > pages.length) return;
        isAnimating = true;
        currentPage = target;
        updateBookState();
        setTimeout(function () { isAnimating = false; }, ANIMATION_DURATION);
    }

    /* ===== MOBILE MENU ===== */

    var mobileMenuBtn = document.getElementById('mobileMenuBtn');
    var mobileMenuIcon = document.getElementById('mobileMenuIcon');
    var mobileMenu = document.getElementById('mobileMenu');
    var mobileMenuWrap = document.getElementById('mobileMenuWrap');
    var menuOpen = false;

    function toggleMobileMenu() {
        if (!mobileMenu) return;
        menuOpen = !menuOpen;
        mobileMenu.classList.toggle('open', menuOpen);
        if (mobileMenuIcon) {
            mobileMenuIcon.className = menuOpen ? 'fas fa-times' : 'fas fa-bars';
        }
    }

    function closeMobileMenu() {
        if (!mobileMenu || !menuOpen) return;
        menuOpen = false;
        mobileMenu.classList.remove('open');
        if (mobileMenuIcon) {
            mobileMenuIcon.className = 'fas fa-bars';
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }

    document.addEventListener('click', function (e) {
        if (menuOpen && mobileMenuWrap && !mobileMenuWrap.contains(e.target)) {
            closeMobileMenu();
        }
    });

    var mobileMenuItems = document.querySelectorAll('.mobile-menu-item');
    mobileMenuItems.forEach(function (item) {
        item.addEventListener('click', function () {
            var target = parseInt(item.dataset.mobileTarget, 10);
            if (!isNaN(target)) {
                closeMobileMenu();
                setTimeout(function () {
                    if (isMobile()) {
                        mobileGoTo(target);
                    } else {
                        goToPage(target);
                    }
                }, 150);
            }
        });
    });

    /* ===== BUTTON EVENTS ===== */

    document.getElementById('nextBtn').addEventListener('click', next);
    document.getElementById('prevBtn').addEventListener('click', prev);

    /* ===== KEYBOARD NAVIGATION ===== */

    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
    });

    /* ===== PAGE CLICK (DESKTOP) ===== */

    pages.forEach(function (page, index) {
        page.addEventListener('click', function (e) {
            if (isMobile()) return;
            if (e.target.closest('a') || e.target.closest('[role="button"]')) return;

            if (index === currentPage) next();
            else if (index === currentPage - 1) prev();
        });
    });

    /* ===== TOUCH / SWIPE SUPPORT ===== */

    var touchStartX = 0;
    var touchStartY = 0;
    var SWIPE_THRESHOLD = 50;

    document.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
        var deltaX = e.changedTouches[0].screenX - touchStartX;
        var deltaY = e.changedTouches[0].screenY - touchStartY;
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
            if (deltaX < 0) next();
            else prev();
        }
    }, { passive: true });

    /* ===== COUNTDOWN ===== */

    var targetDate = new Date('2026-05-16T10:00:00+03:00').getTime();

    function updateCountdown() {
        var daysEl = document.getElementById('countDays');
        var hoursEl = document.getElementById('countHours');
        var minsEl = document.getElementById('countMins');
        if (!daysEl) return;

        var now = new Date().getTime();
        var diff = targetDate - now;

        if (diff <= 0) {
            daysEl.textContent = '0';
            hoursEl.textContent = '0';
            minsEl.textContent = '0';
            return;
        }

        daysEl.textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
        hoursEl.textContent = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minsEl.textContent = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    }

    updateCountdown();
    setInterval(updateCountdown, 60000);

    /* ===== INIT ===== */

    function initMode() {
        if (isMobile()) {
            pages.forEach(function (page) {
                page.style.transform = '';
                page.style.zIndex = '';
            });
            updateMobileFaces();
        } else {
            faces.forEach(function (face) {
                face.classList.remove('mobile-active', 'mobile-prev');
            });
            updateBookState();
        }
        buildIndicator();
    }

    initMode();

    /* ===== FOUC PREVENTION ===== */

    window.addEventListener('load', function () {
        document.body.classList.add('loaded');
    });

    /* ===== RESIZE HANDLER (debounced) ===== */

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initMode, 150);
    });
})();
