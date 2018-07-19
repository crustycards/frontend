import axios from 'axios';
import store from '../store';

const user = store.getState().global.user;

export const getUser = (id: string) => {
  return axios.get(`/api/user/${id}`)
    .then((res) => res.data);
};

export const deleteWhiteCard = (cardId: string) => {
  return axios.delete(`/api/cards/white/${cardId}`)
    .then((res) => res.data);
};

export const deleteBlackCard = (cardId: string) => {
  return axios.delete(`/api/cards/black/${cardId}`)
    .then((res) => res.data);
};

export const deleteCardpack = (cardpackId: string) => {
  return axios.delete(`/api/cardpack/${cardpackId}`)
    .then((res) => res.data);
};

export const createCardpack = (name: string) => {
  return axios.put(`/api/cardpacks/${user.id}`, {name})
    .then((res) => res.data);
};

export const getCardpack = (id: string) => {
  return axios.get(`/api/cardpack/${id}`)
    .then((res) => res.data);
};

export const getCardpacksByUser = (userId: string) => {
  return axios.get(`/api/cardpacks/${userId}`)
    .then((res) => res.data);
};

export const createWhiteCards = (cardpackId: string, cards: Array<object>) => {
  return axios.put(`/api/cardpack/cards/white/${cardpackId}`, cards)
    .then((res) => res.data);
};

export const createBlackCards = (cardpackId: string, cards: Array<object>) => {
  return axios.put(`/api/cardpack/cards/black/${cardpackId}`, cards)
    .then((res) => res.data);
};

export const removeFriend = (friendId: string) => {
  return axios.delete(`/api/user/friends?userId=${user.id}&friendId=${friendId}`)
    .then((res) => res.data);
};

export const addFriend = (friendId: string) => {
  return axios.put(`/api/user/friends?userId=${user.id}&friendId=${friendId}`)
    .then((res) => res.data);
};

export const searchUsers = (query: string) => {
  return axios.get(`/api/user/search?query=${query}`)
    .then((res) => res.data);
};

export const autocompleteUserSearch = (query: string) => {
  return axios.get(`/api/user/search/autocomplete?query=${query}`)
    .then((res) => res.data);
};

export const searchCardpacks = (query: string) => {
  return axios.get(`/api/cardpack/search?query=${query}`)
    .then((res) => res.data);
};

export const autocompleteCardpackSearch = (query: string) => {
  return axios.get(`/api/cardpack/search/autocomplete?query=${query}`)
    .then((res) => res.data);
};

export const linkSessionToFirebase = (firebaseToken: string) => {
  return axios.put(`/api/session?token=${firebaseToken}`)
    .then((res) => res.data);
};
