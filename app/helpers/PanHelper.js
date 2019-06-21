import { PanResponder } from "react-native";

export default class PanHelper {
    constructor(onPanResponderGrant, onPanResponderMove, onPanResponderRelease) {
        return PanResponder.create({
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderGrant: onPanResponderGrant,
            onPanResponderMove: onPanResponderMove,
            onPanResponderRelease: onPanResponderRelease
        });
    }
}