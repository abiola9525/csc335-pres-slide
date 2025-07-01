// Global variables
let currentSlideIndex = 1
const totalSlides = 11
let touchStartX = 0
let touchStartY = 0
let touchEndX = 0
let touchEndY = 0
let isSwipeEnabled = true

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

  // Add enhanced touch/swipe support for mobile
  addEnhancedTouchSupport()

  // Update progress bar
  updateProgressBar()

  // Auto-hide controls after inactivity
  setupAutoHideControls()

  // Show swipe indicator on mobile
  showSwipeIndicator()

  // Add resize listener for responsive adjustments
  window.addEventListener("resize", handleResize)
})

// Enhanced touch/swipe support for mobile
function addEnhancedTouchSupport() {
  const slideContainer = document.querySelector(".slideshow-container")
  let startTime = 0
  let isScrolling = false

  // Touch start
  slideContainer.addEventListener(
    "touchstart",
    (event) => {
      if (!isSwipeEnabled) return

      touchStartX = event.touches[0].clientX
      touchStartY = event.touches[0].clientY
      startTime = Date.now()
      isScrolling = false
    },
    { passive: true },
  )

  // Touch move - detect if user is scrolling vertically
  slideContainer.addEventListener(
    "touchmove",
    (event) => {
      if (!isSwipeEnabled) return

      const currentX = event.touches[0].clientX
      const currentY = event.touches[0].clientY
      const deltaX = Math.abs(currentX - touchStartX)
      const deltaY = Math.abs(currentY - touchStartY)

      // If vertical movement is greater than horizontal, user is scrolling
      if (deltaY > deltaX && deltaY > 10) {
        isScrolling = true
      }

      // If horizontal swipe is detected and not scrolling, prevent default
      if (deltaX > deltaY && deltaX > 10 && !isScrolling) {
        event.preventDefault()
      }
    },
    { passive: false },
  )

  // Touch end
  slideContainer.addEventListener(
    "touchend",
    (event) => {
      if (!isSwipeEnabled || isScrolling) return

      touchEndX = event.changedTouches[0].clientX
      touchEndY = event.changedTouches[0].clientY
      const endTime = Date.now()

      handleSwipe(endTime - startTime)
    },
    { passive: true },
  )

  function handleSwipe(duration) {
    const deltaX = touchEndX - touchStartX
    const deltaY = touchEndY - touchStartY
    const minSwipeDistance = 50
    const maxSwipeTime = 500 // Maximum time for a valid swipe

    // Only process horizontal swipes that are fast enough
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance && duration < maxSwipeTime) {
      // Add visual feedback
      showSwipeAnimation(deltaX > 0 ? "right" : "left")

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

// Show swipe animation feedback
function showSwipeAnimation(direction) {
  const indicator = document.createElement("div")
  indicator.className = "swipe-feedback"
  indicator.innerHTML = direction === "left" ? "→" : "←"
  indicator.style.cssText = `
    position: fixed;
    top: 50%;
    ${direction === "left" ? "right: 20px" : "left: 20px"};
    transform: translateY(-50%);
    background: rgba(254, 56, 66, 0.9);
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
    z-index: 10000;
    animation: swipeFeedback 0.5s ease-out;
    pointer-events: none;
  `

  document.body.appendChild(indicator)
  setTimeout(() => indicator.remove(), 500)
}

// Show swipe indicator for mobile users
function showSwipeIndicator() {
  if (window.innerWidth <= 768) {
    const indicator = document.createElement("div")
    indicator.className = "swipe-indicator"
    indicator.textContent = "← Swipe to navigate →"
    document.body.appendChild(indicator)

    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.remove()
      }
    }, 4000)
  }
}

// Handle window resize
function handleResize() {
  // Recalculate slide heights and positions
  const slides = document.querySelectorAll(".slide")
  slides.forEach((slide) => {
    slide.scrollTop = 0
  })

  // Update navigation positioning
  updateNavigationPosition()
}

// Update navigation position based on screen size
function updateNavigationPosition() {
  const controls = document.querySelector(".slide-controls")
  const indicators = document.querySelector(".slide-indicators")
  const progress = document.querySelector(".progress-container")

  if (window.innerWidth <= 576) {
    // Extra small screens - stack controls vertically
    controls.style.flexDirection = "column"
    controls.style.gap = "10px"
  } else if (window.innerWidth <= 768) {
    // Small screens - horizontal controls
    controls.style.flexDirection = "row"
    controls.style.gap = "15px"
  } else {
    // Desktop - default positioning
    controls.style.flexDirection = "row"
    controls.style.gap = "15px"
  }
}

