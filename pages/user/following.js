import {Avatar, List} from 'antd';
import moment from 'moment';
import {useRouter} from 'next/router';
import {UserContext} from '../../context';
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link'
import { toast } from 'react-toastify';
import Head from 'next/head'



const Following = () => {
    const [state, setState] = useContext(UserContext);
    const [ people, setPeople] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if(state && state.token) fetchFollowing();
    },[state && state.token]);

    const fetchFollowing = async () => {
        try {
            const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API}/user-following`);
            setPeople(data);
        } catch (err) {
            console.log(err)
        }
    };

    const imageSource = (user) => {
        if(user.image){
            return user.image.url
        } else {
            return '/images/default.png';
        }
    };

    const handleUnfollow = async(user) => {
        try{
            const {data} = await axios.put(`${process.env.NEXT_PUBLIC_API}/user-unfollow`, {_id: user._id});
            let auth = JSON.parse(localStorage.getItem('auth'));
            auth.user = data;
            localStorage.setItem('auth', JSON.stringify(auth));
            setState({...state, user: data});
            let filtered = people.filter((p) => (p._id !== user._id));
            setPeople(filtered);
            toast.error(`Unfollowed ${user.name}`);
        } catch (err){
            console.log(err)
        }
    };

    return ( 
        <div className='row col-md-6 offset-md-3 pt-5'>
            <Head>
          <title>LJ Gram | Following</title>
          <meta name="description" content="Social Media Styled website created by Lewis Jelfs" />
          <link rel="icon" href="/favicon.ico" />
          
        </Head>
        <List
            itemLayout='horizontal' dataSource={people} renderItem={(user) => (
                <List.Item>
                    <List.Item.Meta 
                        avatar={<Avatar src={imageSource(user)} />}
                        title={<div className='d-flex justify-content-between'>{user.username} <span onClick={() => handleUnfollow(user)} className='btn btn-danger btn-sm pointer'>Unfollow</span></div>}
                    />
                </List.Item>
            )}
        />
            <div className="col-md-3 offset-md-5">
              <Link href="/user/dashboard"><button className='justify-content-center btn btn-primary btn-sm'>Go back</button></Link>
            </div>
        </div>
    );
}
 
export default Following;