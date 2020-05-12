import {combineReducers} from 'redux'
import index from './indexReducer'
import search from './searchReducer'
export default combineReducers({
    index,
    search
})