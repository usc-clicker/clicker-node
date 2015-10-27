/**
 * User
 *
 * @module      :: Model
 * @description :: This is the base user model
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = {

  attributes: require('waterlock').models.user.attributes({
    
    enrolledIn: {
      collection: 'string'
    }
    
  }),
  
  beforeCreate: require('waterlock').models.user.beforeCreate,
  beforeUpdate: require('waterlock').models.user.beforeUpdate,

  enroll: function (options, cb) {

    User.findOne(options.id).exec(function (err, theUser) {
      if (err) return cb(err);
      if (!theUser) return cb(new Error('User not found.'));
      theUser.enrolledIn.add(options.courses);
      theUser.save(cb);
    });
  }

};
