import React, { useState, useEffect, useContext } from "react";
import BasicTable from "../components/BasicTable";
import FormDialog from "../components/ModalWindowAdd";
import { requestMoney } from "../api/main";
import { requestItems } from "../api/main";
import { requestFamilyMembers } from "../api/family";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
import Filter from "../components/Filter";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  wrap: {
    marginTop: 80,
  },
}));

export const MainPage = () => {
  const [row, setRow] = useState([]);
  const [family, setFamily] = useState([]);
  const { token } = useContext(AuthContext);
  const { user } = useContext(UserContext);

  const postMoney = async (values) => {
    const addedExpenses = await requestMoney(values, token);
    setRow([addedExpenses.data, ...row]);
  };

  const getItems = async () => {
    const items = await requestItems(token);
    setRow(items.data);
  };

  useEffect(() => {
    if (user) {
      getItems();
      getFamily();
    }
  }, [user]);

  const getFamily = async () => {
    const family = await requestFamilyMembers(token);
    setFamily(family.data);
  };

  const expensesUser = async (usersId) => {
    const family_id = user.family_id;
    const expensesUser = await axios.post(
      "http://localhost:5000/expenses/show-expenses",
      { usersId, token, family_id }
    );
    setRow(expensesUser.data);
  };

  const classes = useStyles();
  return (
    <div className={classes.wrap}>
      <div className="modal-window-add">
        <FormDialog onSubmit={postMoney} />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Filter family={family} onSubmit={expensesUser} />
      </div>
      <div className="basic-table">
        <BasicTable row={row} />
      </div>
    </div>
  );
};
