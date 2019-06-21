import React, { StyleSheet, Dimensions } from 'react-native'

const window = Dimensions.get('window');

export default StyleSheet.create({
    Flex1: {
        flex: 1
    },
    GameView: {
        flex: 1,
        backgroundColor: '#000000'
    },
    AimButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -(window.width / 50),
        marginTop: -(window.height / 50),
        width: (window.width / 25),
        height: (window.width / 25),
    },
    AimButtonImage: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    HpBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        flexWrap: 'wrap',
        alignItems: 'center',
        flexDirection: 'row'
    },
    HpBarText: {
        fontFamily: 'neuropol',
        fontSize: 30,
        color: '#ffffff',
        opacity: 0.9
    },
    PointBar: {
        position: 'absolute',
        top: 0,
        right: 0,
        flexWrap: 'wrap',
        alignItems: 'center',
        flexDirection: 'row'
    },
    PointBarText: {
        fontFamily: 'neuropol',
        fontSize: 30,
        color: '#ffffff',
        opacity: 0.9
    },
    BarIcon: {
        width: 30,
        height: 30,
        marginRight: 5
    },
    BackButton: {
        position: 'absolute',
        zIndex: 9999,
        bottom: 5,
        left: 5,
        flexWrap: 'wrap',
        alignItems: 'center',
        flexDirection: 'row'
    },
    BackButtonIcon: {
        width: 18,
        height: 18,
        marginRight: 5
    },
    BackButtonText: {
        fontFamily: 'neuropol',
        fontSize: 16,
        color: '#ffffff',
        opacity: 0.9
    },
    ResetView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 5000,
        padding: 10,
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: 'rgba(0, 0, 0, 0.9)'
    },
    ResetStyle: {
        marginTop: 10,
        padding: 10,
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
        backgroundColor: 'rgba(255, 255, 255, 0.3)'
    },
    ResetText: {
        fontFamily: 'neuropol',
        fontSize: 32,
        textAlign: 'center',
        color: '#ffffff',
        textShadowColor: 'rgba(255, 255, 255, 0.5)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 4
    },
    ResetIcon: {
        width: window.height / 10,
        height: window.height / 10
    },
    PointStyle: {
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    PointText: {
        fontFamily: 'neuropol',
        fontSize: 36,
        textAlign: 'center',
        color: '#ffffff',
    },
    PointIcon: {
        width: window.height / 10,
        height: window.height / 10
    },
    Compass: {
        position: 'absolute',
        top: 5,
        left: window.width / 2,
        opacity: 0.5
    },
    FireButton: {
        position: 'absolute',
        zIndex: 9999,
        bottom: 5,
        right: 5,
        width: (window.width / 8),
        height: (window.width / 8),
        borderColor: '#ffffff',
        backgroundColor: '#000000',
        borderWidth: 2,
        borderRadius: (window.width / 16),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 5,
    },
    FireButtonImage: {
        width: '100%',
        height: '100%'
    },
    LoadingRocket: {
        width: window.height / 3,
        height: window.height / 3,
    },
    AlertText: {
        position: 'absolute',
        top: 0,
        zIndex: 9999,
        width: '100%',
        padding: 5,
        color: '#ff6961',
        backgroundColor: '#f2f2f2',
        textAlign: 'center'
    }
});