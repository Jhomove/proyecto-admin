import React, { useEffect, useState, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField} from '@material-ui/core';
import { StateContextPostbacks } from '../../../postbacks/store';
import { establecerPostbacks } from '../../../actions/interactionsAction';
import { openMensajePantalla } from '../../../actions/snackbarAction';
import { StateContext } from '../../../sesion/store';
import { format } from 'morgan';

const defaultData = {
    title: '',
    description: '',
    key: ''
}

const Edit = props => {
    const [ dataPostback, setDataPostback ] = useState(defaultData);
    const { postbacks,dispatchPostbacks } = useContext(StateContextPostbacks);
    const [ data, dispatch ] = useContext(StateContext);
    const handleInputChange = event => {
        const target = event.currentTarget;
        const name = target.name;
        const value = target.value;
        setDataPostback({
            ...dataPostback,
            [name]: name === 'title' ? value.toUpperCase() : value
        });
    }
    const savePostback = async () => {
        const aux_data = {};
        for(const prop in dataPostback){
            if(dataPostback[prop] === ''){
                aux_data[prop] = props.data[prop];
            } else {
                aux_data[prop] = dataPostback[prop];
            }
        }
        const callback = await establecerPostbacks(props.firebase, 'api/update/postback', aux_data);
        if(callback.status === 200){
            dispatchPostbacks({type: 'UPDATE_POSTBACKS', data: aux_data})
            openMensajePantalla(dispatch, {
                open: true,
                mensaje: 'Se ha actualizado correctamente el postback.'
            })
        } else {
            openMensajePantalla(dispatch, {
                open: true,
                mensaje: 'Ha ocurrido un error al actualizar el postback.'
            })
        }
    }
    return (
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Editar Postback</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        En esta sección podrás actualizar el título y la descripción de un postback.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Título"
                        type="text"
                        name="title"
                        value={dataPostback.title || props.data.title}
                        onChange={handleInputChange}
                        fullWidth
                        disabled
                    />
                    <TextField
                        margin="dense"
                        id="description"
                        label="Descripción"
                        name="description"
                        value={dataPostback.description || props.data.description}
                        onChange={handleInputChange}
                        type="text"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} data-type="edit" color="primary">
                        Cancel
                    </Button>
                    <Button onClick={savePostback} color="primary">
                        Guardar
                    </Button>
                </DialogActions>
        </Dialog>
    );
}

export default Edit;