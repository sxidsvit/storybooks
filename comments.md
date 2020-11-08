### Подключаемся к MongoDB

Можно воспользоваться уже существующей базой в [облаке](https://www.mongodb.com/) и просто добавить в неё новые коллекции

Нам понадобиться код подключения нашего App:
Clusters/Connect/Connect_your_application

Add your connection string into your application code:
"mongoURI": "mongodb+srv://sxidsvit:password@cluster0.b7vva.azure.mongodb.net/app?retryWrites=true&w=majority"

---

### Install Dependencies

npm init

npm i express mongoose connect-mongo express-session express-handlebars dotenv method-override moment morgan passport-google-oauth20 fs-extra

npm i -D nodemon cross-even

"scripts": {
"start": "cross-env NODE_ENV=production node app",
"dev": "cross-env NODE_ENV=development nodemon app"

- connect-mongo - MongoDB session store for Connect and Express
- method-override - Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it
- dotenv - module that loads environment variables from a .env file into process.env ( property returns an object containing the user environment )
- moment - A JavaScript date library for parsing, validating, manipulating, and formatting dates
- morgan - HTTP request logger middleware for node.jsexpress-handlebars - express-handlebars - A Handlebars view engine for Express which doesn't suck
- passport-google-oauth20 - This module lets you authenticate using Google in your Node.js applications. By plugging into [Passport](http://www.passportjs.org), Google authentication can be easily and unobtrusively integrated into any application or framework that supports Connect-style middleware, including Express
- fs-extra - adds file system methods that aren't included in the native fs module and adds promise support to the fs methods

- nodemon - Simple monitor script for use during development of a node.js app
- cross-even - Platform agnostic EventEmitte

---

### Initial Express Setup

Express-приложение может использовать любые базы данных, поддерживаемые Node

##### Подключаемся MongoDB баззе данных (/config/db.js)

```js
mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    console.log(`MongoDB connected ${conn.connection.host}`)
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}
module.exports = connectDB
```

##### Настраиваем app.js

```js
const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

// Load config
dotenv.config({ path: './config/config.env' })

connectDB()

const app = express()
const PORT = process.env.PORT || 3000

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
```

---

### Morgan Logger

_Логирование в процессе разработки_

app.js

```js
const morgan = require('morgan')

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
```

---

### Template Engine & Layouts

Создаём соответствующие папки для [Handlebars](https://www.npmjs.com/package/express-handlebars):

```js
// Handlebars
app.engine(
  '.hbs',
  exphbs({
    // helpers: {
    //   formatDate,
    //   stripTags,
    //   truncate,
    //   editIcon,
    //   select,
    // },
    defaultLayout: 'main',
    extname: '.hbs',
  })
)
app.set('view engine', '.hbs')
```

Создаём файл views/layots/main.hbs

---

### Index Routes & Views

/routes/index.js - задаём два маршрута

```js
const express = require('express')
const router = express.Router()

// @desc Login/Landing page
// @ router GET /

router.get('/', (req, res) => {
  // res.send('Login')
  res.render('login')
})

// @desc Dashboard
// @ router GET /dashboard

router.get('/dashboard', (req, res) => {
  // res.send('Dashboard')
  res.render('dashboard')
})

module.exports = router
```

app.js

```js
// Routes
app.use('/', require('./routes/index'))
```

/views/dashboard.hbs & /views/login.hbs

```html
<h1>Dashboard</h1>
<h1>Login</h1>
```

---

### Materialize & Font Awesome

Идем на соответствующие CDN и подключаем скрипты и ссылки в файл главного шаблона .views/layouts/main/hbs

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css"
      integrity="sha256-46r060N2LrChLLb5zowXQ72/iKKNiw/lAmygmHExk/o="
      crossorigin="anonymous"
    />
    <title>StoryBooks</title>
  </head>

  <body>
    {{{body}}}
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/ckeditor/4.14.1/ckeditor.js"
      integrity="sha256-bEIQpI72w9NJuIVhTLFUF2/8uxl0u5800r8ddViuv+o="
      crossorigin="anonymous"
    ></script>
  </body>
</html>
```

---

### Set Static Folder

Подключаем папку со статическими файлами в app.js:

```js
const path = require('path')

// Static folder
app.use(express.static(path.join(__dirname, 'public')))
```

Для начала создаем файл стилей /public/css/style.css
и полдключаем его - /views/layouts/main.hbs

```htmn
 <link rel="stylesheet" href="/css/style.css">
```

---

### Login Layout

Создаём дополнительный лейаут для страницы логина /views/layouts/login.hbs

Во многом он корпирует /views/layouts/main.hbs, но есть отличия. Например, нам не нужен сайдбар

Подключаем layout в файле описывающем маршруты /routes/index.js

```js
router.get('/', (req, res) => {
  res.render('login', {
    layout: 'login',
  })
})
```

Теперь файл /views/login.hbs будет использовать layout /views/layouts/login.hbs

```html
<h3><i class="fas fa-book-reader"></i> StoryBooks</h3>
<div class="section">
  <p class="lead">Create public and private stories from your life</p>
</div>
<div class="divider"></div>
<div class="section">
  <a href="/auth/google" class="btn red darken-1">
    <i class="fab fa-google left"></i> Log In With Google
  </a>
</div>
```

Здесь и далее все необходимы стили прописываем в файле /public/css/styles.css

---

### Start Google Login

Теперь нужны дополнительные настройки в [Google Cloud Platform](https://console.cloud.google.com/home/dashboard?project=youtube-glo&hl=ru&pli=1)

Api & Services -> Enable API and Services -> Google+ API

The Google+ API enables developers to build on top of the Google+ platform

Включаем сервис ( если уже включен, то Manage) и переходим в настройки Credantials (Учётные данные)

Сначала нужно получить доступ к Create OAuth client ID

Создаём новый проект или используем уже существующий, чтобы получить (создать) данные для нового клиента как Веб-приложения.

На начальном этапе, пока приложение не на хостинге, можно в секции "Разрешенные URI перенаправления" прописать локальный адрес приложения:

```html
http://localhost:3000/auth/google/callback
```

Теперь, после сохранения данных получим два ключа:

```txt
- Идентификатор клиента - 115500663502-********.apps.googleusercontent.com
- Секретный код клиента - 1GrkF0j-********-mdsrt
```

Оба ключа поместим в файл /config/config.env

```js
GOOGLE_CLIENT_ID = 115500663502-********.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = 1GrkF0j-********-mdsrt
```

---

### Passport Intro

Passport - это промежуточное ПО для аутентификации для Node.js. Чрезвычайно гибкий и модульный, Passport можно ненавязчиво добавить в любое веб-приложение на основе Express. Исчерпывающий набор стратегий поддерживает аутентификацию с использованием имени пользователя и пароля, Facebook, Twitter и др.

[Passport strategy for Google OAuth 2.0](http://www.passportjs.org/packages/passport-google-oauth2/)

---

### Passport Config & Sessions

---

### User module

/models/User.js

```js
const mongoose = require('mongoose')

const UserShema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },

  displayName: {
    type: String,
    required: true,
  },

  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

module.exports = mongoose.model('User', UserShema)
```

---

### Passport Google Strategy

Модуль passport позволяет аутентифицироваться с помощью Google в приложении на Node.js

Воспользуемся [документацией ](http://www.passportjs.org/packages/passport-google-oauth2/) и создадим конфигурационный файл /config/passport.js для работы с аутентификацией 2.0 от Google и записи информации о текущем пользователе в БД MongoDB

```js
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (request, accessToken, refreshToken, profile, done) => {
        console.log('passport.js - profile: ', profile)
      }
    )
  )

  //  In order to support login sessions, Passport will serialize and deserialize user instances to and from the session (http://www.passportjs.org/docs/downloads/html/)

  passport.serializeUser((user, done) => done(null, user.id))

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}
```

---

### Auth Routes

Понадобиться дополнительный маршрут для аутентификации (/auth/)
Coplfybv его в файле app.js:

```js
// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT || 3000
```

Детализируем маршруты в файле /routes/auth.js

```js
const express = require('express')
const passport = require('passport')
const router = express.Router()

