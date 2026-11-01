/* ===================================================================
   Muhammad Shidqi Fadhlurrahman - Interactive Portfolio Logic
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Navbar scroll background change
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show');
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('show');
      });
    });
  }

  // Active Link Highlight on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', highlightNavOnScroll);

  // Certificate Filter Tabs
  const certTabs = document.querySelectorAll('.cert-tab');
  const certCards = document.querySelectorAll('.cert-gallery-card');

  certTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      certTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      certCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });

      // Re-init lucide icons in case new ones become visible
      if (window.lucide) {
        window.lucide.createIcons();
      }
    });
  });

  // 3D Tilt effect on Hero Image Card
  const heroCard = document.querySelector('.hero-card-glow');
  if (heroCard && window.innerWidth > 992) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      heroCard.style.transition = 'transform 0.5s ease';
    });

    heroCard.addEventListener('mouseenter', () => {
      heroCard.style.transition = 'none';
    });
  }

  // ===================================================================
  // 3D Stacked Coverflow Gallery Logic (inspired by chardoxx Work Gallery)
  // ===================================================================
  initCoverflowGallery();
});

function initCoverflowGallery() {
  const cards = document.querySelectorAll('.coverflow-card');
  const prevBtn = document.getElementById('coverflowPrev');
  const nextBtn = document.getElementById('coverflowNext');
  const dotsContainer = document.getElementById('coverflowDots');
  const counterEl = document.getElementById('coverflowCounter');
  const detailsContent = document.getElementById('coverflowDetailsContent');
  const tagEl = document.getElementById('coverflowTag');
  const titleEl = document.getElementById('coverflowTitle');
  const descEl = document.getElementById('coverflowDesc');
  const actionBtn = document.getElementById('coverflowActionBtn');
  const actionTextEl = document.getElementById('coverflowActionText');
  const track = document.getElementById('coverflowTrack');

  if (!cards.length) return;

  const total = cards.length;
  let currentIndex = 0;

  // Generate dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    cards.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `coverflow-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('title', `Ke Slide ${idx + 1}`);
      dot.addEventListener('click', () => updateCoverflow(idx));
      dotsContainer.appendChild(dot);
    });
  }

  function updateCoverflow(newIndex) {
    currentIndex = (newIndex + total) % total;

    // Update 3D card classes & styles
    cards.forEach((card, i) => {
      let diff = i - currentIndex;
      while (diff > total / 2) diff -= total;
      while (diff < -total / 2) diff += total;

      card.classList.remove('active', 'prev-1', 'next-1', 'prev-2', 'next-2', 'hidden-card');

      if (diff === 0) {
        card.classList.add('active');
      } else if (diff === -1) {
        card.classList.add('prev-1');
      } else if (diff === 1) {
        card.classList.add('next-1');
      } else if (diff === -2) {
        card.classList.add('prev-2');
      } else if (diff === 2) {
        card.classList.add('next-2');
      } else {
        card.classList.add('hidden-card');
      }
    });

    // Update Details with smooth text fade
    const activeCard = cards[currentIndex];
    if (activeCard && detailsContent) {
      detailsContent.classList.add('transitioning');

      setTimeout(() => {
        const tag = activeCard.getAttribute('data-tag') || 'Selected Project';
        const title = activeCard.getAttribute('data-title') || '';
        const desc = activeCard.getAttribute('data-desc') || '';
        const actionText = activeCard.getAttribute('data-action-text') || 'Lihat Detail Dokumen';
        const img = activeCard.getAttribute('data-img') || '';

        if (tagEl) tagEl.textContent = tag;
        if (titleEl) titleEl.textContent = title;
        if (descEl) descEl.textContent = desc;
        if (actionTextEl) actionTextEl.textContent = actionText;

        if (actionBtn) {
          actionBtn.onclick = () => openModal(img, `${title} — Muhammad Shidqi`);
        }

        detailsContent.classList.remove('transitioning');
      }, 150);
    }

    // Update Dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.coverflow-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }

    // Update Counter (01 / 05)
    if (counterEl) {
      const curNum = String(currentIndex + 1).padStart(2, '0');
      const totNum = String(total).padStart(2, '0');
      counterEl.textContent = `${curNum} / ${totNum}`;
    }
  }

  // Card click event: click side card -> move to it; click active -> open modal
  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      let diff = idx - currentIndex;
      while (diff > total / 2) diff -= total;
      while (diff < -total / 2) diff += total;

      if (diff === 0) {
        const title = card.getAttribute('data-title') || '';
        const img = card.getAttribute('data-img') || '';
        openModal(img, `${title} — Muhammad Shidqi`);
      } else {
        updateCoverflow(idx);
      }
    });
  });

  // Buttons navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', () => updateCoverflow(currentIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => updateCoverflow(currentIndex + 1));
  }

  // Keyboard navigation
  const stage = document.querySelector('.coverflow-stage');
  if (stage) {
    stage.setAttribute('tabindex', '0');
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        updateCoverflow(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        updateCoverflow(currentIndex + 1);
      }
    });
  }

  // Touch & Mouse Drag / Swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  if (track) {
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    let isMouseDown = false;
    let mouseStartX = 0;

    track.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      mouseStartX = e.clientX;
    });

    track.addEventListener('mouseup', (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      const dist = e.clientX - mouseStartX;
      if (Math.abs(dist) > 50) {
        if (dist > 0) updateCoverflow(currentIndex - 1);
        else updateCoverflow(currentIndex + 1);
      }
    });

    track.addEventListener('mouseleave', () => {
      isMouseDown = false;
    });
  }

  function handleSwipe() {
    const swipeDist = touchEndX - touchStartX;
    if (Math.abs(swipeDist) > 40) {
      if (swipeDist > 0) {
        updateCoverflow(currentIndex - 1);
      } else {
        updateCoverflow(currentIndex + 1);
      }
    }
  }

  // Initialize first view
  updateCoverflow(0);
}

/* ===================================================================
   Lightbox Modal Functions (Global scope for onclick attributes)
   =================================================================== */
