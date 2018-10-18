const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const { JWT_SECRET } = require('./config/keys');
const User = require('./models/users');

//JSON Web Tokens Strategy
passport.use(new JwtStrategy({
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: JWT_SECRET
}, async (payload, done) => {
	try{
		//Find the user specified in token
		const user = await User.findById(payload.sub);

		//If user doesn't exists, handle it
		if(!user){
			return done(null, false);
		}

		//Otherwise return the user
		done(null, user);
	} catch(error){
		done(error, false)
	}
})); 

//Google Oauth Strategy
passport.use("googleToken", new GooglePlusTokenStrategy({
	clientID: '103811259743-a8ipi7a6nmja7que9b23coq0pvd68b8u.apps.googleusercontent.com',
	clientSecret: 'rPYN9JwmujAIkWy-INLTBS76'
}, async (accessToken, refreshToken, profile, done) => {

	try{
		//Check whether this current user exists in our DB
		const existingUser = await User.findOne({ "google.id" : profile.id});
		if(existingUser){
			console.log('User already exists in our database');
			return done(null, existingUser);
		}

		console.log('User doesn\'t exists, we are creating a new one');
		//If new Account
		const newUser = new User({
			method: 'google',
			google: {
				id: profile.id,
				email: profile.emails[0].value
			}
		});

		await newUser.save();
		done(null, newUser);
	} catch(error){
		done(error, false, error.message);	
	}

	//Check whether this current user exists in our DB
	const existingUser = await User.findOne({ "google.id" : profile.id});
	if(existingUser){
		return done(null, existingUser);
	}

	//If new Account
	const newUser = new User({
		method: 'google',
		google: {
			id: profile.id,
			email: profile.emails[0].value
		}
	});

	await newUser.save();
	done(null, newUser);
}))

//Local Strategy
passport.use(new LocalStrategy({
	usernameField: 'email'
}, async (email, password, done) => {
	try{
		//Find the user given the email
		const user = await User.findOne({ "local.email" : email });

		//If not, handle it
		if(!user){
			return done(null, false);
		}

		//Check if the password is correct
		const isMatch = await user.isValidPassword(password);

		//If not, handle it
		if(!isMatch){
			return done(null, false)
		}

		//Otherwise return the user
		done(null, user);
	} catch(error){
		done(error, false);
	}
	
}))























