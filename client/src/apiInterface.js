import axios from 'axios';
import store from './store';
import { addCardpack, removeCardpack, removeFriend } from './store/modules/user';

const { apiURL } = window.__PRELOADED_DATA__;

const user = store.getState().user.currentUser;

const api = axios.create({
  baseURL: apiURL,
  timeout: 1000,
  withCredentials: true
});

module.exports.deleteCard = (cardId) => {
  return api.delete(`/card/${cardId}`)
    .then(res => res.data);
};

module.exports.deleteCardpack = (cardpackId) => {
  return api.delete(`/cardpack/${cardpackId}`)
    .then(res => res.data)
    .then(data => {
      store.dispatch(removeCardpack(cardpackId));
      return data;
    });
};

module.exports.createCardpack = (name) => {
  return api.put(`/${user.id}/cardpack`, {name})
    .then(res => res.data)
    .then(cardpack => {
      store.dispatch(addCardpack(cardpack));
      return cardpack;
    });
};

module.exports.getCardpack = (id) => {
  return api.get(`/cardpack/${id}`)
    .then(res => res.data);
};

module.exports.createWhiteCards = (cardpackId, cards) => {
  return api.put(`/cardpack/${cardpackId}/cards/white`, cards)
    .then(res => res.data);
};

module.exports.createBlackCards = (cardpackId, cards) => {
  return api.put(`/cardpack/${cardpackId}/cards/black`, cards)
    .then(res => res.data);
};

module.exports.removeFriend = (friendId) => {
  return api.delete(`/user/${user.id}/friends/${friendId}`)
    .then(res => res.data)
    .then(data => {
      store.dispatch(removeFriend(friendId));
      return data;
    });
};

module.exports.addFriend = (friendId) => {
  return api.put(`/user/${user.id}/friends/${friendId}`)
    .then(res => res.data);
};

module.exports.searchUsers = (query) => {
  return api.get(`/user/search?query=${query}`)
    .then(res => res.data);
};

module.exports.autocompleteUserSearch = (query) => {
  return api.get(`/user/search/autocomplete?query=${query}`)
    .then(res => res.data);
};

module.exports.searchCardpacks = (query) => {
  return api.get(`/cardpack/search?query=${query}`)
    .then(res => res.data);
};

module.exports.autocompleteCardpackSearch = (query) => {
  return api.get(`/cardpack/search/autocomplete?query=${query}`)
    .then(res => res.data);
};