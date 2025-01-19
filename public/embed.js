(function() {
  class StudioBookingWidget {
    constructor(config = {}) {
      this.config = {
        url: 'https://your-vercel-url.vercel.app', // Replace with your Vercel URL
        theme: {
          primaryColor: '#2563eb',
          primaryHoverColor: '#1d4ed8',
          textColor: 'inherit',
          fontFamily: 'inherit',
          ...config.theme
        },
        width: '100%',
        height: '800px',
        containerId: 'studio-booking-widget-' + Math.random().toString(36).substring(7),
        ...config
      };

      this.init();
    }

    init() {
      // Create container if not exists
      if (!document.getElementById(this.config.containerId)) {
        const container = document.createElement('div');
        container.id = this.config.containerId;
        document.currentScript?.parentNode?.insertBefore(container, document.currentScript);
      }

      // Create and inject the iframe
      const iframe = document.createElement('iframe');
      iframe.src = this.config.url;
      iframe.style.width = this.config.width;
      iframe.style.height = this.config.height;
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';
      
      const container = document.getElementById(this.config.containerId);
      if (!container) {
        console.error('Container element not found');
        return;
      }

      container.appendChild(iframe);

      // Pass styles to iframe
      const updateIframeStyles = () => {
        // Get all computed styles from the parent document
        const computedStyle = window.getComputedStyle(document.body);
        
        // Get the actual computed font family
        const fontFamily = this.config.theme.fontFamily === 'inherit' 
          ? computedStyle.fontFamily
          : this.config.theme.fontFamily;

        // Get the actual computed text color
        const textColor = this.config.theme.textColor === 'inherit'
          ? computedStyle.color
          : this.config.theme.textColor;

        // Create CSS variables
        const styles = {
          '--font-family': fontFamily,
          '--text-color': textColor,
          '--primary-color': this.config.theme.primaryColor,
          '--primary-hover-color': this.config.theme.primaryHoverColor,
          // Add explicit font-family rule
          'font-family': fontFamily
        };

        // Send styles to iframe
        iframe.contentWindow.postMessage({
          type: 'UPDATE_STYLES',
          styles
        }, '*');
      };

      // Update styles initially and on window resize
      window.addEventListener('resize', updateIframeStyles);
      iframe.addEventListener('load', () => {
        updateIframeStyles();
        // Reapply styles after a short delay to ensure they're applied
        setTimeout(updateIframeStyles, 100);
      });

      // Handle iframe height adjustments
      window.addEventListener('message', (event) => {
        if (event.data.type === 'RESIZE_IFRAME') {
          iframe.style.height = `${event.data.height}px`;
        }
      });
    }
  }

  // Expose the widget class globally
  window.StudioBookingWidget = StudioBookingWidget;
})(); 