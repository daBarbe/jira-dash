var dash_button = require('node-dash-button'),
    moment = require('moment'),
    prompt = require('prompt'),
    fs = require('fs'),
    config = require('./config.json'),
    router = require('./router');

var dash = dash_button(config.dash_mac_address),
    password = null,
    working = false,
    startTime = null;

prompt.get([{
    name: 'password',
    description: 'Enter your JIRA password',
    required: true,
    hidden: true,
    conform: function (value) {
        return true;
    }
},
{
    name: 'issue',
    description: 'Enter the issue ID ' + (config.issue ? '(' + config.issue + ')' : ''),
    required: true,
}], function (err, result) {
    password = result.password;
    config.issue = result.issue;
    fs.writeFile('config.json', JSON.stringify(config, null, 4));

    console.log('Enjoy your work on ' + config.issue);
});

dash.on('detected', function (){
    console.log('Dash Button Found');

    if (working) {
        working = false;
        var now = moment();
        router.logTime(config.host, config.issue, startTime, now, config.username, password);
    } else {
        working = true;
        startTime = moment();
    }
});
