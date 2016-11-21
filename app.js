var dash_button = require('node-dash-button'),
    prompt = require('prompt'),
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
}], function (err, result) {
    password = result.password;
});

dash.on('detected', function (){
    console.log('Dash Button Found');

    if (working) {
        working = false;
        var now = new Date;
        router.logTime(config.host, config.issue, startTime, now, config.username, password);
    } else {
        working = true;
        startTime = new Date;
    }
});