// @desc Auth with Goole
// @route Get /auth/google
//  http://www.passportjs.org/packages/passport-google-oauth2/

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

// @desc    Google auth callback
// @route   GET /auth/google/callback
//  http://www.passportjs.org/packages/passport-google-oauth2/

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard')
  }
)

module.exports = router
```

---

### Save Google Profile Data

Делаем дополнительные настройки в файле аутентификации config/passport.js :

```js
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (request, accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        }
        try {
          let user = await User.findOne({ googleId: profile.id })
          if (user) {
            done(null, user)
          } else {
            user = await User.create(newUser)
            done(null, user)
          }
        } catch (err) {
          cosole.error(err)
        }
      }
    )
  )

  //  In order to support login sessions, Passport will serialize and deserialize user instances to and from the session (http://www.passportjs.org/docs/downloads/html/)

  passport.serializeUser((user, done) => done(null, user.id))

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}
```

После успешной аутентификации информация о пользователе записывается в коллекцию users базы storybooks MongoDB,
cогласно ранее выполненых настроек (файл /config/db.js)

---

### Logout

Согласно [документации](http://www.passportjs.org/docs/logout/): Passport exposes a logout() function on req (also aliased as logOut()) that can be called from any route handler which needs to terminate a login session. Invoking logout() will remove the req.user property and clear the login session (if any).

То есть, не только нужен редирект, но еще нужно удалить ссесионые данные (сеанс входа)

```js
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})
```

---

### Navigation

Создаём файл /partials/\_header.hbs, в который помещяем верстку для боковой выезжающей панели с меню

```html
...
<ul class="sidenav" id="mobile-demo">
  <li><a href="/stories">Public Stories</a></li>
  <li><a href="/dashboard">Dashboard</a></li>
  <li><a href="/auth/logout">Logout</a></li>
