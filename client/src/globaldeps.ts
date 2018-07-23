import HttpMainApi from './api/http/httpMainApi';
import HttpGameApi from './api/http/httpGameApi';
import createStore from './store/index.js';
import {createBrowserHistory} from 'history';

const userId = window.__PRELOADED_STATE__.user ? window.__PRELOADED_STATE__.user.id : null;

export const mainApi = new HttpMainApi(userId); // TODO - Stop exporting this
export const gameApi = new HttpGameApi(userId); // TODO - Stop exporting this
export const history = createBrowserHistory();
export const store = createStore({history});

// TODO - Move these to app.tsx