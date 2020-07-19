import types from './type';

export default {
  saveDeviceType: (typeList) => ({type: types.SAVE_DEVICE_TYPE, typeList}),
}

