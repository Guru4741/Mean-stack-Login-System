const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');
const User = require('../models/users')
const fetch = require('node-fetch');

signToken = user => {
	return JWT.sign({
			iss: 'NodeAuthentication',
			sub: user._id,
			iat: new Date().getTime(),
			exp: new Date().setDate(new Date().getDate() + 1)
		}, JWT_SECRET);
}

module.exports = {
	signUp: async (req,res,next) => {
		console.log('SignUp called')
		console.log(req.body);
		const { email,password } = req.value.body;
		
		//check if the user already exists
		const foundUser = await User.findOne({ "local.email" : email });
		if(foundUser){
			return res.status(403).send({error: 'Email is already in used'})
		}
		//Create a new user
		const newUser = new User({ 
			method: 'local',
			local: {
				email: email,
				password: password
			}		
		});
		await newUser.save();
		
		//Generate the Token
		const token = signToken(newUser);

		//Respond with token
		//res.json({user: 'created'});
		

		res.status(200).json({ token });
	},
		signIn: async (req,res,next) => {
			//Generate Token
			const token = signToken(req.user);
			res.status(200).json({ token });
			console.log('SignIn called');
			//console.log(req.body);
	},
		googleOAuth: async (req, res, next) => {
			//Generate Token
			console.log('req.user', req.user);
			const token = signToken(req.user);
			res.status(200).json({ token });
		},

		secret: async (req,res,next) => {
			console.log('secret called')
			//res.json({secret : "Access Granted"})

			fetch('https://api.github.com/search/users?q=eric')
				.then(response => response.json())
				.then(data => {
					console.log(data)
					res.json(data)
				})
	},

		gitProfiles: async (req, res, next) => {
			console.log('GitProflies');
			res.json({GitProfile : 'Profiles'});
		}
}