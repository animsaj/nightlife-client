var mongoose = require('mongoose');

var BarSchema = new mongoose.Schema({
    name: String,
    yelpId: String,
    image_url: String,
    display_address: Array,
    display_phone: String,
    visitors: [String]
});

module.exports = mongoose.model('Bar', BarSchema)