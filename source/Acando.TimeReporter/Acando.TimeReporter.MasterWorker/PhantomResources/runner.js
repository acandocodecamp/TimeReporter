var system = require('system');
var utils = require('./utils');
var steps = require('./steps');
var stepIndex = 0;
var loadInProgress = false;
var asyncScriptRunning = false;

try {
    var args = utils.parseArgs();
    var page = new WebPage();
    var stepsToRun = steps.getSteps(page, args);

    page.onAlert = function (message) {
        if (message.indexOf('Denna anv') === 0) {
            utils.logError('Invalid username or password (3 failed tries will lock the account)');
        } else if (message.indexOf('Notera: Data anv') === 0) {
            utils.logError('Data is locked and read-only');
        } else {
            utils.logError(message);
        }
        close();
    };

    page.onError = function (message) {
        page.render('error.png');
        utils.logError(message);
    };

    /*
    page.onConsoleMessage = function (message) {
        console.log(message);
    };
    */

    page.onLoadStarted = function () {
        loadInProgress = true;
    };

    page.onLoadFinished = function () {
        loadInProgress = false;
    };

    interval = setInterval(function () {
        var currentStep;
        var stepSuccess;
        if (!loadInProgress && !asyncScriptRunning) {
            if (typeof stepsToRun[stepIndex] === 'function') {
                try {
                    currentStep = stepsToRun[stepIndex];
                    if (currentStep.length > 0) {
                        asyncScriptRunning = true;
                        currentStep(done);
                    } else {
                        stepSuccess = currentStep();
                        if (stepSuccess === false) {
                            close();
                        }
                    }
                } catch (e) {
                    utils.logError(e.message);
                    close();
                }
                stepIndex++;
            } else {
                clearInterval(interval);
                setTimeout(function () {
                    close();
                }, 100);
            }
        }
    }, 100);

    function done(stepSuccess) {
        if (stepSuccess === false) {
            clearInterval(interval);
            close();
        } else{
            asyncScriptRunning = false;
        }
    }
}
catch (e) {
    utils.logError(e.message);
    close();
}

function close() {
    if (page) {
        page.close();
    }
    phantom.exit();
}