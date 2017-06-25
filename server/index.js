var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var yelp = require('yelp-fusion');
var app = express();
var jwt = require('express-jwt');
var mongoose = require('mongoose');
var async = require('async');
var Bar = require('./models/bar');

mongoose.connect('mongodb://animsaj:jasmina1970@ds139122.mlab.com:39122/nightlife')

// parse application/json
app.use(bodyParser.json());

var jwtCheck = jwt({
  secret: '4Z3AB9N53iXcdtSbU3Zu_r5hqlLHg5VgKWaOoCmnI1wsTe-vbggxuIZo0j0wBOaT',
  audience: 'kKsSYp66OHAv29JhEP4xwoQ7qs2y80Bi'
});

app.use(cors());

app.get('/bars/:query', function (req, res) {
    yelp.accessToken('nnw3o9TS5SDBk4htLWjPQQ', 'XpADkm8eF9jc2rr5K8vd8rPy7tBKny8F53NRexLPxejvzSmSJjZf5aEyy8HY2aYf').then(response => {
    const client = yelp.client(response.jsonBody.access_token);
    client.search({
        term:'bars',
        location: req.params.query
    }).then(response => {
        var bars = [];
        var results = response.jsonBody.businesses;
        for(var i = 0; i < results.length; i++) {
            bars.push({
                name: results[i].name,
                yelpId: results[i].id,
                image_url: results[i].image_url,
                display_address: results[i].location.display_address,
                display_phone: results[i].display_phone,
                visitors: []
            })
        }
        var promises = bars.map(function (bar) {
            return new Promise(function (resolve, reject) {
                Bar.find({yelpId: bar.yelpId}, function (err, barInDb) {
                    if(err) {
                        return reject(err);
                    }
                    if(barInDb.length) {
                        bar.visitors = barInDb[0].visitors;
                    }
                    resolve();
                })
            })
        });
        Promise.all(promises).then(function () {
            res.json({bars: bars});
        }).catch(e => res.json({err: e}))
    }).catch(e => res.json({err: e.response.body}));
    });
});

app.post('/bars/visit/:bar', jwtCheck, function (req, res) {
    Bar.find({yelpId: req.body.yelpId}, function (err, bar) {
        if(err) {
            res.json({err: err});
        }
        if(bar.length) {
            bar[0].name = req.body.name;
            bar[0].yelpId = req.body.yelpId;
            bar[0].image_url = req.body.image_url;
            bar[0].display_address = req.body.display_address;
            bar[0].display_phone = req.body.display_phone;
            bar[0].visitors.push(req.user.name);
            bar[0].save(function (err, barUpdated) {
                if(err) {
                    res.json({err: err});
                } else {
                    res.json({bar: barUpdated});
                }
            });
        } else {
            Bar.create(req.body, function(err, barCreated) {
                if(err) {
                    res.json({err: err});
                } else {
                    res.json({bar: barCreated});
                }
            });
        }
    });
});

app.post('/bars/cancel/:bar', jwtCheck, function (req, res) {
    Bar.find({yelpId: req.body.yelpId}, function (err, bar) {
        if(err) {
            res.json({err: err});
        }
        bar[0].name = req.body.name;
        bar[0].yelpId = req.body.yelpId;
        bar[0].image_url = req.body.image_url;
        bar[0].display_address = req.body.display_address;
        bar[0].display_phone = req.body.display_phone;
        bar[0].visitors = bar[0].visitors.filter(visitor => visitor !== req.user.name);
        bar[0].save(function (err, barUpdated) {
            if(err) {
                res.json({err: err});
            } else {
                res.json({bar: barUpdated});
            }
        });
    });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
