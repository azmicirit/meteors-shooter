import React from 'react';
import { View, ImageBackground, Image } from 'react-native';
import Assets from '../assets/Assets';

export default class Compass extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            size: this.props.size,
            rotate: 0,
            positions: []
        };
    }

    render() {
        let { size } = this.state;

        return (
            <ImageBackground
                source={Assets.icons.compass}
                style={this.props.styles}>
                <Image
                    style={[{
                        position: 'absolute',
                        width: 12,
                        height: 12,
                        top: size / 2 - 6,
                        left: size / 2 - 6
                    }, {
                        transform: [{ rotate: -this.state.rotate + 'deg' }]
                    }]}
                    source={Assets.icons.arrowt}
                    ref={ref => this.arrow = ref}
                >

                </Image>
                {
                    this.state.positions.map(position => {
                        if (Math.sqrt((position.x * position.x) + (position.z * position.z)) < size / 2 - 10) {
                            return (
                                <View key={position.id}
                                    style={{
                                        position: 'absolute',
                                        zIndex: 3000,
                                        width: 5,
                                        height: 5,
                                        borderRadius: 2.5,
                                        backgroundColor: '#' + position.color.toString(16),
                                        top: position.z + size / 2,
                                        left: position.x + size / 2,
                                        shadowColor: '#ffffff',
                                        shadowOpacity: 1,
                                        shadowOffset: { width: 1, height: 1 },
                                        shadowRadius: 6
                                    }}
                                />
                            )
                        }
                    })
                }
            </ImageBackground>
        );
    }

    async setPositions(positions) {
        this.setState({
            positions: positions
        });
    }

    async setRotation(rotation) {
        this.arrow.setNativeProps({
            transform: [{ rotate: -rotation + 'deg' }]
        });
    }
}