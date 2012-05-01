var Mongolian = require('mongolian')
  , _ = require('underscore')
  , sys = require('sys')
  , path = require('path')
  , exec = require('child_process').exec;

function topN(num, cb) {
  var server = new Mongolian;
  var db = server.db('asterank');
  var coll = db.collection('asteroids');
  coll.find().limit(num).sort({score:-1}).toArray(function(err, docs) {
    if (err) {
      cb(true, null);
      return;
    }
    var result = _.map(docs, function(doc) {
      return _.pick(doc, 'score', 'saved', 'price', 'closeness', 'GM', 'spec_B', 'full_name',
                      'moid', 'neo', 'pha', 'diameter');
    });
    cb(null, result);
  });
}

function count(cb) {
  var server = new Mongolian;
  var db = server.db('asterank');
  var coll = db.collection('asteroids');
  coll.count(function(err, count) {
    if (err) {
      cb(true, null);
      return;
    }
    cb(null, count);
  });
}

function query(query, cb) {
  // query JPL database for full information, but cache it

  if (!/^[a-z0-9 ]+$/.test(query)) {
    cb(true, null);
    return;
  }

  var child = exec(path.join(__dirname, '../calc/jpl_lookup.py') + ' ' + query,
               function (error, stdout, stderr) {
    if (error) {
      cb(true, null);
    }
    else {
      cb(null, JSON.parse(stdout));
    }
  });
}

module.exports = {
  topN: topN,
  count: count,
  query: query,

}
