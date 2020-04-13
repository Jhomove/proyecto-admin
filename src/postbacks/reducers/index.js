
const postbacksReducers = (state,action) => {
    switch (action.type) {
        case "ADD_POSTBACKS":
            return [
                ...state,
                action.data
            ]
        default:
            break;
    }
}

export default postbacksReducers;