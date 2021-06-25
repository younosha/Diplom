import React, {useState} from "react";
import {AuthForm} from "../components/forms/AuthForm";
import {MessageAuth} from "../components/forms/MessageAuth";

export const AuthPage = ({logInHandle}) => {
    const [showMessage, setShowMessage] = useState(false);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');

    return showMessage ?
        (<MessageAuth
                error={error}
                setShowMessage={setShowMessage}
                message={message}

            />
        ) : (
            <AuthForm
                logInHandle={logInHandle}
                setShowMessage={setShowMessage}
                setError={setError}
                setMessage={setMessage}
            />
        )
};
