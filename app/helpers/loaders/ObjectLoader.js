import { Asset } from 'expo';
import ExpoTHREE, { THREE } from 'expo-three';
import Assets from '../../assets/Assets';

export default class ObjectLoader {
    async load(file) {
        return await ExpoTHREE.loadObjAsync({
            asset: Assets.objects[file]
        });
    }
}