const { where } = require('sequelize');
const Favorite = require('../models/favorite');
const User = require('../models/user');
const { Schedule } = require('../models/associations');

const favoriteController = {
    addFavorite: async (req,res) => {
        try {
            const user_id = req.user.id;

            const user = await User.findOne({
                where: {id: user_id}
            });

            if (!user) {
                return res.status(404).json('Utilisateur introuvable');
            }

            const {idMeal, name, imageUrl, position} = req.body; //idDbMeal envoyé par le front

            const existingFavorite = await Favorite.findOne({
                where: {
                    user_id,
                    idDbMeal:idMeal
                  }
            })

            if(existingFavorite){
                return res.status(400).json('Ce favori existe déjà !');
            }
            if (!imageUrl  || !name || !idMeal) {
                const bodyErrors = [];
                if (!imageUrl) { bodyErrors.push('image cannot be empty!'); }
                //if (!position) { bodyErrors.push('position cannot be empty!'); }
                if (!name) { bodyErrors.push('name cannot be empty!'); }
                if (!idMeal) { bodyErrors.push('idDbMeal cannot be empty!'); }

            return res.status(422).json(bodyErrors);
            }else {
                const newFavori = await Favorite.create({
                    user_id,
                    image:imageUrl,
                    position:1,
                    name,
                    idDbMeal:idMeal
                })

                const user = await User.findOne({
                    where: { id: user_id },
                    include: [
                      'favorites',
                      { model: Schedule, as: 'schedules', include: 'meals' },
                    ],
                  });
                console.log("ajout dans la bdd")
                res.status(200).json({status:"ok",user:user});
            }

        } catch (error) {
            console.log(error);
            res.status(500).json(error.toString())
        }
    },
    deleteFavorite: async (req, res) => {
        try {
            const user_id = req.user.id;
            console.log(req.body)
            const { idDbMeal } = req.body


            const user = await User.findOne({
                where: {id: user_id},
                include: 'favorites'
            });

            // if (!user) {
            //     return res.status(404).json('Utilisateur introuvable');
            // }

            const favorite = await Favorite.findByPk(favorite_id)
            if (!favorite) {
                res.status(404).json('Can not find favorite with id ' + favorite_id);
            } else {
                await favorite.destroy();

                const user = await User.findOne({
                    where: { id: user_id },
                    include: [
                      'favorites',
                      { model: Schedule, as: 'schedules', include: 'meals' },
                    ],
                  });
                console.log("suppresion dans la bdd")
                res.status(200).json({status:"ok",user:user});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(error.toString())
        }
    }
};

module.exports = favoriteController
