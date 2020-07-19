import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import { userReducer } from './userReducer';
import { troubleReducer } from './troubleReducer';
import { collegeReducer } from './collegeReducer';
import { meetingReducer } from './meetingReducer';
import { deviceReducer } from './deviceReducer';

const reducers = combineReducers({
    userReducer,
    troubleReducer,
    collegeReducer,
    meetingReducer,
    deviceReducer
});

const store = createStore(reducers, applyMiddleware(thunk));
export default store