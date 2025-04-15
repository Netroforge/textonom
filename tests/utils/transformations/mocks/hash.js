// Mock implementation of hash.js for testing
import crypto from 'crypto';

export const md5Hash = (text) => {
  return crypto.createHash('md5').update(text).digest('hex');
};

export const sha1Hash = (text) => {
  return crypto.createHash('sha1').update(text).digest('hex');
};

export const sha256Hash = (text) => {
  return crypto.createHash('sha256').update(text).digest('hex');
};
