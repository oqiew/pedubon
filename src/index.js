import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css


import { Provider, } from 'react-redux';
// redux    
import configureStore from './configureStore';
import { PersistGate } from 'redux-persist/integration/react'
const { store, persistor } = configureStore();
ReactDOM.render(

    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <App></App>
        </PersistGate>
    </Provider>
    ,
    document.getElementById('root')
);

serviceWorker.unregister();
