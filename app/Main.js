import React from 'react';
import { View, ScrollView, ImageBackground, Animated, Dimensions, Text, TextInput, Alert } from 'react-native';
import Modal from "react-native-modal";
import { LoaderManager, Preferences } from './helpers';

import { LottieAnim, TextIcon } from './components';

import Styles from './styles/Main';
import Assets from './assets/Assets';

export default class Main extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        const window = Dimensions.get('window');
        this.state = {
            window: window,
            loading: false,
            showOptions: false,
            loadingAnim: {
                translateY: new Animated.Value(window.height),
                opacity: new Animated.Value(0)
            }
        };
    }

    async componentWillMount() {
        let name = Preferences.get('name');
        let fireColor = Preferences.get('fireColor');
        let mute = Preferences.get('mute');

        this.setState({
            name: await name,
            fireColor: await fireColor || '#ffffff',
            mute: await mute === 'true' ? true : false
        });

        this.props.navigation.addListener('willFocus', this.onNavigationWillFocus.bind(this));
    }

    render() {
        return (
            <View style={Styles.MainView}>
                <ImageBackground
                    style={Styles.BackGround}
                    source={Assets.icons.menuback}>
                    {
                        this.state.loading && <LottieAnim
                            source={'spacecraft'}
                            style={Styles.Loading}
                        />
                    }
                    <TextIcon style={Styles.Banner} textStyle={Styles.BannerText} text={'Meteors Shooter'}></TextIcon>
                    <Animated.View style={[Styles.MenuView, {
                        transform: [{ translateY: this.state.loadingAnim.translateY }],
                        opacity: this.state.loadingAnim.opacity
                    }]}>
                        <TextIcon
                            style={Styles.MenuStyle}
                            textStyle={Styles.MenuText}
                            imageStyle={Styles.MenuIcon}
                            text={'Start'}
                            iconSource={'rocket'}
                            onTouchStart={this.startGame.bind(this)} />
                        <TextIcon
                            style={Styles.MenuStyle}
                            textStyle={Styles.MenuText}
                            imageStyle={Styles.MenuIcon}
                            text={'Leaderboard'}
                            iconSource={'fireworks'}
                            onTouchStart={this.openLeaderboard.bind(this)}
                        />
                        <TextIcon
                            style={Styles.MuteStyle}
                            imageStyle={Styles.MuteIcon}
                            iconSource={this.state.mute ? 'unmute' : 'mute'}
                            loadFont={false}
                            onTouchStart={this.mute.bind(this)}
                        />
                        <TextIcon
                            style={Styles.OptionsStyle}
                            imageStyle={Styles.OptionsIcon}
                            iconSource={'settings'}
                            loadFont={false}
                            onTouchStart={this.openOptions.bind(this)}
                        />
                    </Animated.View>
                </ImageBackground>
                <Modal isVisible={this.state.showOptions} backdropOpacity={0.9}>
                    <ScrollView>
                        <View style={Styles.MenuView}>
                            <View style={{ flex: 1 }}>
                                <Text style={Styles.MenuText}>Name</Text>
                                <TextInput
                                    style={Styles.Input}
                                    onChangeText={(text) => this.setState({ name: text })}
                                    value={this.state.name}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={Styles.MenuText}>Fire Color</Text>
                                <View style={Styles.ColorContainer}>
                                    <View style={[Styles.ColorBox, { backgroundColor: '#ffffff', borderWidth: this.state.fireColor === '#ffffff' ? 0 : 5 }]} onTouchStart={() => this.setState({ fireColor: '#ffffff' })}></View>
                                    <View style={[Styles.ColorBox, { backgroundColor: '#ffb347', borderWidth: this.state.fireColor === '#ffb347' ? 0 : 5 }]} onTouchStart={() => this.setState({ fireColor: '#ffb347' })}></View>
                                    <View style={[Styles.ColorBox, { backgroundColor: '#966fd6', borderWidth: this.state.fireColor === '#966fd6' ? 0 : 5 }]} onTouchStart={() => this.setState({ fireColor: '#966fd6' })}></View>
                                    <View style={[Styles.ColorBox, { backgroundColor: '#c23b22', borderWidth: this.state.fireColor === '#c23b22' ? 0 : 5 }]} onTouchStart={() => this.setState({ fireColor: '#c23b22' })}></View>
                                    <View style={[Styles.ColorBox, { backgroundColor: '#779ecb', borderWidth: this.state.fireColor === '#779ecb' ? 0 : 5 }]} onTouchStart={() => this.setState({ fireColor: '#779ecb' })}></View>
                                    <View style={[Styles.ColorBox, { backgroundColor: '#03c03c', borderWidth: this.state.fireColor === '#03c03c' ? 0 : 5 }]} onTouchStart={() => this.setState({ fireColor: '#03c03c' })}></View>
                                </View>
                            </View>
                            <View style={{ flex: 1, paddingTop: 20 }}>
                                <TextIcon style={Styles.MenuStyle} textStyle={Styles.MenuText} text={'Save'} onTouchStart={this.save.bind(this)} />
                            </View>
                        </View>
                    </ScrollView>
                </Modal>
            </View>
        );
    }

    showMenu(set) {
        Animated.timing(this.state.loadingAnim.translateY, {
            toValue: set ? 0 : -this.state.window.height,
            duration: 1000
        }).start();
        Animated.timing(this.state.loadingAnim.opacity, {
            toValue: set ? 1 : 0,
            duration: 1000
        }).start();
    }

    onNavigationWillFocus() {
        this.showMenu(true);
    }

    async save() {
        let { name, fireColor } = this.state;
        if (name && name.length > 0) {
            await Preferences.set('name', name);
            await Preferences.set('fireColor', fireColor);

            this.setState({
                name: name,
                fireColor: fireColor,
                showOptions: false
            });
        } else {
            Alert.alert('Please enter your name!');
        }
    }

    async mute() {
        let mute = await Preferences.get('mute');
        Preferences.set('mute', mute === 'true' ? 'false' : 'true');
        this.setState({
            mute: mute === 'true' ? false : true
        });
    }

    openLeaderboard() {
        const { navigate } = this.props.navigation;
        navigate('Leaderboard', {});
    }

    openOptions() {
        this.setState({
            showOptions: true
        });
    }


    async startGame() {
        let self = this;
        let name = await Preferences.get('name');
        const { navigate } = this.props.navigation;
        
        if(!(name && name.length > 0)) {
            this.openOptions();
            return;
        }

        this.setState({
            loading: true
        });

        this.showMenu(false);

        LoaderManager.load(null, function (counter, total) {
            setTimeout(() => {
                self.setState({
                    loading: false
                });
                
                navigate('Game', {
                    soundEnabled: !self.state.mute,
                    fire: {
                        color: self.state.fireColor
                    }
                });
            }, 1000);
        });
    }
}