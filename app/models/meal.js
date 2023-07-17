const { Model, DataTypes } = require('sequelize');
const sequelize = require('../dbConnexion');

class Meal extends Model { }

Meal.init({
    idDbMeal: DataTypes.STRING,
    name: DataTypes.STRING,
    image: DataTypes.TEXT,
    position: DataTypes.INTEGER,
},
    {
        sequelize,
        tableName: "meal"
    })

module.exports = Meal;