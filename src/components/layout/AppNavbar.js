import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import BarSession from "./bar/BarSession";
import { withStyles } from "@material-ui/styles";
import { compose } from "recompose";
import { consumerFirebase } from "../../server";
import { StateContext } from "../../sesion/store";

const styles = theme => ({
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMovil: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  }
});

class AppNavbar extends Component {
  static contextType = StateContext;
  state = {
    firebase: null
  };

  componentDidMount() {
    const { firebase } = this.state;
    const [{ sesion }, dispatch] = this.context;

    if (firebase.auth.currentUser !== null && !sesion) {
      firebase.db
        .collection("Users")
        .doc(firebase.auth.currentUser.uid)
        .get()
        .then(doc => {
          const usuarioDB = doc.data();
          dispatch({
            type: "INICIAR_SESION",
            sesion: usuarioDB,
            autenticado: true
          });
        });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let nuevoObjetos = {};
    if (nextProps.firebase !== prevState.firebase) {
      nuevoObjetos.firebase = nextProps.firebase;
    }

    return nuevoObjetos;
  }

  render() {
    const [{sesion}, dispatch] = this.context;

    return sesion ? (sesion.autenticado ? (
      <div>
        <AppBar position="static">
          <BarSession></BarSession>
        </AppBar>
      </div>
    )
    : null
    )
    : null;
  }
}

export default compose(withStyles(styles), consumerFirebase)(AppNavbar);
