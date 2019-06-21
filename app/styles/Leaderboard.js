import React, { StyleSheet, Dimensions, Platform, PixelRatio } from 'react-native'

const window = Dimensions.get('window');

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
    HeaderStyle: {
        width: '100%',
        margin: 5,
        padding: 5,
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    HeaderText: {
        fontFamily: 'neuropol',
        fontSize: 30,
        textAlign: 'center',
        color: '#f2f2f2'
    },
    HeaderIcon: {
        width: window.height / 10,
        height: window.height / 10
    },
    BackButton: {
        position: 'absolute',
        zIndex: 9999,
        top: 5,
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
        fontSize: 18,
        color: '#ffffff',
        opacity: 0.9
    },
    Board: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    List: {
        width: window.width * 0.7,
        margin: 5,
        padding: 10,
        minHeight: 50,
        flexWrap: 'wrap',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 10,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 3,
        backgroundColor: '#ffffff'
    },
    Point: {
        position: 'absolute',
        top: 5,
        right: 5,
        fontFamily: 'neuropol',
        fontSize: 24,
        color: '#0c2f58'
    },
    NameText: {
        marginLeft: 10,
        fontSize: 16,
    },
    NumberText: {
        fontFamily: 'neuropol',
        fontSize: 14,
        color: '#555555'
    },
    MedalIcon: {
        width: 36,
        height: 36
    },
    AlertText: {
        width: '100%',
        padding: 5,
        color: '#ff6961',
        backgroundColor: '#f2f2f2',
        textAlign: 'center'
    }
});