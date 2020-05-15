import React, { useState, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField} from '@material-ui/core';
import { StateContextPostbacks } from '../../../postbacks/store';
import { establecerPostbacks } from '../../../actions/interactionsAction';
import { openMensajePantalla } from '../../../actions/snackbarAction';
import { StateContext } from '../../../sesion/store';

const dataPostbackDefault = {
    title: '',
    description: ''
}

const Create = props => {
    const { postbacks,dispatchPostbacks } = useContext(StateContextPostbacks);
    const [ data, dispatch ] = useContext(StateContext);
    const [ dataPostback, setDataPostback ] = useState(dataPostbackDefault);
    
    const savePostback = async () => {
        const format_title = dataPostback.title.trim();
        const key = format_title.replace(/\s/g,"_");
        const match = postbacks.filter(postback => postback.key === key)
        if(match.length){
            openMensajePantalla(dispatch, {
                open: true,
                mensaje: 'Ya existe un postback con el mismo título.'
            })
            setDataPostback(dataPostbackDefault);
            return false;
        }
        const format_data = {
            ...dataPostback,
            content: [],
            key: key
        }
        format_data.title = format_title;
        const callback = await establecerPostbacks(props.firebase, 'api/create/postback', format_data);
        if(callback.status === 200){
            dispatchPostbacks({type: 'ADD_POSTBACKS', data: format_data})
            openMensajePantalla(dispatch, {
                open: true,
                mensaje: 'Se ha creado correctamente el postback.'
            })
        } else {
            openMensajePantalla(dispatch, {
                open: true,
                mensaje: 'Ha ocurrido un error al crear el postback.'
            })
        }
        setDataPostback(dataPostbackDefault)
    }

    const handleInputChange = event => {
        const target = event.currentTarget;
        const name = target.name;
        const value = target.value;
        setDataPostback({
            ...dataPostback,
            [name]: name === 'title' ? value.toUpperCase() : value
        });
    }
    return (
        <Dialog open={props.open} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Crear Postback</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        En esta sección podrás crear el título y la descripción de un postback.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        name="title"
                        label="Título"
                        type="text"
                        value={dataPostback.title || ''}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="description"
                        name="description"
                        label="Descripción"
                        value={dataPostback.description || ''}
                        onChange={handleInputChange}
                        type="text"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button data-type="create" onClick={props.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={savePostback} color="primary">
                        Guardar
                    </Button>
                </DialogActions>
        </Dialog>
    );
}

export default Create;