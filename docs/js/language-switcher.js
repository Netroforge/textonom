document.addEventListener('DOMContentLoaded', function () {
  // Get the current language from localStorage, browser settings, or default to 'en'
  const currentLang = detectLanguage()

  // Initialize the language switcher
  initLanguageSwitcher(currentLang)

  // Redirect if needed based on detected language
  handleLanguageRedirect(currentLang)
})

// Detect the user's preferred language
function detectLanguage() {
  // First check if user has a saved preference
  const savedLang = localStorage.getItem('textonom-language')
  if (savedLang) {
    return savedLang
  }

  // If no saved preference, check browser language settings
  const browserLang = navigator.language || navigator.userLanguage

  // Check if the browser language starts with 'ru'
  if (browserLang && browserLang.toLowerCase().startsWith('ru')) {
    return 'ru'
  }

  // Default to English
  return 'en'
}

// Handle redirect based on detected language
function handleLanguageRedirect(lang) {
  // Only redirect if we're on the main page and there's no language preference saved yet
  const isMainPage =
    window.location.pathname.endsWith('index.html') ||
    window.location.pathname.endsWith('/') ||
    window.location.pathname.endsWith('/docs/')

  const hasNoSavedPreference = !localStorage.getItem('textonom-language')

  if (isMainPage && hasNoSavedPreference && lang === 'ru') {
    // Save the preference before redirecting
    localStorage.setItem('textonom-language', 'ru')
    window.location.href = 'ru/index.html'
  }
}

// Initialize the language switcher dropdown
function initLanguageSwitcher(currentLang) {
  const languageSwitcher = document.getElementById('language-switcher')
  if (!languageSwitcher) return

  // Set the current language as selected
  const currentLangOption = languageSwitcher.querySelector(`[value="${currentLang}"]`)
  if (currentLangOption) {
    currentLangOption.selected = true
  }

  // Add event listener for language change
  languageSwitcher.addEventListener('change', function (event) {
    const newLang = event.target.value
    localStorage.setItem('textonom-language', newLang)

    // Redirect to the appropriate language version
    if (newLang === 'en') {
      window.location.href = window.location.href.replace('/ru/', '/')
    } else if (newLang === 'ru') {
      // If we're on the main page, redirect to the Russian version
      if (
        window.location.pathname.endsWith('index.html') ||
        window.location.pathname.endsWith('/') ||
        window.location.pathname.endsWith('/docs/')
      ) {
        window.location.href = 'ru/index.html'
      }
    }
  })
}
