import {useRouter} from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PostForm from '../../../components/cards/PostForm';
import UserRoute from '../../../components/routes/UserRoute';
import {toast} from 'react-toastify';
import Link from 'next/link'
import Head from 'next/head';

const EditPost = () => {
    const [ post, setPost] = useState({});

    const [content, setContent] = useState("");
    const [image, setImage] = useState({});
    const [uploading, setUploading] = useState(false);
    
    const router = useRouter();
    const _id = router.query._id;
 
    useEffect(() => {
        if(_id) fetchPost();
    }, [_id]);

    const fetchPost = async () => {
        try{
            const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API}/user-post/${_id}`);
            setPost(data);
            setContent(data.content);
            setImage(data.image);
        } catch (err) {
            console.log(err)
        }
    }

    const postSubmit = async (e) => {
        e.preventDefault();
        try{
            const {data} = await axios.put(`${process.env.NEXT_PUBLIC_API}/update-post/${_id}`, {content, image});
            if(data.error){
                toast.error(error)
            } else {
                toast.success('Post Updated')
                router.push('/user/dashboard')
            }
        } catch(err){
            console.log(err)
        }
    };

    const handleImage = async (e) => {
        const file = e.target.files[0];
        let formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
          const {data} = await axios.post(`${process.env.NEXT_PUBLIC_API}/upload-image`, formData );
          setImage({
            url: data.url,
            public_id: data.public_id,
          })
          setUploading(false);
        } catch(err){
          console.log(err);
          setUploading(false);
        }
    };

    return ( 
        <UserRoute>
            <Head>
            <title>LJ Gram | Edit Post </title>
            <meta name="description" content="Social Media Styled website created by Lewis Jelfs" />
            <link rel="icon" href="/favicon.ico" />
        
      </Head>
           <div className="container-fluid">
                <div className="row py-5 bg-default-image text-light">
                        <div className="col text-center">
                            <h1>Update Post</h1>
                        </div>
                </div>
                <div className="row py-3">
                    <div className="col-md-8 offset-md-2">
                        <PostForm 
                            content={content}
                            setContent={setContent}
                            postSubmit={postSubmit}
                            handleImage={handleImage}
                            uploading={uploading}
                            image={image}
                        />
                        <div className="col-md-3 offset-md-5">
                            <Link href="/user/dashboard"><button className='justify-content-center btn btn-primary btn-sm'>Go back</button></Link>
                        </div>
                    </div>
                </div>
            </div> 
        </UserRoute>
    );
}
 
export default EditPost;