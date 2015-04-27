var system = require('system');
var utils = require('./utils');

exports.getSteps = getSteps;

function getSteps(page, args) {
    if (args.action.actionName === 'get') {
        return [
            openMaconomy(page, args.baseUrl),
            login(page, args.username, args.password),
            goToDate(page, args.action.firstDateOfTimesheet),
            readTimesheetTable(page, args.action.firstDateOfTimesheet),
            logout(page)
        ];
    } else if (args.action.actionName === 'report') {
        return [
            openMaconomy(page, args.baseUrl),
            login(page, args.username, args.password),
            goToDate(page, args.action.firstDateOfTimesheet),
            enterValues(page, args.action.firstDateOfTimesheet, args.action.projects, args.action.deliver),
            goToDate(page, args.action.firstDateOfTimesheet),
            readTimesheetTable(page, args.action.firstDateOfTimesheet),
            logout(page)
        ];
    } else {
        utils.logError('Unknown action "' + (typeof args.action.actionName === 'undefined' || args.action.actionName == null ? 'undefined' : args.action.actionName) + '"');
        return [];
    }
}

function openMaconomy(page, baseUrl) {
    return function () {
        page.open(baseUrl + '/cgi-bin/Maconomy/MaconomyPortal.acando.S_MCS.exe/Framework/maconomyportalmain.msc?SSO=no');
    };
}

function goToDate(page, dateToGoTo) {
    return function () {
        var dateString = getDateString(dateToGoTo);
        goToComponentFrame(page);
        var couldGoToDate = evaluate(page, function (dateStringInner) {
            if (typeof window.scriptSrc === 'undefined') {
                return false;
            } else {
                window.scriptSrc.handleOnClickCardRaw('calendar', dateStringInner);
                return true;
            }
        }, dateString);
        return couldGoToDate;
    };
}

