
const routeApi = 'https://us-central1-aunarbot-lnkibg.cloudfunctions.net/app/';

export const iniciarSesion = (dispatch, firebase, email, password) => {
  return new Promise((resolve, reject) => {
    fetch(routeApi + 'api/login',{
      method: 'POST',
      body: JSON.stringify({
        email: email.replace(/ /g,''),
        password: password
      }),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(response => {
        console.log("response",response);
        firebase.auth
          .signInWithCustomToken(response.customToken)
          .then(auth => {
            //auth.user.uid
            firebase.db
              .collection("Users")
              .doc(auth.user.uid)
              .get()
              .then(doc => {
                const usuarioDB = doc.data();
                dispatch({
                  type: "INICIAR_SESION",
                  sesion: usuarioDB,
                  autenticado: true
                });
                resolve({
                  status: true
                });
              });
          })
          .catch(error => {
            resolve({
              status: false,
              mensaje: error
            })
          });    
      })
      .catch(error => reject({status: false, mensaje: error}))
    // firebase.auth
    //   .signInWithEmailAndPassword(email, password)
    //   .then(auth => {
    //     //auth.user.uid
    //     firebase.db
    //       .collection("Users")
    //       .doc(auth.user.uid)
    //       .get()
    //       .then(doc => {
    //         const usuarioDB = doc.data();
    //         dispatch({
    //           type: "INICIAR_SESION",
    //           sesion: usuarioDB,
    //           autenticado: true
    //         });
    //         resolve({
    //           status: true
    //         });
    //       });
    //   })
    //   .catch(error => {
    //     console.log("error", error);
    //     resolve({
    //       status: false,
    //       mensaje: error
    //     })
    //   });
  });
};

export const crearUsuario = (route,usuario, idToken) => {
  usuario['idToken'] = idToken;
  return new Promise((resolve,reject) => {
    fetch(routeApi + route,{
      method: 'POST',
      body: JSON.stringify(usuario),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(response => {
      if(response.status === 200){
        return resolve({status: true})
      }else {
        console.log("response",response);
        return reject({status: false, mensaje: {'message': response.error}})
      }      
    })
      .catch(error => reject({status: false, mensaje: error}))
  })
  
}

export const actualizarUsuario = async (firebase,route,usuario) => {
  const idToken = await firebase.auth.currentUser.getIdToken(true);
  return new Promise((resolve,reject) => {
    console.log("route",usuario.usuarioid);
    usuario['idToken'] = idToken;
    fetch(routeApi + route + usuario.usuarioid,{
      method: 'PUT',
      body: JSON.stringify(usuario),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(response => resolve({status: true}))
      .catch(error => reject({status: false, mensaje: error}))
  })
}

export const eliminarUsuario = async (firebase,route, uid) => {
  const idToken = await firebase.auth.currentUser.getIdToken(true);
  return new Promise((resolve, reject) => {
    console.log("firebase.aut",uid);
    fetch(routeApi + route + uid,{
      method: 'DELETE',
      body: JSON.stringify({idToken: idToken}),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(response => resolve({status: true}))
      .catch(error => reject({status: false, mensaje: error}))
  })
}


export const cerrarSesion = (dispatch, firebase) => {
    return new Promise((resolve, eject) => {
        firebase.auth.signOut().then(salir => {
            dispatch({
                type: "SALIR_SESION",
                nuevoUsuario : {
                    nombre : "",
                    apellido : "",
                    email : "",
                    foto : "",
                    id: "",
                    telefono : ""
                },
                autenticado: false
            });
            resolve();
        })
    });
}