import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { format } from "date-fns";

const useStyles = makeStyles({
  table: {
    minWidth: 400,
  },
});

export default function StatisticsTable(props) {
  const classes = useStyles();

  
  const formatDate = (expenses) => {
    return format(new Date(expenses.date), "dd/MM/yyyy");
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
          {props.expenses.map((expenses, rowIndex) => (
            <TableRow key={`${expenses.name}_${rowIndex}`}>
              <TableCell component="th" scope="row">
                Я
              </TableCell>
              <TableCell align="center">{expenses.productname}</TableCell>
              <TableCell align="center">{expenses.price}</TableCell>
              <TableCell align="center">{formatDate(expenses)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
