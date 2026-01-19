const fs = require('fs');
const path = require('path');
const logger = require('./logger');

function loadTemplate(name) {
  const templatePath = path.join(__dirname, '..', 'templates', name);
  return fs.readFileSync(templatePath, 'utf8');
}

function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^(www\.|m\.|mobile\.)/, '');
  } catch (err) {
    logger.debug(`Domain extraction failed: ${err.message}`);
    return url;
  }
}

function sanitizeFilename(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

function simpleTemplateReplace(template, data) {
  let result = template;

  for (const [key, value] of Object.entries(data)) {
    const escapedValue = value || '';
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), escapedValue);
    result = result.replace(new RegExp(`{{{${key}}}}`, 'g'), escapedValue);
  }

  result = result.replace(/{{#byline}}[\s\S]*?{{\/byline}}/g, (match) => {
    return data.byline ? match.replace(/{{#byline}}|{{\/byline}}/g, '') : '';
  });

  return result;
}

function generateHTML(article, theme = 'light') {
  logger.verbose('Generating HTML...');

  const cssContent = loadTemplate('style.css');
  const htmlTemplate = loadTemplate('template.html');

  const domain = extractDomain(article.url);

  const templateData = {
    title: article.title || 'Untitled',
    byline: article.byline || '',
    content: article.content,
    url: article.url,
    domain: domain,
    readingTime: article.readingTime,
    theme: theme,
    css: cssContent
  };

  const html = simpleTemplateReplace(htmlTemplate, templateData);

  logger.debug('HTML generated successfully');
  return html;
}

function generateFilename(article, customFilename) {
  if (customFilename) {
    return customFilename.endsWith('.html') ? customFilename : `${customFilename}.html`;
  }

  const sanitized = sanitizeFilename(article.title);
  return `${sanitized}.html`;
}

module.exports = {
  generateHTML,
  generateFilename
};
