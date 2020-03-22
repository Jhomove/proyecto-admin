import React, {useContext, useState, useEffect } from 'react';
import { StateContextInteractions } from '../../../interacciones/store';
import { StateContext } from '../../../sesion/store';
import { compose } from 'recompose';
import { obtenerInteracciones, actualizarInteraccion } from '../../../actions/interactionsAction';
import { openMensajePantalla } from '../../../actions/snackbarAction';
import { Container, Typography, Grid, TextField, CircularProgress, Button } from '@material-ui/core';
import { consumerFirebase } from '../../../server';
import { withRouter } from 'react-router-dom';

const MensajeBievenida = (props) => {

    const { dispatchInteractions } = useContext(StateContextInteractions);
    const [data, dispatch] = useContext(StateContext);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = React.useState(false);
    const [estado, cambiarEstado ] = useState({
        firebase: null,
        'button-title': "",
        interacciones: [],
        menus: []
    })

    useEffect(() => {
        cambiarEstado(prevState => {
          const data = [...prevState.interacciones];
          if(props.firebase !== prevState.firebase)
              prevState.firebase = props.firebase;            
          return { ...prevState, data }
        });
        getInteractions();
      }, [props])

    const getInteractions = async () => {
        const {firebase, data} = estado;
        setLoading(true);
        if(title === ''){
          const callback = await obtenerInteracciones(firebase, '/api/read/configuraciones/greeting');
          setTitle(callback.data);
          dispatchInteractions({
            type: "CAMBIAR_TITULO",
            title: title
          });
        }
        setLoading(false);
      }

      const guardarCambios = async e => {
        e.preventDefault();
        setLoading(true);
        const {firebase, data } = estado;
        const callback = await actualizarInteraccion(firebase, '/api/update/configuracion/greeting', {titulo: title});
        setLoading(false);
        if(callback.status){
          openMensajePantalla(dispatch, {
            open: true,
            mensaje: "Se actualizo correctamente el título"
          })
        } else{
          openMensajePantalla(dispatch, {
            open: true,
            mensaje: "Ha ocurrido un error al tratar de actualizar el título"
          })
        }
      };

    return(
        <Container component="main" maxWidth="md" >
            <div className="title" style={props.style.title}>
            <Typography component="h1" variant="h5">
                Mensaje de Bienvenida
            </Typography>
            </div>
            <div className="section">
                <p>Aquí podras configurar el mensaje de Bienvenida de tú asistente virtual.</p>
                <form style={props.style.form}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                            <TextField
                            name="titulo"
                            variant="outlined"
                            fullWidth 
                            label="Título"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            />
                        </Grid>
                        {                            
                            loading ? <Grid container justify="center"><CircularProgress /> </Grid>: ''
                        }
                        <Grid container justify="center">
                            <Grid item xs={12} md={6}>
                                <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                style={props.style.submit}
                                onClick={guardarCambios}
                                disabled={loading}
                            >
                                Guardar Cambios
                            </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}

export default compose(consumerFirebase, withRouter)(MensajeBievenida);