let verboseEnabled = false;
let debugEnabled = false;
let outputToStderr = false;

function setStderrOutput(enabled) {
  outputToStderr = enabled;
}

function getOutputFn(defaultFn) {
  if (outputToStderr) {
    return console.error;
  }
  return defaultFn;
}

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
    getOutputFn(console.log)(...args);
  }
}

function debug(...args) {
  if (debugEnabled) {
    getOutputFn(console.log)('[DEBUG]', ...args);
  }
}

function info(...args) {
  getOutputFn(console.log)(...args);
}

function error(...args) {
  console.error(...args);
}

function success(...args) {
  getOutputFn(console.log)('✓', ...args);
}

function warn(...args) {
  getOutputFn(console.warn)('⚠', ...args);
}

module.exports = {
  setStderrOutput,
  setVerbose,
  setDebug,
  verbose,
  debug,
  info,
  error,
  success,
  warn
};
