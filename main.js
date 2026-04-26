/**
 * booking.js
 * Module xử lý toàn bộ logic cho trang booking.html
 * Import và gọi initBooking(config, courts) từ main.js
 */

import { showToast } from "../components/Toast.js";
import { saveBooking, saveBookedSlots, getBookedSlots } from "./store.js";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatVnd(value) {
    return `${value.toLocaleString("vi-VN")}đ`;
}

function renderStars(rating) {
    const full = "★".repeat(rating);
    const empty = "☆".repeat(5 - rating);
    return `${full}${empty}`;
}

// ─── Gallery config ──────────────────────────────────────────────────────────

const SPORT_GALLERIES = {
    "Pickleball": [
        "https://images.unsplash.com/photo-1554068865-24cecd4e34f8?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80"
    ],
    "Tennis": [
        "https://images.unsplash.com/photo-1545809027-1b44e55b5a38?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1200&q=80"
    ],
    "Cầu lông": [
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1659203073213-57c6b26524b6?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80"
    ],
    "Bóng đá": [
        "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=80"
    ],
    "Bóng rổ": [
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?auto=format&fit=crop&w=1200&q=80"
    ],
    "Bóng chuyền": [
        "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=1200&q=80"
    ]
};

const DEFAULT_GALLERY = [
    "https://images.unsplash.com/photo-1545809027-1b44e55b5a38?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80"
];

function buildGallery(court) {
    const sportType = (court.sports && court.sports[0]) || "Tennis";
    const galleryBase = SPORT_GALLERIES[sportType] || DEFAULT_GALLERY;
    return court.image
        ? [court.image, galleryBase[1], galleryBase[2]]
        : galleryBase;
}

// ─── Review helpers ──────────────────────────────────────────────────────────

const REVIEW_KEY = "sporthub_user_reviews";

const DEFAULT_REVIEWS = [
    { author: "Nguyễn Văn A", rating: 5, comment: "Sân mới, đẹp, chủ sân nhiệt tình. Trải nghiệm rất tốt." },
    { author: "Trần Thị B",   rating: 5, comment: "Mặt sân ổn, ánh sáng tốt. Mình sẽ quay lại thường xuyên." }
];

