import {useState, useEffect} from 'react';
import  {useRouter} from 'next/router'
import axios from 'axios';
import UserRoute from '../../components/routes/UserRoute';
import  {toast} from 'react-toastify';
import Post from '../../components/cards/Post';
import Link from 'next/link';
import { Modal } from 'antd';
import CommentForm from '../../components/CommentForm';
import Head from 'next/head'


const PostComments = () => {
    const [post, setPost] = useState({});
    const router= useRouter();
    const _id = router.query._id;

      //comments
    const [comment, setComment] = useState('');
    const [visible, setVisible] = useState(false);
    const [currentPost, setCurrentPost] = useState({});

    useEffect(() => {
        if (_id) fetchPost();
    }, [_id]);

    const fetchPost = async () => {
        try{
            const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API}/user-post/${_id}`);
            setPost(data);
        } catch (err){
            console.log(err)
        }
    };

    const handleLike = async (_id) => {
        try{
          const {data} = await axios.put(`${process.env.NEXT_PUBLIC_API}/like-post`,{_id});
          fetchPost();
        } catch(err) {
          console.log(err)
        }
      };
    
      const handleUnlike = async (_id) => {
        try{
          const {data} = await axios.put(`${process.env.NEXT_PUBLIC_API}/unlike-post`,{_id});
          fetchPost();
        } catch(err) {
          console.log(err)
        }
      }; 
    
      const handleComment = (post) => {
        setCurrentPost(post);
        setVisible(true);
      };
    
      const addComment = async (e) => {
        e.preventDefault();
        try{
          const {data} = await axios.put(`${process.env.NEXT_PUBLIC_API}/add-comment`, {
            postId: currentPost._id,
            comment,
          });
          setComment('')
          setVisible(false)
          fetchPost();
          toast.success('Comment added')
    
        } catch(err){
          console.log(err)
        }
      };
    
      const removeComment = async (postId, comment) => {
        let answer = window.confirm("Are you sure?");
        if (!answer) return; 
        try{
            const {data} = await axios.put(`${process.env.NEXT_PUBLIC_API}/remove-comment`,{
                postId, comment,
            });
            fetchPost();
            toast.error('Comment Deleted')
        } catch(err){
            console.log(err)
        }
      }

    return ( 
      
        <div className='container-fluid'>
        <Head>
          <title>LJ Gram | View Post</title>
          <meta name="description" content="Social Media Styled website created by Lewis Jelfs" />
          <link rel="icon" href="/favicon.ico" />
          
        </Head>
            <div className="row py-5 bg-default-image">
                <div className='col text-center'>
                   <h1>View Post</h1> 
                </div>
            </div>
            <div className='container col-md-8 offset-md-2 pt-5'>
                 <Post 
                    post={post} 
                    commentsCount={100} 
                    removeComment={removeComment} 
                    handleComment={handleComment}
                    addComment={addComment}
                    handleLike={handleLike}
                    handleUnlike={handleUnlike}
                /> 
            </div>
            <div className="col-md-3 offset-md-5">
              <Link href="/user/dashboard"><button className='justify-content-center btn btn-primary btn-sm'>Go back</button></Link>
            </div>
            <Modal visible={visible} onCancel={() => setVisible(false)} title='Comment' footer={null}>
                <CommentForm comment={comment} setComment={setComment} addComment={addComment} />
            </Modal>
           
        </div>
    );
}
 
export default PostComments;
