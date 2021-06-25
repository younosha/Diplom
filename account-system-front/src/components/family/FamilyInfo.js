import React, {useContext, useEffect} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import ModalWindowAddFamily from "./ModalWindowAddFamilyMember";
import {UserContext} from "../../context/UserContext";


const useStyles = makeStyles({
    root: {
        marginTop: 100
    },
    table: {
        minWidth: 650,
    },
    familyTable: {
        marginTop: 20
    }
});
export default function FamilyInfo(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const {user} = useContext(UserContext);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const userName = (row) => {
        if (user && user.id === row.id) {
            return "Я";
        } else {
            return row.name;
        }
    };


    return (
        <div className={classes.root}>
            <Typography color='primary' align='center' variant='h1'>Моя семья</Typography>
            <Button
                variant="outlined"
                color="primary"
                onClick={handleClickOpen}>
                Добавить члена семьи
            </Button>
            <ModalWindowAddFamily
                open={open}
                handleClose={handleClose}
                setOpen={setOpen}
            />
            <TableContainer component={Paper} className={classes.familyTable}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Имя</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Сколько всего потратил</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.row.map((row, rowIndex) => (
                            <TableRow key={`${row.name}_${rowIndex}`}>
                                <TableCell component="th" scope="row">
                                    {userName(row)}
                                </TableCell>
                                {/*<TableCell align="center">{row.name}</TableCell>*/}
                                <TableCell align="center">{row.email}</TableCell>
                                <TableCell align="center">{row.sum}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}