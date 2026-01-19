const { Readability } = require('@mozilla/readability');
const logger = require('./logger');

const READING_SPEEDS = {
  en: { cpm: 987, variance: 118 },
  ar: { cpm: 612, variance: 88 },
  de: { cpm: 920, variance: 86 },
  es: { cpm: 1025, variance: 127 },
  fi: { cpm: 1078, variance: 121 },
  fr: { cpm: 998, variance: 126 },
  he: { cpm: 833, variance: 130 },
  it: { cpm: 950, variance: 140 },
  ja: { cpm: 357, variance: 56 },
  nl: { cpm: 978, variance: 143 },
  pl: { cpm: 916, variance: 126 },
  pt: { cpm: 913, variance: 145 },
  ru: { cpm: 986, variance: 175 },
  sl: { cpm: 885, variance: 145 },
  sv: { cpm: 917, variance: 156 },
  tr: { cpm: 1054, variance: 156 },
  zh: { cpm: 255, variance: 29 }
};

function calculateReadingTime(textLength, lang = 'en') {
  const speed = READING_SPEEDS[lang] || READING_SPEEDS.en;
  const cpmLow = speed.cpm - speed.variance;
  const cpmHigh = speed.cpm + speed.variance;

  const minsSlow = Math.ceil(textLength / cpmLow);
  const minsFast = Math.ceil(textLength / cpmHigh);

  if (minsFast === minsSlow) {
    return `~${minsFast} min read`;
  }
  return `${minsFast}-${minsSlow} min read`;
}

function parseArticle(document, url) {
  logger.verbose('Parsing article content...');

  const documentClone = document.cloneNode(true);
  const reader = new Readability(documentClone, {
    debug: false,
    maxElemsToParse: 0,
    nbTopCandidates: 5,
    charThreshold: 500
  });

  const article = reader.parse();

  if (!article) {
    throw new Error('Failed to parse article - content may not be suitable for reader mode');
  }

  logger.debug(`Article parsed: "${article.title}"`);
  logger.debug(`Content length: ${article.length} characters`);
  logger.debug(`Text length: ${article.textContent.length} characters`);

  const readingTime = calculateReadingTime(
    article.textContent.length,
    article.lang || 'en'
  );

  return {
    title: article.title,
    byline: article.byline,
    content: article.content,
    textContent: article.textContent,
    length: article.length,
    excerpt: article.excerpt,
    siteName: article.siteName,
    lang: article.lang,
    readingTime,
    url
  };
}

module.exports = { parseArticle };
