# Firefox Reader CLI

A standalone command-line tool that extracts article content from web pages and saves them as clean, readable HTML files using Firefox's Reader Mode technology.

## Features

- 🚀 Extract clean article content from any web page
- 🎨 Multiple themes (light, dark, sepia, gray, contrast)
- 📖 Reading time estimation
- 📦 Self-contained HTML output (no external dependencies)
- 🔄 Batch processing support
- 💬 Verbose and debug modes

## Installation

```bash
cd /path/to/reader-cli
npm install
chmod +x bin/reader.js

# Optional: make `reader-cli` available on your PATH
npm link
```

## Usage

### Basic Usage

```bash
./bin/reader.js https://example.com/article
```

Or, if you ran `npm link`:

```bash
reader-cli https://example.com/article
```

This will create a file named after the article title (e.g., `how-to-build-cli-tools.html`).

### Custom Output Filename

```bash
./bin/reader.js https://example.com/article -o my-article.html
```

### Choose a Theme

```bash
./bin/reader.js https://example.com/article -t dark
./bin/reader.js https://example.com/article -t sepia
```

Available themes: `light`, `dark`, `sepia`, `gray`, `contrast`

### Batch Processing

```bash
./bin/reader.js url1 url2 url3 -t dark
```

Each article will be saved with an auto-generated filename.

### Verbose Mode

```bash
./bin/reader.js https://example.com/article -v
```

Shows progress information including:
- Fetch status
- Article title
- Reading time

### Debug Mode

```bash
./bin/reader.js https://example.com/article --debug
```

Shows detailed debugging information including:
- DOM fetch details
- Parser output
- Error stack traces

## Examples

```bash
# Single article with custom filename
./bin/reader.js https://developer.mozilla.org/article -o mdn-article.html

# Multiple articles with dark theme
./bin/reader.js \
  https://blog.example.com/post1 \
  https://blog.example.com/post2 \
  -t dark -v

# Debug mode to troubleshoot parsing issues
./bin/reader.js https://example.com/article --debug
```

## Output

The generated HTML files are completely self-contained with:
- Inlined CSS (no external stylesheets)
- Article metadata (title, author, reading time)
- Clean, readable content
- Responsive design
- No JavaScript required

## Technology

This tool uses:
- [@mozilla/readability](https://www.npmjs.com/package/@mozilla/readability) - Mozilla's article extraction library
- [jsdom](https://github.com/jsdom/jsdom) - JavaScript implementation of web standards
- [commander](https://github.com/tj/commander.js) - Node.js command-line interface

## License

Mozilla Public License 2.0 (MPL-2.0)
