import React, {useContext, useEffect, useMemo, useState} from "react";
import CreateFamily from "../components/family/CreateFamily";
import FamilyInfo from "../components/family/FamilyInfo";
import {UserContext} from "../context/UserContext";
import {requestFamilyMembers} from "../api/family";
import {AuthContext} from "../context/AuthContext";

export const FamilyPage = () => {
    const {user, getUser} = useContext(UserContext);
    const [row, setRow] = useState([]);
    const isCreatedFamily = useMemo(() => !!user && !!user.family_id, [user]);
    const isLoading = !user;
    const {token} = useContext(AuthContext);

    const getItems = async () => {
        const items = await requestFamilyMembers(token);
        setRow(items.data);
    };
    useEffect(() => {
        getItems();
    }, []);

    if (isLoading) {
        return 'loading';
    }

    return isCreatedFamily ?
        (<FamilyInfo
                row={row}

            />
        ) : (
            <CreateFamily
                getUser={getUser}
            />
        )
};
