# Cowin Vaccination - alert generator (Server)

Cowin Vaccination - alert generator is a server side project to monitor slot availability and generate notification if slot is available.

## Features
*   Fetch public data with custom intervels
*   Generate notification

## Framework, Database & Platforms
*   [ExpressJS](https://expressjs.com/)
*   [MongoDB](https://www.mongodb.com/)
*   [OneSignal](https://onesignal.com/)


## How to use

### System Requirements

* Globally installed [node](https://nodejs.org/en/)
* Globally installed [nodemon](https://www.npmjs.com/package/nodemon) (optionl)

### Run

On the command prompt run the following commands

```sh
$ git clone https://github.com/SarathKannan/vaccine_alert_generator.git

$ cd vaccine_alert_generator/

$ npm install
  or
$ yarn install

$ nodemon
  or
$ node src
```


Please Note : 
- Create a file called .env in the root folder. 
- Then copy and paste content in the .env.example file.
- Replace the value with yours 