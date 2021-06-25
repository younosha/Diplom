import React, {useContext} from "react";
import {Form, Field} from "react-final-form";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Container, Button, TextField, Typography} from "@material-ui/core";
import {UserContext} from "../../context/UserContext";
import {changeData} from "../../api/auth";
import {AuthContext} from "../../context/AuthContext";
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

export const ChangeDataForm = ({setShowMessage, setMessage, setError}) => {
    const classes = useStyles();
    const {user} = useContext(UserContext);
    const {token} = useContext(AuthContext)
    let history = useHistory();

    const onSubmit = async ({name, email, password, newPassword}) => {
        try {
            await changeData({name, email, password, newPassword, token});
            setShowMessage(true);
            setError(false);
            setMessage('Ваши данные были успешно изменены');
        } catch {
            setShowMessage(true);
            setMessage('Текущий пароль введен неверно');
            setError(true);
            history.push('/login')
        }
    };

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
        return value;
    };

    const validateNewPassword = (value) => {
        if (value) {
            return value && value.length >= 6;
        }
        return;
    };

    const validateRepeatNewPassword = (value) => {
        if (value.newPassword === value.repeatNewPassword) {
            return true;
        }
        return;
    };

    return (
        <Container maxWidth="md" className={classes.root}>
            <Form
                initialValues={{name: user.name, email: user.email}}
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
                    if (!validateNewPassword(value.newPassword) || !validateNewPassword(value.repeatNewPassword)) {
                        errors.newPassword = 'Некорректные данные';
                        errors.repeatNewPassword = 'Некорректные данные';
                    }
                    if (!validateRepeatNewPassword(value)) {
                        errors.repeatNewPassword = 'Некорректные данные';
                    }
                    return errors;
                }}

                render={({handleSubmit, form, submitting}) => (
                    <form onSubmit={handleSubmit}>
                        <Typography color='primary' align='center' variant='h2'>Мой профиль</Typography>

                        <Field name="name" component="input">
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
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        label="Текущее имя пользователя"
                                        fullWidth
                                    />
                                </div>
                            )}
                        </Field>
                        <Field name="email" component="input">
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
                                        margin="normal"
                                        id="email"
                                        label="Текущий email"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
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
                                        label="Текущий пароль"
                                        type="password"
                                        fullWidth
                                    />
                                </div>
                            )}
                        </Field>
                        <Field name='newPassword'>
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
                                        id='newPassword'
                                        label='Новый пароль'
                                        type='password'
                                        fullWidth
                                        error={meta.error && meta.touched}
                                        helperText={meta.error && meta.touched ? meta.error : ''}
                                    />
                                </div>
                            )}
                        </Field>
                        <Field name='repeatNewPassword'>
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
                                        id='newRepeatPassword'
                                        label='Повторить новый пароль'
                                        type='password'
                                        fullWidth
                                        error={meta.error && meta.touched}
                                        helperText={meta.error && meta.touched ? meta.error : ''}
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
                            Изменить данные
                        </Button>
                    </form>
                )}
            />
        </Container>
    );
};

