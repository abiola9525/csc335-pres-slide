// Global variables
let currentSlideIndex = 1
const totalSlides = 11

// Initialize the presentation
document.addEventListener("DOMContentLoaded", () => {
  // Set current date
  document.getElementById("current-date").textContent = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Initialize slide counter
  document.getElementById("current-slide").textContent = currentSlideIndex
  document.getElementById("total-slides").textContent = totalSlides

  // Add keyboard navigation
  document.addEventListener("keydown", handleKeyPress)

  // Add touch/swipe support for mobile
  addTouchSupport()

  // Update progress bar
  updateProgressBar()

  // Auto-hide controls after inactivity
  setupAutoHideControls()
})

// Change slide function
function changeSlide(direction) {
  const currentSlide = document.querySelector(".slide.active")
  let newSlideIndex = currentSlideIndex + direction

  // Boundary checks
  if (newSlideIndex < 1) newSlideIndex = 1
  if (newSlideIndex > totalSlides) newSlideIndex = totalSlides

  if (newSlideIndex !== currentSlideIndex) {
    showSlide(newSlideIndex)
  }
}

// Show specific slide
function currentSlide(slideIndex) {
  showSlide(slideIndex)
}

// Main function to display slide
function showSlide(slideIndex) {
  // Hide current slide
  const currentSlide = document.querySelector(".slide.active")
  if (currentSlide) {
    currentSlide.classList.remove("active")
  }

  // Show new slide
  const newSlide = document.getElementById(`slide-${slideIndex}`)
  if (newSlide) {
    newSlide.classList.add("active")
    currentSlideIndex = slideIndex

    // Update UI elements
    updateSlideCounter()
    updateProgressBar()
    updateIndicators()
    updateNavigationButtons()

    // Scroll to top of new slide
    newSlide.scrollTop = 0

    // Add entrance animation
    addSlideAnimation(newSlide)
  }
}

// Update slide counter
function updateSlideCounter() {
  document.getElementById("current-slide").textContent = currentSlideIndex
}

// Update progress bar
function updateProgressBar() {
  const progressPercentage = (currentSlideIndex / totalSlides) * 100
  document.getElementById("progressBar").style.width = progressPercentage + "%"
}

// Update slide indicators
function updateIndicators() {
  const indicators = document.querySelectorAll(".indicator")
  indicators.forEach((indicator, index) => {
    if (index + 1 === currentSlideIndex) {
      indicator.classList.add("active")
    } else {
      indicator.classList.remove("active")
    }
  })
}

// Update navigation buttons
function updateNavigationButtons() {
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")

  // Update button states
  if (currentSlideIndex === 1) {
    prevBtn.disabled = true
    prevBtn.classList.add("disabled")
  } else {
    prevBtn.disabled = false
    prevBtn.classList.remove("disabled")
  }

  if (currentSlideIndex === totalSlides) {
    nextBtn.disabled = true
    nextBtn.classList.add("disabled")
  } else {
    nextBtn.disabled = false
    nextBtn.classList.remove("disabled")
  }
}

