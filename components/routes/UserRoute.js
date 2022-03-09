import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import  { useRouter } from 'next/router';
import { UserContext } from '../../context';

const UserRoute = ({children}) => {
    const [ok, setOk] = useState(false);
    const router = useRouter();
    const [state] = useContext(UserContext)

    useEffect(() => {
        if (state && state.token) getCurrentUser()
    }, [state && state.token])

    const getCurrentUser = async () => {
        try{
            const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API}/current-user`, {
                headers: {
                    "Authorization": `Bearer ${state.token}`,
                },
            });
            if (data.ok) setOk(true);
        } catch (err){
            router.push('/login')
        }
    };

    process.browser && state === null && setTimeout(() => {
        getCurrentUser();
    },1000)

    return !ok ? (
        <div className="d-flex justify-content-center">
            <div className="spinner-grow text-success" role="status">
                <span className="sr-only"></span>
            </div>
        </div>
    ) : (
        <>{children}</>
    );
};


export default UserRoute;