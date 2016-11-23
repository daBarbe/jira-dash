var request = require('request'),
    moment = require('moment');

var self = {
    logTime: function(host, issue, startTime, endTime, username, password){
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
            "timeSpentSeconds": (endTime-startTime)/1000
        };

        request(options, function(error, response, body) {
            if (error) {
                console.log(error, null);
                return;
            }
            if (response.statusCode === 201) {
                console.log(null, "Success");
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
    }
};

module.exports = self;
