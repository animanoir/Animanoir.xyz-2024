export function handleImageLoad(img) {
  if (img.complete) {
    img.classList.add('loaded');
  } else {
    img.addEventListener('load', () => {
      img.classList.add('loaded');
    }, { once: true });
  }
}

// Función para manejar todas las imágenes en la página
export function handleAllImages() {
  const images = document.querySelectorAll('.postHeroImg, .heroImage');
  images.forEach(img => handleImageLoad(img));
}

// Configurar View Transition
document.addEventListener('astro:page-load', handleAllImages);
document.addEventListener('astro:after-swap', handleAllImages);