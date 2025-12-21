// Vimeo Video Modal İşlevselliği
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const videoModal = document.getElementById("videoModal");
const player = new Vimeo.Player(document.getElementById("vimeoVideo"));

openModal.addEventListener("click", () => {
    videoModal.style.display = "block";
});

closeModal.addEventListener("click", () => {
    videoModal.style.display = "none";
    player.pause();
});

window.addEventListener("click", (e) => {
    if (e.target === videoModal) {
        videoModal.style.display = "none";
        player.pause();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const linksOverlay = document.getElementById("linksOverlay");

    document.getElementById("openLinks").addEventListener("click", function () {
        linksOverlay.style.display = "flex";
    });

    document
        .getElementById("closeLinks")
        .addEventListener("click", function () {
            linksOverlay.style.display = "none";
        });

    // Overlay dışına tıklandığında kapat
    linksOverlay.addEventListener("click", function (event) {
        // Eğer tıklanan alan doğrudan overlay ise (içerideki kutu hariç)
        if (event.target === linksOverlay) {
            linksOverlay.style.display = "none";
        }
    });
});

// Program Sekme Geçişi
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".program-content");

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const day = tab.getAttribute("data-day");
        contents.forEach((content) => {
            content.classList.remove("active");
            if (content.id === day) {
                content.classList.add("active");
            }
        });
    });
});

// Program animasyon düzeltmesi
document.addEventListener("DOMContentLoaded", function () {
    const timelineEvents = document.querySelectorAll(".timeline-event");

    function checkVisibility() {
        timelineEvents.forEach((event) => {
            const rect = event.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                event.classList.add("visible");
            }
        });
    }

    // İlk yüklemede kontrol
    checkVisibility();

    // Scroll sırasında kontrol
    window.addEventListener("scroll", checkVisibility);
});

// Katılımcı kart etkileşimi
document.querySelectorAll(".participant-card").forEach((card) => {
    card.addEventListener("click", function () {
        // Modal açma mantığı buraya eklenecek
        console.log(
            "Katılımcı detayları göster:",
            this.querySelector("h3").textContent
        );
    });
});

// Countdown Script
const countDownDate = new Date("Apr 26, 2025 10:00:00").getTime();

const x = setInterval(function () {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    document.getElementById("days").innerText = Math.floor(
        distance / (1000 * 60 * 60 * 24)
    );
    document.getElementById("hours").innerText = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    document.getElementById("minutes").innerText = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
    );
}, 1000);

window.addEventListener("scroll", () => {
    const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
    const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.querySelector(".scroll-progress").style.width = scrolled + "%";
});

document.querySelectorAll(".faq-question").forEach((item) => {
    item.addEventListener("click", () => {
        const parent = item.parentElement;
        const answer = parent.querySelector(".faq-answer");
        const icon = item.querySelector("i");

        // Diğer açık olanları kapat
        document.querySelectorAll(".faq-item").forEach((otherItem) => {
            if (
                otherItem !== parent &&
                otherItem.classList.contains("active")
            ) {
                otherItem.classList.remove("active");
                otherItem.querySelector(".faq-answer").style.maxHeight = "0";
                otherItem.querySelector("i").style.transform = "rotate(0deg)";
            }
        });

        // Tıklananı aç/kapat
        parent.classList.toggle("active");
        if (parent.classList.contains("active")) {
            answer.style.maxHeight = answer.scrollHeight + "px";
            icon.style.transform = "rotate(45deg)";
        } else {
            answer.style.maxHeight = "0";
            icon.style.transform = "rotate(0deg)";
        }
    });
});

// Custom Cursor
const cursor = document.querySelector(".custom-cursor");
document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
});

document.querySelectorAll("a, button, .participant-card").forEach((element) => {
    element.addEventListener("mouseenter", () => {
        cursor.classList.add("hover");
    });
    element.addEventListener("mouseleave", () => {
        cursor.classList.remove("hover");
    });
});

// Sayfa Görünürlük Animasyonu - Kitap Sayfası Efekti
document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");

    // IntersectionObserver ile section görünürlüğünü takip et
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("page-visible");
            }
        });
    }, observerOptions);

    // Tüm section'ları observe et
    sections.forEach((section) => {
        sectionObserver.observe(section);
    });

    // Sayfa çevirme ipucunu gizle (scroll olunca)
    const pageTurnHint = document.querySelector(".page-turn-hint");
    if (pageTurnHint) {
        window.addEventListener(
            "scroll",
            function () {
                if (window.scrollY > 100) {
                    pageTurnHint.style.opacity = "0";
                    pageTurnHint.style.transition = "opacity 0.5s ease";
                } else {
                    pageTurnHint.style.opacity = "0.8";
                }
            },
            { passive: true }
        );
    }
});

// Scroll Progress güncelle
window.addEventListener(
    "scroll",
    () => {
        const winScroll =
            document.body.scrollTop || document.documentElement.scrollTop;
        const height =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.querySelector(".scroll-progress");
        if (progressBar) {
            progressBar.style.width = scrolled + "%";
        }
    },
    { passive: true }
);
