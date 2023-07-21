const express = require('express');

/*------------ Controllers ---------------- */

/* Controller Wrapper (refacto) */
const controllerWrapper = require('../middlewares/controllerWrapper')
const userController = require('../controllers/userController');
const scheduleController = require('../controllers/scheduleController');
const favoriteController = require('../controllers/favoriteController');
// const { getAllFavorites } = require('../controllers/favoriteController');

/*------------ Validation_Schema ---------------- */

/* Schema validator */
const validator = require('../validation/validator')

/* Favorite Schema */
const validateAddFavoriteSchema = require('../validation/favoriteSchemas/addFavoriteSchema');
const validatedeleteFavoriteSchema = require('../validation/favoriteSchemas/deleteFavoriteSchema');

/* User Schema */
const validateDeleteUserSchema = require('../validation/userSchemas/deleteUserSchema');
const validateLoginUserSchema = require('../validation/userSchemas/loginUserSchema');
const validateSignUpUserSchema = require('../validation/userSchemas/signUpUserSchema');
const validateModifyUserSchema = require('../validation/userSchemas/modifyUserSchema');

/* User Schema */
const validateAddScheduleSchema = require('../validation/scheduleSchemas/addScheduleSchema');
const validateModifyScheduleSchema = require('../validation/scheduleSchemas/modifyScheduleSchema');
const validateDeleteScheduleSchema = require('../validation/scheduleSchemas/deleteScheduleSchema');

/*------------ Middlewares ---------------- */
const authentification = require('../middlewares/authentification')
/*
VERBE | ROUTE                                 | DESCRIPTION                                            |
|-------|---------------------------------------|--------------------------------------------------------|
| POST  | /contact                              | Envoie le formulaire de contact                         |
| GET   | /mettre route http dbMeal              | Affiche les recettes (nom, image, description)         |
| GET   | /mettre route http dbMeal/:id-recette  | Affiche la description d'une recette spécifique         |
*/
/*------------ Routes ---------------- */

const router = express.Router();

/* User -> Profil */

//router.delete(`/profil/:id`, userController.deleteUser)
//router.patch(`/profil/:id`, userController.modifyUser)
//router.get(`/profil/:id`, userController.getOneUser)
router.post(`/signup`, validator('body',validateSignUpUserSchema),controllerWrapper(userController.signUp));
router.post(`/login`, validator('body',validateLoginUserSchema), controllerWrapper(userController.login));
router.get(`/logout`,authentification, controllerWrapper(userController.logout));
router.get(`/user`,authentification, controllerWrapper(userController.getUserInformation));

/* Schedule -> Planning */
// router.patch(`/planning/:id`, scheduleController.modifyScheduling)
router.post(`/schedule-Meal`, authentification, validator('body',validateAddScheduleSchema),controllerWrapper(scheduleController.addMealSchedule));
//router.patch(`/schedule/:id`,validator('body',validateModifyScheduleSchema),scheduleController.modifySchedule);
router.delete(`/schedule-delete/:id`, authentification, validator('body',validateDeleteScheduleSchema),controllerWrapper(scheduleController.deleteSchedule));

/* User -> Favorites */
router.post(`/favorite-add`,validator('body',validateAddFavoriteSchema), authentification, controllerWrapper(favoriteController.addFavorite))
router.delete(`/favorite-delete/:id`, validator('body',validatedeleteFavoriteSchema), authentification, controllerWrapper(favoriteController.deleteFavorite))

/* Export */
module.exports = router;