function openModal(imgSrc, captionText) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const modalDownloadBtn = document.getElementById('modalDownloadBtn');

  if (!modal || !modalImg) return;

  modalImg.src = imgSrc;
  modalCaption.textContent = captionText || 'Pratinjau Dokumen';
  if (modalDownloadBtn) {
    modalDownloadBtn.href = imgSrc;
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  if (!modal) return;

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function closeModalOnOverlay(event) {
  if (event.target.id === 'imageModal') {
    closeModal();
  }
}

// Close modal with ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeProjectModal();
  }
});

/* ===================================================================
   Featured Accounting Projects - Document Modal & Preview Logic
   =================================================================== */
const PROJECT_REGISTRY = {
  aol: {
    badge: 'Accurate Online',
    title: 'Siklus Akuntansi Biaya & HPP Manufaktur',
    documents: [
      {
        name: 'Harga Pokok Produksi (HPP)',
        sub: 'Laporan COGM Pabrikasi',
        file: 'assets/Project/Project Accurate Online (Perusahaan Manufacture)/PT SHIDQI MANUFAKTUR HARGA POKOK PRODUKSI.pdf',
        type: 'pdf',
        desc: 'Rincian biaya bahan baku, pembebanan tenaga kerja langsung, dan alokasi biaya overhead pabrik (BOP).'
      },
      {
        name: 'Jurnal Transaksi (7 Hlm)',
        sub: 'Pencatatan Siklus Lengkap',
        file: 'assets/Project/Project Accurate Online (Perusahaan Manufacture)/PT SHIDQI MANUFAKTUR JURNAL UMUM.pdf',
        type: 'pdf',
        desc: 'Jurnal transaksi pabrik 7 halaman: transfer bahan baku ke WIP hingga pengakuan barang jadi.'
      },
      {
        name: 'Laporan Laba Rugi',
        sub: 'Laba Bersih & Operasional',
        file: 'assets/Project/Project Accurate Online (Perusahaan Manufacture)/PT SHIDQI MANUFAKTUR LAPORAN LABA RUGI.pdf',
        type: 'pdf',
        desc: 'Perhitungan laba kotor manufaktur, beban operasional dan administrasi untuk menentukan laba bersih periode berjalan.'
      },
      {
        name: 'Neraca Standar',
        sub: 'Posisi Keuangan Pabrik',
        file: 'assets/Project/Project Accurate Online (Perusahaan Manufacture)/PT SHIDQI MANUFAKTUR NERACA.pdf',
        type: 'pdf',
        desc: 'Posisi aset lancar & tetap pabrikasi, kewajiban usaha, serta struktur ekuitas PT Shidqi Manufaktur.'
      },
      {
        name: 'Laporan Arus Kas',
        sub: 'Aktivitas Kas Masuk & Keluar',
        file: 'assets/Project/Project Accurate Online (Perusahaan Manufacture)/PT SHIDQI MANUFAKTUR LAPORAN ARUS KAS.pdf',
        type: 'pdf',
        desc: 'Laporan arus kas komprehensif dari operasional produksi, investasi peralatan pabrik, dan pendanaan.'
      }
    ]
  },
  acc5: {
    badge: 'Accurate 5 Desktop',
    title: 'Siklus Akuntansi & Pembukuan Perusahaan Dagang',
    documents: [
      {
        name: 'Neraca Standar (Balance Sheet)',
        sub: 'Posisi Keuangan Komersial',
        file: 'assets/Project/Project Accurate Enterprise 5 (Perusahaan Dagang)/Balance Sheet.pdf',
        type: 'pdf',
        desc: 'Posisi aset likuid, piutang dagang, persediaan barang, serta kewajiban vendor per akhir periode.'
      },
      {
        name: 'Laba / Rugi (Profit & Loss)',
        sub: 'Kinerja Penjualan Dagang',
        file: 'assets/Project/Project Accurate Enterprise 5 (Perusahaan Dagang)/Profit and Loss Statement.pdf',
        type: 'pdf',
        desc: 'Ringkasan omset penjualan barang dagangan, harga pokok penjualan (HPP), dan laba bersih operasional.'
      },
      {
        name: 'Arus Kas (Direct Method)',
        sub: 'Arus Kas Perusahaan Dagang',
        file: 'assets/Project/Project Accurate Enterprise 5 (Perusahaan Dagang)/Cash Flow Statement.pdf',
        type: 'pdf',
        desc: 'Penerimaan kas dari pelanggan dagang serta pengeluaran kas rutin untuk supplier dan operasional.'
      }
    ]
  },
  excel: {
    badge: 'Microsoft Excel',
    title: 'Rekapitulasi & Otomasi Analisis Penjualan Bisnis',
    documents: [
      {
        name: 'Lembar Kerja Analisis (7 Sheet)',
        sub: 'Formula VLOOKUP & SUMIF',
        file: 'assets/Project/Project Excel Administrasi Perusahaan/UJK_Excel_Muhammad Shidqi Fadhlurrahman.xlsx',
        type: 'excel',
        preview: 'assets/project_thumbs/thumb_excel_preview.png',
        desc: 'Workbook terintegrasi 7 sheet: Laporan Penjualan, Tabel Acuan Diskon, SUMIF Margin, dan Visualisasi Grafik.'
      }
    ]
  }
};

