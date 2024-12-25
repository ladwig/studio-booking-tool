(function() {
  // Create and inject the iframe
  function createBookingIframe(targetElementId) {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://your-vercel-url.vercel.app'; // Replace with your actual Vercel URL
    iframe.style.width = '100%';
    iframe.style.height = '800px'; // Adjust as needed
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    
    // Get the target element
    const targetElement = document.getElementById(targetElementId);
    if (!targetElement) {
      console.error(`Element with ID "${targetElementId}" not found`);
      return;
    }

    // Inject the iframe
    targetElement.appendChild(iframe);

    // Pass parent styles to iframe
    function updateIframeStyles() {
      const computedStyle = window.getComputedStyle(document.body);
      const styles = {
        '--font-family': computedStyle.fontFamily,
        '--text-color': computedStyle.color,
        '--primary-color': '#2563eb', // You can make this configurable
        '--primary-hover-color': '#1d4ed8',
      };

      // Send styles to iframe
      iframe.contentWindow.postMessage({
        type: 'UPDATE_STYLES',
        styles
      }, '*');
    }

    // Update styles initially and on window resize
    window.addEventListener('resize', updateIframeStyles);
    updateIframeStyles();

    // Handle iframe height adjustments
    window.addEventListener('message', function(event) {
      if (event.data.type === 'RESIZE_IFRAME') {
        iframe.style.height = `${event.data.height}px`;
      }
    });
  }

  // Expose the function globally
  window.createBookingIframe = createBookingIframe;
})(); 