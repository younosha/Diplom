import React, {useState} from "react"
import ResetPasswordForm from "../components/forms/ResetPasswordForm";
import MessageResetPassword from "../components/forms/MessageResetPassword";

function ResetPasswordPage() {
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    return showMessage ?
        (
            <MessageResetPassword
                message={message}
                error={error}
                setShowMessage={setShowMessage}
            />
        ) : (
            <ResetPasswordForm
                setShowMessage={setShowMessage}
                setMessage={setMessage}
                setError={setError}

            />
        )
};

export default ResetPasswordPage



