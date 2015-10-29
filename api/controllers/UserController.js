/**
 * UserController.js 
 * 
 * @module      :: Controller
 * @description :: Provides the base user
 *                 actions used to make waterlock work.
 *                 
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = require('waterlock').actions.user({
  
	stats: function(req,res) {
		if (req.query.user) {
			User.stats(req.query.user, function(error, results) {
				if (error) {
					return res.status(400).send(error);
				} else {
					console.log("results");
					console.log(results);
					return res.send(results);
				}
			});
		} else {
			return res.status(400).send("Invalid request");
		}
	}

});