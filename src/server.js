const express = require('express');
const app = express();

const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');

const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const { url } = require('./config/database.js');

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

 require('./config/passport')(passport);


const db = mongoose.connection;

// Manejador de eventos para verificar la conexión
db.on('error', (err) => {
  console.error('Error de conexión a MongoDB:', err);
});

db.once('open', () => {
  console.log('Conexión exitosa a MongoDB');
  // Iniciar tu servidor Express aquí, si lo deseas
});

//settings
app.set('port', process.env.PORT || 3000);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');// Configuración de EJS como motor de plantillas
//middleware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret:'faztwebtutorialnode',
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//routes 
require('./app/routes.js')(app,passport);

//static files
app.use(express.static(path.join(__dirname,'public')));
app.listen(app.get('port'), () => {
  console.log('Server on port ', app.get('port'));
});

app.use(function(req, res) {
  res.status(404);
  res.render('error404'); // Renderiza la vista error404.ejs
});
