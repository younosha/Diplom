import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles';
import {Container, Typography, Button} from '@material-ui/core';
import {useHistory} from "react-router-dom";

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        marginTop: 200,
        width: '50%',
        padding: "20px",
        border: '1px solid #ccc',
        boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
    },
}));

function MessageForgotPassword({message, error, setShowMessage}) {
    let history = useHistory();
    const classes = useStyles();
    const handleOk = () => {
        if (error) {
            setShowMessage(false);
            history.push('/forgot-password');
        } else {
            history.push('/')
        }
    };


    return (
        <Container maxWidth='md' className={classes.root}>
            <Typography paragraph>
                {message}
            </Typography>
            <Button
                onClick={handleOk}
                variant='contained'
                color='primary'>
                Ok
            </Button>
        </Container>
    )
}

export default MessageForgotPassword