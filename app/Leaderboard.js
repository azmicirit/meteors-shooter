import React from 'react';
import { View, ScrollView, ImageBackground, Dimensions, Text, Image, ActivityIndicator } from 'react-native';

import { TextIcon } from './components';
import { Api } from './helpers';

import Styles from './styles/Leaderboard';
import Assets from './assets/Assets';

export default class Leaderboard extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        const window = Dimensions.get('window');
        this.state = {
            window: window,
            loading: true,
            list: [],
            alert: null
        };
    }

    componentDidMount() {
        let self = this;
        
        this.MOUNTED = true;
        Api.listScores(function (result) {
            if (result.success) {
                self.set({
                    loading: false,
                    list: result.data
                });
            } else {
                self.set({
                    loading: false,
                    alert: 'Network Error! Please try again later.'
                });
            }
        });
    }

    componentWillUnmount() {
        this.MOUNTED = false;
    }

    set(state) {
        if (this.MOUNTED) {
            this.setState(state);
        }
    }

    render() {
        let { list } = this.state;

        return (
            <View style={Styles.MainView}>
                <ImageBackground
                    style={Styles.BackGround}
                    source={Assets.icons.boardback}>
                    <TextIcon
                        style={Styles.BackButton}
                        textStyle={Styles.BackButtonText}
                        text={'Back'}
                        imageStyle={Styles.BackButtonIcon}
                        iconSource={'back'}
                        onTouchStart={this.exit.bind(this)}
                    />
                    <TextIcon
                        style={Styles.HeaderStyle}
                        textStyle={Styles.HeaderText}
                        imageStyle={Styles.HeaderIcon}
                        text={'Leaderboard'}
                        iconSource={'fireworks'} />
                    {
                        this.state.loading ? (<ActivityIndicator size='large' color='#f2f2f2' />) : (
                            this.state.alert ? (<Text style={Styles.AlertText}>{this.state.alert}</Text>) : (
                                <ScrollView>
                                    <View style={Styles.Board}>
                                        {
                                            list.map((item, index) => (
                                                <View key={item.device} style={Styles.List}>
                                                    {
                                                        index < 3 ?
                                                            (<Image source={Assets.icons['medal-' + (index + 1)]} style={Styles.MedalIcon}></Image>) :
                                                            (<Text style={Styles.NumberText}>{index + 1}</Text>)
                                                    }
                                                    <Text style={Styles.NameText}>{item.name}</Text>
                                                    <Text style={Styles.Point}>{item.point}</Text>
                                                </View>
                                            ))
                                        }
                                    </View>
                                </ScrollView>
                            )
                        )
                    }

                </ImageBackground>
            </View>
        );
    }

    exit() {
        const { navigate } = this.props.navigation;
        navigate('Main', {});
    }
}