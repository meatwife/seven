const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const player = new Audio();
let activeButton = null;

document.querySelectorAll('.play[data-src], .master-play[data-src]').forEach((button) => {
  button.addEventListener('click', async () => {
    if (activeButton === button && !player.paused) {
      player.pause();
      return;
    }
    if (activeButton && activeButton !== button) activeButton.querySelector('span').textContent = '▶';
    if (player.src !== new URL(button.dataset.src, window.location.href).href) player.src = button.dataset.src;
    activeButton = button;
    try {
      await player.play();
    } catch {
      button.querySelector('span').textContent = '▶';
    }
  });
});

player.addEventListener('play', () => {
  if (activeButton) activeButton.querySelector('span').textContent = 'Ⅱ';
});
player.addEventListener('pause', () => {
  if (activeButton) activeButton.querySelector('span').textContent = '▶';
});
player.addEventListener('ended', () => {
  if (activeButton) activeButton.querySelector('span').textContent = '▶';
  activeButton = null;
});

const video = document.querySelector('video');
if (video) {
  video.play().catch(() => {
    video.controls = true;
  });
}

if (!reduceMotion) {
  const portrait = document.querySelector('.portrait-wrap');
  const crossing = document.querySelector('.crossing');

  window.addEventListener('scroll', () => {
    const travel = Math.min(window.scrollY * 0.06, 42);
    portrait.style.translate = `0 ${travel}px`;
  }, { passive: true });

  const revealTargets = document.querySelectorAll('.track, .ears-copy, .credit-grid p');
  revealTargets.forEach((target) => target.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '80px 0px' });

  revealTargets.forEach((target) => observer.observe(target));
  window.setTimeout(() => revealTargets.forEach((target) => target.classList.add('revealed')), 1200);

  crossing.addEventListener('pointermove', (event) => {
    const rect = crossing.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    crossing.querySelector('.rings').style.transform = `translate(${x * 22}px, ${y * 22}px)`;
  });
}
