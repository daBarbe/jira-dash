const
    request = require('request'),
    moment = require('moment'),
    notifier = require('node-notifier'),
    path = require('path'),
    config = require('./config.json');

require("moment-duration-format");

var
    working = false,
    startTime = null

var self = {
    doAction: function (password) {
        if (working) {
            working = false;
            var now = moment();

            var timeSpentSeconds = Math.max(60, now.diff(startTime, 'seconds'));
            var timeSpentHours = moment.duration(timeSpentSeconds, "seconds").format("h [hrs], m [min]");

            self.notify('You logged ' + timeSpentHours + ' on issue ' + config.issue);
            self.logTime(config.host, config.issue, startTime, timeSpentSeconds, config.username, password);
        } else {
            working = true;
            startTime = moment();
            self.notify('Started tracking time on issue ' + config.issue);
        }
    },
    logTime: function(host, issue, startTime, timeSpentSeconds, username, password){
        var options = {
            uri: 'https://' + host + '/rest/api/2/issue/' + issue + '/worklog',
            method: 'POST',
            json: true
        };
        options.auth = {
            'user': username,
            'pass': password
        };

        options.body = {
            "comment": "Logged with JiraDash.",
            "started": startTime.format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
            "timeSpentSeconds": timeSpentSeconds
        };

        request(options, function(error, response, body) {
            if (error) {
                console.log(error, null);
                return;
            }
            if (response.statusCode === 201) {
                console.log("Success");
                return;
            }
            if (response.statusCode === 400) {
                console.log("Invalid Fields: " + JSON.stringify(body));
                return;
            }
            if (response.statusCode === 403) {
                console.log("Insufficient Permissions");
                return;
            }
        });
    },
    notify: function (message) {
        notifier.notify({
          title: 'JiraDash',
          message: message,
          icon: path.join(__dirname, 'assets/jira_icon.png'), // Absolute path (doesn't work on balloons)
          sound: true, // Only Notification Center or Windows Toasters
          wait: true // Wait with callback, until user action is taken against notification
        }, function (err, response) {
          // Response is response from notification
        });
    }
};

module.exports = self;
