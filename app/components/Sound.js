import { Audio } from 'expo';
import Assets from '../assets/Assets';

export default class Sound {
    constructor() {
        this.playbackObject = new Audio.Sound();
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        });
    }

    async load(source) {
        const status = await this.playbackObject.getStatusAsync();

        if (status.isLoaded && status.uri === source.uri) {
            return false;
        } else if (status.isLoaded) {
            if (status.isPlaying) {
                await this.playbackObject.stopAsync();
            }
            await this.playbackObject.unloadAsync();
        }

        await this.playbackObject.loadAsync(Assets.audio[source]);
        return this;
    }

    async play(enabled) {
        if (enabled) {
            await this.playbackObject.playFromPositionAsync(0);
        }
    }

    async stop() {
        await this.playbackObject.stopAsync();
    }
}