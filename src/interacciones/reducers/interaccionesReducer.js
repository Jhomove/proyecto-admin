export const initialState = {
    titulo: ""
}

const interaccionesReducer = (state,action) => {
    switch (action.type) {
        case "CAMBIAR_TITULO":
            return action.title;
    
        default:
            return state;
    }
}

export default interaccionesReducer;