</ul>
...
```

В layout /layouts/main.hbs подключаем этот фрагмент кода

```html
<body>
  {{>_header}}
  <div class="container">{{{body}}}</div>
</body>
```

и прописываем скрипт инициализации, взятый из документации на [Materialize](https://materializecss.com/navbar.html)

```js
<script>M.Sidenav.init(document.querySelector('.sidenav'))</script>
```

---

### Auth Middleware

Теперь нужно защитить роуты от доступа к ним неавторизованных пользователей.
Создаём два middleware (файл /middleware/auth.js)

```js
module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    } else {
      res.redirect('/')
    }
  },
  ensureGuest: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next()
    } else {
      res.redirect('/dashboard')
    }
  },
}
```

и вносим изменения в роуты (/routes/index.js):

```js
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  })
})

router.get('/dashboard', ensureAuth, (req, res) => {
  res.render('dashboard')
})
```

---

### Store Sessions In Database

Мордуль sessions - создаёт middleware для работы с ссесиями, а модуль connect-mongo - хранилище ссесий в MongoDB для Express

Вносим изменения в app.js согласно [документации](https://www.npmjs.com/package/connect-mongo)

```js
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
```

[Подключаем middleware](https://www.npmjs.com/package/connect-mongo):

```js
const mongoose = require('mongoose')
...
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
)
```

После этих действий достаточно зарегистрироваться один раз, после чего быть переадресованным на страницу /dashborad. После перезанрузки мы попрежнему останемся на ней. Всё работает: данные о ссесии сохранены в MongoDB (коллекция sessions)

```js
{
  _id: "tijCDPxhJ4kjQCv0nWINZztPpbE0nxvc"
expires: 2020-11-20T20:46:23.932+00:00
session: {"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"passport":{"user":"5fa46fb5d651464a5ca697c7"}}
}
```

---

### Story Model

/routes/index.js - передадим параметр запроса в метод рендеринга, чтобы понимать какой пользователь активен в настоящий момент

```js
router.get('/dashboard', ensureAuth, (req, res) => {
  res.render('dashboard', {
    name: req.user.firstName,
  })
})
```

Теперь параметр name доступен в /views/dashboards.hbs

```html
<h6>Dashboard</h6>
<h3>Welcome, {{name}}</h3>
<p>Here are list of your stories</p>
```

### Story Model

/models/Story.js

```js
const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'public',
    enum: ['public', 'private'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Story', StorySchema)
```

---

### Dashboard Stories

/routes/index.js - подключаем модель Story и делаем выборку из базы MongoDB

```js
const Story = require('../models/Story')
...
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean() // удаляем лишнюю информацию из объект
    res.render('dashboard', {
      name: req.user.firstName,
      stories
    })
  } catch(err) {
    console.log(err)
    res.render('error/500')
  }
})
module.exports = router
```

Создаём два шаблона /views/error/404.hbs и /views/error/500.hbs для страниц ошибок:

```html
<h1>404 Not Found</h1>
<p>We're sorry, this resource is not found</p>
<a href="/dashboard" class="btn">Go to Dashboard</a>
```

```html
<h1>Server Error</h1>
<p>We're sorry, something went wrong</p>
<a href="/dashboard" class="btn">Go to Dashboard</a>
```

И наконец, вносим изменения в шаблон /views/dashboard.hbs

```html
<h6>Dashboard</h6>
<h3>Welcome {{name}}</h3>
<p>Here are your stories</p>
{{#if stories}}
<table class="striped">
  <thead>
    <tr>
      <th>Title</th>
      <th>Date</th>
      <th>Status</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {{#each stories}}
    <tr>
      <td><a href="/stories/{{_id}}">{{title}}</a></td>
      <td>{{formatDate createdAt 'MMMM Do YYYY, h:mm:ss a'}}</td>
      <td><span class="dash-status">{{status}}</span></td>
      <td>
        <a href="/stories/edit/{{_id}}" class="btn btn-float">
          <i class="fas fa-edit"></i>
        </a>

        <form action="/stories/{{_id}}" method="POST" id="delete-form">
          <input type="hidden" name="_method" value="DELETE" />
          <button type="submit" class="btn red">
            <i class="fas fa-trash"></i>
          </button>
        </form>
      </td>
    </tr>
    {{/each}}
  </tbody>
</table>
{{else}}
<p>You have not created any stories</p>
{{/if}}
```

---

### Add Story

Создадим кнопку для добавления story (записи текущего пользователя):

/views/partials/\_add_btn.hbs

```html
<div class="fixed-action-btn">
  <a
    href="/stories/add"
    class="btn-floating btn-large waves-effect waves-light red"
    ><i class="fas fa-plus"></i
  ></a>
</div>
```

/views/layouts/main.hbs

```html
<body>
  {{>_header}} {{>_add_btn}}
  <div class="container">{{{body}}}</div>
</body>
```

Создаем папку /views/stories, в которую будем помещать шаблоны записей (stories)

_add.hbs_ - форма для создания записи (можно использовать шаблон Formik)

```html
<h3>Add Story</h3>
<div class="row">
  <form action="/stories" method="POST" class="col s12">
    <div class="row">
      <div class="input-field">
        <input type="text" id="title" name="title" />
        <label for="title">Title</label>
      </div>
    </div>

    <div class="row">
      <div class="input-field">
        <select id="status" name="status">
          <option value="public" selected>Public</option>
          <option value="private">Private</option>
        </select>
        <label for="status">Status</label>
      </div>
    </div>

    <div class="row">
      <div class="input-field">
        <h5>Tell Us Your Story:</h5>
        <textarea id="body" name="body"></textarea>
      </div>
    </div>

    <div class="row">
      <input type="submit" value="Save" class="btn" />
      <a href="/dashboard" class="btn orange">Cancel</a>
    </div>
  </form>
</div>
```

Добавим новый маршрут /stories в файл app.js:

```js
// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))
```

Теперь нужно создать сами маршруты в файле /routes/stories.js. Конечный результат таков:

```js
const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Story = require('../models/Story')

// @desc    Show add page
// @route   GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/add')
})

// @desc    Process add form
// @route   POST /stories
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id
    await Story.create(req.body)
    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show all stories
// @route   GET /stories
router.get('/', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    res.render('stories/index', {
      stories,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show single story
// @route   GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate('user').lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user._id != req.user.id && story.status == 'private') {
      res.render('error/404')
    } else {
      res.render('stories/show', {
        story,
      })
    }
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})

// @desc    Show edit page
// @route   GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
    }).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      res.render('stories/edit', {
        story,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Update story
// @route   PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      await Story.remove({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean()

    res.render('stories/index', {
      stories,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router
```

Согласно [документации](https://materializecss.com/select.html) в файл /views/main.hbs добавляем обработчик выбора Status (public, private) в шаблоне /views/partials/\_add.hbs

```html
<script>
  M.Sidenav.init(document.querySelector('.sidenav'))
  M.FormSelect.init(document.querySelector('#status'))
</script>
```

Чтобы сделать инпут textaria более удобным для ввода информации,
установим [CKEditor](https://ckeditor.com/).

Modern JavaScript rich text editor with a modular architecture. Its clean UI and features provide the perfect WYSIWYG UX ❤️ for creating semantic content.

Written in ES6 with MVC architecture, custom data model, virtual DOM.
Responsive images and media embeds (videos, tweets).
Custom output format: HTML and Markdown support.
Boost productivity with auto-formatting and collaboration.
Extensible and customizable by design.

Подключаем в /views/layouts/main.hbs

```html
<script src="https://cdn.ckeditor.com/4.15.0/standard/ckeditor.js"></script>

<script>
  M.Sidenav.init(document.querySelector('.sidenav'))
  M.FormSelect.init(document.querySelector('#status'))

  CKEDITOR.replace('body', {
    plugins: 'wysiwygarea, toolbar, basicstyles, link',
  })
</script>
```

В настройках мы ссылаемся на name="body" в textarea (/views/stories/add.hbs)

```html
<div class="row">
  <div class="input-field">
    <h5>Tell Us Your Story:</h5>
    <textarea id="body" name="body"></textarea>
  </div>
</div>
```

Теперь, когда мы отправляем форму, в /routes/stoties.js нужно будет обработать body соответствующего POST-запроса.

Добавим в файл app.js два парсера:

```js
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
```

В файле /routes/stories.js обработчик POST-запроса отправки формы извлекает только нужную информацию из объекта req: в нем содержится и информация о текущем пользователе (req.user) и данные формы (req.body):

```js
// @desc    Process add form
// @route   POST / stories
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id
    await Story.create(req.body)
    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})
```

---

### Format Date Handlebar Helper

Создаем файл с хелперсами /helpers/hbs.js, в котором будут находится различные функции-помощники.
Они нужны чтобы преобразовывать данные, которые выводятся в шаблоны, к удобному для пользователя виду:

```js
const moment = require('moment')

module.exports = {
  formatDate: function (date, format) {
    return moment(date).utc().format(format)
  },
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + ' '
      new_str = str.substr(0, len)
      new_str = str.substr(0, new_str.lastIndexOf(' '))
      new_str = new_str.length > 0 ? new_str : str.substr(0, len)
      return new_str + '...'
    }
    return str
  },
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, '')
  },
  editIcon: function (storyUser, loggedUser, storyId, floating = true) {
    if (storyUser._id.toString() == loggedUser._id.toString()) {
      if (floating) {
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
      } else {
        return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
      }
    } else {
      return ''
    }
  },
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp('>' + selected + '</option>'),
        ' selected="selected"$&'
      )
  },
}
```

Хелперсы нужно подключить к шаблонизатору handlebars.

app.js

```js
// Handlebars Helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require('./helpers/hbs')

