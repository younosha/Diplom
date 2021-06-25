import axios from "axios";

export const requestCreateFamily = (values) => {
    return axios({
        method: 'post',
        url: "http://localhost:5000/family/create-family",
        data: {token: values}
    });
};
export const requestCreateFamilyMember = (token, email) => {
    return axios({
        method: 'post',
        url: "http://localhost:5000/family/invite",
        data: {
            token: token,
            email: email,
        }
    });
}
export const requestFamilyMembers = async (token) => {
    return await axios.get(
        `http://localhost:5000/family/show-family?token=${token}`
    );
};

