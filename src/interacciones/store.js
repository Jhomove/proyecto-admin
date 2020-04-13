import React, { createContext, useReducer, useEffect } from 'react';
import interaccionesReducer from './reducers/interaccionesReducer';

export const StateContextInteractions = createContext();

const StateProviderInteractions = (props) => {
    const [title, dispatchInteractions] = useReducer(interaccionesReducer, "", () => {
        const localData = localStorage.getItem('title');
        return localData ? localData : "";
    });

    useEffect(() => {
        localStorage.setItem('title',title);
    }, [title]);
    return (
        <StateContextInteractions.Provider value={{title, dispatchInteractions}}>
            { props.children }
        </StateContextInteractions.Provider>
    )
}

export default StateProviderInteractions;
