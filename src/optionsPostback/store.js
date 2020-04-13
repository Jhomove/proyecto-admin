import React, { Component, createContext, useReducer } from 'react';
import optionsPostbackReducer from './reducers';

export const ContextOptionsPostback = createContext();

const ProviderOptionsPostback = props => {
    const [ optionsPostback, dispatchOptionsPostback ] = useReducer(optionsPostbackReducer,[]);

    return (
        <ContextOptionsPostback.Provider value={{ optionsPostback, dispatchOptionsPostback }}>
            { props.children }
        </ContextOptionsPostback.Provider>
    )
}

export default ProviderOptionsPostback;