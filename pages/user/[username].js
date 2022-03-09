import {Avatar, Card} from 'antd';
import moment from 'moment';
import {useRouter} from 'next/router';
import {UserContext} from '../../context';
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {HeartOutlined, HeartFilled} from '@ant-design/icons';
import Link from 'next/link';
// import { imageSource } from '../../functions';
import PostImage from '../../components/images/PostImage';
import Head from 'next/head';



const Username = () => {
    const [state, setState] = useContext(UserContext);
    const [ user, setUser] = useState({});
    const router = useRouter();

    const _id = router.query._id;

    useEffect(() => {
        if(state && state.token) fetchUser();
    },[router.query.username]);

    const fetchUser = async () => {
        try {
            const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API}/user/${router.query.username}`);
            setUser(data);
        } catch (err) {
            console.log(err)
        }
    };

    const imageSource = (user) => {
        if(user.image){
            return user.image.url
        } else {
            return '/images/default.jpg';
        }
    };

    return ( 
        <div className='row col-md-6 offset-md-3 '>
            <Head>
            <title>LJ Gram | {user.name}</title>
            <meta name="description" content="Social Media Styled website created by Lewis Jelfs" />
            <link rel="icon" href="/favicon.ico" />
            
            </Head>
            <div className='pt-5 pb-5 justify-content-center text-center'>
                <Card hoverable cover={<Avatar size={100} src={imageSource(user)} className="mt-2 mx-2"/>}>
                    <Card.Meta 
                        title={user.name}

                    />
                    <p className='pt-2 text-muted'>
                        Joined {moment(user.createdAt).fromNow()}
                    </p>
                    <div className='d-flex justify-content-between'>
                        <span className='btn btn-sm'>
                            {user.followers && user.followers.length} Followers
                        </span>
                        <span className='btn btn-sm'>
                            {user.following && user.following.length} Following
                        </span>
                    </div>
                </Card>
                <div className="row pt-3 col-md-2 offset-md-5">
                    <Link href="/user/dashboard"><button className='justify-content-center btn btn-primary btn-sm'>Go back</button></Link>
                </div>
            </div>
        </div>
    );
}
 
export default Username;