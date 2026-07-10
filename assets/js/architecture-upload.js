/* ============================================================
   ARCHITECTURE UPLOAD LOGIC
   Nikhil Repale Portfolio
   ============================================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const archForm = document.getElementById('arch-upload-form');
    const archTitleInput = document.getElementById('arch-title');
    const archDescInput = document.getElementById('arch-desc');
    const archFileInput = document.getElementById('arch-file');
    const archFileName = document.getElementById('arch-file-name');

    if (!archForm) return;

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

    // Update file name display
    archFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        archFileName.textContent = e.target.files[0].name;
      } else {
        archFileName.textContent = 'No file chosen';
      }
    });

    // Handle form submit
    archForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = archTitleInput.value.trim();
      const desc = archDescInput.value.trim();
      const file = archFileInput.files[0];

      if (!title || !desc || !file) {
        alert('Please fill out all fields and select an image file.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;

        const newArch = {
          id: 'arch_' + Date.now(),
          title: title,
          desc: desc,
          imgSrc: base64String
        };

        const currentArchs = loadArchitectures();
        currentArchs.unshift(newArch); 
        
        try {
          saveArchitectures(currentArchs);
          
          // Redirect back to main page gallery
          window.location.href = 'architectures.html';
          
        } catch (err) {
          if (err.name === 'QuotaExceededError') {
            alert('File is too large! LocalStorage limit exceeded. Try a smaller or more compressed image.');
          } else {
            alert('Error saving architecture.');
          }
        }
      };

      reader.onerror = () => {
        alert('Error reading file!');
      };

      reader.readAsDataURL(file);
    });
  });
})();
