import axios from 'axios';

const apiURL = window.__PRELOADED_DATA__.apiURL;

export default axios.create({
  baseURL: apiURL,
  timeout: 1000,
  withCredentials: true
});