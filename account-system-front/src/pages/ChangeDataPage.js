import React, {useContext, useState, useMemo} from "react";
import {ChangeDataForm} from "../components/forms/ChangeDataForm";
import {MessageChangeData} from "../components/forms/MessageChangeData"
import {UserContext} from "../context/UserContext";


export const ChangeDataPage = () => {
    const {user} = useContext(UserContext);
    const isLoadedUser = useMemo(() => !!user && !!user.family_id, [user]);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const isLoading = !user;
    const [error, setError] = useState(false);

    if (isLoading) {
        return 'loading';
    }

    return showMessage  ?
        (<MessageChangeData
                message={message}
                error={error}
                setShowMessage={setShowMessage}
            />
        ) : (
            !isLoadedUser ? null :
    <ChangeDataForm
        setShowMessage={setShowMessage}
        setMessage={setMessage}
        setError={setError}
    />

        );

};
