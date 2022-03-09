import styles from '../styles/Home.module.css';
import { useState, useContext} from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UserContext } from "../context";
import Head from 'next/head';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const  [state, setState] = useContext(UserContext);

  const router = useRouter();

  

  const handleSubmit = async (e) => {
      e.preventDefault();
      // console.log(name, email, password, secret)
      try{
          setLoading(true);
         const {data} = await axios.post(
             `${process.env.NEXT_PUBLIC_API}/login`, 
             {
              email,
              password,
      }); 

      if(data.error) {
          toast.error(data.error);
          setLoading(false)
      } else {
          setState({
              user: data.user,
              token: data.token
          });
          window.localStorage.setItem('auth', JSON.stringify(data));
          router.push("/user/dashboard");
          }      
      } catch (err) {
          toast.error(err.response.data);
          setLoading(false);
      }    
  };

  if(state && state.token) router.push('/user/dashboard');


    return ( 
      <main className={styles.main}>
        <Head>
          <title>LJ Gram | Login</title>
          <meta name="description" content="Social Media Styled website created by Lewis Jelfs" />
          <link rel="icon" href="/favicon.ico" />
          
        </Head>
        <h1 className={styles.title}>
          Login
        </h1>  
          <form onSubmit={handleSubmit}>
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
            disabled={!email || !password}
            type="submit" className="btn btn-primary col-12">Login</button>
          </form>
          <div className="row">
                <div className="col">
                    <p className="text-center"> Not yet registered?
                        <Link href="/register"><a> Register</a></Link>
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <p className="text-center">
                        <Link href="/forgot-password"><a className="text-danger"> Forgot Password</a></Link>
                    </p>
                </div>
            </div>
      </main>

     );
}
 
export default Login;