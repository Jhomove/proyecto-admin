import React, { useContext, useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField} from '@material-ui/core';
import { StateContextPostbacks } from '../../../postbacks/store';
import { StateContext } from '../../../sesion/store';
import { openMensajePantalla } from '../../../actions/snackbarAction';
import { establecerPostbacks } from '../../../actions/interactionsAction';

const Delete = props => {
    const { postbacks,dispatchPostbacks } = useContext(StateContextPostbacks);
    const [ title, setTitle ] = useState();
    // const [ key, setKey ] = useState();
    const [ data, dispatch ] = useContext(StateContext);

    // useEffect(() => {
    //     console.log("props",props.key)
    //     setKey(props.key);
    // }, key);

    const deletePostback = async event => {
        if(props.data.title === title){
            //Eliminar
            const callback = await establecerPostbacks(props.firebase, 'api/delete/postback', {key: props.data.key});
            if(callback.status === 200){
                dispatchPostbacks({type: 'DELETE_POSTBACKS', data: props.data.key })
                openMensajePantalla(dispatch, {
                    open: true,
                    mensaje: 'Se ha eliminado correctamente el postback.'
                })
            } else {
                openMensajePantalla(dispatch, {
                    open: true,
                    mensaje: 'No se ha podido eliminar correctamente el postback.'
                })
            }
            props.setOpenDelete(false);
            setTitle("");
            return true;
        }else {
            openMensajePantalla(dispatch, {
                open: true,
                mensaje: 'No has escrito correctamente el nombre del postback.'
            })
            setTitle("");
            return false;
        }
    }

    const handleInputChange = event => {
        setTitle(event.target.value.toUpperCase());
    }

    return (
        <Dialog open={props.open} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Eliminar Postback</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        En esta sección eliminar un postback, confirma el título del postback que deseas eliminar.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        name="title"
                        label="Título"
                        placeholder={props.data.title}
                        type="text"
                        value={ title || ''}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button data-type="delete" onClick={props.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button  color="secondary" onClick={deletePostback}>
                        Eliminar
                    </Button>
                </DialogActions>
        </Dialog>
    );
};

export default Delete;