var spawn = require('child_process').spawn;
var slang = require('slang');

function quote(val) {
  // escape and quote the value if it is a string and this isn't windows
  if (typeof val === 'string' && process.platform !== 'win32')
    val = '"' + val.replace(/(["\\$`])/g, '\\$1') + '"';
    
  return val;
}

function weasyprint(input, options, callback) {
  if (!options) {
    options = {};
  } else if (typeof options == 'function') {
    callback = options;
    options = {};
  }
  
  var output = options.output;
  delete options.output;
    
  var keys = Object.keys(options)
  var args = [weasyprint.command];

  keys.forEach(function(key) {
    var val = options[key];
    
    key = key.length === 1 ? '-' + key : '--' + slang.dasherize(key);
  });
  
  var isUrl = /^(https?|file):\/\//.test(input);
  args.push(isUrl ? quote(input) : '-');    // stdin if HTML given directly
  args.push(output ? quote(output) : '-');  // stdout if no output file

  if (process.platform === 'win32') {
    var child = spawn(args[0], args.slice(1));
  } else {
    // this nasty business prevents piping problems on linux
    var child = spawn('/bin/sh', ['-c', args.join(' ') + ' | cat']);
  }
  
  // call the callback with null error when the process exits successfully
  if (callback)
    child.on('exit', function() { callback(null); });
    
  // setup error handling
  var stream = child.stdout;
  function handleError(err) {
    child.removeAllListeners('exit');
    child.kill();
    
    // call the callback if there is one
    if (callback)
      callback(err);
      
    // if not, or there are listeners for errors, emit the error event
    if (!callback || stream.listeners('error').length > 0)
      stream.emit('error', err);
  }
  
  child.once('error', handleError);
  child.stderr.once('data', function(err) {
    handleError(new Error((err || '').toString().trim()));
  });
  
  // write input to stdin if it isn't a url
  if (!isUrl)
    child.stdin.end(input);
  
  // return stdout stream so we can pipe
  return stream;
}

weasyprint.command = 'weasyprint';
module.exports = weasyprint;
