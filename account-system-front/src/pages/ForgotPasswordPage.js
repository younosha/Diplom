import React, {useState} from 'react'
import ForgotPasswordForm from '../components/forms/ForgotPasswordForm';
import MessageForgotPassword from "../components/forms/MessageForgotPassword";

export const ForgotPasswordPage = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    return showMessage ?
        (<MessageForgotPassword
                message={message}
                error={error}
                setShowMessage={setShowMessage}
            />
        ) : (
            <ForgotPasswordForm
                setShowMessage={setShowMessage}
                setMessage={setMessage}
                setError={setError}
            />

        );
};
