import app from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
const config = {
    apiKey: "AIzaSyBzSli9xPVXJdMC1DWdrtmLUcEAVGe6imI",
    authDomain: "aunarbot-lnkibg.firebaseapp.com",
    databaseURL: "https://aunarbot-lnkibg.firebaseio.com",
    projectId: "aunarbot-lnkibg",
    storageBucket: "aunarbot-lnkibg.appspot.com",
    messagingSenderId: "908528263910",
    appId: "1:908528263910:web:8e54499b4c2f2a602e1127"
};


class Firebase{
    constructor(){
        app.initializeApp(config);
        this.db = app.firestore();
        this.auth = app.auth();
        this.storage = app.storage();
    }

    estaIniciado() {
        return new Promise(resolve => {
            this.auth.onAuthStateChanged(resolve)
        })
    }

    guardarDocumento = (nombreDocumento, documento) => this.storage.ref().child(nombreDocumento).put(documento);

    devolverDocumento = (documentoUrl) => this.storage.ref().child(documentoUrl).getDownloadURL();
}

export default Firebase;