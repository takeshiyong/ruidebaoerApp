import { AsyncStorage } from 'react-native';
import config from '../config';

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    }
    if (response.status === 203) {
      // 登录失效
    }
    return { success: false, msg: '请求异常' };
}

/**
 * 请求
 */
export default {
    /**
     * get请求 
     * @param {*} url 地址
     * @param {*} params  参数
     * @param {*} callback  成功后的回调
     */
    get: async (url, params = {}) => {
        let data;
        if (url.indexOf('production-security-service') != -1) {
            url = config.productionUrl + url;
        } else {
            url = config.baseUrl + url;
        }
        let dataStr = ''; //数据拼接字符串
        Object.keys(params).forEach(key => {
            dataStr += key + '=' + params[key] + '&';
        });
        if (dataStr !== '') {
            dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
            url = url + '&' + dataStr;
        }
        console.log('url', url)
        await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': await AsyncStorage.getItem('token')
            }
        })
            .then((response) => {
                return checkStatus(response);
            })
            .then((responseData) => {
                console.log('responseDataPost', responseData);
                data = responseData
            }).catch(error => {
                console.log('errorGet', error);
                data = {
                    success: false,
                    msg: '请求异常'
                }
            });
        return data
    },

    /**
     * @param {*} url 
     * @param {*} service 
     * @param {*} params 
     * @param {*} callback 
     */
    post: async (url, params = {}) => {
        let data
        if (url.indexOf('production-security-service') != -1) {
            url = config.productionUrl + url;
        } else {
            url = config.baseUrl + url;
        }
        console.log('post', url, params);
        await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': await AsyncStorage.getItem('token')
            },
            body: JSON.stringify(params)
        })
            .then((response) => {
                console.log(response)
                return checkStatus(response);
            })
            .then((responseData) => {
                data = responseData
                console.log('responseData', responseData);
            }).catch(error => {
                console.log('error', error);
                data = {
                    success: false,
                    msg: '请求异常'
                }
            });
        return data
    },
    /**
     * @param {*} url
     * @param {*} service
     * @param {*} params
     * @param {*} callback
     */
    postFile: async (url, file) => {
        let data
        console.log('config.upLoadImg + url', config.upLoadImg + url)
        await fetch(config.upLoadImg + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'token': await AsyncStorage.getItem('token')
            },
            body: file
        })
            .then((response) => {
                return checkStatus(response);
            })
            .then((responseData) => {
                data = responseData
            }).catch(error => {
                console.log('请求异常', error);
                data = {
                    success: false,
                    msg: '请求异常'
                }
            });
        return data
    }
}
