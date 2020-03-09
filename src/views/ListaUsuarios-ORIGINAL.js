import React, { Component } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Container, Paper, Grid, Breadcrumbs, Link, Typography, TextField, CardMedia, Card, CardContent, CardActions, TableContainer, Table, TableHead, TableRow } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { consumerFirebase } from "../server";
import fotoUsuarioTemp from "../logo.svg";
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import MaterialTable from 'material-table';
import {StateContext} from '../sesion/store';
import {crearUsuario} from '../actions/sesionAction';
import {openMensajePantalla} from '../actions/snackbarAction';
import { compose } from 'recompose';

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

const StyledTableCell = withStyles(theme => ({
    head: {
    backgroundColor: '#253b80',
    color: theme.palette.common.white,
    },
    body: {
    fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);

class ListaUsuarios extends Component {
    static contextType = StateContext;

    state = {
        firebase: null,
        usuarios: [],
        textoBusqueda : "",
        columns: [
            { title: 'Nombre', field: 'nombre'},
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
            {title: 'usuarioid', field: 'usuarioid', editable: 'never'}
        ]
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.firebase === prevState.firebase){
            return null;
        }
        return {
            firebase : nextProps.firebase
        }
    }

    cambiarBusquedaTexto = e => {
        const self = this;
        self.setState({
            [e.target.name] : e.target.value
        })
        if(self.state.typingTimeout){
            clearTimeout(self.state.typingTimeout);
        }

        self.setState({
            name: e.target.value,
            typing: false,
            typingTimeout: setTimeout(goTime => {
                let objectQuery = this.props.firebase.db
                    .collection("Users")
                    .where("keywords", "array-contains", self.state.textoBusqueda.toLowerCase());
                
                objectQuery.get().then(snapshot => {
                    const arrayUsuarios = snapshot.docs.map(doc => {
                        let data = doc.data();
                        let id = doc.id;
                        return {id, ...data};
                    })

                    this.setState({
                        usuarios: arrayUsuarios
                    })
                })
            }, 500)
        })
    }

    async componentDidMount(){
        let objectQuery = this.props.firebase.db.collection("Users");

        const snapshot = await objectQuery.get();
        const arrayUsuarios = snapshot.docs.map(doc => {
            let data = doc.data();
            let id = doc.id;
            return {id, ...data};
        })

        this.setState({
            usuarios: arrayUsuarios
        })
    }

    render() {
        return (
            <Container style={style.cardGrid}>
                <Paper style={style.paper}>
                    <Grid item xs={12} sm={12}>
                         <Breadcrumbs aria-label="breadcrumbs">
                             <Link color="inherit" style={style.link} href="/">
                                 <HomeIcon />
                                 Home
                             </Link>
                             <Typography color="textPrimary">Usuarios</Typography>
                         </Breadcrumbs>
                     </Grid>
                     <Grid item xs={12} sm={12}>
                        <MaterialTable
                            title="Lista de usuarios"
                            columns={this.state.columns}
                            data={this.state.usuarios}
                            editable={{                                    
                                    onRowUpdate: (newData, oldData) =>
                                        new Promise(async resolve => {
                                            if (oldData) {
                                                const [{sesion, dispatch}] = this.context;
                                                const {firebase, user} = this.state;
                                                await firebase.db.collection("Users").doc(newData.usuarioid).update({
                                                    ...newData
                                                }).then(doc => {
                                                    // openMensajePantalla(dispatch,{
                                                    //     open : true,
                                                    //     mensaje : 'Se actualizo correctamente los datos.'
                                                    // })
                                                    
                                                    resolve({status: true})
                                                }).catch(error => {
                                                    
                                                    // openMensajePantalla(dispatch,{
                                                    //     open : true,
                                                    //     mensaje : error
                                                    // })
                                                    resolve({status: false, mensaje: error})
                                                });
                                            }
                                            setTimeout(() => {
                                            {
                                                const data = this.state.usuarios;
                                                const index = data.indexOf(oldData);
                                                data[index] = newData;
                                                this.setState({ data }, () => resolve());
                                            }
                                            resolve()
                                            }, 1000)
                                    }),
                                    onRowDelete: oldData =>
                                        new Promise(resolve => {
                                            setTimeout(() => {
                                            resolve();
                                            this.setState(prevState => {
                                                const data = [...prevState.usuarios];
                                                data.splice(data.indexOf(oldData), 1);
                                                return { ...prevState, data };
                                            });
                                        }, 600);
                                    }),
                            }}
                        /> 
                     </Grid>
                </Paper>
            </Container>

            // <Container style={style.cardGrid}>
            //     <Paper style={style.paper}>
            //         <Grid item xs={12} sm={12}>
            //             <Breadcrumbs aria-label="breadcrumbs">
            //                 <Link color="inherit" style={style.link} href="/">
            //                     <HomeIcon />
            //                     Home
            //                 </Link>
            //                 <Typography color="textPrimary">Usuarios</Typography>
            //             </Breadcrumbs>
            //         </Grid>
            //         <Grid item xs={12} sm={6} style={style.gridTextfield}>
            //             <TextField
            //                 fullWidth
            //                 InputLabelProps = {{
            //                     shrink : true
            //                 }}
            //                 name="textoBusqueda"
            //                 variant="outlined"
            //                 label="Ingrese el inmueble a buscar"
            //                 onChange = {this.cambiarBusquedaTexto}
            //                 value = {this.state.textoBusqueda}
            //             ></TextField>
            //         </Grid>
            //         <Grid item xs={12} sm={12} style={style.gridTextfield}>
            //             <TableContainer>
            //                 <Table>
            //                     <TableHead>
            //                         <TableRow>
            //                             <StyledTableCell>Usuario</StyledTableCell>
            //                             <StyledTableCell>Identificacion</StyledTableCell>
            //                             <StyledTableCell>Email</StyledTableCell>
            //                             <StyledTableCell>Rol</StyledTableCell>
            //                             <StyledTableCell>Aciones</StyledTableCell>
            //                         </TableRow>
            //                     </TableHead>
            //                     <TableBody>
            //                         {this.state.usuarios.map(row => (
            //                             <StyledTableRow key={row}>
            //                                 <StyledTableCell>{`${row.nombre} ${row.apellidos}`}</StyledTableCell>
            //                                 <StyledTableCell>{`${row.tipoDocumento} ${row.identificacion}`}</StyledTableCell>
            //                                 <StyledTableCell>{row.email}</StyledTableCell>
            //                                 <StyledTableCell>{row.rol}</StyledTableCell>
            //                                 <StyledTableCell>
            //                                     <Button
            //                                         size="small"
            //                                         color="primary"
            //                                     >
            //                                         Editar
            //                                     </Button>
            //                                     <Button
            //                                         size="small"
            //                                         color="secondary"
            //                                     >
            //                                         Eliminar
            //                                     </Button>
            //                                 </StyledTableCell>
            //                             </StyledTableRow>
            //                         ))}
            //                     </TableBody>
            //                 </Table>
            //             </TableContainer>
            //             {/* <Grid container spacing={4}>
            //                 {this.state.usuarios.map(card => (
            //                     <Grid item key={card.id} xs={12} sm={6} md={4}>
            //                         <Card>
            //                             <CardMedia 
            //                                 style={style.cardMedia}
            //                                 image={
            //                                     card.foto
            //                                     ? card.foto
            //                                     : fotoUsuarioTemp
            //                                 }
            //                                 title={card.nombre + " " + card.apellidos}
            //                             />
            //                             <CardContent style={style.cardContent}>
            //                                 <Typography gutterBottom variant="h5" component="h2">
            //                                     {card.tipoDocumento + ": " + card.identificacion}
            //                                 </Typography>
            //                             </CardContent>
            //                             <CardContent style={style.cardContent}>
            //                                 <Typography gutterBottom variant="h5" component="h2">
            //                                     {card.nombre + " " + card.apellidos}
            //                                 </Typography>
            //                             </CardContent>
            //                             <CardActions>
            //                                 <Button
            //                                     size="small"
            //                                     color="primary"
            //                                 >
            //                                     Editar
            //                                 </Button>
            //                                 <Button
            //                                     size="small"
            //                                     color="secondary"
            //                                 >
            //                                     Eliminar
            //                                 </Button>
            //                             </CardActions>
            //                         </Card>
            //                     </Grid>
            //                 ))}
            //             </Grid> */}
            //         </Grid>
            //     </Paper>
            // </Container>
        );
    }
}

export default compose(consumerFirebase)(ListaUsuarios);