import axios from "../../Routes/AxiosConfig";
import { fork, put, all, takeLatest } from "redux-saga/effects";
// Login Redux States
import {
  LOGIN,
  REGISTER_USER,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  GET_IMAGES_REQUEST,
} from "./actionTypes";
import {
  loginSuccess,
  registerUserSuccessful,
  getImagesSuccess,
  getImagesRequest,
} from "./actions";
import { push } from "connected-react-router";
import { sagaErrorHandler } from "../../Shared/HelperMethods/SagaErrorHandler";

//If user is login then dispatch redux action's are directly from here.
function* loginUser({ payload }) {
  try {
    let data = {
      email: payload.email,
      password: payload.password,
    };
    const response = yield axios.post("auth/login", data);
    yield put(loginSuccess(response.data));
    yield put(push("/dashboard"));
  } catch (error) {
    yield sagaErrorHandler(error.response);
  }
}

function* registerUser({ payload }) {
  try {
    let data = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    };
    const response = yield axios.post("auth/register", data);
    yield put(registerUserSuccessful(response.data));
    yield put(push("/dashboard"));
  } catch (error) {
    yield sagaErrorHandler(error.response);
  }
}

function* forgotPasswordRequest({ payload }) {
  try {
    let data = {
      email: payload.email,
    };
    yield axios.post("auth/admin/forgot-password", data);
  } catch (error) {
    yield sagaErrorHandler(error.response);
  }
}
function* getImagesRequestFunction({}) {
  console.log(
    "-----------------------------------------------------------------------------",getImagesRequest()
  );
  try {
    // let data = {
    //   name: payload.name,
    //   path: payload.path,
    //   type: payload.type,
    //   value: payload.value,
    //   category: payload.category,
    // };
    const response = yield axios.get(
     "http://192.168.3.170:3000/cat5.jpg"
    );
    console.log("*********************",response)
    yield put(getImagesRequest(response.response.data.data.DATA));
  } catch (error) {
    console.log(error);
    // yield sagaErrorHandler(error.response);
  }
}

function* resetPasswordRequest({ payload }) {
  try {
    let data = {
      email: payload.email,
      passwordResetToken: payload.passwordResetToken,
      password: payload.password,
    };
    yield axios.post("auth/admin/reset-password", data);
  } catch (error) {
    yield sagaErrorHandler(error.response);
  }
}

export function* watchLogin() {
  yield takeLatest(LOGIN, loginUser);
}
export function* watchRegister() {
  yield takeLatest(REGISTER_USER, registerUser);
}
export function* watchForgotPassword() {
  yield takeLatest(FORGOT_PASSWORD, forgotPasswordRequest);
}
export function* watchResetPassword() {
  yield takeLatest(RESET_PASSWORD, resetPasswordRequest);
}
export function* watchgetImage() {
  yield takeLatest(GET_IMAGES_REQUEST, getImagesRequestFunction);
}

export default function* authSaga() {
  yield all([
    fork(watchLogin),
    fork(watchRegister),
    fork(watchForgotPassword),
    fork(watchResetPassword),
    fork(watchgetImage),
  ]);
}
