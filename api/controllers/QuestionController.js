/**
 * QuestionController
 *
 * @description :: Server-side logic for managing Questions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	ask: function (req, res) {
		Question.ask(null, function(error) {
			if (error) {
				res.status(400).send(error);
			} else {
				return res.send("Push Sent");
			}
		});
  	},
};

