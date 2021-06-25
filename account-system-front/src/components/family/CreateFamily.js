import React, {useContext, useMemo} from "react";
import makeStyles from '@material-ui/core/styles/makeStyles';
import {Button, Container, Typography} from "@material-ui/core";
import {requestCreateFamily} from "../../api/family";
import {AuthContext} from "../../context/AuthContext";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginTop: 200,
        width: "50%",
        padding: "20px",
        border: "1px solid #ccc",
        boxShadow: "2px 2px 5px rgba(0,0,0,0.3)",
    },
    familyContent: {
        padding: theme.spacing(10),
        width: '100%',
    },
}));

export default function CreateFamily({getUser}) {
    const classes = useStyles();
    const {token} = useContext(AuthContext);
    const handleCreatedFamily = async () => {
        try {
            await requestCreateFamily(token);
            getUser();
        } catch (error) {
            console.log(error, 'error')
        }
    };
    return (
        <Container maxWidth='md' className={classes.root}>
            <Typography variant='h3' align='center' color='primary' paragraph>
                Ваша семья ещё не создана
            </Typography>
            <Button
                variant='contained'
                color='primary'
                onClick={handleCreatedFamily}
            >
                Создать семью

            </Button>
        </Container>
    );
}
