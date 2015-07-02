var routes = require('routes')(),
    fs = require('fs'),
    db = require('monk')('localhost/music'),
    qs = require('qs'),
    mime = require('mime'),
    songs = db.get('songs'),
    view = require('mustache')




module.exports = routes
