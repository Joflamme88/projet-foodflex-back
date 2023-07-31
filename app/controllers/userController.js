const bcrypt = require('bcrypt');
const generateAuthTokens = require('../middlewares/generateAuthTokens')
const newUserData = require('../middlewares/userData');
const { User, Schedule, Meal, Favorite, AuthToken } = require('../models/associations');
const apiError = require('../errors/apiErrors');

const userController = {
  modifyUser: async (req, res) => {
    const user_id = req.user.id;
    const { firstName, lastName,  email } = req.body;
    let user = await User.findByPk(user_id);

    if (!user) {
      // res.status(404).json('Can not find user with this id ' + user_id);
      throw new apiError('Can not find user with this id ' + user_id, { statusCode: 404 });
    } else {
      if (user.firstName !== firstName) { user.firstName = firstName }
      if (user.lastName !== lastName) { user.lastName = lastName }
      if ( user.email !== email) {
        const userEmail = await User.findOne({ where: {email} });
        if (userEmail) {
          throw new apiError('Mail already exists', { statusCode: 400 });
        }else{
          user.email = email
        }
      }
      await user.save();
      const newUser = await newUserData(user_id);
      const response =  {
          message: 'Profile has been modified',
          newUser
      }
      res.status(200).json(response);
    }
  },
  deleteUser: async (req, res) => {
    const user_id = req.params.id;
    const user = await User.findByPk(user_id, {
      include: ['favorites', { model: Schedule, as: 'schedules', include: 'meals' }]
    });
    const schedules = await Schedule.findAll({ where: { user_id } });

    if (!user) {
      throw new apiError('Can not find user with id ' + user_id, { statusCode: 404 })
    } else {

      for (const schedule of schedules) {
        await Meal.destroy({ where: { schedule_id: schedule.id } })
      }
      await Schedule.destroy({ where: { user_id: user_id } });
      await Favorite.destroy({ where: { user_id: user_id } });
      await user.destroy();
      res.status(200).json({ message: 'User delete' });
    }
  },

  signUp: async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword} = req.body;

    const user = await User.findOne({ where: { email } });
    if (user) {
      throw new apiError('User already exists.', { statusCode: 400 });
    }

    if (password != confirmPassword){
      throw new apiError('Invalid password. Passwords must match.', { statusCode: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      email,
      lastName,
      password: hashedPassword,
      role_id: 2, // role_id = 2 => membre
    });

    if (newUser) {
      for (let week = 1; week <= 52; week++) {
        await Schedule.create({
          user_id: newUser.id,
          week: week,
          meals: []
        });
      }
    }
    const newUserSignUp = await newUserData(newUser.id);
    const authToken = await generateAuthTokens(newUser.id) // création du token jwt
    const response =  {
        message: 'User has been create',
        token:authToken.token,
        newUser:newUserSignUp
    }
    res.status(200).json(response);

  },
  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
     throw new apiError('Invalid credentials..', { statusCode: 400 });
    }

    const password_validor = await bcrypt.compare(password, user.password);

    if (!password_validor) {
     throw new apiError('Invalid credentials.', { statusCode: 400 });
    }

    const authToken = await generateAuthTokens(user.id) // création du token jwt
    const newUser = await newUserData(user.id);
    const response =  {
        message: 'You have been logged in',
        token:authToken.token,
        newUser
    }
    res.status(200).json(response);
  },

  getUserInformation: async (req, res) => {
    const user_id = req.user.id;
    const newUser = await newUserData(user_id);
    const response =  {
        message: 'You have been logged in',
        newUser
    }
    res.status(200).json(response);
  },

  logout: async (req, res) => {

    if (!req.authToken) {
      throw new apiError({ message: 'Token missing, logout failed.' })

    }
    req.authToken = null;
    req.user = [];
    res.status(200).json({message : "Logout sucessfull"});

  }
};

module.exports = userController;
