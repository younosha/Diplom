import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
// import { UserContext } from "../context/UserContext";
// const { user } = useContext(UserContext);

export default function Statistics(props) {
  const jsfiddleUrl = "https://jsfiddle.net/alidingling/Lrffmzfc/";
  return (
    <AreaChart
      width={700}
      height={400}
      data={props.data}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
    </AreaChart>
  );
}
