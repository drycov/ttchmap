import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import session from 'express-session';
import useragent from 'express-useragent';
import fs from 'fs';
import https from 'https';
import i18next from 'i18next'
import i18nextMiddleware from 'i18next-http-middleware'
import Backend from 'i18next-fs-backend'
import path from 'path';
import favicon from 'serve-favicon';
import { fileURLToPath } from 'url';

import expressLayouts from 'express-ejs-layouts';
import process from 'process';
import config from '../configs/web.config.js';
import connectMongoMiddleware from './helper/connectMongoMiddleware.js';
import corsMiddleware from './helper/corsMiddleware.js';
import loggerMiddleware from './helper/loggerMiddleware.js';
import removeCommentsMiddleware from './helper/removeCommentsMiddleware.js'
import router from './routes.js';
import api from './apirouter.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sslDirectory = path.join(__dirname, '../ssl');

const app = express();
i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'en', // Default language if translation not available for user's preferred language
    ns: ['en', 'ru'], // Namespace for translation keys
    defaultNS: 'en',
    backend: {
      loadPath: __dirname + '/locales/{{lng}}.json',
    },
  });

app.use(i18nextMiddleware.handle(i18next));

app.use(
  session({
    secret: process.env.sesionKey || config.sesionKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
    },
  })
);

const options = {
  key: fs.readFileSync(path.join(sslDirectory, 'private.key')),
  cert: fs.readFileSync(path.join(sslDirectory, 'certificate.crt')),
};

app.set('view engine', 'ejs');

app.use(expressLayouts);
app.enable('view cache');
app.set('layout', 'layouts/base');

app.set('layout extractScripts', true);

app.set('views', path.join(__dirname, 'view'));
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));

app.use(express.static(path.join(__dirname, '../public')));
app.use(removeCommentsMiddleware);

// app.use('/static', express.static(path.join(__dirname, '../public'), { fallthrough: false }));

app.use('/static/adminlte', express.static(path.join(__dirname, '../node_modules/adminlte4/dist')));
app.use('/static/bootstrap', express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));
app.use('/static/fontawesome', express.static(path.join(__dirname, '../node_modules/@fortawesome/fontawesome-free')));
app.use('/static/bootstarpicons', express.static(path.join(__dirname, '../node_modules/bootstrap-icons/font')));
app.use('/static/apexcharts', express.static(path.join(__dirname, '../node_modules/apexcharts/dist')));
app.use('/static/jsvectormap', express.static(path.join(__dirname, '../node_modules/jsvectormap/dist')));


app.use('/static/js', express.static(path.join(__dirname, '../node_modules/jquery/dist')));
app.use('/static/js', express.static(path.join(__dirname, '../node_modules/jquery-ui/dist')));
app.use('/static/js', express.static(path.join(__dirname, '../node_modules/jquery-ui/dist')));
app.use('/static/overlayscrollbars', express.static(path.join(__dirname, '../node_modules/overlayscrollbars')));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(compression());
app.use(useragent.express());
app.use(loggerMiddleware);
app.disable('x-powered-by');
app.disable('expires');
app.use(corsMiddleware);
app.use(connectMongoMiddleware);


router(app);
api(app)

app.use(function (request, response, next) {
  if (process.env.NODE_ENV != 'development' && !request.secure) {
    return response.redirect("https://" + request.headers.host + request.url);
  }
  next();
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: req.t('labelpageTitles.LabelError'), name: req.t('labelpageTitles.LabelError'), breadcrumbs: [
      { label: req.t('labelpageTitles.labelHome'), url: '/' },
      { label: res.statusCode, url: null }
    ], messages: {
      pageTitle:req.t('erorMesages.500.pageTitle'), status: res.statusCode, text:req.t('erorMesages.500.text')}
  });
  // res.status(500).send('Internal Server Error');
});

const server = https.createServer(options, app);

export default server;
