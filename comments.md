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
