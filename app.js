const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const links = document.querySelectorAll('.site-nav a');
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const year = document.getElementById('year');
const dropdowns = document.querySelectorAll('[data-dropdown]');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function closeDropdown(dropdown) {
  const trigger = dropdown.querySelector('.select-trigger');
  dropdown.classList.remove('open');
  trigger?.setAttribute('aria-expanded', 'false');
}

dropdowns.forEach((dropdown) => {
  const trigger = dropdown.querySelector('.select-trigger');
  const valueLabel = dropdown.querySelector('.select-value');
  const hiddenInput = dropdown.querySelector('input[type="hidden"]');
  const options = dropdown.querySelectorAll('.select-menu button');

  trigger?.addEventListener('click', () => {
    const willOpen = !dropdown.classList.contains('open');
    dropdowns.forEach((item) => closeDropdown(item));
    dropdown.classList.toggle('open', willOpen);
    trigger.setAttribute('aria-expanded', String(willOpen));
  });

  options.forEach((option) => {
    option.addEventListener('click', () => {
      const selectedValue = option.dataset.value || '';
      valueLabel.textContent = option.textContent || 'Choose one';
      hiddenInput.value = selectedValue;
      closeDropdown(dropdown);
    });
  });
});

document.addEventListener('click', (event) => {
  dropdowns.forEach((dropdown) => {
    if (!dropdown.contains(event.target)) {
      closeDropdown(dropdown);
    }
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    dropdowns.forEach((dropdown) => closeDropdown(dropdown));
  }
});

async function handleSubmit(event) {
  event.preventDefault();
  formStatus.textContent = 'Sending your message...';

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  const formData = new FormData(form);
  const payload = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    heardAbout: formData.get('heardAbout'),
    message: formData.get('message')
  };

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const contentType = response.headers.get('content-type') || '';
    const result = contentType.includes('application/json')
      ? await response.json()
      : { ok: false, message: 'Contact service is not configured on this deployment yet.' };

    if (!response.ok || !result.ok) {
      throw new Error(result.message || 'Failed to send message.');
    }

    formStatus.textContent = 'Thanks. Your message has been sent.';
    form.reset();
    dropdowns.forEach((dropdown) => {
      const valueLabel = dropdown.querySelector('.select-value');
      const hiddenInput = dropdown.querySelector('input[type="hidden"]');
      valueLabel.textContent = 'Choose one';
      hiddenInput.value = '';
      closeDropdown(dropdown);
    });
  } catch (error) {
    formStatus.textContent = error.message || 'Unable to send your message right now.';
  } finally {
    submitButton.disabled = false;
  }
}

if (form) {
  form.addEventListener('submit', handleSubmit);
}

const promoVideo = document.querySelector('.promo-video');

if (promoVideo) {
  promoVideo.muted = true;
  promoVideo.setAttribute('muted', '');
  promoVideo.setAttribute('playsinline', '');
  promoVideo.setAttribute('webkit-playsinline', '');

  const startPromoVideo = () => {
    if (promoVideo.paused) {
      const playPromise = promoVideo.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    }
  };

  promoVideo.addEventListener('loadeddata', startPromoVideo);
  promoVideo.addEventListener('canplay', startPromoVideo);
  window.addEventListener('load', startPromoVideo);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      startPromoVideo();
    }
  });
}

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealElements.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2
    }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('active'));
}
