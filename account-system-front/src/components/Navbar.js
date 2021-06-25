import React from "react";
import makeStyles from '@material-ui/core/styles/makeStyles';
import {AppBar, Container, Toolbar, Typography, Button} from '@material-ui/core';
import {Link} from "react-router-dom";

import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        '&:hover': {
            color: '#81d4fa'
        }
    },
    title: {
        flexGrow: 1,
        '& > * + *': {
            marginLeft: theme.spacing(10),
        }
    },
    menuButton: {
        marginRight: theme.spacing(1)
    },
    container: {
        padding: '0 50px'
    },
}));

export default function NavBar ({logOutHandle}) {
    const classes = useStyles();
    let history = useHistory();
    const onLogoutClick = () => {
        logOutHandle();
        history.push('/login');
    };

    return (
      <AppBar position="fixed">
        <Container fixed className={classes.container}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              <Link to="/main" className="links">
                Главная
              </Link>
              <Link to="/family" className="links">
                Семья
              </Link>
              <Link to="/statistics" className="links">
                Статистика
              </Link>
                <Link to="/change-data" className="links">
                    Мой профиль
                </Link>
            </Typography>
            <Button
              classes={{
                root: classes.root,
              }}
              onClick={onLogoutClick}
              color="inherit"
              variant="outlined"
            >
              Выйти
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
    );
}
