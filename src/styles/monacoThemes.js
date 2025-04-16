/**
 * Monaco editor theme definitions
 */

/**
 * Get the appropriate Monaco theme based on app theme
 * @param {string} theme - The application theme name
 * @returns {string} Monaco theme name
 */
export const getMonacoTheme = (theme) => {
    switch (theme) {
        case 'dark':
            return 'vs-dark';
        case 'cyberpunk':
            return 'cyberpunk';
        case 'cyberpunk-turbo':
            return 'cyberpunk-turbo';
        default:
            return 'vs-light';
    }
};

/**
 * Define Monaco editor themes
 * @param {object} monaco - Monaco editor instance
 */
export const defineMonacoThemes = (monaco) => {
    // Custom dark theme
    monaco.editor.defineTheme('custom-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {}
    });

    // Cyberpunk theme - now matches Cyberpunk Turbo
    monaco.editor.defineTheme('cyberpunk', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '#6272a4' },
            { token: 'string', foreground: '#ff55cc' },
            { token: 'keyword', foreground: '#ff00aa' },
            { token: 'number', foreground: '#bd93f9' },
            { token: 'operator', foreground: '#00ffee' }
        ],
        colors: {
            'editor.background': '#0a0a12',
            'editor.foreground': '#f0f0f0',
            'editorCursor.foreground': '#ff00aa',
            'editor.lineHighlightBackground': '#1a1a2e',
            'editorLineNumber.foreground': '#3a3a5a',
            'editor.selectionBackground': '#3a3a5a',
            'editor.selectionHighlightBackground': '#1a1a2e'
        }
    });

    // Cyberpunk Turbo theme
    monaco.editor.defineTheme('cyberpunk-turbo', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '#6272a4' },
            { token: 'string', foreground: '#ff55cc' },
            { token: 'keyword', foreground: '#ff00aa' },
            { token: 'number', foreground: '#bd93f9' },
            { token: 'operator', foreground: '#00ffee' }
        ],
        colors: {
            'editor.background': '#0a0a12',
            'editor.foreground': '#f0f0f0',
            'editorCursor.foreground': '#ff00aa',
            'editor.lineHighlightBackground': '#1a1a2e',
            'editorLineNumber.foreground': '#3a3a5a',
            'editor.selectionBackground': '#3a3a5a',
            'editor.selectionHighlightBackground': '#1a1a2e'
        }
    });
};
