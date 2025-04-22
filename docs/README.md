# Textonom GitHub Pages

This directory contains the GitHub Pages website for the Textonom project.

## About

Textonom is a text editor that lets you perform common text transformations locally. It helps make your sensitive data safe by processing everything on your local machine.

## Features

- Cyberpunk theme with optional Turbo Mode (CRT effects)
- Responsive design that works on mobile and desktop
- Interactive elements with hover effects
- Showcases all the transformations available in Textonom
- Localization support (English and Russian)

## Development

To test the GitHub Pages site locally:

1. Navigate to the `/docs` directory
2. Run the included test server with Node.js: `node test-server.js`
3. Open your browser to `http://localhost:8080`

Alternatively, you can use any static file server:

```bash
# Using Python
python -m http.server 8000

# Using PHP
php -S localhost:8000
```

## Localization

The website supports the following languages:

- English (default)
- Russian

The language switcher is located in the top-right corner of the website. The site automatically detects the user's preferred language based on browser settings and redirects accordingly. The selected language is saved in the browser's localStorage and will be remembered on subsequent visits.

### Adding a New Language

To add a new language:

1. Create a new directory for the language (e.g., `/docs/fr/` for French)
2. Create an `index.html` file in the new language directory, based on the existing language files
3. Update the language switcher in all HTML files to include the new language option
4. Update the language-switcher.js file to handle the new language:
   - Add the language to the language switcher event listener
   - Update the `detectLanguage()` function to detect the new language based on browser settings

## License

This website is licensed under the same MIT license as the main Textonom project.
