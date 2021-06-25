import React from "react";
import {Form, Field} from "react-final-form";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Container, Button, TextField, Typography} from "@material-ui/core";
import {requestRegister} from "../../api/auth";

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

export const RegistrationForm = ({setShowMessage, setMessage, setError, setBtnText}) => {
    const onSubmit = async (values) => {
        try {
            console.log(values, "<______");
            await requestRegister(values);
            setShowMessage(true);
            setError(false);
            setMessage('Вы успешно зарегистрировались');
            setBtnText('Войти');
        } catch {
            setShowMessage(true);
            setMessage('Пользователь с таким адресом электронной почты уже существует');
            setBtnText('Ok');
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
    const validateName = (value) => {
        return value;
    };
    const validatePassword = (value) => {
        return value && value.length >= 6;
    };
    const validateRepeatPassword = (value, value2) => {
        if (value && value === value2 && value.length >= 6) {
            return true;
        }
        return;
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
                    if (!validateName(value.name)) {
                        errors.name = "Некорректные данные";
                    }
                    if (!validatePassword(value.password)) {
                        errors.password = "Некорректные данные";
                    }
                    if (!validateRepeatPassword(value.password2, value.password)) {
                        errors.password2 = "Некорректные данные";
                    }
                    return errors;
                }}
                render={({handleSubmit, form, submitting, values}) => (
                    <form onSubmit={handleSubmit}>
                        <Typography color='primary' align='center' variant='h2'>Регистрация</Typography>
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
                        <Field name="name">
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
                                        id="name"
                                        label="Введите ФИО"
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
                                </div>
                            )}
                        </Field>
                        <Field name="password2">
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
                                        id="password2"
                                        label="Повторите пароль"
                                        type="password"
                                        fullWidth
                                    />
                                </div>
                            )}
                        </Field>
                            <Button
                                type="submit"
                                disabled={submitting}
                                variant="contained"
                                color="primary"
                            >
                                Регистрация
                            </Button>
                    </form>
                )}
            />
        </Container>
    );
};

