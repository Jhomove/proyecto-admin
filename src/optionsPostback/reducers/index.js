const optionsPostbackReducer = (state,action) => {
    switch (action.type) {
        case "ADD_TEXT":
            return [
                ...state,
                {
                    title: '',
                    type: 'text'
                }
            ]
        case "RESET_OPTIONS":
            return [];
        default:
            break;
    }
}

export default optionsPostbackReducer;