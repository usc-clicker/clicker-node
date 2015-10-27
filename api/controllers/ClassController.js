/**
 * ClassController
 *
 * @description :: Server-side logic for managing Classes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	import: function (req, res) {
		if (req.query.term) {
			Class.importFromAPI(req.query.term, function(error) {
				console.log(error);
			});
		} else {
			return res.status(400).send("Invalid request");
		}
	}
};

