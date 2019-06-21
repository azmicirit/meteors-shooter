import { ObjectLoader, MaterialLoader } from './loaders/index';
import Assets from '../assets/Assets';

export default class LoaderManager {
    static counter = 0;
    static total = 0;

    static objects = {};
    static textures = {};

    static async load(counterCallback, completeCallback) {
        counterCallback = counterCallback ? counterCallback : Function.prototype;
        completeCallback = completeCallback ? completeCallback : Function.prototype;

        LoaderManager.counter = 0;
        LoaderManager.total = Object.keys(Assets.objects).length + Object.keys(Assets.textures).length;

        for (let key in Assets.objects) {
            let objectLoader = new ObjectLoader();
            let object = await objectLoader.load(key);
            LoaderManager.objects[key] = object;
            LoaderManager.counter++;
            counterCallback(LoaderManager.counter, LoaderManager.total);
        }

        for (let key in Assets.textures) {
            let materialLoader = new MaterialLoader();
            let texture = await materialLoader.load(key);
            LoaderManager.textures[key] = texture;
            LoaderManager.counter++;
            counterCallback(LoaderManager.counter, LoaderManager.total);
        }

        completeCallback(LoaderManager.counter, LoaderManager.total);
    }
}