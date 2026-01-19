#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const { fetchArticle } = require('../lib/fetcher');
const { parseArticle } = require('../lib/parser');
const { generateHTML, generateFilename } = require('../lib/generator');
const logger = require('../lib/logger');

const packageJson = require('../package.json');

program
  .name('reader-cli')
  .description('Firefox Reader Mode CLI - Extract and save articles as clean, readable HTML')
  .version(packageJson.version)
  .argument('<urls...>', 'One or more URLs to process')
  .option('-o, --output <file>', 'Output filename (only for single URL)')
  .option('-t, --theme <theme>', 'Theme: light, dark, sepia, gray, contrast', 'light')
  .option('-v, --verbose', 'Verbose output')
  .option('--debug', 'Debug output with detailed information')
  .action(async (urls, options) => {
    if (options.debug) {
      logger.setDebug(true);
    } else if (options.verbose) {
      logger.setVerbose(true);
    }

    const validThemes = ['light', 'dark', 'sepia', 'gray', 'contrast'];
    if (!validThemes.includes(options.theme)) {
      logger.error(`Invalid theme: ${options.theme}`);
      logger.info(`Valid themes: ${validThemes.join(', ')}`);
      process.exit(1);
    }

    if (urls.length > 1 && options.output) {
      logger.warn('--output option ignored for multiple URLs');
    }

    logger.debug(`Processing ${urls.length} URL(s)`);
    logger.debug(`Theme: ${options.theme}`);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const urlNum = urls.length > 1 ? `[${i + 1}/${urls.length}] ` : '';

      try {
        logger.info(`${urlNum}Processing: ${url}`);

        const { document, url: finalUrl } = await fetchArticle(url);

        const article = parseArticle(document, finalUrl);

        const html = generateHTML(article, options.theme);

        const filename = generateFilename(
          article,
          urls.length === 1 ? options.output : null
        );

        fs.writeFileSync(filename, html, 'utf8');

        logger.success(`${urlNum}Saved: ${filename}`);
        logger.verbose(`  Title: ${article.title}`);
        logger.verbose(`  Reading time: ${article.readingTime}`);

        successCount++;
      } catch (err) {
        logger.error(`${urlNum}Failed: ${url}`);
        logger.error(`  ${err.message}`);
        if (options.debug) {
          logger.debug(err.stack);
        }
        failCount++;
      }
    }

    if (urls.length > 1) {
      logger.info('');
      logger.info(`Summary: ${successCount} succeeded, ${failCount} failed`);
    }

    process.exit(failCount > 0 ? 1 : 0);
  });

program.parse();
