import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import Firebase, { FirebaseContext } from './server';
import { initialState } from './sesion/initialState';
import { initialState as initialStateInteractions } from './interacciones/initialState';
import { StateProvider } from './sesion/store';
import {mainReducer} from './sesion/reducers';
import StateProviderInteractions from "./interacciones/store";
import StateProviderPostbacks from "./postbacks/store";
import ProviderOptionsPostback from "./optionsPostback/store";

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <StateProvider initialState={initialState} reducer={mainReducer}>
      <StateProviderInteractions>
        <StateProviderPostbacks>
          <ProviderOptionsPostback>
            <App />
          </ProviderOptionsPostback>
        </StateProviderPostbacks>
      </StateProviderInteractions>
    </StateProvider>
  </FirebaseContext.Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
