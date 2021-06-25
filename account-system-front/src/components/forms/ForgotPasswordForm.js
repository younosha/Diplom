import React from 'react'
import {Form, Field} from 'react-final-form';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {Container, Typography, Button, TextField} from '@material-ui/core';
import {forgotPassword} from '../../api/auth';

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        marginTop: 200,
        maxWidth: '600px',
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

function ForgotPasswordForm({setShowMessage, setMessage, setError}) {
    const classes = useStyles();

    const handleSubmit = async (values) => {
        try {
            await forgotPassword(values);
            setShowMessage(true);
            setError(false);
            setMessage(' Письмо с инструкцией по восстановлению пароля направлено Вам на почту');
        } catch {
            setShowMessage(true);
            setMessage('Возникла ошибка,попробуйте снова');
            setError(true);
        }
    };

    const validateEmail = (value) => {
        if (value) {
            return /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i.test(value);
        }
        return;
    };

    return (
        <Container maxWidth='md' className={classes.root}>
            <Typography color='primary' variant='h4' gutterBottom>
                Восстановление доступа к странице
            </Typography>
            <Typography paragraph>
                Пожалуйста, укажите e-mail, который Вы использовали для входа на сайт.
            </Typography>
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
                                        color='primary'>
                                        Далее
                                    </Button>
                                </div>
                            )}

                        </Field>
                    </form>
                )}
            />
        </Container>
    )
}

export default ForgotPasswordForm