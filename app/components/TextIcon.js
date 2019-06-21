import React from 'react';
import { View, Text, Image } from 'react-native';
import { Font } from 'expo';
import Assets from '../assets/Assets';

export default class TextIcon extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadFont: this.props.loadFont != null ? this.props.loadFont : true,
            fontLoaded: false
        };
    }

    async componentDidMount() {
        if(this.state.loadFont) {
            await Font.loadAsync({
                'neuropol': Assets.fonts['neuropol']
            });
        }

        this.setState({ fontLoaded: true });
    }

    render() {
        return (
            <View style={this.props.style} onTouchStart={this.props.onTouchStart}>
                <Image
                    source={Assets.icons[this.props.iconSource]}
                    style={this.props.imageStyle}
                />
                {
                    (this.state.fontLoaded && this.state.loadFont) && (
                        <Text style={this.props.textStyle}>{this.props.text}</Text>
                    )
                }
            </View>
        );
    }
}