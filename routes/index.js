var cron = require('node-cron');
var express = require('express');
var fs = require("fs");
var https = require("https");
var router = express.Router();
var imgurData;
var count = -1;

// cron.schedule('0 0 1 * *', function () {
fs.readFile('/etc/sjtekcontrol/imgur/config.json', function (err, content) {
    if (err) {
        console.log('Config error: ' + err);
        return;
    }
    var clientSecret = JSON.parse(content).clientSecret;
    console.log('Updating Imgur data');

    var req = https.request({
        host: 'api.imgur.com',
        port: 443,
        path: '/3/gallery/random/random/0',
        headers: {
            'Authorization': 'Client-ID ' + clientSecret
        },
        json: true
    }, function (res) {
        res.setEncoding('utf8');
        var body = '';
        res.on('data', function (data) {
            body += data;
        });

        res.on('end', function () {
            imgurData = JSON.parse(body);
        })
    });
    req.end();

});
// }, true);

router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/imgur', function (req, res, next) {

    if (!imgurData) {
        var err = new Error('Imgur error');
        err.status = 500;
        next(err);
        return;
    }

    var images = imgurData.data;
    count++;

    if (count >= images.length) count = 0;
    var imageId = count;
    res.render('image', {imageUrl: images[imageId].link, title: images[imageId].title});
});

router.get('/api/imgur', function (req, res, next) {
    if (!imgurData) {
        var err = new Error('Imgur error');
        err.status = 500;
        next(err);
        return;
    }
    res.json(imgurData.data);
});

router.get('/api/imgur/:id', function (req, res, next) {
    if (!imgurData) {
        var err = new Error('Imgur error');
        err.status = 500;
        next(err);
        return;
    }
    res.json(imgurData.data[req.params.id]);
});

module.exports = router;
