const IntentsReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_INTENT':
            console.log("state",state);
            console.log("action",action.data);
            return([
                ...state,
                action.data
            ])
        case 'UPDATE_INTENT':
            const update_data = state.map(data => {
                if(data.name === action.data.name)
                    return action.data
                return data;
            })
            return(update_data)
        default:
            break;
    }
}

export default IntentsReducer;