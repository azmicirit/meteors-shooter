import { Constants } from 'expo';
import Axios from 'axios';

import { Preferences } from '../helpers';
import CONSTANTS from '../../Constants';

export default class Api {
    static async sendScore(point, callback) {
        let name = await Preferences.get('name');

        Axios.post(CONSTANTS.url + '/board',
            {
                device: Constants.deviceId,
                point: point,
                name: name
            }, {
                timeout: 3000,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        ).then(function (response) {        
            if(response.status === 200 && response.data.success) {
                callback({
                    success: true
                });
            } else {
                callback({
                    success: false
                });
            }
        }).catch(function (error) {
            callback({
                success: false,
                error: error
            });
        });
    }

    static listScores(callback) {
        Axios.get(CONSTANTS.url + '/board', {
            timeout: 3000,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function (response) {
            callback({
                success: response.status === 200 ? true : false,
                data: response.data
            });
        }).catch(function (error) {
            callback({
                success: false,
                error: error
            });
        });
    }
}