(function () {
    'use strict';

    var pages = document.querySelectorAll('.page');
    var currentPage = 0;
    var isAnimating = false;
    var ANIMATION_DURATION = 1200;
    var MOBILE_ANIM_DURATION = 600;
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

    /* ===== DRAG-TO-FLIP ===== */

    var isDragging = false;
    var dragStartX = 0;
    var dragStartY = 0;
    var dragStartTime = 0;
    var dragDirection = 0;
    var dragLocked = false;
    var dragProgress = 0;
    var dragRaf = null;
    var DRAG_THRESHOLD = 10;
    var COMPLETE_THRESHOLD = 0.25;
    var VELOCITY_THRESHOLD = 0.35;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function onDragStart(x, y) {
        if (isAnimating || reducedMotion) return;
        dragStartX = x;
        dragStartY = y;
        dragStartTime = Date.now();
        dragDirection = 0;
        dragLocked = false;
        dragProgress = 0;
        isDragging = false;
    }

    function onDragMove(x, y) {
        if (isAnimating || reducedMotion) return;

        var dx = x - dragStartX;
        var dy = y - dragStartY;

        if (!dragLocked) {
            if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
            dragLocked = true;
            if (Math.abs(dy) > Math.abs(dx)) {
                dragDirection = 0;
                return;
            }
            dragDirection = dx < 0 ? 1 : -1;
        }

        if (dragDirection === 0) return;

        if (isMobile()) {
            if (dragDirection === 1 && mobileIndex >= faces.length - 1) return;
            if (dragDirection === -1 && mobileIndex <= 0) return;
        } else {
            if (dragDirection === 1 && currentPage >= pages.length) return;
            if (dragDirection === -1 && currentPage <= 0) return;
        }

        if (!isDragging) {
            isDragging = true;
            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';
            if (isMobile()) {
                addDraggingClass(true);
            } else {
                addDraggingClass(false);
            }
        }

        var screenW = window.innerWidth;
        dragProgress = Math.min(Math.abs(dx) / (screenW * 0.4), 1);

        if (dragRaf) cancelAnimationFrame(dragRaf);
        dragRaf = requestAnimationFrame(function () {
            if (isMobile()) {
                renderMobileDrag(dragProgress, dragDirection);
            } else {
                renderDesktopDrag(dragProgress, dragDirection);
            }
        });
    }

    function onDragEnd(x) {
        if (dragRaf) { cancelAnimationFrame(dragRaf); dragRaf = null; }
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';

        if (!isDragging) {
            if (dragLocked && dragDirection !== 0) {
                var dx = Math.abs(x - dragStartX);
                var elapsed = Date.now() - dragStartTime;
                if (dx > 40 || (dx > 20 && elapsed < 250)) {
                    if (dragDirection === 1) next();
                    else prev();
                    return true;
                }
            }
            return false;
        }

        isDragging = false;
        removeDraggingClass();

        var elapsed2 = Math.max(Date.now() - dragStartTime, 1);
        var velocity = Math.abs(x - dragStartX) / elapsed2;
        var shouldComplete = dragProgress > COMPLETE_THRESHOLD || velocity > VELOCITY_THRESHOLD;

        if (isMobile()) {
            clearMobileDragStyles();
            if (shouldComplete) {
                if (dragDirection === 1) mobileNext();
                else mobilePrev();
            } else {
                isAnimating = true;
                setTimeout(function () { isAnimating = false; }, MOBILE_ANIM_DURATION);
            }
        } else {
            if (shouldComplete) {
                if (dragDirection === 1) {
                    currentPage++;
                } else {
                    currentPage--;
                }
            }
            pages.forEach(function (p) { p.classList.remove('dragging'); });
            updateBookState();
            isAnimating = true;
            setTimeout(function () { isAnimating = false; }, ANIMATION_DURATION);
        }

        dragProgress = 0;
        dragDirection = 0;
        return true;
    }

    function addDraggingClass(mobile) {
        if (mobile) {
            var current = faces[mobileIndex];
            if (current) current.classList.add('dragging');
            if (dragDirection === 1 && mobileIndex < faces.length - 1) {
                faces[mobileIndex + 1].classList.add('dragging');
            } else if (dragDirection === -1 && mobileIndex > 0) {
                faces[mobileIndex - 1].classList.add('dragging');
            }
        } else {
            var page;
            if (dragDirection === 1) page = pages[currentPage];
            else if (currentPage > 0) page = pages[currentPage - 1];
            if (page) page.classList.add('dragging');
        }
    }

    function removeDraggingClass() {
        faces.forEach(function (f) { f.classList.remove('dragging'); });
        pages.forEach(function (p) { p.classList.remove('dragging'); });
    }

    function clearMobileDragStyles() {
        faces.forEach(function (f) {
            f.style.transform = '';
            f.style.zIndex = '';
        });
    }

    function renderDesktopDrag(progress, dir) {
        var page, angle;
        if (dir === 1) {
            page = pages[currentPage];
            if (!page) return;
            angle = -progress * 180;
            page.style.transform = 'rotateY(' + angle + 'deg) translateZ(0px)';
        } else {
            if (currentPage <= 0) return;
            page = pages[currentPage - 1];
            if (!page) return;
            angle = -180 + progress * 180;
            page.style.transform = 'rotateY(' + angle + 'deg) translateZ(0px)';
        }
    }

    function renderMobileDrag(progress, dir) {
        var current = faces[mobileIndex];
        if (!current) return;

        if (dir === 1) {
            var nxt = faces[mobileIndex + 1];
            if (!nxt) return;
            var tx = -progress * 100;
            var ry = -progress * 30;
            current.style.transform = 'perspective(1200px) translateX(' + tx + '%) rotateY(' + ry + 'deg)';
            var ntx = 100 - progress * 100;
            var nry = 30 - progress * 30;
            nxt.style.transform = 'perspective(1200px) translateX(' + ntx + '%) rotateY(' + nry + 'deg)';
            nxt.style.zIndex = '2';
        } else {
            var prv = faces[mobileIndex - 1];
            if (!prv) return;
            var tx2 = progress * 100;
            var ry2 = progress * 30;
            current.style.transform = 'perspective(1200px) translateX(' + tx2 + '%) rotateY(' + ry2 + 'deg)';
            var ptx = -100 + progress * 100;
            var pry = -30 + progress * 30;
            prv.style.transform = 'perspective(1200px) translateX(' + ptx + '%) rotateY(' + pry + 'deg)';
            prv.style.zIndex = '2';
        }
    }

    /* Touch events */
    document.addEventListener('touchstart', function (e) {
        if (e.target.closest('.nav-btn') || e.target.closest('.mobile-menu-wrap') ||
            e.target.closest('.page-indicator') || e.target.closest('.side-nav')) return;
        var t = e.changedTouches[0];
        onDragStart(t.clientX, t.clientY);
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
        var t = e.changedTouches[0];
        onDragMove(t.clientX, t.clientY);
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
        var t = e.changedTouches[0];
        onDragEnd(t.clientX);
    }, { passive: true });

    /* Mouse events (desktop) */
    var isMouseDown = false;
    var mouseTarget = null;
    var bookEl = document.getElementById('book');

    document.addEventListener('mousedown', function (e) {
        if (e.button !== 0 || isMobile()) return;
        if (!bookEl || !bookEl.contains(e.target)) return;
        isMouseDown = true;
        mouseTarget = e.target;
        onDragStart(e.clientX, e.clientY);
    });

    document.addEventListener('mousemove', function (e) {
        if (!isMouseDown) return;
        onDragMove(e.clientX, e.clientY);
    });

    document.addEventListener('mouseup', function (e) {
        if (!isMouseDown) return;
        isMouseDown = false;
        var handled = onDragEnd(e.clientX);
        if (!handled && !isMobile()) {
            var clicked = mouseTarget ? mouseTarget.closest('.page') : null;
            if (clicked && !mouseTarget.closest('a') && !mouseTarget.closest('button') &&
                !mouseTarget.closest('[role="button"]')) {
                var idx = Array.prototype.indexOf.call(pages, clicked);
                if (idx === currentPage) next();
                else if (idx === currentPage - 1) prev();
            }
        }
        mouseTarget = null;
    });

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
        isDragging = false;
        removeDraggingClass();
        if (isMobile()) {
            clearMobileDragStyles();
            pages.forEach(function (page) {
                page.style.transform = '';
                page.style.zIndex = '';
            });
            updateMobileFaces();
        } else {
            faces.forEach(function (face) {
                face.classList.remove('mobile-active', 'mobile-prev');
                face.style.transform = '';
                face.style.zIndex = '';
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
