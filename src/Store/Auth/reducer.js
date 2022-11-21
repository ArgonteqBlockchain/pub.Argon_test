import produce from "immer";
import { string } from "prop-types";
import {
  REGISTER_USER_SUCCESSFUL,
  LOGIN_SUCCESS,
  LOGOUT,
  GET_IMAGES_SUCCESS,
  GET_IMAGES_REQUEST,
} from "./actionTypes";

const initialState = {
  user: null,
  token: null,
  imagesData: [],
  // path: "",
  // type: null,
  // value: "",
  // category:null,
};

// const initialStateOne={
//   name: string,
//     path: string,
//     type: null,
//     value: string,
//     category:null,

// }
const Auth = produce((state, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      state.user = action.payload;
      state.token = action.payload.accessToken;
      break;
    case REGISTER_USER_SUCCESSFUL:
      state.user = action.payload.user;
      state.token = action.payload.accesToken;
      break;
    case LOGOUT:
      state.user = null;
      state.token = null;
      break;
    case GET_IMAGES_SUCCESS:
      state.imagesData = action;
      break;
    case GET_IMAGES_REQUEST:
      state.imagesData = action;
      break;
    default:
      break;
  }
}, initialState);

export default Auth;