function readStoredReviews() {
    try {
        const raw = localStorage.getItem(REVIEW_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
        return {};
    }
}

function writeStoredReviews(allReviews) {
    localStorage.setItem(REVIEW_KEY, JSON.stringify(allReviews));
}

function getCourtReviews(courtId) {
    const all = readStoredReviews();
    return Array.isArray(all[courtId]) ? all[courtId] : [];
}

// ─── Main export ─────────────────────────────────────────────────────────────

/**
 * Khởi tạo toàn bộ trang đặt sân.
 * @param {Object} config  - Cấu hình app từ config.json
 * @param {Array}  courts  - Danh sách sân từ courts.json
 * @param {Function} bindRevealAnimations - Callback animation từ main.js
 */
export function initBooking(config, courts, bindRevealAnimations) {
    // ── 1. Xác định sân ──────────────────────────────────────────────────────
    const urlParams = new URLSearchParams(window.location.search);
    const courtId   = urlParams.get("id");
    const court     = courts.find(c => c.id === courtId) || courts[0];

    // ── 2. Dữ liệu cơ bản ───────────────────────────────────────────────────
    const gallery      = buildGallery(court);
    const slotTimeline = Array.from({ length: 17 }, (_, i) => `${String(i + 6).padStart(2, "0")}:00`);
    const dates        = ["21", "22", "23", "24", "25", "26", "27"];
    const subCourts    = court.sports.includes("Pickleball")
        ? [
            { id: "A", label: "Pickleball 1",   multiplier: 1    },
            { id: "B", label: "Pickleball 2",   multiplier: 1.15 },
            { id: "C", label: "Pickleball VIP", multiplier: 1.3  }
          ]
        : [
            { id: "D", label: "Sân 1", multiplier: 1   },
            { id: "E", label: "Sân 2", multiplier: 1.1 }
          ];

    // ── 3. Trạng thái cục bộ ────────────────────────────────────────────────
    let imageIndex     = 0;
    let activeDate     = 0;
    let activeSubCourt = 0;
    let selectedRating = 0;
    const selectedSlots = new Set();

    // ── 4. DOM refs ──────────────────────────────────────────────────────────
    const heroImage     = document.getElementById("bookingHeroImage");
    const thumbs        = document.getElementById("bookingThumbs");
    const dateList      = document.getElementById("dateList");
    const subcourtList  = document.getElementById("subcourtList");
    const timeGrid      = document.getElementById("timeGrid");
    const detailMeta    = document.getElementById("detailMeta");
    const reviewsTitle  = document.getElementById("reviewsTitle");
    const reviewList    = document.getElementById("reviewList");
    const starRating    = document.getElementById("starRating");
    const submitReview  = document.getElementById("submitReview");
    const reviewComment = document.getElementById("reviewComment");

    // ── 5. Busy slots ────────────────────────────────────────────────────────
    function getBusySlots() {
        const seed = (activeDate + 1) * (activeSubCourt + 1) * court.id.charCodeAt(0);
        const busy = new Set();
        const count = (seed % 3) + 3;
        for (let i = 0; i < count; i++) {
            busy.add(slotTimeline[(seed * (i + 2)) % slotTimeline.length]);
        }

        // Lấy slot đã đặt từ localStorage
        const dateStr     = `2026-04-${dates[activeDate]}`;
        const subcourtId  = subCourts[activeSubCourt].id;
        const bookedSlots = getBookedSlots(court.id, dateStr, subcourtId);

        if (bookedSlots && typeof bookedSlots === "object") {
            (Array.isArray(bookedSlots) ? bookedSlots : Object.keys(bookedSlots))
                .forEach(slot => busy.add(slot));
        }
        return busy;
    }

    let busySlots = getBusySlots();

    // ── 6. Helpers giá ───────────────────────────────────────────────────────
    function getCurrentPrice() {
        const base = court.priceFrom || court.pricePerHour || 0;
        return Math.round(base * subCourts[activeSubCourt].multiplier);
    }

    // ── 7. Render functions ──────────────────────────────────────────────────
    function renderGallery() {
        heroImage.src = gallery[imageIndex];

        thumbs.innerHTML = gallery.map((src, idx) =>
            `<img src="${src}" class="booking-thumb ${idx === imageIndex ? "is-active" : ""}" data-index="${idx}" alt="thumbnail">`
        ).join("");

        const indicators = document.getElementById("heroIndicators");
        if (indicators) {
            indicators.innerHTML = gallery.map((_, idx) =>
                `<div class="hero-indicator ${idx === imageIndex ? "is-active" : ""}"></div>`
            ).join("");
        }
    }

    function renderDates() {
        dateList.innerHTML = dates.map((d, idx) =>
            `<button class="date-chip ${idx === activeDate ? "is-active" : ""}" data-index="${idx}" type="button">
                <strong>${d}</strong><span>T4</span>
             </button>`
        ).join("");
    }

    function renderSubCourts() {
        const base = court.priceFrom || court.pricePerHour || 80000;
        subcourtList.innerHTML = subCourts.map((item, idx) =>
            `<button class="subcourt-chip ${idx === activeSubCourt ? "is-active" : ""}" data-index="${idx}" type="button">
                <strong>${item.label}</strong>
                <span style="font-size:0.8rem;opacity:0.8">${formatVnd(base * item.multiplier)}/h</span>
             </button>`
        ).join("");
    }

    function renderSlots() {
        timeGrid.innerHTML = slotTimeline.map(slot => {
            const isBusy    = busySlots.has(slot);
            const isSelected = selectedSlots.has(slot);
            const stateClass = isBusy ? "is-busy" : isSelected ? "is-selected" : "";
            const nextHour  = `${String(Number(slot.slice(0, 2)) + 1).padStart(2, "0")}:00`;
            return `<button class="time-cell ${stateClass}" data-slot="${slot}" ${isBusy ? "disabled" : ""} type="button">
                        <strong>${slot}</strong>
                        <span style="font-size:0.75rem">${nextHour}</span>
                    </button>`;
        }).join("");
    }

    function renderSummary() {
        const currentPrice = getCurrentPrice();
        const totalHours   = selectedSlots.size;
        const totalPrice   = totalHours * currentPrice;

        document.getElementById("summaryPrice").innerHTML =
            `${formatVnd(currentPrice)}<span class="text-sm">/giờ</span>`;
        document.getElementById("summaryDate").textContent =
            `T3, ${dates[activeDate]}/04/2026`;
        document.getElementById("summaryCourtName").textContent =
            subCourts[activeSubCourt].label;
        document.getElementById("summarySlots").textContent  = `${totalHours} slot`;
        document.getElementById("summaryTotal").textContent  = formatVnd(totalPrice);
        document.getElementById("bottomHours").textContent   = `${totalHours}h`;
        document.getElementById("bottomTotal").textContent   = formatVnd(totalPrice);
        document.getElementById("bottomConfirm").textContent = `${totalHours} khung giờ đã chọn`;

        const detailName = document.getElementById("detailCourtName");
        if (detailName) detailName.textContent = court.name;

        const breadcrumbName = document.getElementById("breadcrumbCourtName");
        if (breadcrumbName) breadcrumbName.textContent = court.name;

        if (detailMeta) {
            detailMeta.innerHTML = `
                <span class="meta-item">📍 ${court.address || court.district}</span>
                <span class="meta-item">🕒 ${court.openTime || "06:00"} - ${court.closeTime || "22:00"}</span>
                <span class="meta-item">⭐ ${court.rating || 0} (${court.reviews || 0} đánh giá)</span>`;
        }

        if (reviewsTitle) {
            reviewsTitle.textContent = `ĐÁNH GIÁ (${court.reviews || 0})`;
        }
    }

    function renderReviewList() {
        const userReviews = getCourtReviews(court.id);
        reviewList.innerHTML = [...userReviews, ...DEFAULT_REVIEWS].map(item => `
            <div class="review-item">
                <div class="review-item__head">
                    <strong>${item.author}</strong>
                    <span class="review-item__stars">${renderStars(item.rating)}</span>
                </div>
                <p class="review-item__text">${item.comment}</p>
            </div>`
        ).join("");
    }

    function updateStarInput() {
        starRating?.querySelectorAll(".star-btn").forEach(btn => {
            const value = Number(btn.dataset.value);
            btn.classList.toggle("is-active", value <= selectedRating);
            btn.textContent = value <= selectedRating ? "★" : "☆";
        });
    }

    function draw() {
        renderGallery();
        renderDates();
        renderSubCourts();
        renderSlots();
        renderSummary();
    }

    // ── 8. Slide tự động ────────────────────────────────────────────────────
    let slideInterval = setInterval(() => {
        imageIndex = (imageIndex + 1) % gallery.length;
        renderGallery();
    }, 3000);

    const heroSection = document.querySelector(".booking-hero");
    if (heroSection) {
        heroSection.addEventListener("mouseenter", () => clearInterval(slideInterval));
        heroSection.addEventListener("mouseleave", () => {
            slideInterval = setInterval(() => {
                imageIndex = (imageIndex + 1) % gallery.length;
                renderGallery();
            }, 3000);
        });
    }

    // ── 9. Event listeners ──────────────────────────────────────────────────
    document.getElementById("heroPrev").addEventListener("click", () => {
        imageIndex = imageIndex === 0 ? gallery.length - 1 : imageIndex - 1;
        renderGallery();
    });
    document.getElementById("heroNext").addEventListener("click", () => {
        imageIndex = (imageIndex + 1) % gallery.length;
        renderGallery();
    });

    thumbs.addEventListener("click", e => {
        const item = e.target.closest("img[data-index]");
        if (!item) return;
        imageIndex = Number(item.dataset.index);
        renderGallery();
    });

    dateList.addEventListener("click", e => {
        const item = e.target.closest(".date-chip");
        if (!item) return;
        activeDate = Number(item.dataset.index);
        selectedSlots.clear();
        busySlots = getBusySlots();
        draw();
    });

    subcourtList.addEventListener("click", e => {
        const item = e.target.closest(".subcourt-chip");
        if (!item) return;
        activeSubCourt = Number(item.dataset.index);
        selectedSlots.clear();
        busySlots = getBusySlots();
        renderSubCourts();
        renderSlots();
        renderSummary();
    });

    timeGrid.addEventListener("click", e => {
        const item = e.target.closest(".time-cell");
        if (!item || item.classList.contains("is-busy")) return;
        const { slot } = item.dataset;
        selectedSlots.has(slot) ? selectedSlots.delete(slot) : selectedSlots.add(slot);
        renderSlots();
        renderSummary();
    });

    // ── 10. Booking flow ─────────────────────────────────────────────────────
    function continueFlow() {
        if (!selectedSlots.size) {
            showToast("Vui lòng chọn ít nhất 1 khung giờ");
            return;
        }
        const dateStr    = `2026-04-${dates[activeDate]}`;
        const subcourtId = subCourts[activeSubCourt].id;
        saveBookedSlots(court.id, dateStr, subcourtId, Array.from(selectedSlots));
        saveBooking({
            court: { ...court, name: `${court.name} - ${subCourts[activeSubCourt].label}` },
            slot:  [...selectedSlots].join(", "),
            date:  dateStr
        });
        window.location.href = "./profile.html";
    }

    document.getElementById("continueBooking").addEventListener("click", continueFlow);

    // ── 11. Đánh giá ────────────────────────────────────────────────────────
    starRating?.addEventListener("click", e => {
        const button = e.target.closest(".star-btn");
        if (!button) return;
        selectedRating = Number(button.dataset.value);
        updateStarInput();
    });

    submitReview?.addEventListener("click", () => {
        const comment = (reviewComment?.value || "").trim();
        if (!selectedRating) { showToast("Vui lòng chọn số sao từ 1 đến 5"); return; }
        if (!comment)        { showToast("Vui lòng nhập nội dung đánh giá"); return; }

        const allReviews = readStoredReviews();
        const list = Array.isArray(allReviews[court.id]) ? allReviews[court.id] : [];
        list.unshift({ author: "Bạn", rating: selectedRating, comment });
        allReviews[court.id] = list;
        writeStoredReviews(allReviews);

        if (reviewComment) reviewComment.value = "";
        selectedRating = 0;
        updateStarInput();
        renderReviewList();
        showToast("Cảm ơn bạn đã gửi đánh giá!");
    });

    // ── 12. Tab switching ────────────────────────────────────────────────────
    const tabBtns      = document.querySelectorAll("#bookingTabBar .tab-btn");
    const blockDate     = document.getElementById("blockDate");
    const blockSubCourt = document.getElementById("blockSubCourt");
    const blockTime     = document.getElementById("blockTime");
    const blockInfo     = document.getElementById("blockInfo");
    const blockReviews  = document.getElementById("blockReviews");
    const bottomBar     = document.getElementById("bottomBar");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("is-active"));
            btn.classList.add("is-active");
            const tab = btn.dataset.tab;

            blockDate.style.display     = "none";
            blockSubCourt.style.display = "none";
            blockTime.style.display     = "none";
            blockInfo.style.display     = "none";
            blockReviews.style.display  = "none";
            bottomBar.style.display     = "none";

            if (tab === "booking") {
                blockDate.style.display     = "block";
                blockSubCourt.style.display = "block";
                blockTime.style.display     = "block";
                bottomBar.style.display     = "flex";
            } else if (tab === "info") {
                blockInfo.style.display = "block";
            } else if (tab === "reviews") {
                blockReviews.style.display = "block";
            }
        });
    });

    // ── 13. Khởi tạo lần đầu ────────────────────────────────────────────────
    draw();
    renderReviewList();
    updateStarInput();
    bindRevealAnimations();
}