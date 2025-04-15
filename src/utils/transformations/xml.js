import { logTransformation } from './utils';

/**
 * Formats XML with indentation
 * @param {string} text - The XML string to format
 * @returns {string} Formatted XML
 */
export const xmlPrettify = (text) => {
    try {
        logTransformation('xmlPrettify', text);
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');

        // Check for parsing errors
        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
            throw new Error('Invalid XML format');
        }

        // Format XML
        const serializer = new XMLSerializer();
        let formatted = '';
        let indent = '';

        const format = (node, level) => {
            if (node.nodeType === 3) { // Text node
                const value = node.nodeValue.trim();
                if (value) {
                    formatted += indent + value + '\n';
                }
            } else if (node.nodeType === 1) { // Element node
                const hasChildren = node.childNodes.length > 0;
                const hasTextOnly = hasChildren && node.childNodes.length === 1 && node.childNodes[0].nodeType === 3;

                if (hasTextOnly) {
                    formatted += indent + serializer.serializeToString(node) + '\n';
                } else {
                    formatted += indent + '<' + node.nodeName;

                    // Add attributes
                    for (let i = 0; i < node.attributes.length; i++) {
                        const attr = node.attributes[i];
                        formatted += ' ' + attr.name + '="' + attr.value + '"';
                    }

                    if (hasChildren) {
                        formatted += '>\n';

                        // Process child nodes with increased indentation
                        const oldIndent = indent;
                        indent += '  ';

                        for (let i = 0; i < node.childNodes.length; i++) {
                            format(node.childNodes[i], level + 1);
                        }

                        indent = oldIndent;
                        formatted += indent + '</' + node.nodeName + '>\n';
                    } else {
                        formatted += '/>\n';
                    }
                }
            }
        };

        // Process all root elements
        for (let i = 0; i < xmlDoc.childNodes.length; i++) {
            format(xmlDoc.childNodes[i], 0);
        }

        const result = formatted.replace(/\n/g, '\n');
        logTransformation('xmlPrettify', text, result);
        return result;
    } catch (error) {
        throw new Error('Invalid XML format: ' + error.message);
    }
};

/**
 * Compacts XML by removing whitespace
 * @param {string} text - The XML string to compact
 * @returns {string} Compacted XML
 */
export const xmlCompact = (text) => {
    try {
        logTransformation('xmlCompact', text);
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');

        // Check for parsing errors
        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
            throw new Error('Invalid XML format');
        }

        // Compact XML
        const serializer = new XMLSerializer();
        const result = serializer.serializeToString(xmlDoc);
        logTransformation('xmlCompact', text, result);
        return result;
    } catch (error) {
        throw new Error('Invalid XML format: ' + error.message);
    }
};
