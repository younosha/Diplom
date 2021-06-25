import React, {useContext, useMemo} from "react";
import {Container, Typography, Button} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useHistory} from "react-router-dom";
import axios from "axios";
import {AuthContext} from "../context/AuthContext";
import {useLocation} from "react-router-dom";
import {UserContext} from "../context/UserContext";


const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        marginTop: 300,
        width: "50%",
        padding: "20px",
        border: "1px solid #ccc",
        boxShadow: "2px 2px 5px rgba(0,0,0,0.3)",
    },
}));

export const JoinPage = () => {
    const classes = useStyles();
    const history = useHistory();
    const query = useQuery();
    const {token} = useContext(AuthContext);
    const {user, getUser} = useContext(UserContext);
    const isLoading = !user;


    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }

    const handleNo = () => {
        history.push("/");
    };
    const handleYes = async () => {
        const familyToken = query.get("token");
        console.log(familyToken)
        await axios.post("http://localhost:5000/family/join", {
            token,
            family_token: familyToken,
        });
        getUser();
        if (isLoading) {
            return 'loading';

        }

        const handleNo = () => {
            history.push("/");
        };
        const handleYes = async () => {
            const familyToken = query.get("token");
            await axios.post("http://localhost:5000/family/join", {
                token,
                family_token: familyToken,
            });
            getUser();
            if (isLoading) {
                return 'loading';
            }
            history.push("/family");
        };

        return (
            <div>
                <Container maxWidth="md" className={classes.root}>
                    <Typography paragraph>
                        <h5 style={{textAlign: "center"}}>Вас пришлашают в семью.</h5>
                        <h6 style={{textAlign: "center"}}>Вы принимаете приглашение?</h6>
                    </Typography>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <Button variant="contained" color="secondary" onClick={handleNo}>
                            Нет
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{marginLeft: "50px"}}
                            onClick={handleYes}
                        >
                            Да
                        </Button>
                    </div>
                </Container>
            </div>
        );
    }
}
