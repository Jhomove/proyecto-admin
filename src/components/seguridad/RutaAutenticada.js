import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useStateValue } from '../../sesion/store';

function RutaAutenticada({component: Component, autenticadoFirebase, ...rest}){
    
    const [{autenticado}, dispatch] = useStateValue();

    return (
        <Route
            {...rest}
            render={(props) => (autenticado === true || autenticadoFirebase !== null)
            ? <Component {...props} {...rest} />
            : <Redirect to="/auth/login"/>
            }
        />
    )
}

export default RutaAutenticada;