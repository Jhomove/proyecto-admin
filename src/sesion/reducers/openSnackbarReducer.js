const initialState = {
    open : false,
    mensaje : ""
}

const openSnackbarReducer = (state = initialState, action) => {
    switch (action.type) {
        case "OPEN_SNACKBAR":
            return {
                ...state,
                open : action.openMensaje.open,
                mensaje: action.openMensaje.mensaje
            }
            break;
    
        default:
            return state;
            break;
    }
}

export default openSnackbarReducer;