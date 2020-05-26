import React, { useState, useContext, useEffect } from 'react';
import { Button, TextField } from '@material-ui/core';
import TableIntents from './TableIntents';
import TableResponses from './TableResponses';
import { ContextIntents } from './store';
import { StateContext } from '../../sesion/store';
import { openMensajePantalla } from '../../actions/snackbarAction';
import { consumerFirebase } from '../../server';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { obtenerPostbacks, establecerPostbacks } from '../../actions/interactionsAction';

const styles = {
    containerGeneral: {
        width: '100%',
        padding: '25px 50px 50px'
    }
}

const default_data = {
    says: [],
    responses   : []
}

const CrearIntenciones = props => {
    const [ intent, setIntent ] = useState(default_data);
    const [ data, dispatch ] = useContext(StateContext);
    const [ firebase, setFirebase ] = useState();

    const { intents, dispatchIntents } = useContext(ContextIntents);

    const handleInputChange = event => {
        const { name, value } = event.target;

        setIntent({
            ...intent,
            [ name ] : value
        })
    }

    const handleSaveIntents = async event => {
        if((intent.name === undefined || intent.name === "")|| (intent.description === undefined || intent.description === "")){
            openMensajePantalla(dispatch, {
                open: true,
                mensaje: 'Debes diligenciar el nombre y la descripción de la intención.'
            })
            return false;
        }
        console.log("intents",intents);
        const match = intents.filter(elem => intent.name = elem.name)
        console.log("match",match);
        if(!match.length)
            dispatchIntents({ type: 'ADD_INTENT', data: intent});
        else
            dispatchIntents({ type: 'UPDATE_INTENT', data: intent})
        const callback = await establecerPostbacks(firebase, 'api/create/intent',intent);
    }

    useEffect(() => {
        if(props.firebase !== firebase)
            setFirebase(props.firebase)
    }, [props])

    return(
        <div style={styles.containerGeneral}>
            <Button variant="contained" color="primary" onClick={handleSaveIntents}>
                + Crear
            </Button>
            <h2>Crear Nueva Intención</h2>
            <p>Las intenciones son dichos de usuario agrupados con un propósito similar. Por ejemplo, un usuario puede decir: "Hola", "Buenos días" y eso se puede agrupar con la intención de "Saludos"</p>
            <TextField
                autoFocus
                margin="normal"
                id="intent-name"
                name="name"
                label="Nombre de la intención"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
            />
            <TextField 
                margin="normal"
                id="intent-description"
                name="description"
                label="Descripción de la intención"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
            />
            <div className="content-users-says">
                <TableIntents intent={intent} setIntent={setIntent} intents={intents}/>
            </div>
            <div className="content-reponses-to-users">
                <TableResponses intent={intent} setIntent={setIntent} />
            </div>
        </div>
    );
}

export default compose(consumerFirebase, withRouter)(CrearIntenciones);