import styles from '../../../styles/Home.module.css';
import { useState, useContext, useEffect } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { Modal, Avatar } from 'antd';
import Link from 'next/link';
import { UserContext } from "../../../context";
import { useRouter } from "next/router";
import {LoadingOutlined, CameraOutlined} from '@ant-design/icons';
import Head from 'next/head';

const ProfileUpdate = () => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ok, setOk] = useState(false);
    const [loading, setLoading] = useState(false);

    const [image, setImage] = useState({});
    const [uploading, setUploading] = useState(false);

  const [state, setState] = useContext(UserContext);
  const router= useRouter();

  useEffect(()=> {
    if(state && state.user){
       setUsername(state.user.username);
       setName(state.user.name);
       setEmail(state.user.email);
       setPassword(state.user.password);
       setImage(state.user.image);
    }
},[state && state.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        setLoading(true);
       const {data} = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/profile-update`, {
            name,
            username,
            email,
            password,
            image,
        }); 
    if (data.error) {
        toast.error(data.error)
        setLoading(false);
    } else {
        //update local storage, update user, keep token
        let auth = JSON.parse(localStorage.getItem('auth'));
        auth.user = data;
        localStorage.setItem('auth', JSON.stringify(auth));
        //update context
        setState({...state, user: data});
        setOk(true);
        setLoading(false);
      }  
    }
    catch (err) {
      toast.error(err.response.data);
      setLoading(false);
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
      <main className={styles.main}>
        <Head>
          <title>LJ Gram | Update Profile</title>
          <meta name="description" content="Social Media Styled website created by Lewis Jelfs" />
          <link rel="icon" href="/favicon.ico" />
          
        </Head>
        <h1 className={styles.title}>
          Update Profile
        </h1>  

        <label className="d-flex justify-content-center h5">
            {
                image && image.url ? (<Avatar size={30} src={image.url} className="mt-2"/>) : uploading ? (<LoadingOutlined className="mt-2"/>) : (<CameraOutlined className="mt-2" />)
            }
                <input onChange={handleImage} type="file" accept="images/*" hidden />
        </label>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="Name">Your Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="form-control" id="name" placeholder="What's your name?" />
            </div>
            <div className="form-group">
              <label htmlFor="Username">Username</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" className="form-control" id="username" placeholder="Choose a Username" />
            </div>
            <div className="form-group">
              <label htmlFor="Email">Email address</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" />
              <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div className="form-group pb-3">
              <label htmlFor="Password">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" id="password" placeholder="Password" />
            </div>
            <button 
            disabled={!name || !username || !email || !password}
            type="submit" className="btn btn-primary col-12 ">Submit</button>
          </form>
            <div className="row pt-3">
              <Link href="/user/dashboard"><button className='justify-content-center btn btn-primary btn-sm'>Go back</button></Link>
            </div>
          
          <div className="row">
                <div className="col">
                    <Modal
                        title="Congratulations!"
                        visible={ok}
                        onCancel={() => setOk(false)}
                        footer={null}
                    >
                        <p>
                            You have successfully updated your profile
                        </p>
                    </Modal>
                </div>
            </div>
  
      </main>
     );
}
 
export default ProfileUpdate;