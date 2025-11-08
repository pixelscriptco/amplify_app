/**
 * Utility functions for URL replacement and management
 */

// CloudFront base URL
export const CLOUDFRONT_BASE_URL = 'https://d11s11f9nk48ol.cloudfront.net';

// Common S3 base URLs that might be used in the application
const S3_BASE_URLS = [
  'https://propbuilding.s3.ap-south-1.amazonaws.com'
];

/**
 * Replaces S3 URLs with CloudFront URLs
 * @param {string} url - The URL to process
 * @returns {string} - The URL with S3 base replaced by CloudFront base
 */
export const replaceS3WithCloudFront = (url) => {
  if (!url || typeof url !== 'string') {
    return url;
  }

  // Check if the URL contains any S3 base URL
  for (const s3BaseUrl of S3_BASE_URLS) {
    if (url.includes(s3BaseUrl)) {
      return url.replace(s3BaseUrl, CLOUDFRONT_BASE_URL);
    }
  }

  // If no S3 base URL found, return original URL
  return url;
};

/**
 * Replaces S3 URLs with CloudFront URLs in an object (recursively)
 * @param {Object|Array|string} data - The data to process
 * @returns {Object|Array|string} - The processed data with S3 URLs replaced
 */
export const replaceS3WithCloudFrontInObject = (data) => {
  if (!data) {
    return data;
  }

  if (typeof data === 'string') {
    return replaceS3WithCloudFront(data);
  }

  if (Array.isArray(data)) {
    return data.map(item => replaceS3WithCloudFrontInObject(item));
  }

  if (typeof data === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = replaceS3WithCloudFrontInObject(value);
    }
    return result;
  }

  return data;
};

/**
 * Checks if a URL is an S3 URL
 * @param {string} url - The URL to check
 * @returns {boolean} - True if the URL is an S3 URL
 */
export const isS3Url = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  return S3_BASE_URLS.some(s3BaseUrl => url.includes(s3BaseUrl));
};

/**
 * Gets the CloudFront URL for a given S3 URL
 * @param {string} s3Url - The S3 URL to convert
 * @returns {string|null} - The CloudFront URL or null if not an S3 URL
 */
export const getCloudFrontUrl = (s3Url) => {
  if (!isS3Url(s3Url)) {
    return null;
  }

  return replaceS3WithCloudFront(s3Url);
};

/**
 * Batch replace S3 URLs with CloudFront URLs in an array of URLs
 * @param {string[]} urls - Array of URLs to process
 * @returns {string[]} - Array of processed URLs
 */
export const batchReplaceS3WithCloudFront = (urls) => {
  if (!Array.isArray(urls)) {
    return urls;
  }

  return urls.map(url => replaceS3WithCloudFront(url));
};

/**
 * Utility function to process API response data and replace S3 URLs
 * This can be used as a response interceptor or data processor
 * @param {Object} responseData - The API response data
 * @returns {Object} - The processed response data
 */
export const processApiResponse = (responseData) => {
  return replaceS3WithCloudFrontInObject(responseData);
};

// Default export for convenience
export default {
  CLOUDFRONT_BASE_URL,
  replaceS3WithCloudFront,
  replaceS3WithCloudFrontInObject,
  isS3Url,
  getCloudFrontUrl,
  batchReplaceS3WithCloudFront,
  processApiResponse
};
