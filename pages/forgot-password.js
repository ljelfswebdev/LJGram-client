import { useState, useContext } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { UserContext } from "../context";
import { useRouter } from "next/router";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [secret, setSecret] = useState('');
    const [ok, setOk] = useState(false);
    const [loading, setLoading] = useState(false);

    const [state] = useContext(UserContext);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(name, email, password, secret)
        try{
            setLoading(true);
           const {data} = await axios.post(
               `${process.env.NEXT_PUBLIC_API}/forgot-password`, 
               {
                email,
                newPassword,
                secret,
        }); 
        if (data.error) {
            toast.error(data.error);
            setLoading(false);
          }
      
          if (data.success) {
            toast.success("You have successfully changed your password")
            setEmail("");
            setNewPassword("");
            setSecret("");
            setOk(true);
            setLoading(false);
            router.push('/login')
          }
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
    };

    if(state && state.token) router.push('/');

    return (
            <div className="container-fluid">
            <div className="row py-5 bg-default-image text-light">
                <div className="col text-center">
                    <h1>Forgot Password</h1>
                </div>
            </div>
            <div className="row py-5">
                <div className="col-md-6 offset-md-3">
                    
                <form onSubmit={handleSubmit}>
                        <div className="form-group py-2">
                            <small>
                              <label className="text-muted">Email Address</label>  
                            </small>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" placeholder="Email Address"/>
                        </div>
                        <div className="form-group py-2">
                            <small>
                              <label className="text-muted">New Password</label>  
                            </small>
                            <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" className="form-control" placeholder="Enter new password"/>
                        </div>
                        <div className="form-group py-2">
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
                        </div>
                        <div className="form-group">
                            <input value={secret} onChange={(e) => setSecret(e.target.value)} type="text" className="form-control py-2" placeholder="Write your answer here" />
                        </div>
                        <div className="form-group py-2">
                            <button disabled={!email || !newPassword || !secret || loading}  className="btn btn-primary col">
                               {loading ? <div class="d-flex justify-content-center">
                                            <div class="spinner-grow text-success" role="status">
                                                <span class="sr-only"></span>
                                            </div>
                                        </div> : "Submit"}
                            </button>
                        </div>                     
                    </form>
                </div>
            </div>
        </div>
        
     );
}
 
export default ForgotPassword;