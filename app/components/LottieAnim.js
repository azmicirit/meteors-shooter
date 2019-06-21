import React from 'react';
import { View } from 'react-native';
import { Asset, DangerZone } from 'expo';
const { Lottie } = DangerZone;

import Assets from '../assets/Assets';

export default class LottieAnim extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            animation: null,
            speed: props.speed || 10
        };
    }
    
    async componentDidMount() {       
        const asset = Asset.fromModule(Assets.animations[this.props.source]);
        await asset.downloadAsync();

        let json = await fetch(
            asset.localUri
        ).then(data => {
            return data.json();
        });

        this.setState({
            animation: json
        });
    }

    render() {
        return (
            <View style={this.props.style}>
                {this.state.animation &&
                    <Lottie
                        ref={animation => {
                            if(animation) {
                                this.animation = animation;
                                this.animation.play();
                            }
                        }}
                        style={{ width: '100%', height: '100%' }}
                        source={this.state.animation}
                        loop={true}
                        speed={this.state.speed}
                    />
                }
            </View>
        );
    }
}