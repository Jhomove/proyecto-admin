import React, { createContext, useReducer, useEffect } from 'react';
import intentsReducer from './reducers';

export const ContextIntents = createContext();

const IntentsProvider = props => {
    const [ intents, dispatchIntents ] = useReducer(intentsReducer, [], () => {
        const local_data = JSON.parse(localStorage.getItem('intenciones'));
        return local_data ? local_data : [];
    });

    useEffect(() => {
        if(intents !== null || !intents.length){
            //Realizar llamada api para obtener las intenciones
            let aux_intents = typeof intents === 'string' ? JSON.parse(intents) : intents;
            console.log("aux_intents",aux_intents);
            localStorage.setItem('intents', JSON.stringify(aux_intents))
        }
    })

    return (
        <ContextIntents.Provider value={{ intents, dispatchIntents }}>
            {props.children}
        </ContextIntents.Provider>
    )
}

export default IntentsProvider;