import types from './type';

export default {
  saveToubleLevel: (params) => ({type: types.SAVE_TROUBLE_LEVEL, troubleLevel: params}),
  saveToubleType: (params) => ({type: types.SAVE_TROUBLE_TYPE, troubleType: params}),
}

