const User = require('../models/user');

module.exports.registerForm = (req, res) => {
    res.render('users/register');
} 

module.exports.postRegister = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email , username });
        const registertedUser = await User.register(user, password);
        req.login(registertedUser, err => {
            if(err) return next(err)
            req.flash('success', 'Welcome to travelzilla');
        res.status(200)
        res.redirect('/bnbs');
        })
        
    } catch (e) {
        req.flash('error', e.message);
        res.status(400).send('Incorrect credentials')
        // res.redirect('/register');
    }

}

module.exports.loginForm = (req, res) => {
    res.render('users/login');
}

module.exports.postLogin = async (req, res) => {
    req.flash('success', 'Welcome back to travelzilla');
    const redirecturl =  '/bnbs';
    res.redirect(redirecturl);
}

module.exports.Logout = (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', "goodbye!");
    res.redirect('/bnbs');
      });
   
}