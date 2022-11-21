import axios from "axios";
const BASE_URL_API = "http://192.168.3.170:3000/api/v1/";
const IMAGE_URL_API="http://192.168.3.170:3000/cat5.jpg";
// const IMAGE_URL_API="http://192.168.3.170:3000/cat5.jpg";

const axiosConfig = axios.create({
  baseURL: BASE_URL_API,
  imageURL:IMAGE_URL_API,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

axiosConfig.interceptors.response.use(
  function (response) {
    return response;
  }
);

export default axiosConfig;
