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

	this.findAllIn = function(collection) {
		return new Promise(function(fulfill, reject) {
			try {	// nodemon crashes here sometimes (...?)
				db.collection(collection).find({}).toArray(function(err, doc) {
					if (err)
						reject(err);
					else
						fulfill(doc);
				});
			} catch(err) {
				console.log(err);
			}
		});
	};

	// this.findAllWhere = function(collection, query) {
	// 	return new Promise(function(fulfill, reject) {
	// 		db.collection(collection).find(query).toArray(function(err, doc) {
	// 			if (err)
	// 				reject(err);
	// 			else
	// 				fulfill(doc);
	// 		});
	// 	});
	// };

	this.findDocIn = function(collection, docId) {
		var o_id = new mongo.ObjectID(docId);
		return new Promise(function(fulfill, reject) {
			db.collection(collection).findOne({_id: o_id}, function(err, doc) {
				if (err)
					reject(err);
				else
					fulfill(doc);
			});
		});
	}
	
	this.insertDocInto = function(collection, obj) {
		return new Promise(function(fulfill, reject) {
			db.collection(collection).insertOne(obj, function(err, doc) {
				if(err)
					reject(err);
				else
					fulfill(doc);
			});
		});
	};

	this.replaceDocIn = function(collection, docId, obj) {
		var o_id = new mongo.ObjectID(docId);
		return new Promise(function(fulfill, reject) {
			db.collection(collection).update({_id: o_id}, obj, function(err, doc) {
				if (err)
					reject(err);
				else
					fulfill(doc);
			});
		});
	}

	return this;
};