let currentActiveProject = null;
let currentActiveDocIndex = 0;

function openProjectModal(projectKey, docIndex = 0) {
  const project = PROJECT_REGISTRY[projectKey];
  if (!project) return;

  currentActiveProject = projectKey;
  currentActiveDocIndex = docIndex;

  const modal = document.getElementById('projectDocModal');
  const badgeEl = document.getElementById('pmBadge');
  const docListEl = document.getElementById('pmDocList');

  if (badgeEl) badgeEl.textContent = project.badge;

  // Build Document Switcher Tabs
  if (docListEl) {
    docListEl.innerHTML = '';
    project.documents.forEach((doc, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `doc-item-btn ${idx === docIndex ? 'active' : ''}`;
      
      const iconName = doc.type === 'excel' ? 'file-spreadsheet' : 'file-text';
      btn.innerHTML = `
        <i data-lucide="${iconName}"></i>
        <div class="doc-item-info">
          <span class="doc-item-title">${doc.name}</span>
          <span class="doc-item-sub">${doc.sub}</span>
        </div>
      `;

      btn.addEventListener('click', () => {
        selectProjectDoc(idx);
      });

      docListEl.appendChild(btn);
    });
  }

  // Activate selected document
  selectProjectDoc(docIndex);

  // Show Modal
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function selectProjectDoc(docIndex) {
  if (!currentActiveProject) return;
  const project = PROJECT_REGISTRY[currentActiveProject];
  const doc = project.documents[docIndex];
  if (!doc) return;

  currentActiveDocIndex = docIndex;

  // Update tabs active state
  const docButtons = document.querySelectorAll('#pmDocList .doc-item-btn');
  docButtons.forEach((btn, idx) => {
    btn.classList.toggle('active', idx === docIndex);
  });

  // Update headers
  const titleEl = document.getElementById('pmTitle');
  const descEl = document.getElementById('pmDesc');
  const extBtn = document.getElementById('pmExternalBtn');
  const downBtn = document.getElementById('pmDownloadBtn');
  const pdfFrame = document.getElementById('pmPdfFrame');
  const excelViewer = document.getElementById('pmExcelViewer');

  if (titleEl) titleEl.textContent = doc.name;
  if (descEl) descEl.textContent = doc.desc;
  if (extBtn) extBtn.href = doc.file;
  if (downBtn) downBtn.href = doc.file;

  if (doc.type === 'pdf') {
    if (pdfFrame) {
      pdfFrame.style.display = 'block';
      pdfFrame.src = doc.file;
    }
    if (excelViewer) {
      excelViewer.style.display = 'none';
    }
  } else if (doc.type === 'excel') {
    if (pdfFrame) {
      pdfFrame.style.display = 'none';
      pdfFrame.src = '';
    }
    if (excelViewer) {
      excelViewer.style.display = 'flex';
      const excelImg = document.getElementById('pmPreviewImg');
      if (excelImg && doc.preview) {
        excelImg.src = doc.preview;
      }
    }
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function closeProjectModal() {
  const modal = document.getElementById('projectDocModal');
  const pdfFrame = document.getElementById('pmPdfFrame');
  if (!modal) return;

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  // Clear iframe src to stop any rendering or memory load
  if (pdfFrame) {
    pdfFrame.src = '';
  }
}

// Attach event listeners for project modal triggers
document.addEventListener('DOMContentLoaded', () => {
  // Triggers on project document pills & action buttons
  document.querySelectorAll('[data-project]').forEach(el => {
    // Only attach if it's not a direct download <a> tag
    if (el.tagName.toLowerCase() === 'a' && el.hasAttribute('download')) {
      return;
    }
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const proj = el.getAttribute('data-project');
      const docIdx = parseInt(el.getAttribute('data-doc') || '0', 10);
      openProjectModal(proj, docIdx);
    });
  });

  // Close button
  const pmCloseBtn = document.getElementById('pmCloseBtn');
  if (pmCloseBtn) {
    pmCloseBtn.addEventListener('click', closeProjectModal);
  }

  // Backdrop overlay click
  const projectDocModal = document.getElementById('projectDocModal');
  if (projectDocModal) {
    projectDocModal.addEventListener('click', (e) => {
      if (e.target.id === 'projectDocModal') {
        closeProjectModal();
      }
    });
  }
});


/* ===================================================================
   Organization Experience Showcase 3D Sliders
   =================================================================== */
function initOrgSliders() {
  const showcaseCards = document.querySelectorAll('.org-showcase-card[data-org-slider]');

  showcaseCards.forEach(container => {
    const track = container.querySelector('.org-slider-track');
    const cards = container.querySelectorAll('.org-slide-card');
    const prevBtn = container.querySelector('.org-nav-btn.prev-btn');
    const nextBtn = container.querySelector('.org-nav-btn.next-btn');
    const captionTitle = container.querySelector('.caption-title');
    const captionSub = container.querySelector('.caption-sub');
    const dots = container.querySelectorAll('.org-counter-pill .dot');
    const counterNum = container.querySelector('.counter-num');

    if (!cards.length) return;

    let currentIndex = 0;
    const total = cards.length;

    function updateSlider(index) {
      currentIndex = (index % total + total) % total;

      cards.forEach((card, idx) => {
        let diff = idx - currentIndex;
        while (diff > total / 2) diff -= total;
        while (diff < -total / 2) diff += total;

        card.classList.remove('active', 'prev-1', 'next-1', 'prev-2', 'next-2', 'hidden-slide');

        if (diff === 0) {
          card.classList.add('active');
        } else if (diff === -1) {
          card.classList.add('prev-1');
        } else if (diff === 1) {
          card.classList.add('next-1');
        } else if (diff === -2) {
          card.classList.add('prev-2');
        } else if (diff === 2) {
          card.classList.add('next-2');
        } else {
          card.classList.add('hidden-slide');
        }
      });

      // Update caption
      const activeCard = cards[currentIndex];
      if (activeCard) {
        const title = activeCard.getAttribute('data-title') || '';
        const sub = activeCard.getAttribute('data-sub') || '';
        if (captionTitle) captionTitle.textContent = title;
        if (captionSub) captionSub.textContent = sub;
      }

      // Update dots
      if (dots.length) {
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentIndex);
        });
      }

      // Update counter
      if (counterNum) {
        const cur = String(currentIndex + 1).padStart(2, '0');
        const tot = String(total).padStart(2, '0');
        counterNum.textContent = `${cur} / ${tot}`;
      }
    }

    // Prev / Next button clicks
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateSlider(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateSlider(currentIndex + 1);
      });
    }

    // Card click: move or open modal
    cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        if (idx === currentIndex) {
          const img = card.getAttribute('data-img');
          const title = card.getAttribute('data-title');
          if (img) openModal(img, title);
        } else {
          updateSlider(idx);
        }
      });
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    if (track) {
      track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) updateSlider(currentIndex - 1);
          else updateSlider(currentIndex + 1);
        }
      }, { passive: true });
    }

    // Initialize position
    updateSlider(0);
  });
}

// Call on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initOrgSliders();
});
