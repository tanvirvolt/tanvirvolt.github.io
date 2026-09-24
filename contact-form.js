(() => {
  const ACCESS_KEY = 'b05cb543-357d-42fa-a6bd-e1eae025f04a';

  const initContactForm = () => {
    const form = document.getElementById('form');
    if (!form || form.dataset.web3formsReady === 'true') return;

    form.action = 'https://api.web3forms.com/submit';
    form.method = 'POST';
    form.dataset.web3formsReady = 'true';

    const addHidden = (name, value) => {
      if (form.querySelector(`[name="${name}"]`)) return;
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.prepend(input);
    };

    addHidden('access_key', ACCESS_KEY);
    addHidden('subject', 'New Portfolio Contact Message');
    addHidden('from_name', 'TanvirVolt Portfolio');

    const botcheck = document.createElement('input');
    botcheck.type = 'checkbox';
    botcheck.name = 'botcheck';
    botcheck.tabIndex = -1;
    botcheck.autocomplete = 'off';
    botcheck.setAttribute('aria-hidden', 'true');
    botcheck.style.display = 'none';
    form.appendChild(botcheck);

    let status = form.querySelector('.contact-form-status');
    if (!status) {
      status = document.createElement('p');
      status.className = 'contact-form-status';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      status.style.cssText = 'margin-top:12px;color:var(--muted);font-size:12px;line-height:1.6;';
      form.appendChild(status);
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();

      const submitButton = form.querySelector('button[type="submit"], button:not([type])');
      const originalText = submitButton ? submitButton.textContent : '';
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }
      status.textContent = 'Sending your message...';

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || 'Submission failed');
        status.textContent = 'Thank you! Your message was sent successfully.';
        form.reset();
      } catch (error) {
        status.textContent = 'Sorry, your message could not be sent. Please try again later.';
        console.error('Contact form error:', error);
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
      }
    }, true);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initContactForm);
  else initContactForm();
})();