function enterValues(page, firstDateOfTimesheet, projects, deliver) {
    return function (done) {
        var events = [];
        var lastIndexPair = getLastIndexPair();

        if (lastIndexPair == null) {
            utils.logError('No time data supplied');
            done(false);
        }

        goToComponentFrame(page);
        injectJQuery(page);
        injectUtils(page);
        
        events.push({
            time: 500,
            run: function () {
                evaluate(page, function () {
                    /* Needed to get editing to work for some reason */
                    $('[id="wrapper:panes"]').click();
                });
            }
        });

        projects.forEach(addEventsForProject);
        
        var errorMessageWhenChecking = evaluate(page, evaluateCheckingTimesheet, firstDateOfTimesheet);

        if (errorMessageWhenChecking) {
            utils.logError(errorMessageWhenChecking);
            done(false);
            return;
        }

        var errorMessageWhenCreating = evaluate(page, evaluateCreateTimesheet, firstDateOfTimesheet);

        if (errorMessageWhenCreating) {
            utils.logError(errorMessageWhenCreating);
            done(false);
            return;
        }

        if (events.length > 0) {
            events.push({
                time: 50,
                run: function () {
                    if (deliver === true) {
                        var evalErrorMessage = evaluate(page, evaluateClickDeliverButton, firstDateOfTimesheet);
                        if (evalErrorMessage) {
                            throw new Error(evalErrorMessage);
                        }
                    }
                    /* Needed for last event to finish properly */
                }
            });
            setTimeout(function () {
                callEvent(0);
            }, events[0].time);
        } else {
            done(true);
            return;
        }

        function callEvent(index) {
            if (index >= events.length) {
                done(true);
                return;
            }
            var currentEvent = events[index];

            try {
                currentEvent.run();
            } catch (e) {
                utils.logError(e.message);
                done(false);
                return;
            }

            setTimeout(function () {
                callEvent(index + 1);
            }, currentEvent.time);
        }

        function getLastIndexPair() {
            var pair = {
                projectIndex: -1,
                dayIndex: -1
            };
            projects.forEach(function (project, projectIndex) {
                project.days.forEach(function (day, dayIndex) {
                    if (typeof day !== 'undefined' && day != null) {
                        pair.projectIndex = projectIndex;
                        pair.dayIndex = dayIndex;
                    }
                });
            });
            if (pair.projectIndex > -1 && pair.dayIndex > -1) {
                return pair;
            }
            return null;
        }

        function addEventsForProject(project, projectIndex) {
            var isFirstDayOfProject = true;

            project.days.forEach(addEventsForDay);

            function addEventsForDay(day, dayIndex) {

                if (typeof day == 'undefined' || day == null || day === '') {
                    return;
                }

                /* Focus on the input field */
                events.push({
                    /* Cannot be faster than 800ms because then editing fails */
                    time: isFirstDayOfProject ? 800 : 50,
                    run: function () {
                        var evalErrorMessage = evaluate(page, function (firstDateOfTimesheetInner, projectInner, dayIndexInner, dayInner) {
                            try {
                                var timesheet = window.utils.parseTimesheet(firstDateOfTimesheetInner);
                                var matchedRow = timesheet.findRow(projectInner.projectCode, projectInner.taskCode);
                                var matchedDay = matchedRow.getDayByIndex(dayIndexInner);
                                matchedDay.el.focus();
                                return null;
                            } catch (e) {
                                return e.message;
                            }
                        }, firstDateOfTimesheet, project, dayIndex, day);
                        if (evalErrorMessage) {
                            throw new Error(evalErrorMessage);
                        }
                    }
                });

                isFirstDayOfProject = false;

                /* Set value to input field */
                events.push({
                    time: 50,
                    run: function () {
                        var evalErrorMessage = evaluate(page, function (firstDateOfTimesheetInner, projectInner, dayIndexInner, dayInner) {
                            try {
                                var timesheet = window.utils.parseTimesheet(firstDateOfTimesheetInner);
                                var matchedRow = timesheet.findRow(projectInner.projectCode, projectInner.taskCode);
                                var matchedDay = matchedRow.getDayByIndex(dayIndexInner);
                                matchedDay.el.val(dayInner);
                                return null;
                            } catch (e) {
                                return e.message;
                            }
                        }, firstDateOfTimesheet, project, dayIndex, day);
                        if (evalErrorMessage) {
                            throw new Error(evalErrorMessage);
                        }
                    }
                });

                /* Send enter key to last input field */
                if (lastIndexPair.projectIndex === projectIndex && lastIndexPair.dayIndex === dayIndex) {
                    events.push({
                        time: 800,
                        run: function () {
                            var evalErrorMessage = evaluate(page, function (firstDateOfTimesheetInner, projectInner, dayIndexInner, dayInner) {
                                try {
                                    var timesheet = window.utils.parseTimesheet(firstDateOfTimesheetInner);
                                    var matchedRow = timesheet.findRow(projectInner.projectCode, projectInner.taskCode);
                                    var matchedDay = matchedRow.getDayByIndex(dayIndexInner);
                                    window.utils.sendEnterKeyPress(matchedDay.el);
                                    return null;
                                } catch (e) {
                                    return e.message;
                                }
                            }, firstDateOfTimesheet, project, dayIndex, day);
                            if (evalErrorMessage) {
                                throw new Error(evalErrorMessage);
                            }
                        }
                    });
                }
            }
        }
        
        function evaluateCheckingTimesheet(firstDateOfTimesheetInner) {
            try {
                var selectedWeekSpan = $('table.calendar span.selected');
                var currentDay = selectedWeekSpan.closest('tr').find('.days:contains("' + firstDateOfTimesheetInner.day + '")');
                
                if (currentDay.length === 1) {
                    return null;
                } else {
                    return 'Incorrect week selected';
                }
            } catch (e) {
                return e.message;
            }
        }

        function evaluateCreateTimesheet(firstDateOfTimesheetInner) {
            try {
                var timesheet = window.utils.parseTimesheet(firstDateOfTimesheetInner);
                var status = timesheet.getStatus();

                if (status !== 'default') {
                    return 'Cannot report for week. Timesheet status is \"' + status + '\"';
                }

                if (timesheet.getCanCreate()) {
                    timesheet.createButton.click();
                }
                return null;
            } catch (e) {
                return e.message;
            }
        }

        function evaluateClickDeliverButton(firstDateOfTimesheetInner) {
            try {
                var timesheet = window.utils.parseTimesheet(firstDateOfTimesheetInner);
                timesheet.deliverButton.click();
                return null;
            } catch (e) {
                return e.message;
            }
        }
    };
}

