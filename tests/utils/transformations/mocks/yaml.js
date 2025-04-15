// Mock implementation of yaml.js for testing
import jsYaml from 'js-yaml';
import { detectLineEnding } from './utils';

export const jsonToYaml = (text) => {
  try {
    const obj = JSON.parse(text);
    return jsYaml.dump(obj);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};

export const yamlToJson = (text) => {
  try {
    const obj = jsYaml.load(text);
    return JSON.stringify(obj, null, 2) || 'null';
  } catch (error) {
    throw new Error('Invalid YAML format');
  }
};

export const propertiesToYaml = (text) => {
  try {
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

    return jsYaml.dump(properties);
  } catch (error) {
    throw new Error('Invalid properties format');
  }
};

export const yamlToProperties = (text) => {
  try {
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
    return properties.join(lineEnding);
  } catch (error) {
    throw new Error('Invalid YAML format');
  }
};
