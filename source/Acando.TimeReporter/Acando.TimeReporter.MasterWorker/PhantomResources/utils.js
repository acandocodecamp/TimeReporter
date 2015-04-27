var system = require('system');

exports.parseArgs = parseArgs;
exports.logError = logError;
exports.logResult = logResult;

function parseArgs() {
    var args = system.args;
    if (args.length < 4) {
        logError('Missing arguments');
        phantom.exit();
    }
    return {
        baseUrl: args[1],
        username: args[2],
        password: args[3],
        action: JSON.parse(args[4])
    };
};

function logError(message) {
    system.stderr.writeLine(JSON.stringify({ message: message }));
};

function logResult(data) {
    system.stdout.writeLine(JSON.stringify({ data: data }));
};