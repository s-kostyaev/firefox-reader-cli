let verboseEnabled = false;
let debugEnabled = false;

function setVerbose(enabled) {
  verboseEnabled = enabled;
}

function setDebug(enabled) {
  debugEnabled = enabled;
  if (enabled) {
    verboseEnabled = true;
  }
}

function verbose(...args) {
  if (verboseEnabled) {
    console.log(...args);
  }
}

function debug(...args) {
  if (debugEnabled) {
    console.log('[DEBUG]', ...args);
  }
}

function info(...args) {
  console.log(...args);
}

function error(...args) {
  console.error(...args);
}

function success(...args) {
  console.log('✓', ...args);
}

function warn(...args) {
  console.warn('⚠', ...args);
}

module.exports = {
  setVerbose,
  setDebug,
  verbose,
  debug,
  info,
  error,
  success,
  warn
};
