const menuToggle = document.querySelector('.menu-toggle');
const header = document.querySelector('.site-header');

menuToggle.addEventListener('click', () => {
  const isOpen = header.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.desktop-nav a, .header-cta').forEach((link) => {
  link.addEventListener('click', () => {
    header.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => revealObserver.observe(item));

document.querySelectorAll('.category-card[data-images]').forEach((card) => {
  const images = card.dataset.images.split('|');
  const media = document.createElement('div');
  const progress = document.createElement('div');
  let current = 0;

  media.className = 'category-media';
  progress.className = 'category-progress';

  images.forEach((source, index) => {
    const image = document.createElement('img');
    const marker = document.createElement('span');
    image.className = `category-slide${index === 0 ? ' active' : ''}`;
    image.src = source;
    image.alt = '';
    image.loading = index === 0 ? 'eager' : 'lazy';
    media.appendChild(image);
    marker.className = index === 0 ? 'active' : '';
    progress.appendChild(marker);
  });

  card.prepend(media, progress);

  if (images.length > 1) {
    window.setInterval(() => {
      const slides = media.querySelectorAll('.category-slide');
      const markers = progress.querySelectorAll('span');
      slides[current].classList.remove('active');
      markers[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
      markers[current].classList.add('active');
      media.style.transform = `translateX(-${current * 100}%)`;
    }, 3200);
  }
});

const viewer = document.querySelector('.category-viewer');
const viewerImage = viewer.querySelector('.viewer-image');
const viewerLabel = viewer.querySelector('.viewer-label');
const viewerCount = viewer.querySelector('.viewer-count');
let viewerImages = [];
let viewerIndex = 0;
let viewerTimer;

const showViewerImage = () => {
  viewerImage.src = viewerImages[viewerIndex];
  viewerCount.textContent = `${String(viewerIndex + 1).padStart(2, '0')} / ${String(viewerImages.length).padStart(2, '0')}`;
};

const closeViewer = () => {
  viewer.classList.remove('open');
  document.body.classList.remove('viewer-open');
  window.clearInterval(viewerTimer);
};

document.querySelectorAll('.category-card[data-images]').forEach((card) => {
  card.addEventListener('click', () => {
    viewerImages = card.dataset.images.split('|');
    viewerIndex = 0;
    viewerLabel.textContent = card.querySelector('h3').textContent;
    showViewerImage();
    viewer.classList.add('open');
    document.body.classList.add('viewer-open');
    window.clearInterval(viewerTimer);
    viewerTimer = window.setInterval(() => {
      viewerIndex = (viewerIndex + 1) % viewerImages.length;
      showViewerImage();
    }, 3200);
  });
});

viewer.querySelector('.viewer-close').addEventListener('click', closeViewer);
viewer.addEventListener('click', (event) => {
  if (event.target === viewer) closeViewer();
});
viewer.querySelector('.viewer-prev').addEventListener('click', () => {
  viewerIndex = (viewerIndex - 1 + viewerImages.length) % viewerImages.length;
  showViewerImage();
});
viewer.querySelector('.viewer-next').addEventListener('click', () => {
  viewerIndex = (viewerIndex + 1) % viewerImages.length;
  showViewerImage();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeViewer();
});