// Add slide animation
function addSlideAnimation(slide) {
  const cards = slide.querySelectorAll(".card")
  cards.forEach((card, index) => {
    card.style.animation = "none"
    card.offsetHeight // Trigger reflow
    card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`
  })
}

// Keyboard navigation
function handleKeyPress(event) {
  switch (event.key) {
    case "ArrowLeft":
    case "ArrowUp":
      event.preventDefault()
      changeSlide(-1)
      break
    case "ArrowRight":
    case "ArrowDown":
    case " ": // Spacebar
      event.preventDefault()
      changeSlide(1)
      break
    case "Home":
      event.preventDefault()
      showSlide(1)
      break
    case "End":
      event.preventDefault()
      showSlide(totalSlides)
      break
    case "Escape":
      event.preventDefault()
      toggleFullscreen()
      break
  }
}

// Touch/Swipe support for mobile
function addTouchSupport() {
  let startX = 0
  let startY = 0
  let endX = 0
  let endY = 0

  const slideContainer = document.querySelector(".slideshow-container")

  slideContainer.addEventListener("touchstart", (event) => {
    startX = event.touches[0].clientX
    startY = event.touches[0].clientY
  })

  slideContainer.addEventListener("touchend", (event) => {
    endX = event.changedTouches[0].clientX
    endY = event.changedTouches[0].clientY
    handleSwipe()
  })

  function handleSwipe() {
    const deltaX = endX - startX
    const deltaY = endY - startY
    const minSwipeDistance = 50

    // Horizontal swipe is more significant than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        // Swipe right - go to previous slide
        changeSlide(-1)
      } else {
        // Swipe left - go to next slide
        changeSlide(1)
      }
    }
  }
}

// Auto-hide controls after inactivity
function setupAutoHideControls() {
  let inactivityTimer
  const controls = document.querySelectorAll(".slide-controls, .slide-indicators, .progress-container")

  function showControls() {
    controls.forEach((control) => {
      control.style.opacity = "1"
      control.style.pointerEvents = "auto"
    })
  }

  function hideControls() {
    controls.forEach((control) => {
      control.style.opacity = "0.3"
      control.style.pointerEvents = "none"
    })
  }

  function resetInactivityTimer() {
    clearTimeout(inactivityTimer)
    showControls()
    inactivityTimer = setTimeout(hideControls, 3000) // Hide after 3 seconds
  }

  // Show controls on mouse movement or touch
  document.addEventListener("mousemove", resetInactivityTimer)
  document.addEventListener("touchstart", resetInactivityTimer)
  document.addEventListener("keydown", resetInactivityTimer)

  // Keep controls visible when hovering over them
  controls.forEach((control) => {
    control.addEventListener("mouseenter", showControls)
    control.addEventListener("mouseleave", resetInactivityTimer)
  })

  // Initial timer
  resetInactivityTimer()
}

// Fullscreen toggle
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.log(`Error attempting to enable fullscreen: ${err.message}`)
    })
  } else {
    document.exitFullscreen()
  }
}

// Presentation mode (hide all controls)
function togglePresentationMode() {
  const controls = document.querySelectorAll(".navbar, .slide-controls, .slide-indicators, .progress-container")
  const body = document.body

  if (body.classList.contains("presentation-mode")) {
    // Exit presentation mode
    body.classList.remove("presentation-mode")
    controls.forEach((control) => {
      control.style.display = ""
    })
  } else {
    // Enter presentation mode
    body.classList.add("presentation-mode")
    controls.forEach((control) => {
      control.style.display = "none"
    })
  }
}

// Add presentation mode keyboard shortcut (F5)
document.addEventListener("keydown", (event) => {
  if (event.key === "F5") {
    event.preventDefault()
    togglePresentationMode()
  }
})

// Smooth scrolling for slide content
function smoothScrollToTop(element) {
  element.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// Add click handlers for better UX
document.addEventListener("click", (event) => {
  // Close any open dropdowns when clicking outside
  const dropdowns = document.querySelectorAll(".dropdown-menu.show")
  dropdowns.forEach((dropdown) => {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove("show")
    }
  })
})

// Performance optimization: Preload next slide
function preloadNextSlide() {
  if (currentSlideIndex < totalSlides) {
    const nextSlide = document.getElementById(`slide-${currentSlideIndex + 1}`)
    if (nextSlide) {
      // Preload images in next slide
      const images = nextSlide.querySelectorAll("img")
      images.forEach((img) => {
        if (img.dataset.src) {
          img.src = img.dataset.src
        }
      })
    }
  }
}

// Call preload function when slide changes
const originalShowSlide = showSlide
showSlide = (slideIndex) => {
  originalShowSlide(slideIndex)
  setTimeout(preloadNextSlide, 100)
}

// Add loading animation
function showLoadingAnimation() {
  const loader = document.createElement("div")
  loader.className = "loading-overlay"
  loader.innerHTML = `
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `
  document.body.appendChild(loader)

  setTimeout(() => {
    loader.remove()
  }, 500)
}

// Initialize presentation
showSlide(1)

// Add CSS for loading overlay
const loadingStyles = `
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        backdrop-filter: blur(5px);
    }
    
    .presentation-mode .navbar,
    .presentation-mode .slide-controls,
    .presentation-mode .slide-indicators,
    .presentation-mode .progress-container {
        display: none !important;
    }
    
    .slide-controls, .slide-indicators, .progress-container {
        transition: opacity 0.3s ease;
    }
`

// Inject loading styles
const styleSheet = document.createElement("style")
styleSheet.textContent = loadingStyles
document.head.appendChild(styleSheet)

// Add print functionality
function printPresentation() {
  window.print()
}

// Add export to PDF functionality (requires additional library)
function exportToPDF() {
  // This would require a library like jsPDF or Puppeteer
  alert("PDF export functionality would require additional libraries like jsPDF")
}

// Add slide notes functionality
const slideNotes = {
  1: "Welcome slide - introduce the project and team members",
  2: "Explain the problem TaskNest solves and project objectives",
  3: "Detail functional and non-functional requirements",
  4: "Show system architecture and database design",
  5: "Present UI design principles and technology stack",
  6: "Highlight key implementation details and challenges",
  7: "Discuss testing strategy and evaluation methods",
  8: "Explain deployment and maintenance approach",
  9: "Summarize achievements and lessons learned",
  10: "Present future enhancement opportunities",
  11: "Thank audience and invite questions",
}

function showSlideNotes() {
  const notes = slideNotes[currentSlideIndex] || "No notes available for this slide"
  alert(`Slide ${currentSlideIndex} Notes:\n\n${notes}`)
}

// Add keyboard shortcut for notes (N key)
document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "n") {
    event.preventDefault()
    showSlideNotes()
  }
})

// Enhanced Animation Functions
function addAdvancedSlideAnimation(slide, direction = "right") {
  const cards = slide.querySelectorAll(".card")
  const icons = slide.querySelectorAll("i")
  const titles = slide.querySelectorAll("h1, h2, h3, h4, h5")
  const badges = slide.querySelectorAll(".badge")

  // Reset all animations
  cards.forEach((card) => {
    card.style.animation = "none"
    card.offsetHeight // Trigger reflow
  })

  // Animate cards with staggered timing
  cards.forEach((card, index) => {
    const animations = [
      "slideInFromLeft",
      "slideInFromRight",
      "slideInFromBottom",
      "flipIn",
      "bounceIn",
      "zoomInRotate",
    ]

    const randomAnimation = animations[index % animations.length]
    const delay = index * 0.15

    card.style.animation = `${randomAnimation} 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s both`
  })

  // Animate titles with typewriter effect on first slide
  if (slide.id === "slide-1") {
    const mainTitle = slide.querySelector("h1")
    if (mainTitle) {
      mainTitle.classList.add("typewriter-text")
    }
  }

  // Animate icons
  icons.forEach((icon, index) => {
    setTimeout(() => {
      icon.style.animation = "bounceIn 0.6s ease-out, float 3s ease-in-out infinite 1s"
    }, index * 100)
  })

  // Animate badges
  badges.forEach((badge, index) => {
    setTimeout(() => {
      badge.style.transform = "scale(1.1)"
      setTimeout(() => {
        badge.style.transform = "scale(1)"
      }, 200)
    }, index * 50)
  })

  // Add particle effects
  addParticleEffect(slide)
}

// Particle Effect System
function addParticleEffect(slide) {
  const particleContainer = document.createElement("div")
  particleContainer.className = "particle-container"
  particleContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
  `

  // Create floating particles
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement("div")
    particle.className = "particle"
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 6 + 2}px;
      height: ${Math.random() * 6 + 2}px;
      background: rgba(13, 110, 253, ${Math.random() * 0.5 + 0.2});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: floatParticle ${Math.random() * 10 + 5}s linear infinite;
    `
    particleContainer.appendChild(particle)
  }

  slide.appendChild(particleContainer)

  // Remove particles after animation
  setTimeout(() => {
    if (particleContainer.parentNode) {
      particleContainer.remove()
    }
  }, 15000)
}

// Enhanced slide transition with sound effect simulation
function showSlideWithEffects(slideIndex) {
  const currentSlide = document.querySelector(".slide.active")
  const newSlide = document.getElementById(`slide-${slideIndex}`)

  if (!newSlide || slideIndex === currentSlideIndex) return

  // Add transition overlay
  const overlay = document.createElement("div")
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(13, 110, 253, 0.1), rgba(111, 66, 193, 0.1));
    z-index: 999;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  `
  document.body.appendChild(overlay)

  // Trigger overlay animation
  setTimeout(() => {
    overlay.style.opacity = "1"
  }, 10)

  // Hide current slide with exit animation
  if (currentSlide) {
    currentSlide.style.animation = "slideOutLeft 0.5s ease-in-out"
    setTimeout(() => {
      currentSlide.classList.remove("active")
      currentSlide.style.animation = ""
    }, 500)
  }

  // Show new slide with entrance animation
  setTimeout(() => {
    newSlide.classList.add("active")
    currentSlideIndex = slideIndex

    // Update UI elements
    updateSlideCounter()
    updateProgressBarWithAnimation()
    updateIndicators()
    updateNavigationButtons()

    // Add advanced animations
    addAdvancedSlideAnimation(newSlide)

    // Scroll to top smoothly
    newSlide.scrollTo({ top: 0, behavior: "smooth" })

    // Remove overlay
    setTimeout(() => {
      overlay.style.opacity = "0"
      setTimeout(() => overlay.remove(), 300)
    }, 200)
  }, 300)
}

