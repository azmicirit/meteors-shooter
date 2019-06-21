import React from 'react';
import { Animated, View } from 'react-native';

export default class Joystick extends React.Component {
    constructor(props) {
        super(props);
        this.props.onChanged = this.props.onChanged || Function.prototype;

        this.state = {
            size: this.props.size,
            top: new Animated.Value(this.props.size / 4),
            left: new Animated.Value(this.props.size / 4),
            location: {
                x: 0,
                y: 0
            },
            prevLocation: {
                x: 0,
                y: 0
            }
        };
    }

    render() {
        let { top, left, size } = this.state;

        return (
            <View style={{
                position: 'absolute',
                left: this.props.left,
                right: this.props.right,
                top: this.props.top,
                bottom: this.props.bottom,
                backgroundColor: '#000000',
                borderRadius: 50,
                opacity: 0.5,
                width: size,
                height: size
            }}
                onTouchStart={this.onPanResponderGrant.bind(this)}
                onTouchMove={this.onPanResponderMove.bind(this)}
                onTouchEnd={this.onPanResponderRelease.bind(this)}>
                <Animated.View
                    style={{
                        position: 'absolute',
                        backgroundColor: '#f2f2f2',
                        width: size / 2,
                        height: size / 2,
                        borderRadius: size / 4,
                        left: left,
                        top: top
                    }} />
            </View>
        );
    }

    onPanResponderGrant(e, gestureState) {
        this.moveJoystick(e.nativeEvent.locationX, e.nativeEvent.locationY);
        this.updateEvent('grant', e.nativeEvent);
    }

    onPanResponderMove(e, gestureState) {
        this.moveJoystick(e.nativeEvent.locationX, e.nativeEvent.locationY);
        this.updateEvent('move', e.nativeEvent);
    }

    onPanResponderRelease(e) {
        this.moveJoystick(this.state.size / 4, this.state.size / 4);
        this.updateEvent('release', e.nativeEvent);
    }

    updateEvent(type, loc) {
        let x = (this.state.location.x / this.state.size) * 2 - 1;
        let y = -(this.state.location.y / this.state.size) * 2 + 1;

        let diffX = loc.locationX - this.state.prevLocation.x;
        let diffY = loc.locationY - this.state.prevLocation.y;

        this.state.prevLocation.x = loc.locationX;
        this.state.prevLocation.y = loc.locationY;

        let direction = {
            forward: y > 0 ? true : false,
            back: y < 0 ? true : false,
            left: x < 0 ? true : false,
            right: x > 0 ? true : false,
        };

        this.props.onChanged({
            type: type,
            loc: loc,
            direction: direction,
            diff: {
                x: diffX,
                y: diffY
            }
        });
    }

    moveJoystick(x, y) {
        this.state.location.x = x + (this.state.size / 4);
        this.state.location.y = y + (this.state.size / 4);

        Animated.timing(
            this.state.top,
            {
                toValue: y,
                duration: 100,
            }
        ).start();

        Animated.timing(
            this.state.left,
            {
                toValue: x,
                duration: 100,
            }
        ).start();
    }
}