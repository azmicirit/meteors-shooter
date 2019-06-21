import React, { StyleSheet, Dimensions, Platform, PixelRatio } from 'react-native'

const window = Dimensions.get('window');

let normalize = function (percent) {
    const widthPercent = percent * window.width / 100
    return Math.round(widthPercent);
};

export default StyleSheet.create({
    MainView: {
        flex: 1,
        backgroundColor: '#000000'
    },
    BackGround: {
        flex: 1,
        width: null,
        height: null
    },
    Loading: {
        position: 'absolute',
        zIndex: 9999,
        bottom: 0,
        left: window.width / 4,
        width: window.width / 2,
        height: window.height / 2
    },
    MenuView: {
        flex: 1,
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    MenuStyle: {
        width: window.width / 2,
        margin: 5,
        padding: 5,
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 30,
        borderWidth: 5,
        borderColor: '#f2f2f2',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    MenuText: {
        fontFamily: 'neuropol',
        fontSize: normalize(3),
        textAlign: 'center',
        color: '#f2f2f2'
    },
    MenuIcon: {
        width: window.height / 10,
        height: window.height / 10
    },
    Banner: {
        position: 'absolute',
        zIndex: 5000,
        width: '100%',
        padding: 10
    },
    BannerText: {
        width: '100%',
        textAlign: 'center',
        fontFamily: 'neuropol',
        fontSize: normalize(5),
        textAlign: 'center',
        color: '#5b92b9',
        textShadowColor: '#ffffff',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 20
    },
    MuteStyle: {
        position: 'absolute',
        zIndex: 1000,
        bottom: 5,
        right: 5,
        padding: 5,
        width: window.width / 15,
        height: window.width / 15,
        borderRadius: window.width / 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 10,
    },
    MuteIcon: {
        width: '100%',
        height: '100%'
    },
    OptionsStyle: {
        position: 'absolute',
        zIndex: 1000,
        bottom: 5,
        left: 5,
        padding: 5,
        width: window.width / 15,
        height: window.width / 15,
        borderRadius: window.width / 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 10,
    },
    OptionsIcon: {
        width: '100%',
        height: '100%'
    },
    Input: {
        marginTop: 10,
        width: window.width / 2,
        padding: 5,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        color: '#ffffff'
    },
    ColorContainer: {
        flex: 1,
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    ColorBox: {
        width: window.width / 15,
        height: window.width / 15,
        margin: 5,
        padding: 5,
        borderColor: '#000000'
    }
});