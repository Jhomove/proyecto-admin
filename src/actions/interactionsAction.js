const routeApi = "https://bf7a5ef2.ngrok.io";

export const obtenerInteracciones = async (firebase, route) => {
  // const idToken = await firebase.auth.currentUser.getIdToken(true);
  return new Promise((resolve, reject) => {
    fetch(routeApi + route, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(response => {
        return resolve({ status: true, data: response.titulo });
      })
      .catch(error => reject({ status: false, mensaje: error }));
  });
};

export const actualizarInteraccion = async (
  firebase,
  route,
  titulo
) => {
  return new Promise((resolve, reject) => {
    fetch(routeApi + route, {
      method: "POST",
      body: JSON.stringify(titulo),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(response => {
        console.log("response",response);
        if (response.status === 200) {
          return resolve({ status: true, data: response });
        } else {
          return reject({
            status: false,
            mensaje: { message: response.error }
          });
        }
      })
      .catch(error => reject({ status: false, mensaje: error }));
  });
};

export const establecerMenuPersistente = async (firebase,route,data) => {
  return new Promise(async (resolve, reject) => {
    const idToken = await firebase.auth.currentUser.getIdToken(true);
    fetch(routeApi + route, {
      method: "POST",
      body: JSON.stringify({
        idToken: idToken,
        data: data
      }),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
    .then(response => {
      console.log("response", response);
      return resolve({ status: response.status, data: response.data !== undefined ? response.data : [] });
    })
    .catch(error => reject({ status: false, mensaje: error }))
  })
}

export const obtenerConfiguracionMenuPersistente = async (firebase, route) => {
  return new Promise(async (resolve, reject) => {
    fetch(routeApi + route, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.json())
    .then(response => resolve({status: response.status , data: response.data }))
    .catch(error => reject({ status: false, mensaje: error }))
  })
}

export const obtenerPostbacks = async (firebase, route) => {
  return new Promise (async (resolve,reject) => {
    fetch(routeApi + route, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.json())
    .then(response => resolve({status: response.status , data: response.data }))
    .catch(error => reject({ status: false, mensaje: error }))
  })
}

export const establecerPostbacks = async (firebase,route,data) => {
  return new Promise (async ( resolve, reject ) => {
    const idToken = await firebase.auth.currentUser.getIdToken(true);
    fetch(routeApi + route, {
      method: "POST",
      body: JSON.stringify({
        idToken: idToken,
        data: data
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
    .then(response => resolve({status: response.status, data: response.data !== undefined ? response.data : [], mensaje: response.message}))
    .catch(error => reject({ status: false, mensaje: error}))
  })
}