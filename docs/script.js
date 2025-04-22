document.addEventListener('DOMContentLoaded', function () {
  // Get the turbo mode toggle
  const turboToggle = document.getElementById('turbo-mode')

  // Lightbox functionality
  const lightbox = document.getElementById('screenshot-lightbox')
  const lightboxImage = document.getElementById('lightbox-image')
  const closeButton = document.querySelector('.close-lightbox')
  const screenshotLinks = document.querySelectorAll('.screenshot-link')

  // Open lightbox when clicking on a screenshot
  screenshotLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault()
      const imageSrc = this.getAttribute('data-src')
      lightboxImage.src = imageSrc
      lightbox.classList.add('active')

      // Add cyberpunk glitch effect when opening lightbox
      if (turboToggle.checked) {
        createRandomGlitch()
      }
    })
  })

  // Close lightbox when clicking the close button
  closeButton.addEventListener('click', function () {
    lightbox.classList.remove('active')
  })

  // Close lightbox when clicking outside the image
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) {
      lightbox.classList.remove('active')
    }
  })

  // Close lightbox with Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active')
    }
  })

  // Check if there's a saved preference for turbo mode
  const savedTurboMode = localStorage.getItem('turboMode')

  // Apply saved preference if it exists
  if (savedTurboMode === 'true') {
    turboToggle.checked = true
    document.body.setAttribute('data-crt-effect', 'true')
  }

  // Toggle turbo mode when the checkbox is clicked
  turboToggle.addEventListener('change', function () {
    if (this.checked) {
      document.body.setAttribute('data-crt-effect', 'true')
      localStorage.setItem('turboMode', 'true')

      // Create random glitches occasionally
      startGlitchEffects()
    } else {
      document.body.setAttribute('data-crt-effect', 'false')
      localStorage.setItem('turboMode', 'false')

      // Stop glitch effects
      stopGlitchEffects()
    }
  })

  // Glitch effect variables
  let glitchInterval = null

  // Start glitch effects
  function startGlitchEffects() {
    if (glitchInterval) {
      clearInterval(glitchInterval)
    }

    // Create random glitches every 5-10 seconds
    glitchInterval = setInterval(createRandomGlitch, Math.random() * 5000 + 5000)
  }

  // Stop glitch effects
  function stopGlitchEffects() {
    if (glitchInterval) {
      clearInterval(glitchInterval)
      glitchInterval = null
    }
  }

  // Create a random glitch effect
  function createRandomGlitch() {
    // Only create glitches if turbo mode is enabled
    if (!turboToggle.checked) return

    // Choose a random glitch type
    const glitchType = Math.floor(Math.random() * 3)

    switch (glitchType) {
      case 0:
        createHorizontalGlitch()
        break
      case 1:
        createColorShiftGlitch()
        break
      case 2:
        createStaticGlitch()
        break
    }
  }

  // Create a horizontal glitch effect
  function createHorizontalGlitch() {
    const glitchOverlay = document.querySelector('.crt-glitch-overlay')
    const duration = 100 + Math.random() * 300 // 100-400ms

    // Apply the glitch effect
    glitchOverlay.style.transform = `translateX(${Math.random() > 0.5 ? 5 : -5}px)`
    glitchOverlay.style.opacity = '0.1'

    // Reset after the duration
    setTimeout(() => {
      glitchOverlay.style.transform = 'translateX(0)'
      glitchOverlay.style.opacity = '0.05'
    }, duration)
  }

  // Create a color shift glitch effect
  function createColorShiftGlitch() {
    const body = document.body
    const duration = 50 + Math.random() * 150 // 50-200ms

    // Apply the color shift
    body.style.filter = `hue-rotate(${Math.random() * 30}deg)`

    // Reset after the duration
    setTimeout(() => {
      body.style.filter = 'none'
    }, duration)
  }

  // Create a static noise glitch effect
  function createStaticGlitch() {
    const glitchOverlay = document.querySelector('.crt-glitch-overlay')
    const duration = 100 + Math.random() * 200 // 100-300ms

    // Increase the opacity for static effect
    glitchOverlay.style.opacity = '0.2'
    glitchOverlay.style.backgroundImage =
      'url("data:image/png;base64,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")'

    // Reset after the duration
    setTimeout(() => {
      glitchOverlay.style.opacity = '0.05'
      glitchOverlay.style.backgroundImage = 'none'
    }, duration)
  }

  // Start glitch effects if turbo mode is enabled
  if (turboToggle.checked) {
    startGlitchEffects()
  }

  // Add hover effect to feature cards
  const featureCards = document.querySelectorAll('.feature-card')
  featureCards.forEach((card) => {
    card.addEventListener('mouseenter', function () {
      if (turboToggle.checked) {
        this.style.boxShadow = `0 5px 15px rgba(255, 0, 255, 0.3), 0 0 5px rgba(255, 0, 255, 0.5), 0 0 20px rgba(255, 0, 255, 0.2)`
      }
    })

    card.addEventListener('mouseleave', function () {
      this.style.boxShadow = ''
    })
  })
})
