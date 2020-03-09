import React, { useEffect,useState,useContext } from 'react';
import MaterialTable from 'material-table';
import { Grid, Container, Paper, Breadcrumbs, Link, Typography, IconButton } from '@material-ui/core';
import { compose } from 'recompose';
import { consumerFirebase } from '../server';
import {openMensajePantalla} from '../actions/snackbarAction';
import {StateContext} from '../sesion/store';
import HomeIcon from '@material-ui/icons/Home';
import { withRouter } from "react-router-dom";
import { eliminarUsuario, actualizarUsuario } from '../actions/sesionAction';

const style = {
    cardGrid : {
        paddingTop: 8,
        paddingBottom: 8
    },
    paper: {
        backgroudColor: "#f5f5f5",
        padding: "20px",
        minHeight: 650
    },
    link: {
        display: "flex"
    },
    gridTextfield: {
        marginTop: "20px"
    },
    card: {
        height: "100%",
        display: "flex",
        flexDirection: "column"
    },
    cardMedia: {
        paddingTop: "56.25%"
    },
    cardContent: {
        flexGrow: 1
    }
}

const ListaUsuarios = props => {
    const [state, setState] = React.useState({
        firebase: null,
        columns: [
            { 
                title: 'Nombre', 
                field: 'nombre',
               
            },
            { title: 'Apellidos', field: 'apellidos'},
            { title: 'Email', field: 'email'},
            { 
                title: 'TD', 
                field: 'tipoDocumento',
                lookup: {
                    'cc': 'Cédula de ciudadanía',
                    'ce': 'Cédula de extranejería'
                }
            },
            { title: 'Identificación', field: 'identificacion', type: 'numeric'},
            { 
                title: 'Rol', 
                field: 'rol',
                lookup: {
                    'admin': 'Administrador',
                    'gestor': 'Gestor'
                }
            },
            {title: 'usuarioid', field: 'usuarioid', hidden: 'true'}
        ],
        data: [
        ],
    });

    const [data, dispatch] = useContext(StateContext);

  useEffect(() => {
    setState(prevState => {
        const data = [...prevState.data];
        if(props.firebase !== prevState.firebase)
            prevState.firebase = props.firebase;            
        return { ...prevState, data }
    });
    updateUsersData();
  },[props])

  async function updateUsersData() {
    let objectQuery = props.firebase.db.collection("Users");

    const snapshot = await objectQuery.get();
    const arrayUsuarios = snapshot.docs.map(doc => {
        let data = doc.data();
        let id = doc.id;
        return {id, ...data};
    })
    setState(prevState => {
        const data = arrayUsuarios;
        return { ...prevState, data}
    })
  }

  return (
    <Container style={style.cardGrid}>
                <Paper style={style.paper}>
                    <Grid item xs={12} sm={12} justify="space-between">
                         <Breadcrumbs aria-label="breadcrumbs">
                             <Link color="inherit" style={style.link} href="/">
                                 <HomeIcon />
                                 Home
                             </Link>
                             <Typography color="textPrimary">Usuarios</Typography>
                         </Breadcrumbs>                         
                     </Grid>
                     <Grid container direction="row" justify="flex-end">
                        <IconButton color="inherit" component={Link} href="/auth/registrarUsuario">
                            <i className="material-icons">person_add</i>
                        </IconButton>
                     </Grid>
                     <Grid item xs={12} sm={12}>
                        <MaterialTable
                            title="Lista de usuarios"
                            columns={state.columns}
                            data={state.data}
                            options={{
                                headerStyle: {
                                backgroundColor: '#253b80',
                                color: '#FFF'
                                }
                            }}
                            editable={{
                                onRowUpdate: (newData, oldData) =>
                                    new Promise(async (resolve,reject) => {
                                        const {firebase, data} = state;
                                        if (oldData) {
                                            const callback = await actualizarUsuario(firebase,'/api/update/user/',newData)
                                            if(callback.status){
                                                openMensajePantalla(dispatch, {
                                                    open: true,
                                                    mensaje: 'Se ha actualizado correctamente el usuario'
                                                })
                                            } else {
                                                openMensajePantalla(dispatch, {
                                                    open: true,
                                                    mensaje: callback.mensaje.message
                                                })
                                                reject({status: false})
                                            }
                                            resolve({status: true})
                                        }
                                    }),
                                onRowDelete: oldData =>
                                new Promise(async (resolve,reject) => {
                                    const {firebase, data} = state;
                                    const user = firebase.auth.currentUser;
                                    if(user.uid === oldData.usuarioid){
                                        openMensajePantalla(dispatch, {
                                            open: true,
                                            mensaje: 'No puedes eliminar tu propio usuario'
                                        })
                                        resolve({status: true})
                                    } else{
                                        let callback = await eliminarUsuario(firebase,'/api/delete/user/', oldData.usuarioid);
                                        if(callback.status){
                                            openMensajePantalla(dispatch, {
                                                open: true,
                                                mensaje: 'Se ha eliminado correctamente el usuario'
                                            })
                                        } else {
                                            console.log("ERROR", callback.mensaje.message);
                                            openMensajePantalla(dispatch, {
                                                open: true,
                                                mensaje: callback.mensaje.message
                                            })
                                            reject({status: false})
                                        }
                                        resolve({status: true})
                                    }
                                }),
                            }}
                            />
                     </Grid>
                </Paper>
    </Container>
  );
}

export default compose(consumerFirebase, withRouter)(ListaUsuarios);