// Change slide function with enhanced mobile support
function changeSlide(direction) {
  const currentSlide = document.querySelector(".slide.active")
  let newSlideIndex = currentSlideIndex + direction

  // Boundary checks
  if (newSlideIndex < 1) {
    newSlideIndex = 1
    // Show bounce effect when at first slide
    showBounceEffect("start")
    return
  }
  if (newSlideIndex > totalSlides) {
    newSlideIndex = totalSlides
    // Show bounce effect when at last slide
    showBounceEffect("end")
    return
  }

  if (newSlideIndex !== currentSlideIndex) {
    showSlide(newSlideIndex)
  }
}

// Show bounce effect at slide boundaries
function showBounceEffect(position) {
  const message = position === "start" ? "First slide" : "Last slide"
  const bounceIndicator = document.createElement("div")
  bounceIndicator.textContent = message
  bounceIndicator.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(254, 56, 66, 0.9);
    color: white;
    padding: 10px 20px;
    border-radius: 25px;
    font-weight: bold;
    z-index: 10000;
    animation: bounceEffect 0.6s ease-out;
    pointer-events: none;
  `

  document.body.appendChild(bounceIndicator)
  setTimeout(() => bounceIndicator.remove(), 600)
}

// Show specific slide
function currentSlide(slideIndex) {
  showSlide(slideIndex)
}

// Main function to display slide
function showSlide(slideIndex) {
  // Disable swipe temporarily during transition
  isSwipeEnabled = false

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

    // Re-enable swipe after transition
    setTimeout(() => {
      isSwipeEnabled = true
    }, 800)
  }
}

// Update slide counter
function updateSlideCounter() {
  document.getElementById("current-slide").textContent = currentSlideIndex
}

// Update progress bar with enhanced animation
function updateProgressBar() {
  const progressPercentage = (currentSlideIndex / totalSlides) * 100
  const progressBar = document.getElementById("progressBar")

  // Add smooth transition
  progressBar.style.width = progressPercentage + "%"

  // Add pulse effect
  progressBar.style.animation = "pulse 0.3s ease-in-out"
  setTimeout(() => {
    progressBar.style.animation = ""
  }, 300)
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

// Enhanced keyboard navigation
function handleKeyPress(event) {
  // Don't interfere with form inputs
  if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
    return
  }

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
    // Don't hide on mobile devices
    if (window.innerWidth <= 768) return

    controls.forEach((control) => {
      control.style.opacity = "0.7"
      control.style.pointerEvents = "auto" // Keep interactive
    })
  }

  function resetInactivityTimer() {
    clearTimeout(inactivityTimer)
    showControls()
    inactivityTimer = setTimeout(hideControls, 4000) // Hide after 4 seconds
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

// Add CSS for new animations
const additionalStyles = `
  @keyframes swipeFeedback {
    0% {
      transform: translateY(-50%) scale(0.5);
      opacity: 0;
    }
    50% {
      transform: translateY(-50%) scale(1.2);
      opacity: 1;
    }
    100% {
      transform: translateY(-50%) scale(1);
      opacity: 0;
    }
  }
  
  @keyframes bounceEffect {
    0% {
      transform: translate(-50%, -50%) scale(0.5);
      opacity: 0;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.1);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
    }
  }
  
  .swipe-feedback {
    animation: swipeFeedback 0.5s ease-out;
  }
`

// Inject additional styles
const additionalStyleSheet = document.createElement("style")
additionalStyleSheet.textContent = additionalStyles
document.head.appendChild(additionalStyleSheet)

// Initialize presentation
showSlide(1)

// Performance optimization for mobile
if (window.innerWidth <= 768) {
  // Reduce animation complexity on mobile
  document.documentElement.style.setProperty("--animation-duration", "0.4s")

  // Add mobile-specific optimizations
  document.addEventListener("touchstart", () => {}, { passive: true })
  document.addEventListener("touchmove", () => {}, { passive: true })
}

// Add orientation change handler
window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    handleResize()
    updateNavigationPosition()
  }, 100)
})

console.log("TaskNest Presentation loaded successfully! 🚀")
console.log("Mobile Features:")
console.log("- Swipe left/right to navigate slides")
console.log("- Responsive design for all screen sizes")
console.log("- Touch-optimized controls")
console.log("- Optimized animations for mobile")
console.log("")
console.log("Desktop Features:")
console.log("← → ↑ ↓ Space: Navigate slides")
console.log("Home/End: First/Last slide")
console.log("F5: Toggle presentation mode")
console.log("Esc: Toggle fullscreen")
console.log("N: Show slide notes")
