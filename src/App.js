import React, { Component, useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import "./App.css";
import ListaUsuarios from "./views/ListaUsuarios";
import AppNavbar from "./components/layout/AppNavbar";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import theme from "./theme/theme";
import RegistrarUsuario from "./components/seguridad/RegistrarUsuario";
import Login from "./components/seguridad/Login";
import Firebase, { FirebaseContext } from "./server";

import { useStateValue } from "./sesion/store";
import Snackbar from '@material-ui/core/Snackbar';
import openSnackbarReducer from "./sesion/reducers/openSnackbarReducer";
import RutaAutenticada from "./components/seguridad/RutaAutenticada";
import PerfilUsuario from "./components/seguridad/PerfilUsuario";

function App(props) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  let firebase = React.useContext(FirebaseContext);
  const [autenticacionIniciada, setupFirebaseInicial] = React.useState(false);

  const [{ openSnackbar,sesion }, dispatch] = useStateValue();
  console.log("openSnackBar",useStateValue);

  useEffect(() => {
    firebase.estaIniciado().then(val => {
      setupFirebaseInicial(val);
    });
  });
  // setupFirebaseInicial(true);

  return autenticacionIniciada !== false ? (
    <React.Fragment>
      <Snackbar
          anchorOrigin = {{ vertical: "bottom", horizontal: "center" }}
          open={openSnackbar ? openSnackbar.open : false}
          autoHideDuration={3000}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={
            <span id="message-id">
              {openSnackbar ? openSnackbar.mensaje : ""}
            </span>
          }
          onClose = {() => {
            dispatch({
              type : "OPEN_SNACKBAR",
              openMensaje : {
                open : false,
                mensaje: ""
              }
            })
          }}
      />
        <Router>
          <MuiThemeProvider theme={theme}>
            <AppNavbar />
            <Grid container>
              <Switch>
                <RutaAutenticada exact path="/" autenticadoFirebase={firebase.auth.currentUser} component={ListaUsuarios}/>
                <RutaAutenticada path="/auth/perfil" autenticadoFirebase={firebase.auth.currentUser} component={PerfilUsuario}/>
                <RutaAutenticada path="/auth/registrarUsuario" autenticadoFirebase={firebase.auth.currentUser} component={RegistrarUsuario}/>
                {/* <Route path="/auth/registrarUsuario" component={RegistrarUsuario}></Route> */}
                <Route path="/auth/login" component={Login}></Route>
              </Switch>
            </Grid>
          </MuiThemeProvider>
        </Router>
      {/* </Snackbar> */}
    </React.Fragment>
  ) : null;
}

export default App;
