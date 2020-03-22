import React, { createContext, useReducer } from 'react';
import interaccionesReducer from './reducers/interaccionesReducer';

export const StateContextInteractions = createContext();

const StateProviderInteractions = (props) => {
    const [title, dispatchInteractions] = useReducer(interaccionesReducer, "");
    return (
        <StateContextInteractions.Provider value={{title, dispatchInteractions}}>
            { props.children }
        </StateContextInteractions.Provider>
    )
}

export default StateProviderInteractions;
