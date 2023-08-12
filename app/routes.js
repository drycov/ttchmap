import jwt from 'jsonwebtoken';
import config from '../configs/web.config.js';
import authMiddleware from './helper/authMiddleware.js';
import aclMiddleware from './helper/aclMiddleware.js';
import connectMongoMiddleware from './helper/connectMongoMiddleware.js'
import sessionMiddleware from './helper/sessionMiddleware.js'

export default function (app) {
    app.get('/', authMiddleware, sessionMiddleware, aclMiddleware(['any']), (req, res) => {
        res.redirect('/index');
    });

    app.route('/logout').get((req, res) => {
        // Clear the session and remove the token cookie
        req.session.destroy();
        res.clearCookie('token');
        // Redirect the user to the login page or any other desired location
        res.redirect('/login');
    });

    app.route('/login')
        .get(sessionMiddleware, (req, res) => {
            res.render('pages/login', { title: req.t('labelpageTitles.labelLogin') });
        })
        .post((req, res) => {
            const { username, password } = req.body;
            if (username === 'admin' && password === 'password') {
                const token = jwt.sign({ username }, process.env.sesionKey || config.sesionKey, {
                    expiresIn: '1h',
                });
                req.session.isAuthenticated = true;
                req.session.token = token;
                res.redirect('/index');
            } else if (username === 'user' && password === 'password') {
                const token = jwt.sign({ username }, process.env.sesionKey || config.sesionKey, {
                    expiresIn: '1h',
                });
                req.session.isAuthenticated = true;
                req.session.token = token;
                res.redirect('/index');
            } else {
                res.redirect('/login');
            }
        });

    app.route('/index').get(authMiddleware, sessionMiddleware, aclMiddleware(['any']), (req, res) => {
        res.render('pages/index', {
            title: req.t('labelpageTitles.labelHome'), name: req.t('labelpageTitles.labelHome'), breadcrumbs: [
                { label: req.t('labelpageTitles.labelHome'), url: '/' },
            ]
        });
        // res.send('Hello, '+ req.user.username + '! Your role: ' + req.user.role + ' : \n'+JSON.stringify(req.user));
    });

    app.route('/admin',).get(authMiddleware, sessionMiddleware, aclMiddleware(['admin']), (req, res) => {

        res.send('Admin area. ' + req.user.username + ' Your role: ' + req.user.role);
    });

    app.route('/hmap')
        .get(authMiddleware, sessionMiddleware, aclMiddleware(['admin', 'user']), (req, res) => {
            res.send('Hello, HMAP! ' + req.user.username + ' Your role: ' + req.user.role);
        });

    app.route('/user/:id').get(authMiddleware, sessionMiddleware, aclMiddleware(['admin']), connectMongoMiddleware, (req, res) => {
        const userId = req.params.id;
        res.send(`${req.user.username} ID: ${userId} Your role: ${req.user.role}`);
    });

    app.route('/config').get(authMiddleware, sessionMiddleware, aclMiddleware(['admin']), connectMongoMiddleware, (req, res) => {
        res.render('pages/config', {
            title: req.t('labelpageTitles.labelHome'), name: req.t('labelpageTitles.labelHome'), breadcrumbs: [
                { label: req.t('labelpageTitles.labelHome'), url: '/' },
                { label: req.t('sidebarLabel.labelEqipment'), url: '/eq' },
            ]
        });
    });

    app.route('/eq/:type').get(authMiddleware, sessionMiddleware, aclMiddleware(['admin', 'user']), connectMongoMiddleware, (req, res) => {
        const type = req.params.type;
        res.render('pages/index', {
            title: req.t('labelpageTitles.labelHome'), name: req.t('labelpageTitles.labelHome'), breadcrumbs: [
                { label: req.t('labelpageTitles.labelHome'), url: '/' },
                { label: req.t('sidebarLabel.labelEqipment'), url: '/eq' },
                { label: type, url: '/eq/' + type },
            ]
        });
    });
    app.route('/ports').get(authMiddleware, sessionMiddleware, aclMiddleware(['admin', 'user']), connectMongoMiddleware, (req, res) => {
        const userId = req.params.type;
        res.render('pages/index', {
            title: req.t('labelpageTitles.labelHome'), name: req.t('labelpageTitles.labelHome'), breadcrumbs: [
                { label: req.t('labelpageTitles.labelHome'), url: '/' },
            ]
        });
    });


    app.route('*').get(sessionMiddleware, (req, res) => {
        res.status(404).render('error', {
            title: req.t('labelpageTitles.LabelError'), name: req.t('labelpageTitles.LabelError'), breadcrumbs: [
                { label: req.t('labelpageTitles.labelHome'), url: '/' },
                { label: res.statusCode, url: null }
            ], messages: {
                pageTitle: req.t('erorMesages.404.pageTitle'), status: res.statusCode, text: req.t('erorMesages.404.text')
            }


        });
    });
}
