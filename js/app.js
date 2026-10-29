/**
 * Suleiman HTML CSS JS Animation Gallery - Interactive Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const galleryGrid = document.getElementById('galleryGrid');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const filterBar = document.getElementById('filterBar');
  const emptyState = document.getElementById('emptyState');
  const totalCountEl = document.getElementById('totalCount');
  const visibleCountEl = document.getElementById('visibleCount');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const gridViewBtn = document.getElementById('gridViewBtn');
  const listViewBtn = document.getElementById('listViewBtn');

  // Modal Elements
  const previewModal = document.getElementById('previewModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalIframe = document.getElementById('modalIframe');
  const modalLoader = document.getElementById('modalLoader');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalExternalLink = document.getElementById('modalExternalLink');
  const modalCodeLink = document.getElementById('modalCodeLink');
  const modalFullscreenBtn = document.getElementById('modalFullscreenBtn');
  const modalSourceToggle = document.getElementById('modalSourceToggle');

  // Application State
  let activeCategory = 'All';
  let searchQuery = '';
  let viewMode = 'grid';
  let currentProject = null;
  let useLocalSource = true;

  // Category Icon Map
  const categoryIcons = {
    'All': '🌟',
    '3D & WebGL': '🧊',
    'Buttons & Controls': '🔘',
    'Cards & Glassmorphism': '💎',
    'Clocks & Calendars': '⏱️',
    'Backgrounds & Canvas': '🌌',
    'Templates & Websites': '🌐',
    'Forms & Auth': '🔐',
    'Navigation & Menus': '🧭',
    'Games & Utilities': '🎮',
    'Special Effects': '✨'
  };

  // Initialize Theme
  const savedTheme = localStorage.getItem('suleiman_gallery_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('suleiman_gallery_theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    themeToggleBtn.innerHTML = theme === 'dark' 
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    themeToggleBtn.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }

  // View Mode Handlers
  gridViewBtn.addEventListener('click', () => setViewMode('grid'));
  listViewBtn.addEventListener('click', () => setViewMode('list'));

  function setViewMode(mode) {
    viewMode = mode;
    if (mode === 'list') {
      galleryGrid.classList.add('list-view');
      listViewBtn.classList.add('active');
      gridViewBtn.classList.remove('active');
    } else {
      galleryGrid.classList.remove('list-view');
      gridViewBtn.classList.add('active');
      listViewBtn.classList.remove('active');
    }
  }

  // Render Filter Categories
  function renderFilterButtons() {
    const categories = ['All'];
    const categoryCounts = { 'All': GALLERY_PROJECTS.length };

    GALLERY_PROJECTS.forEach(p => {
      if (!categories.includes(p.category)) {
        categories.push(p.category);
        categoryCounts[p.category] = 0;
      }
      categoryCounts[p.category]++;
    });

    filterBar.innerHTML = categories.map(cat => {
      const icon = categoryIcons[cat] || '📁';
      const isActive = cat === activeCategory ? 'active' : '';
      return `
        <button class="filter-btn ${isActive}" data-category="${cat}">
          <span>${icon}</span>
          <span>${cat}</span>
          <span class="filter-count">${categoryCounts[cat]}</span>
        </button>
      `;
    }).join('');

    filterBar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.getAttribute('data-category');
        filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderGallery();
      });
    });
  }

  // Filter Projects Logic
  function getFilteredProjects() {
    return GALLERY_PROJECTS.filter(project => {
      const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        project.name.toLowerCase().includes(q) ||
        project.folder.toLowerCase().includes(q) ||
        project.category.toLowerCase().includes(q) ||
        project.tags.some(t => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }

  // Render Gallery Cards
  function renderGallery() {
    const filtered = getFilteredProjects();

    visibleCountEl.textContent = filtered.length;
    totalCountEl.textContent = GALLERY_PROJECTS.length;

    if (filtered.length === 0) {
      galleryGrid.innerHTML = '';
      emptyState.classList.add('active');
      return;
    }

    emptyState.classList.remove('active');

    galleryGrid.innerHTML = filtered.map(project => {
      const icon = categoryIcons[project.category] || '🎨';
      return `
        <article class="project-card" data-id="${project.id}">
          <div class="card-header-thumb">
            <div class="card-pattern"></div>
            <span class="card-index">#${String(project.id).padStart(2, '0')}</span>
            <span class="card-category-badge">${project.category}</span>
            <div class="card-icon">${icon}</div>
          </div>
          <div class="card-body">
            <h3 class="card-title">${project.name}</h3>
            <div class="card-folder">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              <span>${project.folder}</span>
            </div>
            <div class="card-tags">
              ${project.tags.map(t => `<span class="card-tag">#${t}</span>`).join('')}
            </div>
            <div class="card-actions">
              <button class="btn-preview btn-open-modal" data-id="${project.id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <span>Live Preview</span>
              </button>
              <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary" title="Open Netlify Live Demo">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                <span>Netlify</span>
              </a>
              <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary" title="GitHub üzərində Məxfi Repozitoriya (Giriş üçün: suleyman.hacizade1@gmail.com)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span>Code 🔒</span>
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach preview event listeners
    galleryGrid.querySelectorAll('.btn-open-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        const proj = GALLERY_PROJECTS.find(p => p.id === id);
        if (proj) openModal(proj);
      });
    });
  }

  // Modal Functions
  function openModal(project) {
    currentProject = project;
    modalTitle.textContent = project.name;
    modalLoader.style.opacity = '1';
    modalLoader.style.pointerEvents = 'auto';

    modalExternalLink.href = project.demoUrl;
    modalCodeLink.href = project.githubUrl;
    modalCodeLink.setAttribute('title', 'GitHub üzərində Məxfi Repozitoriya (Giriş üçün: suleyman.hacizade1@gmail.com)');

    loadModalIframe();

    previewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function loadModalIframe() {
    if (!currentProject) return;
    const targetUrl = useLocalSource ? currentProject.localUrl : currentProject.demoUrl;
    modalIframe.src = targetUrl;
  }

  modalIframe.addEventListener('load', () => {
    modalLoader.style.opacity = '0';
    modalLoader.style.pointerEvents = 'none';
  });

  function closeModal() {
    previewModal.classList.remove('active');
    modalIframe.src = 'about:blank';
    currentProject = null;
    document.body.style.overflow = '';
  }

  modalCloseBtn.addEventListener('click', closeModal);
  previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) closeModal();
  });

  // Modal Fullscreen
  modalFullscreenBtn.addEventListener('click', () => {
    const modalWindow = document.querySelector('.modal-window');
    if (!document.fullscreenElement) {
      modalWindow.requestFullscreen().catch(err => alert(`Fullscreen error: ${err.message}`));
    } else {
      document.exitFullscreen();
    }
  });

  // Search Input Handler
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
    renderGallery();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.style.display = 'none';
    searchInput.focus();
    renderGallery();
  });

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && previewModal.classList.contains('active')) {
      closeModal();
    }
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  });

  // Copy Email to Clipboard Handler
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyEmailText = document.getElementById('copyEmailText');
  if (copyEmailBtn && copyEmailText) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'suleyman.hacizade1@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        const originalText = copyEmailText.textContent;
        copyEmailText.textContent = '✓ Kopyalandı!';
        copyEmailBtn.style.borderColor = 'var(--accent-emerald)';
        copyEmailBtn.style.color = 'var(--accent-emerald)';
        setTimeout(() => {
          copyEmailText.textContent = originalText;
          copyEmailBtn.style.borderColor = '';
          copyEmailBtn.style.color = '';
        }, 2200);
      } catch (err) {
        // Fallback for older browsers
        window.prompt('E-poçt ünvanı:', email);
      }
    });
  }

  // Initial Initialization
  renderFilterButtons();
  renderGallery();
});
