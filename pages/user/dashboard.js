import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import { useRouter, userRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import PostForm from '../../components/cards/PostForm';
import PostList from "../../components/cards/PostList";
import People from "../../components/cards/People";
import Link from'next/link';
import Search from "../../components/Search";
import CommentForm from "../../components/CommentForm";
import { Modal, Pagination } from "antd";
import Head from 'next/head'


const Dashboard = () => {
  const [state, setState] = useContext(UserContext);
  const [uploading, setUploading] = useState(false);

  //post
  const [content, setContent] = useState("");
  const [image, setImage] = useState({});
  const [posts, setPosts] = useState([]);

  //people
  const [people, setPeople] = useState([]);

  //comments
  const [comment, setComment] = useState('');
  const [visible, setVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState({});

  //pagination
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);


  //useEffects
  useEffect(() => {
    if (state && state.token) {
      newsFeed();
      findPeople();
    }
  }, [state && state.token, page]);

  useEffect(() => {
    try{
      axios.get(`${process.env.NEXT_PUBLIC_API}/total-posts`).then(({data}) => setTotalPosts(data));
    } catch (err){
      console.log(err)
    }
  })

  //functions
  const postSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:8002/api/create-post', { content, image});
      console.log("create post response => ", data);
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Post Submitted");
        setContent("");
        setImage({});
        newsFeed();
        setPage(1);
      }
    } catch (err) {
      console.log(err);
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

  const newsFeed = async () => {
    try{
      const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API}/news-feed/${page}`);
      setPosts(data)
    } catch (err){
      console.log(err)
    }
  };
  
  const handleDelete = async (post) => {
    try {
      const answer = window.confirm('Are you sure you want to delete?')
      if(!answer) return;
      const {data} = await axios.delete(`${process.env.NEXT_PUBLIC_API}/delete-post/${post._id}`);
      toast.error('Post deleted')
      newsFeed();
    } catch (err){
      console.log(err)
    }
  };

  const findPeople = async () => {
    try{
      const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API}/find-people`);
      setPeople(data);
    } catch (err){
      console.log(err);
    }
  };

  const handleFollow = async (user) => {
    try{
      const {data} = await axios.put(`${process.env.NEXT_PUBLIC_API}/user-follow`, {_id: user._id});
        // console.log("following", data)
        let auth = JSON.parse(localStorage.getItem('auth'));
        auth.user = data;
        localStorage.setItem('auth', JSON.stringify(auth));
        setState({...state, user: data});
        let filtered = people.filter((p) => (p._id !== user._id));
        setPeople(filtered);
        newsFeed();
        toast.success(`Following ${user.name}`)
    } catch(err){
      console.log(err)
    }
  };

  const handleLike = async (_id) => {
    try{
      const {data} = await axios.put(`${process.env.NEXT_PUBLIC_API}/like-post`,{_id});
      newsFeed();
    } catch(err) {
      console.log(err)
    }
  };

  const handleUnlike = async (_id) => {
    try{
      const {data} = await axios.put(`${process.env.NEXT_PUBLIC_API}/unlike-post`,{_id});
      newsFeed();
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
      newsFeed();

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
        newsFeed();
    } catch(err){
        console.log(err)
    }
  }

    return ( 

      

      <UserRoute>
        <Head>
        <title>LJ Gram | {state && state.user.name}</title>
        <meta name="description" content="Social Media Styled website created by Lewis Jelfs" />
        <link rel="icon" href="/favicon.ico" />
        
      </Head>
        <div className="container-fluid">
          <div className="row py-5 bg-default-image text-light">
            <div className="col text-center">
              <h1>Newsfeed</h1>
            </div>
          </div>
          <div className="row py-3">
            <div className="col-md-8">
              <PostForm 
                content={content}
                setContent={setContent}
                postSubmit={postSubmit}
                handleImage={handleImage}
                uploading={uploading}
                image={image}
              />
              <div>
                <PostList 
                  posts={posts}
                  handleDelete={handleDelete}
                  handleLike={handleLike}
                  handleUnlike={handleUnlike}
                  handleComment= {handleComment}
                  removeComment={removeComment}
                />
                <Pagination current={page} total={(totalPosts/5) * 10} onChange={(value) => setPage(value)} className='pb-5'/>
              </div>
          </div>
          <div className="col-md-4">
            <Search />
            <br/>
            {state && state.user && state.user.following && <Link href={`/user/following`}>
              <a className="h6">{state.user.following.length} Following</a>
            </Link>}
            <People people={people} handleFollow={handleFollow}/>
          </div>
        </div>
        <Modal visible={visible} onCancel={() => setVisible(false)} title='Comment' footer={null}>
          <CommentForm comment={comment} setComment={setComment} addComment={addComment} />
        </Modal>
      </div>
    </UserRoute>
        
     );
}
 
export default Dashboard;