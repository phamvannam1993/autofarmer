import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "./App.css";
import "./customer.css";

import { Provider } from 'react-redux';
import store from './redux/store/index';

import * as serviceWorker from "./serviceWorker";
import Firebase, { FirebaseContext } from "./Firebase";

ReactDOM.render(
	<Provider store={store}>
		<FirebaseContext.Provider value={new Firebase()}>
			<App />
		</FirebaseContext.Provider>
	</Provider>, document.getElementById('root')
);


serviceWorker.unregister();