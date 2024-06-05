const User = require('../models/user');

module.exports.renderCreateForm = (req, res) => {
    res.render('users/register')
}

module.exports.createUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Auto Car Sale!')
            res.redirect('/cars');
        })
    } catch (e) {
        req.flash('error', e.message); // use the message from Joi
        return res.redirect('./register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('home');
}

module.exports.login = (req, res) => {
    req.flash('success', `Successfully Logged In!`);
    const redirectUrl = res.locals.returnTo || '/cars';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Successfully logged out!');
        res.redirect('/cars');
    });
}
