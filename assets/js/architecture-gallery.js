/* ============================================================
   ARCHITECTURE GALLERY LOGIC
   Nikhil Repale Portfolio
   ============================================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const archGalleryGrid = document.getElementById('arch-gallery-grid');
    if (!archGalleryGrid) return;

    // Load from local storage
    const loadArchitectures = () => {
      const stored = localStorage.getItem('portfolioArchitectures');
      let archs = [];
      if (stored) {
        try {
          archs = JSON.parse(stored);
        } catch (e) {
          console.error('Error parsing architectures from local storage');
        }
      }
      return archs;
    };

    // Save to local storage
    const saveArchitectures = (archs) => {
      localStorage.setItem('portfolioArchitectures', JSON.stringify(archs));
    };

    // Delete architecture
    window.deleteArchitecture = (id) => {
      const archs = loadArchitectures();
      const filtered = archs.filter(a => a.id !== id);
      saveArchitectures(filtered);
      renderGallery();
    };

    // Render the gallery
    const renderGallery = () => {
      const archs = loadArchitectures();
      
      let html = `
        <div class="arch-card">
          <div class="arch-img-wrapper">
            <img src="https://via.placeholder.com/800x400.png?text=AWS+3-Tier+Architecture" alt="Default Architecture">
          </div>
          <div class="arch-card-content">
            <h3>Standard 3-Tier Web Application</h3>
            <p>Traffic flows through Route 53 to a CloudFront CDN, hitting an Application Load Balancer. The ALB distributes traffic to an Auto Scaling Group of EC2 instances in private subnets, which securely read from an RDS Multi-AZ database cluster.</p>
          </div>
        </div>
      `;

      archs.forEach(arch => {
        html += `
          <div class="arch-card" id="arch-${arch.id}">
            <div class="arch-img-wrapper">
              <img src="${arch.imgSrc}" alt="${arch.title}">
            </div>
            <div class="arch-card-content">
              <h3>${arch.title}</h3>
              <p>${arch.desc}</p>
              <button class="arch-delete-btn" onclick="deleteArchitecture('${arch.id}')">
                <i class="fas fa-trash"></i> Remove
              </button>
            </div>
          </div>
        `;
      });

      archGalleryGrid.innerHTML = html;
    };

    // Initial render
    renderGallery();


    // Projects Tabs logic
    const tabBtns = document.querySelectorAll('.project-tab-btn');
    const tabContents = document.querySelectorAll('.project-tab-content');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked button
        btn.classList.add('active');

        // Show target content
        const targetId = btn.getAttribute('data-ptab');
        const targetContent = document.getElementById('ptab-' + targetId);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });

  });
})();
