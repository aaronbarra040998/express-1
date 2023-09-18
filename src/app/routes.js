// Exporta un módulo que define las rutas y controladores de la aplicación
module.exports = (app, passport) => {

  // Ruta principal, renderiza la vista "index"
  app.get("/", (req, res) => {
    res.render("index");
  });

  // Ruta de inicio de sesión, renderiza la vista "login" y maneja mensajes flash
  app.get("/login", (req, res) => {
    res.render("login", {
      message: req.flash("loginMessage"),
    });
  });

  // Procesa la solicitud de inicio de sesión utilizando Passport.js
  app.post("/login", passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

  // Ruta de registro de usuario, renderiza la vista "signup" y maneja mensajes flash
  app.get("/signup", (req, res) => {
    res.render("signup", {
      message: req.flash("signupMessage"),
    });
  });

  // Procesa la solicitud de registro de usuario utilizando Passport.js
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  // Ruta de perfil de usuario, solo accesible para usuarios autenticados
  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', {
      user: req.user
    });
  });

  // Ruta de cierre de sesión
  app.get('/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        // Manejar el error si es necesario
      }
      res.redirect('/');
    });
  });

 // Ruta de confirmacion de matrículas
 app.post('/confirmacion', (req, res) => {
  const curso = req.body.curso;
  const medioPago = req.body.medioPago;

  function getPrecioCurso(curso) {
    switch (curso) {
      case 'Java':
        return 1200;
      case 'PHP':
        return 800;
      case '.NET':
        return 1500;
      default:
        return 0;
    }
  }
  const precioCurso = getPrecioCurso(curso);

  // Lógica para calcular el total a pagar
  let totalpagar = precioCurso;

  // Lógica para aplicar un descuento del 10% si el medio de pago es "Pago en efectivo"
  if (medioPago === 'Pago en efectivo') {
    const descuento = precioCurso * 0.1;
    totalpagar = precioCurso - descuento; // Resta el descuento al precio original
  }

  // Lógica para procesar los datos y mostrar la vista de confirmación
  res.render('confirmacion', { curso, totalpagar, medioPago });
});

// Resto de tus rutas y middleware aquí...
};



// Función de middleware para verificar si un usuario está autenticado
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/');
}

