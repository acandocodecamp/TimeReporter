window.utils = {};
window.utils.parseTimesheet = function (firstDateOfTimesheet) {
    var timesheetTable = $('#timeSheetTable');
    var rows;
    var timesheet;
    var dateCell;

    if (timesheetTable.length === 0) {
        throw new Error('Unable to find timesheet table');
    }
    timesheet = {
        rows: []
    };
    rows = timesheetTable.find('>tbody>tr:not(:first)');
    $.each(rows, function (index, row) {
        timesheet.rows.push(parseRow(row));
    });

    timesheet.createButton = $('[name="timeSheetCard:createTimeSheet"]');
    timesheet.deliverButton = $('[name="timeSheetCard:MSE_PrelNormControl"]');
    timesheet.getCanCreate = function () { return timesheet.createButton.is(':disabled') === false; };
    timesheet.getCanDeliver = function () { return timesheet.deliverButton.is(':disabled') === false; };

    dateCell = $('.calendar .clickable:contains("' + firstDateOfTimesheet.day + '")').filter(function () {
        return $(this).html() === firstDateOfTimesheet.day.toString();
    }).parents('td:first');

    timesheet.getStatus = function () {
        var status = 'default';
        if (dateCell.hasClass('approved')) {
            status = 'approved';
        } else if (dateCell.hasClass('submitted')) {
            status = 'submitted';
        }
        return status;
    };

    timesheet.toReturnValue = toReturnValue;
    timesheet.findRow = findRow;

    return timesheet;

    function toReturnValue() {
        return {
            canCreate: timesheet.getCanCreate(),
            canDeliver: timesheet.getCanDeliver(),
            status: timesheet.getStatus(),
            rows: timesheet.rows.map(function (row) {
                return {
                    projectCode: row.projectCode.getValue(),
                    projectName: row.projectName.getValue(),
                    customerName: row.customerName.getValue(),
                    taskCode: row.taskCode.getValue(),
                    taskName: row.taskName.getValue(),
                    monday: row.monday.getValue(),
                    tuesday: row.tuesday.getValue(),
                    wednesday: row.wednesday.getValue(),
                    thursday: row.thursday.getValue(),
                    friday: row.friday.getValue(),
                    saturday: row.saturday.getValue(),
                    sunday: row.sunday.getValue(),
                    total: row.total.getValue()
                };
            })
        };
    }

    function parseRow(row) {
        var cells = $(row).find('>td');
        var projectCode = {
            el: getInput(cells, 1),
            getValue: function () { return getValue(cells, 1); }
        };
        var projectName = {
            el: getInput(cells, 2),
            getValue: function () { return getValue(cells, 2); }
        };
        var customerName = {
            el: getInput(cells, 3),
            getValue: function () { return getValue(cells, 3); }
        };
        var taskCode = {
            el: getInput(cells, 4),
            getValue: function () { return getValue(cells, 4); }
        };
        var taskName = {
            el: getInput(cells, 5),
            getValue: function () { return getValue(cells, 5); }
        };
        var monday = {
            el: getInput(cells, 6),
            getValue: function () { return getValue(cells, 6); }
        };
        var tuesday = {
            el: getInput(cells, 7),
            getValue: function () { return getValue(cells, 7); }
        };
        var wednesday = {
            el: getInput(cells, 8),
            getValue: function () { return getValue(cells, 8); }
        };
        var thursday = {
            el: getInput(cells, 9),
            getValue: function () { return getValue(cells, 9); }
        };
        var friday = {
            el: getInput(cells, 10),
            getValue: function () { return getValue(cells, 10); }
        };
        var saturday = {
            el: getInput(cells, 11),
            getValue: function () { return getValue(cells, 11); }
        };
        var sunday = {
            el: getInput(cells, 12),
            getValue: function () { return getValue(cells, 12); }
        };
        var total = {
            el: getInput(cells, 13),
            getValue: function () { return getValue(cells, 13); }
        };
        return {
            projectCode: projectCode,
            projectName: projectName,
            customerName: customerName,
            taskCode: taskCode,
            taskName: taskName,
            monday: monday,
            tuesday: tuesday,
            wednesday: wednesday,
            thursday: thursday,
            friday: friday,
            saturday: saturday,
            sunday: sunday,
            total: total,
            getDayByIndex: function (dayIndex) {
                if (dayIndex === 0) {
                    return monday;
                } else if (dayIndex === 1) {
                    return tuesday;
                } else if (dayIndex === 2) {
                    return wednesday;
                } else if (dayIndex === 3) {
                    return thursday;
                } else if (dayIndex === 4) {
                    return friday;
                } else if (dayIndex === 5) {
                    return saturday;
                } else if (dayIndex === 6) {
                    return sunday;
                }
                throw new Error('Day out of index "' + dayIndex + '"');
            }
        };
    }

    function getInput(cells, index) {
        return cells.eq(index).find('input:first');
    }

    function getValue(cells, index) {
        return getInput(cells, index).attr('title');
    }

    function findRow(projectCode, taskCode) {
        var matchedRow = timesheet.rows.find(function (row) {
            return row.projectCode.getValue() === projectCode && row.taskCode.getValue() === taskCode;
        });

        if (typeof matchedRow === 'undefined' || matchedRow == null || matchedRow.length === 0) {
            throw new Error('Unable to find project and task "' + projectCode + '/' + taskCode + '"');
        }

        return matchedRow;
    }
};

window.utils.sendEnterKeyPress = function (el) {
    var e = jQuery.Event('keypress');
    e.which = 13;
    e.keyCode = 13;
    el.trigger(e);
};

window.utils.waitFor = function (testFunc, readyFunc, timeoutMs) {
    var maxtimeOutMillis = timeoutMs ? timeoutMs : 3000;
    var start = new Date().getTime();
    var condition = false;
    var interval = setInterval(function () {
        if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
            try {
                condition = (typeof (testFunc) === "string" ? eval(testFunc) : testFunc());
            }
            catch (e) {
                clearInterval(interval);
                throw new Error("test function failed: " + e.message);
            }
        } else {
            if (!condition) {
                throw new Error("'waitFor()' timed out");
            } else {
                typeof (readyFunc) === "string" ? eval(readyFunc) : readyFunc();
                clearInterval(interval);
            }
        }
    }, 100);
};