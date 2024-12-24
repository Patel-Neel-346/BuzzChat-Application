// const { HOST } = require("@/utiles/constants");
// const { default: axios } = require("axios");

// import { HOST } from "@/utiles/constants";
import axios from "axios";
import {HOST} from "@/utiles/constants.js";


 export const apiClient=axios.create({
    baseURL:"http://localhost:8787",
})

// export const apiClient=axios.create({
//     baseURL:HOST,
// })
// export default apiClient;