// Handlebars
app.engine(
  '.hbs',
  exphbs({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
    },
    defaultLayout: 'main',
    extname: '.hbs',
  })
)
app.set('view engine', '.hbs')
```

Вот один из примеров подключения хелперса formatDate в шаблоне /views/dashboard.hbs

````html
<tr>
  <td><a href="/stories/{{_id}}">{{title}}</a></td>
  <td>{{formatDate createdAt 'MMMM Do YYYY, h:mm:ss a'}}</td>
  <td><span class="dash-status">{{status}}</span></td>
  <td>```</td>
</tr>
````

---

### Public Stories

Создаём шаблон /views/stories/index.hbs для страницы с историями (заметками, постами)

```html
<h1>Stories</h1>
<div class="row">
  {{#each stories}}
  <div class="col s12 m4">
    <div class="card">
      <div class="card-image">{{!-- {{{editIcon user ../user _id}}} --}}</div>
      <div class="card-content center-align">
        <h5>{{title}}</h5>
        <p>{{stripTags (truncate body 150)}}</p>
        <br />
        <div class="chip">
          <img src="{{user.image}}" alt="" />
          <a href="/stories/user/{{user._id}}">{{user.displayName}}</a>
        </div>
      </div>
      <div class="card-action center-align">
        <a href="/stories/{{_id}}" class="btn grey">Read More</a>
      </div>
    </div>
  </div>
  {{else}}
  <p>No stories to display</p>
  {{/each}}
</div>
```

