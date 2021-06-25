import React from "react";
import {Form, Field} from "react-final-form";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Container, Button, TextField, Typography} from "@material-ui/core";
import {requestAuth} from "../../api/auth";
import {Link} from "react-router-dom";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        marginTop: 200,
        width: "50%",
        padding: "20px",
        border: "1px solid #ccc",
        boxShadow: "2px 2px 5px rgba(0,0,0,0.3)",
    },
    underlineInput: {
        "& .MuiInputBase-root": {
            "& input": {
                boxShadow: "none",
                borderBottom: "none",
                paddingLeft: "15px",
                marginBottom: 0,

                "&:focus": {
                    borderBottom: "none !important",
                    boxShadow: "none !important",
                },
            },
            "&:before": {
                borderBottom: "none",
            },
            "&:after": {
                borderBottom: "none",
            },
            "&:hover": {
                "&:before": {
                    borderBottom: "none",
                },
            },
        },
    },
}));

export const AuthForm = ({logInHandle,setShowMessage, setMessage, setError}) => {
    let history = useHistory();

    const onSubmit = async (values) => {
        try {

            const res = await requestAuth(values);
            logInHandle(res.data.token);
            history.push('/');
            setShowMessage(true);
            setError(false);
        } catch {
            setShowMessage(true);
            setMessage('Вы ввели неверный логин или пароль');
            setError(true);
        }
    };
    const classes = useStyles();

    const validateEmail = (value) => {
        if (value) {
            return /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i.test(
                value
            );
        }
        return;
    };
    const validatePassword = (value) => {
        return value && value.length >= 6;
    };
    return (
        <Container maxWidth="md" className={classes.root}>
            <Form
                onSubmit={onSubmit}
                validate={(value) => {
                    const errors = {};
                    if (!validateEmail(value.email)) {
                        errors.email = "Некорректные данные";
                    }
                    if (!validatePassword(value.password)) {
                        errors.password = "Некорректные данные";
                    }
                    return errors;
                }}
                render={({handleSubmit, form, submitting, values}) => (
                    <form onSubmit={handleSubmit}>
                        <Typography color='primary' align='center' variant='h2'>Вход</Typography>
                        <Field name="email">
                            {({input, meta}) => (
                                <div>
                                    <TextField
                                        error={meta.error && meta.touched}
                                        helperText={meta.error && meta.touched ? meta.error : ""}
                                        {...input}
                                        classes={{
                                            root: classes.underlineInput,
                                        }}
                                        required
                                        variant="outlined"
                                        margin="normal"
                                        id="email"
                                        label="Введите email"
                                        type="email"
                                        fullWidth
                                    />
                                </div>
                            )}
                        </Field>
                        <Field name="password">
                            {({input, meta}) => (
                                <div>
                                    <TextField
                                        error={meta.error && meta.touched}
                                        helperText={meta.error && meta.touched ? meta.error : ""}
                                        {...input}
                                        classes={{
                                            root: classes.underlineInput,
                                        }}
                                        required
                                        variant="outlined"
                                        margin="normal"
                                        id="password"
                                        label="Введите пароль"
                                        type="password"
                                        fullWidth
                                    />
                                        <Button
                                            type="submit"
                                            disabled={submitting}
                                            variant="contained"
                                            color="primary"
                                        >
                                            Войти
                                        </Button>
                                        <Link
                                            to='/forgot-password'
                                            className='linkReg'
                                        >
                                            Забыли пароль?
                                        </Link>
                                        <Link
                                            to='/register'
                                            className='linkReg'
                                       >
                                            Регистрация
                                        </Link>
                                </div>
                            )}
                        </Field>
                    </form>
                )}
            />
        </Container>
    );
};
