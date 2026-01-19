const { JSDOM } = require('jsdom');
const logger = require('./logger');

async function fetchArticle(url) {
  logger.verbose(`Fetching: ${url}`);

  try {
    const dom = await JSDOM.fromURL(url, {
      userAgent: 'Mozilla/5.0 (compatible; Firefox-Reader-CLI/1.0)',
      referrer: url
    });

    logger.debug('DOM fetched successfully');
    logger.debug(`Document title: ${dom.window.document.title}`);

    return {
      document: dom.window.document,
      url: dom.window.location.href
    };
  } catch (err) {
    logger.debug(`Fetch error: ${err.message}`);
    throw new Error(`Failed to fetch URL: ${err.message}`);
  }
}

module.exports = { fetchArticle };
