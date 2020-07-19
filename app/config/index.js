import { Dimensions, Platform } from 'react-native';

const Request = {
    // baseUrl: 'http://39.98.38.66:1001',
    // imgUrl: 'http://39.98.74.88:8888/',
    // upLoadImg: 'http://39.98.38.66:8240/',
    // productionUrl: 'http://39.98.38.66:1001',
    baseUrl: 'http://192.168.1.224:1001',
    imgUrl: 'http://192.168.1.220:8888/',
    upLoadImg: 'http://192.168.1.224:8240',
    productionUrl: 'http://192.168.1.224:1001',
    cameraImg: 'http://192.168.1.224:10800/api/v1/getsnap?channel=',
    cameraDes: 'rtmp://192.168.1.224:10935/hls/stream_',
    weatherUrl: 'http://39.98.38.66:9000/weather/weather.html',
    isAndroid: Platform.OS === 'android',
    VESION_NO: '2.2',
}
 
const Skin = {
    nowPage: 15,
    scrollHeight: 40,
    placeholderColor: '#BDBDBD',
    loginBgColor: '#fff',
    mainColor: '#fff',
    loadingBgColor: '#BDBDBD',
    loadingColor: '#00333f',
    menuColor: 'gray',
    otherColor: '#0248b8',
    bgColor: '#F2F2F2',
    borderColor: '#E0E0E0',
    errColor: '#FD6363',
    refuseColor: '#FA791D',
    fontColor: '#1B1B1B',
    mainWidth: Dimensions.get('window').width,
    mainHeight: Dimensions.get('window').height
}

export default {
    ...Request,
    ...Skin
}