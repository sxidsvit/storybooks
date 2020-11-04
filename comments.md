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
- morgan - HTTP request logger middleware for node.js
- passport-google-oauth20 - This module lets you authenticate using Google in your Node.js applications. By plugging into [Passport](http://www.passportjs.org), Google authentication can be easily and unobtrusively integrated into any application or framework that supports Connect-style middleware, including Express
- fs-extra - adds file system methods that aren't included in the native fs module and adds promise support to the fs methods

- nodemon - Simple monitor script for use during development of a node.js app
- cross-even - Platform agnostic EventEmitte

---

### Initial Express Setup
