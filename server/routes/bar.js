var mongoose = require('mongoose');
var yelp = require('yelp-fusion');

module.exports = (app) => {
    app.post('/bars', function (req, res) {
        yelp.accessToken(req.webtaskContext.secrets.YELP_CLIENT_ID, req.webtaskContext.secrets.YELP_CLIENT_SECRET).then(response => {
            const client = yelp.client(response.jsonBody.access_token);
            client.search({
                term: 'bars',
                location: req.body.query
            }).then(response => {
                var bars = [];
                var results = response.jsonBody.businesses;
                for (var i = 0; i < results.length; i++) {
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
                        req.barModel.find({ yelpId: bar.yelpId }, function (err, barInDb) {
                            if (err) {
                                return reject(err);
                            }
                            if (barInDb.length) {
                                bar.visitors = barInDb[0].visitors;
                            }
                            resolve();
                        })
                    })
                });
                Promise.all(promises).then(function () {
                    res.json({ bars: bars });
                }).catch(e => res.json({ err: e.response.body }))
            }).catch(e => res.json({ err: e.response.body }));
        });
    });

    app.post('/visit/:bar', function (req, res) {
        req.barModel.find({ yelpId: req.body.yelpId }, function (err, bar) {
            if (err) {
                res.json({ err: err });
            }
            if (bar.length) {
                bar[0].name = req.body.name;
                bar[0].yelpId = req.body.yelpId;
                bar[0].image_url = req.body.image_url;
                bar[0].display_address = req.body.display_address;
                bar[0].display_phone = req.body.display_phone;
                bar[0].visitors = req.body.visitors;
                bar[0].save(function (err, barUpdated) {
                    if (err) {
                        res.json({ err: err });
                    } else {
                        res.json({ bar: barUpdated });
                    }
                });
            } else {
                req.barModel.create(req.body, function (err, barCreated) {
                    if (err) {
                        res.json({ err: err });
                    } else {
                        res.json({ bar: barCreated });
                    }
                });
            }
        });
    });

    app.post('/cancel/:bar', function (req, res) {
        req.barModel.find({ yelpId: req.body.yelpId }, function (err, bar) {
            if (err) {
                res.json({ err: err });
            } else {
                bar[0].visitors = req.body.visitors;
                bar[0].save(function (err, barUpdated) {
                    if (err) {
                        res.json({ err: err });
                    } else {
                        res.json({ bar: barUpdated });
                    }
                });
            }
        });
    });
}