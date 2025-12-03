// ========================================
// State Management
// ========================================

let countries = [];

// ========================================
// DOM Elements
// ========================================

const gallery = document.getElementById('gallery');
const emptyState = document.getElementById('emptyState');
const modal = document.getElementById('modal');
const modalOverlay = document.getElementById('modalOverlay');
const addBtn = document.getElementById('addBtn');
const closeBtn = document.getElementById('closeBtn');
const cancelBtn = document.getElementById('cancelBtn');
const countryForm = document.getElementById('countryForm');
const countryImage = document.getElementById('countryImage');
const imagePreview = document.getElementById('imagePreview');
const fileUploadContent = document.querySelector('.file-upload-content');

// ========================================
// API Functions
// ========================================

async function fetchCountries() {
  try {
    const response = await fetch('http://localhost:3000/api/countries');
    const data = await response.json();
    countries = data.countries;
    renderGallery();
  } catch (error) {
    console.error('Error fetching countries:', error);
    showNotification('Failed to load countries', 'error');
  }
}

async function addCountry(formData) {
  try {
    const response = await fetch('http://localhost:3000/api/countries', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to add country');
    }

    const data = await response.json();
    showNotification('Country added successfully!', 'success');
    closeModal();
    fetchCountries();
  } catch (error) {
    console.error('Error adding country:', error);
    showNotification('Failed to add country', 'error');
  }
}

async function deleteCountry(id) {
  if (!confirm('Are you sure you want to remove this country from your collection?')) {
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/countries/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete country');
    }

    showNotification('Country removed from collection', 'success');
    fetchCountries();
  } catch (error) {
    console.error('Error deleting country:', error);
    showNotification('Failed to delete country', 'error');
  }
}

// ========================================
// Render Functions
// ========================================

function renderGallery() {
  gallery.innerHTML = '';

  if (countries.length === 0) {
    emptyState.classList.add('active');
    gallery.style.display = 'none';
  } else {
    emptyState.classList.remove('active');
    gallery.style.display = 'grid';

    countries.forEach((country, index) => {
      const card = createCountryCard(country, index);
      gallery.appendChild(card);
    });
  }
}

function createCountryCard(country, index) {
  const card = document.createElement('div');
  card.className = 'country-card';
  card.style.animationDelay = `${index * 50}ms`;

  card.innerHTML = `
    <div class="country-card-image-wrapper">
      <img
        src="http://localhost:3000/uploads/${country.image_path}"
        alt="${country.name}"
        class="country-card-image"
        loading="lazy"
      />
    </div>
    <div class="country-card-content">
      <h3 class="country-card-name">${escapeHtml(country.name)}</h3>
      <div class="country-card-actions">
        <button class="btn-delete" onclick="deleteCountry(${country.id})">
          Remove
        </button>
      </div>
    </div>
  `;

  return card;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ========================================
// Modal Functions
// ========================================

function openModal() {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
  countryForm.reset();
  imagePreview.innerHTML = '';
  imagePreview.classList.remove('active');
  fileUploadContent.style.display = 'block';
}

// ========================================
// Form Functions
// ========================================

function handleImagePreview(e) {
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function(event) {
      imagePreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
      imagePreview.classList.add('active');
      fileUploadContent.style.display = 'none';
    };

    reader.readAsDataURL(file);
  }
}

function handleFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(countryForm);
  addCountry(formData);
}

// ========================================
// Notification System
// ========================================

function showNotification(message, type = 'success') {
  // Remove existing notification if any
  const existing = document.querySelector('.notification');
  if (existing) {
    existing.remove();
  }

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add styles
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    background: type === 'success' ? '#10b981' : '#ef4444',
    color: 'white',
    fontWeight: '500',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    zIndex: '10000',
    animation: 'slideInRight 0.3s ease-out',
    fontSize: '0.95rem'
  });

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100px);
    }
  }
`;
document.head.appendChild(style);

// ========================================
// Event Listeners
// ========================================

addBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

countryImage.addEventListener('change', handleImagePreview);
countryForm.addEventListener('submit', handleFormSubmit);

// Prevent modal close when clicking inside modal content
document.querySelector('.modal-content').addEventListener('click', (e) => {
  e.stopPropagation();
});

// Escape key to close modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});

// Drag and drop functionality
const fileUpload = document.getElementById('fileUpload');

fileUpload.addEventListener('dragover', (e) => {
  e.preventDefault();
  fileUpload.style.borderColor = 'var(--color-primary)';
});

fileUpload.addEventListener('dragleave', () => {
  fileUpload.style.borderColor = 'var(--color-border)';
});

fileUpload.addEventListener('drop', (e) => {
  e.preventDefault();
  fileUpload.style.borderColor = 'var(--color-border)';

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    countryImage.files = files;
    handleImagePreview({ target: { files } });
  }
});

// ========================================
// Initialize
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  fetchCountries();
});
