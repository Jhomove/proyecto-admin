
const postbacksReducers = (state,action) => {
    let new_data;
    switch (action.type) {
        case "ADD_POSTBACKS":
            return [
                ...state,
                action.data
            ]
        case "UPDATE_POSTBACKS":
            new_data = state.map(postback => {
                if(postback.key === action.data.key){
                    return action.data;
                }
                return postback;
            })
            return new_data;
        case "DELETE_POSTBACKS":
            new_data = state.filter(postback => postback.key !== action.data)
            return new_data;
        default:
            break;
    }
}

export default postbacksReducers;