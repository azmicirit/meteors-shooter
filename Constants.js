const debug = Expo.Constants.appOwnership === 'expo';

module.exports = {
    url: debug ? 'http://<server ip>:3000' : 'http://api.example.com'
};