// Enhanced progress bar animation
function updateProgressBarWithAnimation() {
  const progressBar = document.getElementById("progressBar")
  const progressPercentage = (currentSlideIndex / totalSlides) * 100

  // Add pulsing effect during transition
  progressBar.style.animation = "pulse 0.5s ease-in-out"

  setTimeout(() => {
    progressBar.style.width = progressPercentage + "%"
    progressBar.style.animation = ""
  }, 250)
}

// Add CSS for new animations
const additionalStyles = `
  @keyframes slideOutLeft {
    to {
      opacity: 0;
      transform: translateX(-100px) scale(0.95);
    }
  }
  
  @keyframes floatParticle {
    0% {
      transform: translateY(0px) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(-100vh) rotate(360deg);
      opacity: 0;
    }
  }
  
  .particle-container {
    animation: fadeIn 1s ease-in-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`

// Inject additional styles
const additionalStyleSheet = document.createElement("style")
additionalStyleSheet.textContent = additionalStyles
document.head.appendChild(additionalStyleSheet)

// Override the original showSlide function
const originalShowSlideFunction = showSlide
showSlide = showSlideWithEffects

// Add hover effects for interactive elements
document.addEventListener("DOMContentLoaded", () => {
  // Enhanced card hover effects
  const cards = document.querySelectorAll(".card")
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px) scale(1.02) rotateX(5deg)"
      card.style.boxShadow = "0 25px 50px rgba(0, 0, 0, 0.15)"
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1) rotateX(0deg)"
      card.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)"
    })
  })

  // Add click ripple effect
  document.addEventListener("click", createRippleEffect)
})

