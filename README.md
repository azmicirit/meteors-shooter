![ss2](https://raw.githubusercontent.com/azmicirit/meteors-shooter/master/screenshots/s2.jpg)
![ss1](https://raw.githubusercontent.com/azmicirit/meteors-shooter/master/screenshots/s1.jpg)

# INSTALL

`npm install`

OR

`yarn install`

`npm start`

# API
! Server integration is optional !

## Server Configuration
`Constants.js` CONSTANTS.url

## Post Score to server

`POST` \<URL>/board

device: <`string` Device ID>

point: <`int` SCORE>

name: <`string` NAME>

## Fetch Leaderboard

`GET` \<URL>/board