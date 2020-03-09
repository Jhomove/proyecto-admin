import React, { Component } from "react";
import {
  Container,
  Avatar,
  Typography,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  responsiveFontSizes
} from "@material-ui/core";
import LockoutLineIcon from "@material-ui/icons/LockOutlined";
import { compose } from 'recompose';
import { consumerFirebase } from '../../server'
import {crearUsuario} from '../../actions/sesionAction';
import {openMensajePantalla} from '../../actions/snackbarAction';
import {StateContext} from '../../sesion/store';

const style = {
  paper: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: 8,
    backgroundColor: "#e53935"
  },
  form: {
    width: "100%",
    marginTop: 10
  },
  submit: {
    marginTop: 15,
    marginBottom: 20
  }
};

const defaultUser = {
  nombre: "",
  apellidos: "",
  email: "",
  password: "",
  identificacion: "",
  tipoDocumento: "",
  rol: ""
}

class RegistrarUsuario extends Component {
  static contextType = StateContext;
  state = {
      firebase: null,
      user: {
        nombre: "",
        apellidos: "",
        email: "",
        password: "",
        identificacion: "",
        tipoDocumento: "",
        rol: ""
      },
      'container-alerts': []
  };

  static getDerivedStateFromProps(nextProps, prevState){
    if(nextProps.firebase === prevState.firebase){
      return null;
    }
    return {
      firebase : nextProps.firebase
    }
  }

  onChange = e => {
      let user = Object.assign({},this.state.user);
      user[e.target.name] = e.target.value
      this.setState({
          user : user
      })
  }

  registrarUsuario = async e => {
      e.preventDefault();
      const [{sesion, dispatch}] = this.context;
      const {firebase, user} = this.state;
      if(sesion.usuario.rol === 'admin'){
        try {
          const idToken = await firebase.auth.currentUser.getIdToken(true);
            let callback = await crearUsuario('api/create/user', this.state.user, idToken)
            console.log("callback",callback);
            if(callback.status){
              this.props.history.push("/")
            } else {
              openMensajePantalla(dispatch,{
                open : true,
                mensaje : callback.mensaje.message
              })
            }
        } catch (error) {
          console.log("ERror",error);
          alert(error.mensaje.message);
        }
      }

      // if(sesion.usuario.rol === 'admin'){
      //   let callback = await crearUsuario('/api/create/user', this.state.user, sesion.usuario.usuarioid)
      //   if(callback.status){
      //     this.props.history.push("/")
      //   } else {
      //     openMensajePantalla(dispatch,{
      //       open : true,
      //       mensaje : callback.mensaje.message
      //     })
      //   }
      // }
  }

  handleChange =  e => {
    this.setState(state => state.user[e.target.name] = e.target.value)
  }

  render() {
    return (
      <Container maxWidth="md">
        <Grid container spacing={2} justify="center">
          <Grid item md={6} xs={12}>
            <div id="container-alert">
              {
                this.state['container-alerts'][0]
              }
            </div>
          </Grid>
        </Grid>
        <div style={style.paper}>
          <Avatar style={style.avatar}>
            <LockoutLineIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Registre la Cuenta del nuevo usuario
          </Typography>
          <form style={style.form}>
            <Grid container spacing={2} justify="center">
              <Grid item md={6} xs={12}>
                <TextField
                  name="nombre"
                  fullWidth
                  label="Ingrese el nombre del nuevo usuario"
                  onChange={this.onChange}
                  value={this.state.user.nombre}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  name="apellidos"
                  fullWidth
                  label="Ingrese los apellido del nuevo usuario"
                  onChange={this.onChange}
                  value={this.state.user.apellidos}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField name="email" fullWidth label="Ingrese el e-mail" onChange={this.onChange}
                  value={this.state.user.email}/>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  name="password"
                  type="password"
                  fullWidth
                  label="Ingrese la contraseña"
                  onChange={this.onChange}
                  value={this.state.user.password}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  name="identificacion"
                  fullWidth
                  label="identificacion"
                  onChange={this.onChange}
                  value={this.state.user.identificacion}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <InputLabel id="select-tipo-identificacion-label">
                  Tipo documento
                </InputLabel>
                <Select
                  fullWidth
                  labelId="select-tipo-identificacion-label"
                  id="select-tipo-identificacion"
                  onChange={this.onChange}
                  value={this.state.user.tipoDocumento}
                  onChange={this.handleChange}
                  name="tipoDocumento"
                >
                  <MenuItem value="cc">Cédula de ciudadania</MenuItem>
                  <MenuItem value="ce">Cédula de extranjería</MenuItem>
                </Select>
              </Grid>
              <Grid item md={6} xs={12}>
                <InputLabel id="select-rol-label">
                  Rol
                </InputLabel>
                <Select
                  fullWidth
                  labelId="select-rol-label"
                  id="select-rol"
                  onChange={this.onChange}
                  value={this.state.user.rol}
                  onChange={this.handleChange}
                  name="rol"
                >
                  <MenuItem value="admin">Administrador</MenuItem>
                  <MenuItem value="gestor">Gestor</MenuItem>
                </Select>
              </Grid>
            </Grid>
            <Grid container justify="center">
              <Grid item md={6} xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  color="primary"
                  style={style.submit}
                  onClick={this.registrarUsuario}
                >
                  Registrar
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
}

export default compose(consumerFirebase)(RegistrarUsuario);
