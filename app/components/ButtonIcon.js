import React from 'react';
import { View, Image } from 'react-native';
import Assets from '../assets/Assets';

export default class ButtonIcon extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.visible) {
            return (
                <View style={this.props.parentStyle}
                    onTouchStart={this.props.onTouchStart}
                    onTouchEnd={this.props.onTouchEnd}
                    ref={ref => this.parent = ref}>
                    <Image
                        source={Assets.icons[this.props.iconSource]}
                        style={this.props.imageStyle}
                        ref={ref => this.image1 = ref}
                    />
                    <Image
                        source={Assets.icons[this.props.iconSource1]}
                        style={this.props.imageStyle1}
                        ref={ref => this.image2 = ref}
                    />
                </View>
            );
        } else {
            return null;
        }
    }

    setParentProps(parentProps) {
        parentProps = parentProps || {};

        if (this.parent) {
            this.parent.setNativeProps(parentProps);
        }
    }

    setImageProps(image1Props, image2Props) {
        image1Props = image1Props || {};
        image2Props = image2Props || {};

        if (this.image1 && this.image2) {
            this.image1.setNativeProps(image1Props);
            this.image2.setNativeProps(image2Props);
        }
    }
}