const LocalStrategy =require ('passport-local').Strategy;

const User=require('../app/models/user');

module.exports = function(passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
      });


      passport.deserializeUser(function (id, done) {
        User.findById(id)
          .then(function (user) {
            done(null, user);
          })
          .catch(function (err) {
            done(err, null);
          });
      });
//signup
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
},
async function (req, email, password, done) {
  try {
    const user = await User.findOne({ 'local.email': email });

    if (user) {
      return done(null, false, req.flash('signupMessage', 'The email is already taken'));
    } else {
      const newUser = new User();
      newUser.local.email = email;
      newUser.local.password = newUser.generateHash(password);

      await newUser.save();

      return done(null, newUser);
    }
  } catch (err) {
    return done(err);
  }
}));


   //login
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
function (req, email, password, done) {
  User.findOne({'local.email': email})
    .exec() // Utiliza .exec() para manejar la consulta
    .then((user) => {
      if (!user) {
        return done(null, false, req.flash('loginMessage', 'No User found  " TRY AGAIN "'));
      }
      if (!user.validPassword(password)) {
        return done(null, false, req.flash('loginMessage', 'Wrong password'));
      }
      return done(null, user);
    })
    .catch((err) => {
      return done(err);
    });
}));

    }
    
