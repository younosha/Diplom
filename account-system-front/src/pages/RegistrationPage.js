import React, {useState} from "react";
import {MessageRegistration} from '../components/forms/MessageRegistration'
import {RegistrationForm} from "../components/forms/RegistrationForm";

export const RegistrationPage = (props) => {
    // const [page, setPage] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [btnText, setBtnText] = useState('');

    return showMessage ?
        (<MessageRegistration
                message={message}
                btnText={btnText}
                error={error}
                setShowMessage={setShowMessage}
            />
        ) : (
            <RegistrationForm
                setShowMessage={setShowMessage}
                setMessage={setMessage}
                setBtnText={setBtnText}
                setError={setError}
            />
        );
};
