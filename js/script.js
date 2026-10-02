const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const navMenu = document.querySelector('.nav-menu');
const mobileMenuButton = document.querySelector('.mobile-menu-btn');
const navMore = navMenu?.querySelector('.nav-more');
const navLinks = document.querySelectorAll('.nav-menu a');
const revealItems = document.querySelectorAll('.reveal');
const tiltCards = document.querySelectorAll('.tilt-card');
const scrollTopButton = document.getElementById('scroll-top');
const contactForm = document.getElementById('contactForm');
const sectionIds = [...document.querySelectorAll('main section[id]')];

const setTheme = (theme) => {
  body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  if (themeToggle) {
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
  }
};

const savedTheme = localStorage.getItem('theme');
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
setTheme(savedTheme || (prefersLight ? 'light' : 'dark'));

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });
}

if (mobileMenuButton && navMenu) {
  mobileMenuButton.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    mobileMenuButton.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navMore?.removeAttribute('open');
      mobileMenuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

document.addEventListener('pointerdown', (event) => {
  if (navMore?.open && !navMore.contains(event.target)) {
    navMore.removeAttribute('open');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;

  navMore?.removeAttribute('open');
  if (navMenu?.classList.contains('open')) {
    navMenu.classList.remove('open');
    mobileMenuButton?.setAttribute('aria-expanded', 'false');
    mobileMenuButton?.focus();
  }
});

const updateActiveNav = () => {
  let activeId = 'home';

  sectionIds.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 150 && rect.bottom >= 150) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${activeId}`;
    link.classList.toggle('active', isActive);
  });

  const moreIsActive = [...(navMore?.querySelectorAll('a') || [])].some(
    (link) => link.getAttribute('href') === `#${activeId}`
  );
  navMore?.classList.toggle('active', moreIsActive);
};

window.addEventListener('scroll', () => {
  updateActiveNav();

  if (scrollTopButton) {
    scrollTopButton.classList.toggle('visible', window.scrollY > 350);
  }
});

if (scrollTopButton) {
  scrollTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const applyTilt = (card) => {
  const maxRotate = 10;

  card.addEventListener('pointermove', (event) => {
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;
    const rotateY = ((x / width) - 0.5) * maxRotate * 2;
    const rotateX = (0.5 - (y / height)) * maxRotate * 2;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
};

tiltCards.forEach(applyTilt);

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const successMessage = document.getElementById('form-success');

    if (!name || !email || !subject || !message) {
      successMessage.textContent = 'Please fill in all fields before sending your message.';
      successMessage.style.color = '#fbbf24';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      successMessage.textContent = 'Please enter a valid email address.';
      successMessage.style.color = '#fbbf24';
      return;
    }

    const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailtoLink = `mailto:arvindit24306@gmail.com?subject=${encodeURIComponent(subject)}&body=${mailtoBody}`;

    successMessage.textContent = 'Your message is ready to send. Your email app should open now.';
    successMessage.style.color = '#34d399';

    window.location.href = mailtoLink;
    contactForm.reset();
  });
}

const heroCanvas = document.getElementById('hero-canvas');
const initializeHeroScene = (THREE) => {
  if (!heroCanvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, heroCanvas.clientWidth / heroCanvas.clientHeight, 0.1, 1000);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0x5ac8fa, 2, 28, 2);
  pointLight.position.set(4, 3, 8);
  scene.add(pointLight);

  const points = [];
  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 120;

  for (let i = 0; i < particleCount; i += 1) {
    points.push(
      (Math.random() - 0.5) * 16,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 12
    );
  }

  particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));

  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: 0x8ee7ff,
      size: 0.045,
      transparent: true,
      opacity: 0.9
    })
  );

  scene.add(particles);

  const group = new THREE.Group();
  const geometry = new THREE.IcosahedronGeometry(0.9, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x73f0d4,
    emissive: 0x2b5d67,
    roughness: 0.35,
    metalness: 0.45
  });

  const orb = new THREE.Mesh(geometry, material);
  orb.position.set(-2.8, 0.7, -1.2);
  group.add(orb);

  const ringGeometry = new THREE.TorusGeometry(1.5, 0.08, 16, 100);
  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0x5ac8fa,
    emissive: 0x275f7f,
    metalness: 0.8,
    roughness: 0.2
  });

  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = 1.2;
  ring.rotation.y = 0.8;
  ring.position.set(2.2, -0.5, -0.6);
  group.add(ring);

  const boxGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
  const boxMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    emissive: 0x2f1f5d,
    roughness: 0.28,
    metalness: 0.55
  });

  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.set(3.1, 2.1, -0.8);
  group.add(box);

  scene.add(group);

  const resizeCanvas = () => {
    const { clientWidth, clientHeight } = heroCanvas;
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(clientWidth, clientHeight, false);
  };

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const pointer = { x: 0, y: 0 };
  window.addEventListener('pointermove', (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  const tick = () => {
    const time = performance.now() * 0.001;
    orb.rotation.x = time * 0.8;
    orb.rotation.y = time * 1.1;
    ring.rotation.z = time * 0.5;
    box.rotation.x = time * 0.9;
    box.rotation.y = time * 0.8;
    group.rotation.y += 0.003;
    group.rotation.x = pointer.y * 0.35;
    group.position.x = pointer.x * 0.8;
    particles.rotation.y = time * 0.08;
    particles.rotation.x = time * 0.04;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };

  tick();
};

if (heroCanvas) {
  const threeModule = window.THREE
    ? Promise.resolve(window.THREE)
    : import('https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js');

  threeModule
    .then(initializeHeroScene)
    .catch(() => heroCanvas.classList.add('scene-fallback'));
}

updateActiveNav();
