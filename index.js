const http = require('http');

var deathOnline = false;
var pkOnline = false;
var lastTime = new Date();

var useCount = 0;
var currentCommand = 0;
var abusedTime;
//92519180972072960
var DiscordClient = require('discord.io');
var bot = new DiscordClient({
    autorun: true,
    email: "rlai816@gmail.com",
    password: "reallyfast1",
    //OR 
    token: ""
});
 
bot.on('ready', function() {
    console.log(bot.username + " - (" + bot.id + ")");
    console.log(lastTime);
    bot.setPresence({
        game: "in the snow"
    });
});

bot.on('presence', function(user, userID, status, gameName, rawEvent) {
    console.log(user);
    console.log(status);
    if (userID == 92519180972072960) {
        if (deathOnline == false && status == 'online'){
            deathOnline = true;
            bot.sendMessage({
                to: '88797945012432896',
                message: 'xxdeathx is online'
            });
        }
        else if (deathOnline == true && status == 'offline'){
            deathOnline = false;
            bot.sendMessage({
                to: '88797945012432896',
                message: 'xxdeathx is offline'
            });
        }
    }
    if (userID == 92723160922722304) {
        if (pkOnline == false && status == 'online'){
            pkOnline = true;
            bot.sendMessage({
                to: '88797945012432896',
                message: 'pkk is online'
            });
        }
        else if (pkOnline == true && status == 'offline'){
            pkOnline = false;
            bot.sendMessage({
                to: '88797945012432896',
                message: 'pkk is offline'
            });
        }
    }
});
 
bot.on('message', function(user, userID, channelID, message, rawEvent) {
    console.log(user);
    console.log(message);
    if (userID == bot.id) { return; }
    if (userID == 88797945012432896) {
        if (/^!pk$/.test(message)) {
            bot.sendMessage({
                to: channelID,
                message: '<@92723160922722304>'
            });
        }
        if (/^!deps$/.test(message)) {
            bot.sendMessage({
                to: channelID,
                message: '<@94216323264937984>'
            });
        }
        if (/^!xd$/.test(message)) {
            bot.sendMessage({
                to: channelID,
                message: '<@92519180972072960>'
            });
        }
    }
    if (message == '<@135220585725689857>'){
        bot.sendMessage({
            to: channelID,
            message: '<@' + userID + '>'
        });
    }
    if (/^[Aa][Yy]{2,}$/.test(message)) {
        bot.sendMessage({
            tts: true,
            to: channelID,
            message: 'lmao'
        });
    }
    if (/^h((ell(o+))|(i+))(([.!~?]*$)|([,\s]*((little)|<@135220585725689857> )[.!~]*$))/i.test(message)){
        bot.sendMessage({
            to: channelID,
            message: 'Hello, <@' + userID + '>'
        });
    }
    if (/fuck ((you)|(u))/i.test(message)){
        bot.sendMessage({
            to: channelID,
            message: 'Fuck you too, <@' + userID + '>'
        });
    }
    if (/^(usa\s*)+$/.test(message)){
        bot.sendMessage({
            to: channelID,
            message: ':us:'
        });
    }
    if (/^!roll/.test(message)){
        var max = 100;
        if (/^!roll [0-9]+$/.test(message)){
            max = message.split(' ')[1];
        }
        bot.sendMessage({
            to: channelID,
            message: Math.floor((Math.random() * max) + 1)
        });
    }
    // if (message == 'Give me a random visual novel.'){
    //     var options = {
    //       host: 'vndb.org',
    //       port: 80,
    //       path: '/v/rand',
    //       method: 'POST'
    //     };

    //     http.request(options, function(res) {
    //       console.log('STATUS: ' + res.statusCode);
    //       console.log('HEADERS: ' + JSON.stringify(res.headers));
    //       res.setEncoding('utf8');
    //       res.on('data', function (chunk) {
    //         console.log('BODY: ' + chunk);
    //       });
    //     }).end();
    // }
});