В файл /helpers/hbs добавляем новые функции (хелперсы) и не забываем их также указать в файле app.js (код этих файлов приведен выше)

Наконец в файл /routes/stories.js добавляем маршрут /stories/ :

```js
// @desc    Show all stories
// @route   GET /stories
router.get('/', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    res.render('stories/index', {
      stories,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})
```

---

### Truncate & StripTags Helpers

/helpers/hbs.js

```js
 truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + ' '
      new_str = str.substr(0, len)
      new_str = str.substr(0, new_str.lastIndexOf(' '))
      new_str = new_str.length > 0 ? new_str : str.substr(0, len)
      return new_str + '...'
    }
    return str
  },
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, '')
  },
```

/views/stories/index.hbs

```html
<h5>{{title}}</h5>
<p>{{stripTags (truncate body 150)}}</p>
```

---

### Edit Icon Helper

Добавим иконку в верхнем правом углу заметки,
которая указывает, что автор может редактировать её.

/helpers/hbs.js

```js
  editIcon: function (storyUser, loggedUser, storyId, floating = true) {
    if (storyUser._id.toString() == loggedUser._id.toString()) {
      if (floating) {
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
      } else {
        return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
      }
    } else {
      return ''
    }
  },
```

Разумеется, порсле создания нового хелпера его нужно подключить в файлу app.js

