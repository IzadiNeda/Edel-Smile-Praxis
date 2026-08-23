// EDEL SMILE — shared behaviors
document.addEventListener('DOMContentLoaded', () => {

  const header = document.querySelector('.site-header');
  if (header){
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive:true });
  }

  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links){
    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('is-open');
      links.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open);
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.classList.remove('is-open');
      links.classList.remove('is-open');
    }));
  }

  const current = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current){ a.classList.add('active'); }
  });

  /* Language pills need no JS - they are plain links */

  /* Services dropdown: click on the little arrow toggles it open (robust fallback
     alongside CSS hover, works on touch devices too) */
  document.querySelectorAll('.nav-item-dropdown > a svg').forEach(svg => {
    svg.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const dropdown = svg.closest('.nav-item-dropdown');
      document.querySelectorAll('.nav-item-dropdown.is-open').forEach(d => {
        if (d !== dropdown) d.classList.remove('is-open');
      });
      dropdown.classList.toggle('is-open');
    });
  });
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.nav-item-dropdown.is-open').forEach(d => {
      if (!d.contains(e.target)) d.classList.remove('is-open');
    });
  });

  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length){
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* Forms: appointment / contact — real submission via Formspree */
  document.querySelectorAll('form[data-fake-submit]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = form.querySelector('.form-note');
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : '';

      if (submitBtn) submitBtn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        if (note) {
          if (response.ok) {
            note.textContent = note.dataset.successText || 'Thank you. We will contact you shortly.';
            note.style.borderColor = '';
            note.style.color = '';
            form.reset();
          } else {
            note.textContent = note.dataset.errorText || 'Something went wrong. Please try again or contact us directly by phone or email.';
            note.style.borderColor = '#b45252';
            note.style.color = '#e8a3a3';
          }
          note.classList.add('is-visible');
        }
      })
      .catch(() => {
        if (note) {
          note.textContent = note.dataset.errorText || 'Something went wrong. Please try again or contact us directly by phone or email.';
          note.style.borderColor = '#b45252';
          note.style.color = '#e8a3a3';
          note.classList.add('is-visible');
        }
      })
      .finally(() => {
        if (submitBtn){ submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
      });
    });
  });

});
