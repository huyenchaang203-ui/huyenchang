/**
 * MAIN JAVASCRIPT - ACADEMIC PORTFOLIO
 * Sinh viên: Nguyễn Huyền Trang
 * Trường Đại học Y Dược
 */

document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  initMobileMenu();
  initScrollEffects();
  initTypingAnimation();
  initCounters();
  initAccordion();
  initPDFViewers();
  initComputerDiagram();
  initKanbanBoard();
  initGallery();
  initLightbox();

  // Kích hoạt cuộn lần đầu để chạy scroll reveal
  window.dispatchEvent(new Event("scroll"));
});


/**
 * 2. DARK MODE TOGGLE (Chế độ tối sáng)
 * Hỗ trợ lưu cấu hình vào localStorage của trình duyệt
 */
function initDarkMode() {
  const toggleBtn = document.getElementById("theme-toggle-btn");
  if (!toggleBtn) return;
  
  // Kiểm tra cấu hình cũ của người dùng
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
  
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

/**
 * 3. MOBILE MENU NAVIGATION (Menu trên điện thoại)
 */
function initMobileMenu() {
  const menuBtn = document.getElementById("menu-btn");
  const navList = document.querySelector("nav");
  const navLinks = document.querySelectorAll("nav ul li a");
  
  if (!menuBtn || !navList) return;
  
  // Bật/tắt menu
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    navList.classList.toggle("open");
    const icon = menuBtn.querySelector("i");
    if (navList.classList.contains("open")) {
      icon.className = "fas fa-times";
    } else {
      icon.className = "fas fa-bars";
    }
  });
  
  // Đóng menu khi nhấp vào link điều hướng
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navList.classList.remove("open");
      const icon = menuBtn.querySelector("i");
      if (icon) icon.className = "fas fa-bars";
    });
  });
  
  // Đóng menu khi nhấp ra ngoài
  document.addEventListener("click", (e) => {
    if (navList.classList.contains("open") && !navList.contains(e.target) && e.target !== menuBtn) {
      navList.classList.remove("open");
      const icon = menuBtn.querySelector("i");
      if (icon) icon.className = "fas fa-bars";
    }
  });
}

/**
 * 4. SCROLL EFFECTS (Hiệu ứng khi cuộn trang)
 * - Header dính & Thanh tiến trình đọc sách
 * - Làm nổi bật mục điều hướng hiện tại (Active Nav Link)
 * - Scroll Reveal (Hiển thị mượt các khối nội dung)
 * - Back to Top Button
 */
