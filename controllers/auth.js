const UserService = require("../services/userService");
const becrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false,
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Sign Up',
        isAuthenticated: false,
        errorMessage: null,
        oldInput: null
    });
};

exports.postLogin = async(req, res, next) => {
    const { email, password } = req.body;
    const user = await UserService.getUserByEmail(email);
    const checkPassword = await becrypt.compare(password, user ? user.password : '');
    if (!user || !checkPassword) {
        return res.render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            isAuthenticated: false,
            errorMessage: 'Invalid email or password.',
            oldInput: { email }
        });
    }
    req.session.isLoggedIn = true;
    req.session.user = { id: user.id };
    res.redirect('/');
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};

exports.postSignup = async (req, res, next) => {
    const { fullName, email, password, confirmPassword, terms, newsletter } = req.body;

    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
        return res.render('auth/signup', {
            path: '/signup',
            pageTitle: 'Sign Up',
            isAuthenticated: false,
            errorMessage: 'Please fill in all required fields.',
            oldInput: { fullName, email }
        });
    }

    if (password !== confirmPassword) {
        return res.render('auth/signup', {
            path: '/signup',
            pageTitle: 'Sign Up',
            isAuthenticated: false,
            errorMessage: 'Passwords do not match.',
            oldInput: { fullName, email }
        });
    }

    if (!terms) {
        return res.render('auth/signup', {
            path: '/signup',
            pageTitle: 'Sign Up',
            isAuthenticated: false,
            errorMessage: 'Please accept the Terms of Service and Privacy Policy.',
            oldInput: { fullName, email }
        });
    }

    try {
        const existingUser = await UserService.getUserByEmail(email);
        if (existingUser) {
            return res.render('auth/signup', {
                path: '/signup',
                pageTitle: 'Sign Up',
                isAuthenticated: false,
                errorMessage: 'An account with this email already exists.',
                oldInput: { fullName, email }
            });
        }

        const user = await UserService.createUser({
            name: fullName,
            email: email,
            password: await becrypt.hash(password, 12) // Hash the password
        });

        console.log('User created:', { id: user.id, email: user.email, newsletter: !!newsletter });

        // Log user in automatically after signup
        req.session.isLoggedIn = true;
        req.session.user = { id: user.id };

        // Save session and redirect
        req.session.save(err => {
            if (err) {
                console.error('Session save error:', err);
            }
            res.redirect('/login');
        });

    } catch (error) {
        console.error('Error during signup:', error);
        return res.render('auth/signup', {
            path: '/signup',
            pageTitle: 'Sign Up',
            isAuthenticated: false,
            errorMessage: 'An error occurred while creating your account. Please try again later.',
            oldInput: { fullName, email }
        });
    }
};