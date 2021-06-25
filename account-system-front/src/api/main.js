import axios from "axios";

export const requestMoney = async (values, token) => {
  return await axios.post("http://localhost:5000/expenses/generate-expenses", {
    ...values,
    token,
  });
};

export const requestUser = async (token) => {
  return await axios.get(`http://localhost:5000/auth/userinfo?token=${token}`);
};
export const requestItems = async (token) => {
  return await axios.post("http://localhost:5000/expenses/show-expenses", {
    token
  });
};
