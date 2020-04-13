import React, { Component } from "react";
import { Container, Avatar, TextField, Typography, Button } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { compose } from "recompose";
import { consumerFirebase } from "../../server";
import {iniciarSesion} from '../../actions/sesionAction';
import {StateContext} from '../../sesion/store';
import {openMensajePantalla} from '../../actions/snackbarAction';

const style = {
  paper: {
    marginTop: 9,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: 5,
    backgroundColor: "red"
  },
  form: {
    width: "100%",
    marginTop: 8
  }
};

class Login extends Component {
 static contextType = StateContext;
  state = {
      firebase: null,
      usuario : {
          email : '',
          password : ''
      }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if( nextProps.firebase === prevState.firebase ){
      return null;
    }

    return {
      firebase: nextProps.firebase
    }
  }

  onChange = e => {
      let usuario = Object.assign({},this.state.usuario)
      usuario[e.target.name]  = e.target.value;
      this.setState({
          usuario: usuario
      })
  }
  
  login = async e => {
    e.preventDefault();
    const [{sesion}, dispatch] = this.context;
    const {firebase, usuario} = this.state;
    const {email,password}  = usuario;
    let callback = await iniciarSesion(dispatch, firebase, email, password);
    if(callback.status){
      this.props.history.push('/');
    } else {
      openMensajePantalla(dispatch, {
        open: true,
        mensaje: callback.mensaje.message
      })
    }
  }

  render() {
    return (
      <Container maxWidth="xs">
        <div style={style.paper}>
          <Avatar style={style.avatar}>
            <AccountCircle />
          </Avatar>
          <Typography component="h1" variant="h5">
            Ingrese Usuario
          </Typography>
          <form style={style.form}>
            <TextField 
              variant="outlined" 
              label="E-Mail" 
              name="email"
              fullWidth
              margin="normal"
              onChange = {this.onChange}
              value = {this.state.usuario.email}
            />
            <TextField
              variant="outlined"
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              onChange = {this.onChange}
              value = {this.state.usuario.password}
            />
            <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick= {this.login}
            >
                Enviar
            </Button>
          </form>
        </div>
      </Container>
    );
  }
}

export default compose(consumerFirebase)(Login);
