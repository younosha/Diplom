import React, {useContext} from "react";
import {Switch, Route, Redirect} from "react-router-dom";
import {RegistrationPage} from "./pages/RegistrationPage";
import {FamilyPage} from "./pages/FamilyPage";
import { StatisticsPage } from "./pages/StatisticsPage";
import {MainPage} from "./pages/MainPage";
import { JoinPage } from "./pages/JoinPage";
import {AuthPage} from "./pages/AuthPage";
import {ForgotPasswordPage} from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import {AuthContext} from './context/AuthContext'
import NavBar from "./components/Navbar";
import {ChangeDataPage} from "./pages/ChangeDataPage";

export const useRoutes = () => {
    const {isAuth, logInHandle, logOutHandle} = useContext(AuthContext)
    if (isAuth) {
        return (
          <>
            <NavBar logOutHandle={logOutHandle} />
            <Switch>
              <Route path="/family" exact>
                <FamilyPage />
              </Route>
              <Route path="/" exact>
                <MainPage />
              </Route>
              <Route path="/statistics" exact>
                <StatisticsPage />
              </Route>
              <Route path="/join" exact>
                <JoinPage />
              </Route>
                <Route>
                    <ChangeDataPage path="/change-data"/>
                </Route>
              <Redirect to="/" />
            </Switch>
          </>
        );
    }

    return (

        <Switch>
            <Route path="/login" exact>
                <AuthPage
                    logInHandle={logInHandle}
                />
            </Route>
            <Route path="/register" exact>
                <RegistrationPage/>
            </Route>
            <Route path="/forgot-password">
                <ForgotPasswordPage/>
            </Route>
            <Route path="/reset-password">
                <ResetPasswordPage/>
            </Route>
            <Redirect to='/login'/>
        </Switch>
    );
};
