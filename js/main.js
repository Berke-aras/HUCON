(function () {
    'use strict';

    var pages = document.querySelectorAll('.page');
    var currentPage = 0;
    var isAnimating = false;
    var ANIMATION_DURATION = 1200;
    var indicatorContainer = document.getElementById('pageIndicator');

    /* ===== PAGE INDICATOR ===== */

    function buildIndicator() {
        if (!indicatorContainer) return;
        indicatorContainer.innerHTML = '';
        for (var i = 0; i <= pages.length; i++) {
            var dot = document.createElement('span');
            dot.className = 'indicator-dot' + (i === 0 ? ' active' : '');
            dot.dataset.page = i;
            (function (target) {
                dot.addEventListener('click', function () {
                    goToPage(target);
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

    /* ===== BOOK STATE ===== */

    function updateBookState() {
        if (window.innerWidth <= 900) return;

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
    }

    /* ===== NAVIGATION WITH ANIMATION LOCK ===== */

    function next() {
        if (window.innerWidth <= 900 || isAnimating) return;
        if (currentPage < pages.length) {
            isAnimating = true;
            currentPage++;
            updateBookState();
            setTimeout(function () { isAnimating = false; }, ANIMATION_DURATION);
        }
    }

    function prev() {
        if (window.innerWidth <= 900 || isAnimating) return;
        if (currentPage > 0) {
            isAnimating = true;
            currentPage--;
            updateBookState();
            setTimeout(function () { isAnimating = false; }, ANIMATION_DURATION);
        }
    }

    function goToPage(target) {
        if (window.innerWidth <= 900 || isAnimating || target === currentPage) return;
        if (target < 0 || target > pages.length) return;
        isAnimating = true;
        currentPage = target;
        updateBookState();
        setTimeout(function () { isAnimating = false; }, ANIMATION_DURATION);
    }

    /* ===== BUTTON EVENTS ===== */

    document.getElementById('nextBtn').addEventListener('click', next);
    document.getElementById('prevBtn').addEventListener('click', prev);

    /* ===== KEYBOARD NAVIGATION ===== */

    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
    });

    /* ===== PAGE CLICK ===== */

    pages.forEach(function (page, index) {
        page.addEventListener('click', function (e) {
            if (window.innerWidth <= 900) return;
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
        if (window.innerWidth <= 900) return;
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

    buildIndicator();
    updateBookState();

    /* ===== FOUC PREVENTION ===== */

    window.addEventListener('load', function () {
        document.body.classList.add('loaded');
    });

    /* ===== RESIZE HANDLER ===== */

    window.addEventListener('resize', function () {
        if (window.innerWidth > 900) {
            updateBookState();
        } else {
            pages.forEach(function (page) {
                page.style.transform = '';
                page.style.zIndex = '';
            });
        }
    });
})();
