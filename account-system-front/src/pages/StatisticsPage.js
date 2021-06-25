import React, { useState, useEffect, useContext } from "react";
import StatisticsTable from "../components/StatisticsTable";
import Statistics from "../components/Statistics";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
import axios from "axios";

export const StatisticsPage = () => {
  const [expenses, setExpenses] = useState([]);
  const { token } = useContext(AuthContext);
  const { user } = useContext(UserContext);

  console.log(expenses);

  const data = [
    {
      name: "Сентябрь",
      uv: 9000,
    },
    {
      name: "Октябрь",
      uv: 3000,
    },
    {
      name: "Ноябрь",
      uv: 2000,
    },
    {
      name: "Декабрь",
      uv: 2780,
    },
    {
      name: "Январь",
      uv: 1890,
    },
    {
      name: "Февраль",
      uv: 2390,
    },
  ];

  const getExpenses = async () => {
    const userId = user.id;
    const usersId = [userId];

    const expenses = await axios.post(
      "http://localhost:5000/expenses/show-expenses",
      {
        token,
        usersId,
      }
    );
    setExpenses(expenses.data);
  };

  useEffect(() => {
    if (user) {
      getExpenses();
    }
  }, []);

  return (
    <div style={{ marginTop: "150px", marginLeft: "80px" }}>
      <div style={{ justifyContent: "center" }}>
        <Statistics data={data} />
      </div>
      <div style={{ marginTop: "30px" }}>
        <StatisticsTable expenses={expenses} />
      </div>
    </div>
  );
};