function readTimesheetTable(page, firstDateOfTimesheet) {
    return function (done) {
        var result;
        goToComponentFrame(page);
        injectJQuery(page);
        injectUtils(page);

        result = evaluate(page, evaluateTimesheet, firstDateOfTimesheet);

        if (typeof result === "string") {
            utils.logError(result);
            done(false);
        } else {
            utils.logResult(result);
        }

        done(true);

        function evaluateTimesheet(firstDateOfTimesheet) {
            try {
                var timesheet = window.utils.parseTimesheet(firstDateOfTimesheet);
                var returnValue = timesheet.toReturnValue();

                /*
                dumpTimesheet(returnValue);
                */
                
                return returnValue;

                /*
                function dumpTimesheet(sheet) {
                    console.log('canCreate:' + sheet.canCreate);
                    console.log('canDeliver:' + sheet.canDeliver);
                    console.log('status:' + sheet.status);
                    console.log(sheet.rows);
                    sheet.rows.forEach(function (row, index) {
                        console.log('***** ROW ' + index + ' *****');
                        console.log('projectCode:' + row.projectCode);
                        console.log('projectName:' + row.projectName);
                        console.log('customerName:' + row.customerName);
                        console.log('taskCode:' + row.taskCode);
                        console.log('taskName:' + row.taskName);
                        console.log('monday:' + row.monday);
                        console.log('tuesday:' + row.tuesday);
                        console.log('wednesday:' + row.wednesday);
                        console.log('thursday:' + row.thursday);
                        console.log('friday:' + row.friday);
                        console.log('saturday:' + row.saturday);
                        console.log('sunday:' + row.sunday);
                        console.log('total:' + row.total);
                        console.log('*****************');
                    });
                }
                */
            } catch (e) {
                return e.message;
            }
        }
    };
}

function login(page, username, password) {
    return function () {
        page.switchToFrame('mainwindow');
        var success = evaluate(page, function (usernameInner, passwordInner) {
            var nameOfUser = document.getElementsByName('nameofuser');
            if (typeof nameOfUser === 'undefined' || nameOfUser.length === 0) {
                return false;
            }
            nameOfUser[0].value = usernameInner;
            document.getElementsByName('password')[0].value = passwordInner;
            document.getElementsByName('logonform')[0].submit();
            return true;
        }, username, password);
        if (success === false) {
            utils.logError('Could not load page ' + page.url);
        }
        return success;
    };
}

function logout(page) {
    return function () {
        goToMainWindow(page);
        var navFrameName = evaluate(page, function () {
            var iframes = document.getElementsByTagName('frame');
            if (iframes.length <= 1) {
                utils.logError('Unable to find navigation frame');
                return false;
            }
            return iframes.item(1).name;
        });
        page.switchToFrame(navFrameName);
        injectJQuery(page);
        var errorMessage = evaluate(page, function () {
            var logoutLink = $('.headermenu').last();
            if (logoutLink.length !== 1) {
                return 'Unable to find logout link';
            }
            logoutLink[0].onclick();
            return null;
        });

        if (errorMessage) {
            utils.logError(errorMessage);
            return false;
        }
    };
}

function dumpPage(page, name) {
    return function () {
        page.render(name || 'dump.png');
    };
}

function injectJQuery(page) {
    page.injectJs('jquery-2.1.3.min.js');
}

function injectUtils(page) {
    page.injectJs('clientUtils.js');
}

function goToMainWindow(page) {
    while (typeof page.switchToParentFrame === 'function' && page.switchToParentFrame()) { }
    page.switchToFrame('mainwindow');
}

function goToComponentFrame(page) {
    goToMainWindow(page);
    page.switchToFrame('portalmain');
    page.switchToFrame(4);
    page.switchToFrame('componentframe');
}

function getDateString(date) {
    return date.year + '.' + padLeft(date.month, 2) + '.' + padLeft(date.day, 2);
}

function padLeft(text, totalChars, padChar) {
    return Array(totalChars - String(text).length + 1).join(padChar || '0') + text;
}

function evaluate(page, func) {
    var args = [].slice.call(arguments, 2);
    var fn = "function() { return (" + func.toString() + ").apply(this, " + JSON.stringify(args) + ");}";
    return page.evaluate(fn);
}
