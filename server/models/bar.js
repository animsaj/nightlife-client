var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    name: String,
    yelpId: String,
    image_url: String,
    display_address: Array,
    display_phone: String,
    visitors: [String]
});