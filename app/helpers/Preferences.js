import { AsyncStorage } from 'react-native';

export default class Preferences {
    static async get(key) {
        try {
            return await AsyncStorage.getItem('@MeteorsShooter:' + key);
        } catch (error) {
            return null;
        }
    }

    static async set(key, value) {
        try {
            await AsyncStorage.setItem('@MeteorsShooter:' + key, value);
            return true;
        } catch (error) {
            return false;
        }
    }

    static async delete(key) {
        try {
            await AsyncStorage.removeItem('@MeteorsShooter:' + key);
            return true;
        } catch (error) {
            return false;
        }
    }
}