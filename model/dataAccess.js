var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var Promise = require('promise');
var debug = require('debug')('App');
var f = require('util').format;

module.exports = function(config) {
	var baseUrl = config.database.url + ':' + config.database.port + '/' + config.database.db;
	var user = encodeURIComponent(config.database.username);
	var password = encodeURIComponent(config.database.password);
	var authMechanism = 'DEFAULT';
	var authSource = config.database.authSource;
	this.db = null;

	var url = f('mongodb://%s:%s@%s?authMechanism=%s&authSource=%s', user, password, baseUrl, authMechanism, authSource);
	debug('Connecting to database: ', url);
	
	mongoClient.connect(url, function(err, db) {
  		if(err) {
  			debug("Database connection error. Cannot connect to " + baseUrl + "(user" + user + ")");
  			throw err;
  			return null;
  		}
  		debug("Database connected");
		this.db = db;
	});

	this.getDb = function() {
		return this.db;
	};

	// this.testFind = function() {
	// 	return new Promise(function(fulfill, reject) {
	// 		db.collection('test').findOne({},function(err, doc) {
	// 			if (err)
	// 				reject(err);
	// 			else
	// 				fulfill(doc);
	// 		});
	// 	});
	// };

	// this.testCount = function() {
	// 	return new Promise(function(fulfill, reject) {
	// 		db.collection('test').count(function(err, count) {
	// 			if (err)
	// 				reject(err);
	// 			else
	// 				fulfill(count);
	// 		});
	// 	});
	// }

	this.findSources = function() {
		return new Promise(function(fulfill, reject) {
			db.collection('sources').find({}).toArray(function(err, doc) {
				if (err)
					reject(err);
				else
					fulfill(doc);
			});
		});
	};

	this.findSource = function(srcId) {
		var o_id = new mongo.ObjectID(srcId);
		return new Promise(function(fulfill, reject) {
			db.collection('sources').findOne({_id: o_id}, function(err, doc) {
				if (err)
					reject(err);
				else
					fulfill(doc);
			});
		});
	};

	this.insertNewSource = function(obj) {
		return new Promise(function(fulfill, reject) {
			console.log(obj);
			db.collection('sources').insertOne(obj, function(err, doc) {
				if(err)
					reject(err);
				else
					fulfill(doc);
			});
		});
	};

	return this;
	
};

