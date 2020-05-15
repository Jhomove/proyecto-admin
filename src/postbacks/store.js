import React, { createContext, useReducer, useEffect, useState } from 'react';
import postbacksReducers from './reducers';
import { obtenerPostbacks } from '../actions/interactionsAction';

export const StateContextPostbacks = createContext();


const StateProviderPostbacks = props => {
    const [ postbacks, dispatchPostbacks ] = useReducer(postbacksReducers,[],() => {
        const localData = JSON.parse(localStorage.getItem('postbacks'));
        return localData ? localData : [];
    });

    useEffect(() => {
        if(postbacks !== null && postbacks.length){
            let aux_postbacks = typeof postbacks === "string" ? JSON.parse(postbacks) : postbacks;
            localStorage.setItem('postbacks',JSON.stringify(aux_postbacks));
        }
    }, [postbacks]);
    return (
        <StateContextPostbacks.Provider value={{postbacks,dispatchPostbacks}}>
            { props.children }
        </StateContextPostbacks.Provider>
    );
}

export default StateProviderPostbacks;