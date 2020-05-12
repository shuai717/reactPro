import {GETINDEX} from '../action_type'
export default function(preState={},action){
    let newState;
    const {type,data}=action

    switch (type) {
        case GETINDEX:
            newState={...data,...preState}
            return newState
    
        default:
            return preState
    }
}