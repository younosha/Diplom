import React, {useContext} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Form, Field } from "react-final-form";
import { Container, Button, TextField } from "@material-ui/core";
import { requestCreateFamilyMember } from "../../api/family";
import {AuthContext} from "../../context/AuthContext";
import ModalWindowMessage from "./ModalWindowMessage";


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

export default function ModalWindowAddFamilyMember(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const validateEmail = (value) => {
        if (value) {
            return /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i.test(value);
        }
        return;
    };
    const { token } = useContext(AuthContext);

    const handleSubmit = async (value) => {
        try{
            setMessage ('Письмо с предложением о вступлении в семейную группу направлено пользователю на почту')
            await requestCreateFamilyMember(token, value.email);


        } catch(error){
            setMessage ('Такого пользователя не существует или данный пользователь уже создавал семью');
            console.log(error,'error')
        }
    };

    return (
        <div>

        <Dialog
            classes={{
                paper: classes.paper,
            }}
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle
                id="form-dialog-title"
                align='center'
                classes={{root: classes.title}} >
                Добавление семьи
            </DialogTitle>
            <DialogContent>
                <Container maxWidth="md" className={classes.root}>
                    <Form
                        onSubmit={handleSubmit}
                        validate={(value) => {
                            const errors = {};
                            if (!validateEmail(value.email)) {
                                errors.email = 'Required';
                            }
                            return errors;
                        }}
                        render={({handleSubmit, form, submitting}) => (
                            <form onSubmit={handleSubmit}>
                                <Field name='email'>
                                    {({input, meta}) => (
                                        <div>
                                            <TextField
                                                {...input}
                                                classes={{
                                                    root: classes.underlineInput,
                                                }}
                                                required
                                                autoFocus
                                                variant='outlined'
                                                margin='normal'
                                                id='email'
                                                label='Email'
                                                type='email'
                                                fullWidth
                                                error={meta.error && meta.touched}
                                                helperText={meta.error && meta.touched ? meta.error : ''}
                                            />
                                            <Button
                                                type='submit'
                                                disabled={submitting || meta.error && meta.touched}
                                                variant='contained'
                                                color='primary'
                                                onClick={handleClickOpen}
                                            >
                                                Далее
                                            </Button>
                                            <ModalWindowMessage
                                                open={open}
                                                handleClose={handleClose}
                                                setOpen={setOpen}
                                                message={message}
                                            />
                                        </div>
                                    )}

                                </Field>
                            </form>
                        )}
                    />
                </Container>
            </DialogContent>
            <DialogActions></DialogActions>
        </Dialog>
        </div>
    );
}