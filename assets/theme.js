(() => {
  const theme = () => window.theme || { routes: { root: '/', cart: '/cart' }, cartType: 'page', strings: {} };

  const parseSection = (html, selector) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.querySelector(selector);
  };

  const withTransition = (update) => {
    if (document.startViewTransition) {
      document.startViewTransition(update);
    } else {
      update();
    }
  };

  const Cart = {
    sections: ['cart-drawer'],

    async add(formData) {
      formData.append('sections', this.sections.join(','));
      formData.append('sections_url', window.location.pathname);
      const response = await fetch(`${theme().routes.cartAdd}.js`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: formData
      });
      const data = await response.json();
      if (!response.ok || data.status) {
        throw new Error(data.description || data.message || theme().strings.cartError);
      }
      return data;
    },

    async change(line, quantity) {
      const response = await fetch(`${theme().routes.cartChange}.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ line, quantity, sections: this.sections, sections_url: window.location.pathname })
      });
      const data = await response.json();
      if (!response.ok || data.status) {
        throw new Error(data.description || data.message || theme().strings.cartError);
      }
      return data;
    },

    render(sections) {
      if (!sections || !sections['cart-drawer']) return;
      const fresh = parseSection(sections['cart-drawer'], '#CartDrawerInner');
      const current = document.getElementById('CartDrawerInner');
      if (!fresh || !current) return;
      withTransition(() => {
        current.replaceWith(fresh);
        const count = fresh.dataset.cartCount || '0';
        document.querySelectorAll('[data-cart-count]').forEach((bubble) => {
          bubble.textContent = count;
          bubble.hidden = count === '0';
        });
      });
    },

    open() {
      const drawer = document.getElementById('CartDrawer');
      if (drawer && theme().cartType === 'drawer') {
        drawer.showModal();
        return true;
      }
      return false;
    }
  };

  window.Cart = Cart;

  document.addEventListener('click', (event) => {
    const opener = event.target.closest('[data-cart-open]');
    if (opener && Cart.open()) {
      event.preventDefault();
    }

    const dialogCloser = event.target.closest('[data-dialog-close]');
    if (dialogCloser) {
      dialogCloser.closest('dialog')?.close();
    }

    if (event.target instanceof HTMLDialogElement && event.target.classList.contains('drawer')) {
      event.target.close();
    }
  });

  class ScrollSlider extends HTMLElement {
    connectedCallback() {
      this.track = this.querySelector('[data-slider-track]');
      this.prev = this.querySelector('[data-slider-prev]');
      this.next = this.querySelector('[data-slider-next]');
      if (!this.track) return;
      this.prev?.addEventListener('click', () => this.go(-1));
      this.next?.addEventListener('click', () => this.go(1));
      this.track.addEventListener('scroll', () => this.update(), { passive: true });
      this.update();
    }

    go(direction) {
      const item = this.track.firstElementChild;
      const step = item ? item.getBoundingClientRect().width + parseFloat(getComputedStyle(this.track).columnGap || 0) : this.track.clientWidth;
      this.track.scrollBy({ left: step * direction, behavior: 'smooth' });
    }

    update() {
      const max = this.track.scrollWidth - this.track.clientWidth - 2;
      if (this.prev) this.prev.disabled = this.track.scrollLeft <= 2;
      if (this.next) this.next.disabled = this.track.scrollLeft >= max;
    }
  }

  if (!customElements.get('scroll-slider')) customElements.define('scroll-slider', ScrollSlider);

  class QuantityInput extends HTMLElement {
    connectedCallback() {
      this.input = this.querySelector('input');
      this.querySelectorAll('button[name]').forEach((button) => {
        button.addEventListener('click', (event) => {
          event.preventDefault();
          const previous = this.input.value;
          if (button.name === 'plus') this.input.stepUp();
          else this.input.stepDown();
          if (previous !== this.input.value) this.input.dispatchEvent(new Event('change', { bubbles: true }));
        });
      });
    }
  }

  if (!customElements.get('quantity-input')) customElements.define('quantity-input', QuantityInput);

  const revealObserver =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
              }
            });
          },
          { rootMargin: '0px 0px -10% 0px' }
        )
      : null;

  const observeReveals = (root = document) => {
    root.querySelectorAll('.reveal:not(.is-visible)').forEach((element) => {
      if (revealObserver && !window.Shopify?.designMode) revealObserver.observe(element);
      else element.classList.add('is-visible');
    });
  };

  observeReveals();
  document.addEventListener('shopify:section:load', (event) => observeReveals(event.target));
})();
