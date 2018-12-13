const Users = require('../models/userModel');
// const events = require('../utils/events');
module.exports = {
    getCurrentUser: (req, res, next) => {
        const { payload: { id } } = req;
        return Users.findById(id)
            .then((user) => {
                if (!user) {
                    return res.sendStatus(400);
                }

                return res.json({ user: user.toAuthJSON() });
            });
    },
    createUser: (req, res, next) => {
        const { body: { user } } = req;

        if (!user.email) {
            return res.status(422).json({
                errors: {
                    email: 'is required'
                }
            });
        }

        if (!user.password) {
            return res.status(422).json({
                errors: {
                    password: 'is required'
                }
            });
        }

        const finalUser = new Users(user);

        finalUser.setPassword(user.password);

        return finalUser.save()
            // .then(() => {
            //     events.emit('userRegistered', finalUser);
            // })
            .then(() => res.json({ user: finalUser.toAuthJSON() }));
    }
};