// Ripple effect on click
function createRippleEffect(event) {
  const ripple = document.createElement("div")
  const rect = event.target.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: radial-gradient(circle, rgba(13, 110, 253, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s ease-out;
    pointer-events: none;
    z-index: 1000;
  `

  if (event.target.style.position !== "absolute" && event.target.style.position !== "relative") {
    event.target.style.position = "relative"
  }

  event.target.appendChild(ripple)

  setTimeout(() => ripple.remove(), 600)
}

// Add ripple animation
const rippleStyles = `
  @keyframes ripple {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
`

const rippleStyleSheet = document.createElement("style")
rippleStyleSheet.textContent = rippleStyles
document.head.appendChild(rippleStyleSheet)

// Enhanced keyboard navigation with sound effects simulation
const originalHandleKeyPress = handleKeyPress
handleKeyPress = (event) => {
  // Add visual feedback for key presses
  const keyIndicator = document.createElement("div")
  keyIndicator.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(13, 110, 253, 0.9);
    color: white;
    padding: 10px 15px;
    border-radius: 25px;
    font-weight: bold;
    z-index: 10000;
    animation: slideInFromRight 0.3s ease-out, fadeOut 0.3s ease-out 1s;
    pointer-events: none;
  `
  keyIndicator.textContent = `Key: ${event.key}`
  document.body.appendChild(keyIndicator)

  setTimeout(() => keyIndicator.remove(), 1300)

  // Call original function
  originalHandleKeyPress(event)
}

// Add fade out animation for key indicator
const keyIndicatorStyles = `
  @keyframes fadeOut {
    to {
      opacity: 0;
      transform: translateX(20px);
    }
  }
`

const keyIndicatorStyleSheet = document.createElement("style")
keyIndicatorStyleSheet.textContent = keyIndicatorStyles
document.head.appendChild(keyIndicatorStyleSheet)

console.log("TaskNest Presentation loaded successfully!")
console.log("Keyboard shortcuts:")
console.log("← → ↑ ↓ Space: Navigate slides")
console.log("Home/End: First/Last slide")
console.log("F5: Toggle presentation mode")
console.log("Esc: Toggle fullscreen")
console.log("N: Show slide notes")
console.log("Enhanced animations loaded! 🎨✨")
console.log("New features:")
console.log("- Advanced slide transitions")
console.log("- Particle effects")
console.log("- Ripple click effects")
console.log("- Enhanced hover animations")
console.log("- Keyboard visual feedback")
