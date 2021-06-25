import axios from "axios";

export const requestRegister = (values) => {
    return axios.post("http://localhost:5000/auth/register", values);
};
export const requestAuth = (values) => {
    return axios.post("http://localhost:5000/auth/login", values);
};
export const forgotPassword = (values) => {
    return axios.post("http://localhost:5000/auth/forgot-password", values);
};
export const resetPassword = (values) => {
    return axios.post("http://localhost:5000/auth/reset-password", values);
};

export const changeData = (values) => {
    return axios.post("http://localhost:5000/auth/change-data", values);
};

// export const requestProfileChange = (email, password,newPassword, name, token) => {
//     return axios({
//         method: 'post',
//         url: "http://localhost:5000/auth/change-data",
//         data: {
//             name: name,
//             email: email,
//             password: password,
//             token: token,
//             newPassword: newPassword,
//         }
//     });
// }