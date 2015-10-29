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
		if (req.body.user) {
			User.stats(req.body.user, function(error) {
				if (error) {
					return res.status(400).send(error);
				} else {
					return res.send("Error getting user stats");
				}
			});
		} else {
			return res.status(400).send("Invalid request");
		}
	}

});