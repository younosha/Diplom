import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { UserContext } from "../context/UserContext";
import { format } from "date-fns";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function BasicTable(props) {
  const classes = useStyles();

  const { user } = useContext(UserContext);
  const userName = (row) => {
    if (user && user.id === row.id) {
      return "Я";
    } else {
      return row.name;
    }
  };
  const formatDate = (row) => {
    return format(new Date(row.date), "dd/MM/yyyy");
  };
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Член семьи</TableCell>
            <TableCell align="center">На что потратил</TableCell>
            <TableCell align="center">Сколько потратил</TableCell>
            <TableCell align="center">Дата покупки</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.row.map((row, rowIndex) => (
            <TableRow key={`${row.name}_${rowIndex}`}>
              <TableCell component="th" scope="row">
                {userName(row)}
              </TableCell>
              <TableCell align="center">{row.productname}</TableCell>
              <TableCell align="center">{row.price}</TableCell>
              <TableCell align="center">{formatDate(row)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
