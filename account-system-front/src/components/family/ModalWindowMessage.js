import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Container, Button, DialogContentText } from "@material-ui/core";
import {useHistory} from "react-router-dom";


const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
    },
    title: {
        '& .MuiTypography-root': {
            fontSize: '30px',
            color: '#3f51b5',
        }
    },
    underlineInput: {
        "& .MuiInputBase-root": {
            "& input": {
                boxShadow: "none",
                borderBottom: "none",
                paddingLeft: 10,
                marginBottom: 0,
                width: '100%',
                "&:focus": {
                    borderBottom: "none !important",
                    boxShadow: "none !important",
                },
            },
        },
    },
    paper: {
        width: '400px',
    },
}));

export default function ModalWindowMessage(props) {
    const classes = useStyles();
    let history = useHistory();

    // const handleClickOk = () => {
    //     history.push('/family')
    // };

    return (
            <Dialog
                classes={{
                    paper: classes.paper,
                }}
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogContent>
                    <Container maxWidth="md" className={classes.root}>
                        <DialogContentText id="alert-dialog-description">
                            {props.message}
                        </DialogContentText>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={props.handleClose}
                        >
                            Ок
                        </Button>

                    </Container>
                </DialogContent>
            </Dialog>
    );

}
