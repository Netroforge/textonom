import jsYaml from 'js-yaml';
import { logTransformation, detectLineEnding } from './utils';

/**
 * Converts JSON to YAML
 * @param {string} text - The JSON string to convert
 * @returns {string} YAML string
 */
export const jsonToYaml = (text) => {
    try {
        logTransformation('jsonToYaml', text);
        const obj = JSON.parse(text);
        const result = jsYaml.dump(obj);
        logTransformation('jsonToYaml', text, result);
        return result;
    } catch (error) {
        throw new Error('Invalid JSON format');
    }
};

/**
 * Converts YAML to JSON
 * @param {string} text - The YAML string to convert
 * @returns {string} JSON string
 */
export const yamlToJson = (text) => {
    try {
        logTransformation('yamlToJson', text);
        const obj = jsYaml.load(text);
        const result = JSON.stringify(obj, null, 2);
        logTransformation('yamlToJson', text, result);
        return result;
    } catch (error) {
        throw new Error('Invalid YAML format');
    }
};

/**
 * Converts Java properties to YAML
 * @param {string} text - The properties string to convert
 * @returns {string} YAML string
 */
export const propertiesToYaml = (text) => {
    try {
        logTransformation('propertiesToYaml', text);
        const properties = {};
        const lineEnding = detectLineEnding(text);

        // Parse properties file
        text.split(lineEnding).forEach(line => {
            // Skip comments and empty lines
            if (line.trim() === '' || line.trim().startsWith('#')) {
                return;
            }

            // Split by first equals sign
            const separatorIndex = line.indexOf('=');
            if (separatorIndex > 0) {
                const key = line.substring(0, separatorIndex).trim();
                const value = line.substring(separatorIndex + 1).trim();

                // Handle nested properties
                const keyParts = key.split('.');
                let current = properties;

                for (let i = 0; i < keyParts.length - 1; i++) {
                    const part = keyParts[i];
                    if (!current[part]) {
                        current[part] = {};
                    }
                    current = current[part];
                }

                // Set the value
                current[keyParts[keyParts.length - 1]] = value;
            }
        });

        const result = jsYaml.dump(properties);
        logTransformation('propertiesToYaml', text, result);
        return result;
    } catch (error) {
        throw new Error('Invalid properties format');
    }
};

/**
 * Converts YAML to Java properties
 * @param {string} text - The YAML string to convert
 * @returns {string} Properties string
 */
export const yamlToProperties = (text) => {
    try {
        logTransformation('yamlToProperties', text);
        const obj = jsYaml.load(text);
        const properties = [];
        const lineEnding = detectLineEnding(text);

        // Flatten nested objects into dot notation
        const flatten = (obj, prefix = '') => {
            for (const key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    flatten(obj[key], prefix + key + '.');
                } else {
                    properties.push(prefix + key + '=' + obj[key]);
                }
            }
        };

        flatten(obj);
        const result = properties.join(lineEnding);
        logTransformation('yamlToProperties', text, result);
        return result;
    } catch (error) {
        throw new Error('Invalid YAML format');
    }
};
