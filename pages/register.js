import styles from '../styles/Home.module.css';
import { useState, useContext } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import Link from 'next/link';
import { UserContext } from "../context";
import { useRouter } from "next/router";
import Head from 'next/head';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secret, setSecret] = useState('');

  const [state] = useContext(UserContext);
  const router= useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
       const {data} = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/register`, {
            name,
            username,
            email,
            password,
            secret,
        }); 
    if (data.error) {
        toast.error(data.error)
    } else {
        toast.success("You have successfully registered")
        setName('');
        setUsername('');
        setEmail('');
        setPassword('');
        setSecret('');
        router.push('/user/dashboard');
      }  
    }
    catch (err) {
      toast.error(err.response.data);
    }  
  };

  if(state && state.token) router.push('/');

    return ( 
      <main className={styles.main}>
        <Head>
          <title>LJ Gram | Register</title>
          <meta name="description" content="Social Media Styled website created by Lewis Jelfs" />
          <link rel="icon" href="/favicon.ico" />
          
        </Head>
        <h1 className={styles.title}>
          Register
        </h1>  
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
            <div className="form-group">
              <label htmlFor="Password">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" id="password" placeholder="Password" />
            </div>
            <small>
              <label className="text-muted">Pick a queston</label>
            </small>
            <select className="form-control py-2">
              <option>What is your favourite colour?</option>
              <option>What is your first pet's name?</option>
              <option>What city were you born in?</option>
            </select>
            <small className="form-text text-muted">
              You can use this to reset your password if you have forgotten it.
            </small>
            <div className="form-group pb-3">
              <label htmlFor="secret">Secret</label>
              <input value={secret} onChange={(e) => setSecret(e.target.value)} type="text" className="form-control" id="secret" placeholder="Secret" />
            </div>
            <button 
            disabled={!name || !username || !email || !password || !secret}
            type="submit" className="btn btn-primary col-12">Submit</button>
          </form>
  
      </main>
     );
}
 
export default Register;