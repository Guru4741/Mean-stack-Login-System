const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../passport');
const { validateBody, schemas } = require('../helpers/routeHelpers'); 
const UsersController = require('../controllers/users');

router.route('/signup')
	  .post(validateBody(schemas.authSchema), UsersController.signUp);

router.route('/signin')
	  .post(validateBody(schemas.authSchema), passport.authenticate('local', { session: false }),UsersController.signIn);

router.route('/oauth/google')
	  .post(passport.authenticate('googleToken', { session: false }), UsersController.googleOAuth);

router.route('/secret')
	  .get(passport.authenticate('jwt', { session: false }), UsersController.secret);
router.route('/gitprofiles')
	  .get(UsersController.gitProfiles);

module.exports = router;