/views/stories/index.hbs

```html
<div class="col s12 m4">
  <div class="card">
    <div class="card-image">{{{editIcon user ../user _id}}}</div>
  </div>
</div>
...
```

Здесь запись ../user означеет, что нужно взять но того user? который является автором текущей записи цикла, а выйти за пределы цикла (../) и взять авторизованного в данный момент user

Комментарий.
Если мы хотим передать HTML код в handlebars, то должны использовать ТРОЙНЫЕ фигурные скобки ( {{{ ...}}})

Теперь нужно получить доступ к id авторизованного user.

Создадим глобальную переменну res.locals.user в файле app.js
Эта переменная будет доступна при обработке маршрутов

```js
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  console.log('res.locals.user: ', res.locals.user)
  next()
})
```

[В официальной документации Express](https://expressjs.com/en/api.html#res.locals) про объект res.locals говориться следующее

```txt
res.locals
An object that contains response local variables scoped to the request, and therefore available only to the view(s) rendered during that request / response cycle (if any). Otherwise, this property is identical to app.locals.

This property is useful for exposing request-level information such as the request path name, authenticated user, user settings, and so on.
```

Поскольку мы находимся на роутах, которые требуют авторизации пользователя. то на этих маршрутах присутствует объект req.user

---

### Edit Story

Сначала создаем маршрут /routes/stories.js и для него устанавливаем ограничения: только авторизованный пользователь и автор _приватной_ заметки могут просматривать её

```js
// @desc    Show single story
// @route   GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate('user').lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user._id != req.user.id && story.status == 'private') {
      res.render('error/404')
    } else {
      res.render('stories/show', {
        story,
      })
    }
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})
```

Теперь создаём сам шаблон для заметки - /views/stories/show.hbs

```js
<div class="row">
  <div class="col s12 m8">
    <h3>
      {{story.title}}
      <small>{{{editIcon story.user user story._id false}}}</small>
    </h3>
    <div class="card story">
      <div class="card-content">
        <span class="card-title"
          >{{formatDate date 'MMMM Do YYYY, h:mm:ss a'}}</span
        >
        {{{story.body}}}
      </div>
    </div>
  </div>
  <div class="col s12 m4">
    <div class="card center-align">
      <div class="card-content">
        <span class="card-title">{{story.user.displayName}}</span>
        <img
          src="{{story.user.image}}"
          class="circle responsive-img img-small"
        />
      </div>
      <div class="card-action">
        <a href="/stories/user/{{story.user._id}}"
          >More From {{story.user.firstName}}</a
        >
      </div>
    </div>
  </div>
</div>
```

Аналогично создаём роут для редактирования заметки /routes/stories.js, причём редактировать story может только её владелец.
Роут должен использовать /layout/stories.hbs? так как нам нужен подключённый редактор CKEDITOR

```js
// @desc    Show edit page
// @route   GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
    }).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      res.render('stories/edit', {
        story,
        layout: 'stories',
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})
```

Теперь создаём сам шаблон для редактирования заметки - /views/stories/edit.hbs
За основу берем шаблон /views/stories/adds.hbs

```html
<h3>Edit Story</h3>
<div class="row">
  <form action="/stories/{{story._id}}" method="POST" class="col s12">
    <input type="hidden" name="_method" value="PUT" />
    <div class="row">
      <div class="input-field">
        <input type="text" id="title" name="title" value="{{story.title}}" />
        <label for="title">Title</label>
      </div>
    </div>

    <div class="row">
      <div class="input-field">
        <select id="status" name="status">
          {{#select story.status}}
          <option value="public" selected>Public</option>
          <option value="private">Private</option>
          {{/select}}
        </select>
        <label for="status">Status</label>
      </div>
    </div>

    <div class="row">
      <div class="input-field">
        <h5>Tell Us Your Story:</h5>
        <textarea id="body" name="body">{{story.body}}</textarea>
      </div>
    </div>

    <div class="row">
      <input type="submit" value="Save" class="btn" />
      <a href="/dashboard" class="btn orange">Cancel</a>
    </div>
  </form>
</div>
```

Тонкость этого шаблона - в использовании хелпера select.
Он делает активным опцию соответствующую текущему статусу поста (public/private).
Код хелпера был найден автором в интернете

---

### Method Override For PUT Requests

После внесения правок в заметку (story) её нужно обновить в базе. Для этого нужно создать PUT request

/routes/stories.js

```js
// @desc    Update story
// @route   PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})
```

Сейчас проблема в том, что когда шаблон /views/stories/edit.hbs отправляет форму он делает это методом POST.
Нам нужно заменить его на PUT

В app.js добавляем еще один модуль

```js
const methodOverride = require('method-override')

...

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)
```

Модуль method-override позволяет "_use HTTP verbs such as PUT or DELETE in places where the client doesn't support it_"

В [документации](https://www.npmjs.com/package/method-override#custom-logic) приводится код middliware, который мы вставляем в app.js, а также добавляем скрытое поле в /views/stories/edit.hbs

Таким образом, маршрутизатор анализирует содержание тела запроса и если оно содержит поле \_method, то заменяем им метод запроса и удаляем поле \_metthod из тела запроса

---

### Method Override For DELETE Requests

В файле /routes/stories.js создаём запрос на удаление story

```js
// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      await Story.remove({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})
```

Разумеется, что удалить запись может только её создатель.

В файле /views/dashboard.hbs нужно добавить кнопку и форму для удаления записи. Форма нужна чтобы в дальнейшем в роутере POST-запрос заменить на PUT-запрос

```html
<td>
  <a href="/stories/edit/{{_id}}" class="btn btn-float">
    <i class="fas fa-edit"></i>
  </a>

  <form action="/stories/{{_id}}" method="POST" id="delete-form">
    <input type="hidden" name="_method" value="DELETE" />
    <button type="submit" class="btn red">
      <i class="fas fa-trash"></i>
    </button>
  </form>
</td>
```

---

### Single Story Page

В файле /routes/stories.js создаём get запрос на просмотр выбранной записи (story)

```js
// @desc    Show single story
// @route   GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate('user').lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user._id != req.user.id && story.status == 'private') {
      res.render('error/404')
    } else {
      res.render('stories/show', {
        story,
      })
    }
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})
```

Создаём шаблон /views/stories/show.hbs для показа одной записи (story):

```html
<div class="row">
  <div class="col s12 m8">
    <h3>
      {{story.title}}
      <small>{{{editIcon story.user user story._id false}}}</small>
    </h3>
    <div class="card story">
      <div class="card-content">
        <span class="card-title"
          >{{formatDate date 'MMMM Do YYYY, h:mm:ss a'}}</span
        >
        {{{story.body}}}
      </div>
    </div>
  </div>
  <div class="col s12 m4">
    <div class="card center-align">
      <div class="card-content">
        <span class="card-title">{{story.user.displayName}}</span>
        <img
          src="{{story.user.image}}"
          class="circle responsive-img img-small"
        />
      </div>
      <div class="card-action">
        <a href="/stories/user/{{story.user._id}}"
          >More From {{story.user.firstName}}</a
        >
      </div>
    </div>
  </div>
</div>
```

---

### User Stories

Осталось роут и шаблон для отображения всех записей выбранного пользователя.

В файле /routes/stories.js создаём get запрос:

```js
// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean()

    res.render('stories/index', {
      stories,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})
```

В качестве шаблона для отображения записей (stories) используется ранее созданный шаблон /views/stories/index.hbs

---
