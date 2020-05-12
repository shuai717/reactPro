import {createStore,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import index from './reducer/index'
import {composeWithDevTools} from 'redux-devtools-extension'
export default createStore(index,composeWithDevTools(applyMiddleware(thunk)))