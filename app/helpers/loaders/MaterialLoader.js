import { Asset } from 'expo';
import ExpoTHREE, { THREE } from 'expo-three';
import Assets from '../../assets/Assets';

export default class MaterialLoader {
    async load(file) {
        const asset = Asset.fromModule(Assets.textures[file]);
        await asset.downloadAsync();
        const map = await ExpoTHREE.loadAsync(asset);
        return map;
    }

    async getTexture(file) {
        return await ExpoTHREE.loadTextureAsync({ asset: Assets.textures[file] });
    }
}