function initScrollEffects() {
  const header = document.querySelector("header");
  const progressBar = document.querySelector(".reading-progress-bar");
  const backToTop = document.getElementById("back-to-top");
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav ul li a");
  
  // Xử lý sự kiện scroll
  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // 1. Cập nhật thanh tiến trình đọc
    if (docHeight > 0 && progressBar) {
      const scrollPercent = (scrollPos / docHeight) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    }
    
    // 2. Nút Back to Top
    if (backToTop) {
      if (scrollPos > 400) {
        backToTop.classList.add("show");
      } else {
        backToTop.classList.remove("show");
      }
    }
    
    // 3. Highlight liên kết Menu hoạt động
    let currentSection = "";
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 120;
      const secHeight = sec.offsetHeight;
      if (scrollPos >= secTop && scrollPos < secTop + secHeight) {
        currentSection = sec.getAttribute("id");
      }
    });
    
    if (currentSection) {
      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentSection}`) {
          link.classList.add("active");
        }
      });
    }
    
    // 4. Scroll Reveal
    document.querySelectorAll(".reveal").forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      const revealPoint = 150;
      if (elementTop < window.innerHeight - revealPoint) {
        el.classList.add("active");
      }
    });
  });
  
  // Nút cuộn lên đầu trang
  if (backToTop) {
    backToTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
}

/**
 * 5. TYPING ANIMATION (Hiệu ứng gõ chữ ở Hero Section)
 */
function initTypingAnimation() {
  const textEl = document.querySelector(".typing-text");
  if (!textEl) return;
  
  const words = JSON.parse(textEl.getAttribute("data-words") || "[]");
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      // Xóa ký tự
      textEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Thêm ký tự
      textEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }
    
    let typeSpeed = isDeleting ? 40 : 80;
    
    if (!isDeleting && charIndex === currentWord.length) {
      // Gõ xong một từ -> dừng lại một lát
      typeSpeed = 1500;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Xóa xong một từ -> chuyển từ kế tiếp
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500;
    }
    
    setTimeout(type, typeSpeed);
  }
  
  setTimeout(type, 1000);
}

/**
 * 6. ANIMATED COUNTERS (Số chạy tăng dần)
 */
function initCounters() {
  const counters = document.querySelectorAll(".counter-value");
  if (counters.length === 0) return;
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetVal = parseInt(target.getAttribute("data-target") || "0", 10);
        let currentVal = 0;
        const step = Math.ceil(targetVal / 50); // Tốc độ chạy số
        
        const counterInterval = setInterval(() => {
          currentVal += step;
          if (currentVal >= targetVal) {
            target.textContent = targetVal;
            clearInterval(counterInterval);
          } else {
            target.textContent = currentVal;
          }
        }, 30);
        
        obs.unobserve(target); // Chạy 1 lần duy nhất
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => observer.observe(counter));
}

/**
 * 7. ACCORDION (Khối xếp chồng)
 * Dùng cho phần "Bài học rút ra" của mỗi Case Study
 */
function initAccordion() {
  const headers = document.querySelectorAll(".accordion-header");
  
  headers.forEach(header => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const content = header.nextElementSibling;
      const isActive = item.classList.contains("active");
      
      // Đóng tất cả các accordion khác
      const parentSection = item.closest(".accordion-container");
      if (parentSection) {
        parentSection.querySelectorAll(".accordion-item").forEach(sibling => {
          sibling.classList.remove("active");
          sibling.querySelector(".accordion-content").style.maxHeight = null;
        });
      }
      
      if (!isActive) {
        item.classList.add("active");
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}

/**
 * 8. CUSTOM PDF VIEWERS (Bộ xem tài liệu PDF kiểu Notion)
 * Hỗ trợ Phóng to, Thu nhỏ, Xem toàn màn hình, Tải về, Mở trong tab mới
 */
function initPDFViewers() {
  const viewers = document.querySelectorAll(".pdf-viewer");
  
  viewers.forEach(viewer => {
    const iframe = viewer.querySelector("iframe");
    const zoomInBtn = viewer.querySelector(".zoom-in-btn");
    const zoomOutBtn = viewer.querySelector(".zoom-out-btn");
    const zoomLevelEl = viewer.querySelector(".pdf-zoom-level");
    const fullscreenBtn = viewer.querySelector(".fullscreen-btn");
    const openTabBtn = viewer.querySelector(".open-tab-btn");
    const downloadBtn = viewer.querySelector(".download-btn");
    const loadBtn = viewer.querySelector(".load-pdf-btn");
    const placeholder = viewer.querySelector(".pdf-placeholder");
    const container = viewer.querySelector(".pdf-iframe-container");
    
    if (!iframe) return;
    
    // Nạp PDF động khi nhấn nút Xem
    if (loadBtn && placeholder && container) {
      loadBtn.addEventListener("click", () => {
        const dataSrc = iframe.getAttribute("data-src");
        if (dataSrc) {
          iframe.setAttribute("src", dataSrc);
          iframe.removeAttribute("data-src");
        }
        placeholder.style.display = "none";
        container.style.display = "block";
      });
    }
    
    let currentZoom = 100;
    
    // Zoom In
    if (zoomInBtn) {
      zoomInBtn.addEventListener("click", () => {
        checkAndLoadPdf();
        if (currentZoom < 150) {
          currentZoom += 10;
          iframe.style.transform = `scale(${currentZoom / 100})`;
          iframe.style.width = `${100 * (100 / currentZoom)}%`;
          iframe.style.height = `${100 * (100 / currentZoom)}%`;
          if (zoomLevelEl) zoomLevelEl.textContent = `${currentZoom}%`;
        }
      });
    }
    
    // Zoom Out
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener("click", () => {
        checkAndLoadPdf();
        if (currentZoom > 70) {
          currentZoom -= 10;
          iframe.style.transform = `scale(${currentZoom / 100})`;
          iframe.style.width = `${100 * (100 / currentZoom)}%`;
          iframe.style.height = `${100 * (100 / currentZoom)}%`;
          if (zoomLevelEl) zoomLevelEl.textContent = `${currentZoom}%`;
        }
      });
    }
    
    // Fullscreen Toggle (Toggle CSS Fullscreen Mode)
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener("click", () => {
        checkAndLoadPdf();
        viewer.classList.toggle("fullscreen");
        const icon = fullscreenBtn.querySelector("i");
        if (viewer.classList.contains("fullscreen")) {
          icon.className = "fas fa-compress";
        } else {
          icon.className = "fas fa-expand";
        }
      });
    }
    
    // Open in New Tab
    if (openTabBtn) {
      openTabBtn.addEventListener("click", () => {
        const fileUrl = iframe.getAttribute("src") || iframe.getAttribute("data-src");
        window.open(fileUrl, "_blank");
      });
    }
    
    // Download File
    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        const fileUrl = iframe.getAttribute("src") || iframe.getAttribute("data-src");
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }

    // Tự động nạp PDF nếu người dùng tương tác trực tiếp với các nút toolbar
    function checkAndLoadPdf() {
      if (placeholder && container && placeholder.style.display !== "none") {
        const dataSrc = iframe.getAttribute("data-src");
        if (dataSrc) {
          iframe.setAttribute("src", dataSrc);
          iframe.removeAttribute("data-src");
        }
        placeholder.style.display = "none";
        container.style.display = "block";
      }
    }
  });
}

/**
 * 9. COMPUTER DIAGRAM (Sơ đồ hệ thống phần cứng)
 * Hiển thị thông tin mô tả chi tiết khi hover chuột lên các thiết bị ngoại vi
 */
function initComputerDiagram() {
  const nodes = document.querySelectorAll(".diagram-node");
  
  // Tạo element tooltip
  const tooltip = document.createElement("div");
  tooltip.className = "diagram-tooltip";
  document.body.appendChild(tooltip);
  
  const componentInfo = {
    cpu: {
      title: "Bộ xử lý trung tâm (CPU)",
      desc: "Được coi là bộ não của máy tính, chịu trách nhiệm thực thi các câu lệnh và điều khiển hoạt động của hệ thống phần cứng."
    },
    ram: {
      title: "Bộ nhớ truy cập ngẫu nhiên (RAM)",
      desc: "Bộ nhớ lưu trữ dữ liệu tạm thời của các chương trình đang hoạt động. Dữ liệu sẽ mất đi khi tắt nguồn máy tính."
    },
    mainboard: {
      title: "Bo mạch chủ (Mainboard)",
      desc: "Bản mạch xương sống kết nối tất cả các linh kiện phần cứng bao gồm CPU, RAM, ổ cứng và các cổng giao tiếp thiết bị ngoại vi."
    },
    storage: {
      title: "Thiết bị lưu trữ (SSD/HDD)",
      desc: "Bộ nhớ lưu trữ dài hạn hệ điều hành, các phần mềm ứng dụng và toàn bộ dữ liệu cá nhân của người dùng."
    },
    keyboard: {
      title: "Bàn phím (Keyboard)",
      desc: "Thiết bị ngoại vi nhập liệu chuẩn, dùng để nhập văn bản và điều khiển hệ thống bằng phím bấm."
    },
    mouse: {
      title: "Chuột máy tính (Mouse)",
      desc: "Thiết bị ngoại vi trỏ và điều hướng trong giao diện đồ họa người dùng (GUI), hỗ trợ chọn các thao tác nhanh chóng."
    },
    monitor: {
      title: "Màn hình hiển thị (Monitor)",
      desc: "Thiết bị ngoại vi đầu ra chính, hiển thị thông tin hình ảnh, văn bản và toàn bộ giao diện làm việc."
    }
  };
  
  nodes.forEach(node => {
    node.addEventListener("mouseenter", (e) => {
      const compId = node.getAttribute("data-comp");
      const info = componentInfo[compId];
      if (!info) return;
      
      tooltip.innerHTML = `<strong>${info.title}</strong><p style="margin-top: 4px; line-height: 1.4;">${info.desc}</p>`;
      tooltip.style.display = "block";
    });
    
    node.addEventListener("mousemove", (e) => {
      tooltip.style.left = `${e.pageX + 15}px`;
      tooltip.style.top = `${e.pageY + 15}px`;
    });
    
    node.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    });
  });
}

/**
 * 10. KANBAN BOARD (Bảng Kanban hợp tác dự án)
 * Kéo thả thẻ công việc giữa các trạng thái (Todo, Doing, Review, Done)
 */
function initKanbanBoard() {
  const cards = document.querySelectorAll(".kanban-card");
  const cols = document.querySelectorAll(".kanban-cards");
  
  if (cards.length === 0 || cols.length === 0) return;
  
  cards.forEach(card => {
    card.addEventListener("dragstart", () => {
      card.classList.add("dragging");
    });
    
    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
      updateKanbanCounts();
    });
  });
  
  cols.forEach(col => {
    col.addEventListener("dragover", (e) => {
      e.preventDefault();
      col.classList.add("drag-over");
      
      const draggingCard = document.querySelector(".kanban-card.dragging");
      if (!draggingCard) return;
      
      // Định vị trí chèn thẻ
      const afterElement = getDragAfterElement(col, e.clientY);
      if (afterElement == null) {
        col.appendChild(draggingCard);
      } else {
        col.insertBefore(draggingCard, afterElement);
      }
    });
    
    col.addEventListener("dragleave", () => {
      col.classList.remove("drag-over");
    });
    
    col.addEventListener("drop", () => {
      col.classList.remove("drag-over");
      updateKanbanCounts();
    });
  });
  
  // Xác định thẻ đứng trước hoặc sau con trỏ chuột khi kéo thả
  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".kanban-card:not(.dragging)")];
    
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }
  
  // Cập nhật số đếm thẻ trên mỗi cột
  function updateKanbanCounts() {
    cols.forEach(col => {
      const colId = col.getAttribute("data-col");
      const countEl = document.getElementById(`kanban-count-${colId}`);
      if (countEl) {
        const count = col.querySelectorAll(".kanban-card").length;
        countEl.textContent = count;
      }
    });
  }
  
  // Chạy lần đầu
  updateKanbanCounts();
}

/**
 * 11. GALLERY FILTER & SEARCH (Phân loại & Tìm kiếm tác phẩm)
 */
function initGallery() {
  const searchInput = document.getElementById("gallery-search");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  
  if (galleryItems.length === 0) return;
  
  let currentFilter = "all";
  let currentSearchQuery = "";
  
  // Xử lý bộ lọc filter
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter");
      applyFilterAndSearch();
    });
  });
  
  // Xử lý ô tìm kiếm
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearchQuery = e.target.value.toLowerCase().trim();
      applyFilterAndSearch();
    });
  }
  
  function applyFilterAndSearch() {
    galleryItems.forEach(item => {
      const itemCategory = item.getAttribute("data-category");
      const itemSearchText = item.getAttribute("data-search").toLowerCase();
      
      const matchesFilter = (currentFilter === "all" || itemCategory === currentFilter);
      const matchesSearch = itemSearchText.includes(currentSearchQuery);
      
      if (matchesFilter && matchesSearch) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }
}

/**
 * 12. LIGHTBOX (Bộ xem ảnh phóng to toàn màn hình)
 * Phóng to hình ảnh hoặc sơ đồ SVG khi nhấp chuột
 */
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxWrapper = document.querySelector(".lightbox-content-wrapper");
  const lightboxCaption = document.querySelector(".lightbox-caption");
  const closeBtn = document.querySelector(".lightbox-close");
  const triggers = document.querySelectorAll("[data-lightbox]");
  
  if (!lightbox || !lightboxWrapper) return;
  
  triggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      // Làm sạch nội dung cũ
      lightboxWrapper.innerHTML = "";
      
      // Kiểm tra xem là IMG hay SVG
      const img = trigger.querySelector("img");
      const svg = trigger.querySelector("svg");
      const captionText = trigger.getAttribute("data-lightbox") || "";
      
      if (img) {
        const clone = img.cloneNode(true);
        lightboxWrapper.appendChild(clone);
      } else if (svg) {
        const clone = svg.cloneNode(true);
        lightboxWrapper.appendChild(clone);
      } else {
        // Nếu trigger chính là element chứa SVG/IMG
        if (trigger.tagName === "SVG") {
          lightboxWrapper.appendChild(trigger.cloneNode(true));
        } else if (trigger.tagName === "IMG") {
          lightboxWrapper.appendChild(trigger.cloneNode(true));
        }
      }
      
      if (lightboxCaption) lightboxCaption.textContent = captionText;
      
      lightbox.style.display = "flex";
      document.body.style.overflow = "hidden"; // khóa scroll body
    });
  });
  
  // Đóng lightbox khi bấm close
  if (closeBtn) {
    closeBtn.addEventListener("click", closeLightbox);
  }
  
  // Đóng lightbox khi nhấp ra ngoài vùng ảnh
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Đóng lightbox khi bấm nút ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.style.display === "flex") {
      closeLightbox();
    }
  });
  
  function closeLightbox() {
    lightbox.style.display = "none";
    document.body.style.overflow = null; // mở lại scroll body
  }
}
