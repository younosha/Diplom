import React from 'react'
import {Form, Field} from 'react-final-form';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {Container, Typography, Button, TextField} from '@material-ui/core';
import {resetPassword} from '../../api/auth';
import {useLocation} from "react-router-dom";

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        marginTop: 200,
        width: '50%',
        padding: '20px',
        border: '1px solid #ccc',
        boxShadow: '2px 2px 5px rgba(0,0,0,0.3)'
    },
    underlineInput: {
        '& .MuiInputBase-root': {
            '& input': {
                boxShadow: 'none',
                borderBottom: 'none',
                paddingLeft: '15px',
                marginBottom: 0,
                '&:focus': {
                    borderBottom: 'none !important',
                    boxShadow: 'none !important'
                },
            },
            '&:before': {
                borderBottom: 'none',
            },
            '&:after': {
                borderBottom: 'none'
            },
            '&:hover': {
                '&:before': {
                    borderBottom: 'none',
                },
            }
        }
    }
}));

function ResetPasswordForm({setShowMessage, setMessage, setError}) {
    const classes = useStyles();
    const query = useQuery();

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }

    const handleSubmit = async (values) => {
        try {
            const token = query.get("token");
            values.token = token;
            await resetPassword(values);
            setShowMessage(true);
            setError(false);
            setMessage('Ваш пароль успешно изменен');
        } catch {
            setShowMessage(true);
            setMessage('Возникла ошибка,попробуйте снова');
            setError(true);
        }
    };

    const validatePassword = (value) => {
        if (value) {
            return value && value.length >= 6;
        }
        return;
    };

    const validateRepeatPassword = (value) => {
        if (value.password === value.repeatPassword) {
            return true;
        }
        return;
    };

    return (
        <Container maxWidth='md' className={classes.root}>
            <Typography color='primary' variant='h4' align='center' gutterBottom>
                Изменение пароля
            </Typography>

            <Form
                onSubmit={handleSubmit}
                validate={(value) => {
                    const errors = {};
                    if (!validatePassword(value.password) || !validatePassword(value.repeatPassword)) {
                        errors.password = 'Required';
                        errors.repeatPassword = 'Required';
                    }
                    if (!validateRepeatPassword(value)) {
                        errors.repeatPassword = 'Required';
                    }
                    return errors;
                }}
                render={({handleSubmit, form, submitting}) => (
                    <form onSubmit={handleSubmit}>
                        <Field name='password'>
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
                                        id='password'
                                        label='Password'
                                        type='password'
                                        fullWidth
                                        error={meta.error && meta.touched}
                                        helperText={meta.error && meta.touched ? meta.error : ''}
                                    />
                                </div>
                            )}
                        </Field>

                        <Field name='repeatPassword'>
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
                                        id='repeatPassword'
                                        label='Repeat password'
                                        type='password'
                                        fullWidth
                                        error={meta.error && meta.touched}
                                        helperText={meta.error && meta.touched ? meta.error : ''}
                                    />
                                </div>

                            )}
                        </Field>
                        <Button type='submit' disabled={submitting} variant='contained' color='primary'>Изменить
                            пароль</Button>
                    </form>
                )}
            />
        </Container>
    )
}

export default ResetPasswordForm