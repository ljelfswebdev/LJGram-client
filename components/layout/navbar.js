import Link from "next/link";
import { UserContext } from "../../context";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Avatar } from 'antd'
import { imageSource } from "../../functions";


const Navbar = () => {
    const [current, setCurrent] = useState('');
    const [state, setState] = useContext(UserContext);

    useEffect(() => {
        process.browser && setCurrent(window.location.pathname);
    }, [process.browser && window.location.pathname]);

    const router = useRouter(); 

    const logout = () => {
        window.localStorage.removeItem('auth');
        setState(null);
        router.push('/login');
    };
 
    return ( 
        <nav className="navbar navbar-expand-lg navbar-dark" >
            <div className="container-fluid">
            <Link href="/"><a className="navbar-brand"><Avatar size={40} src="/favicon.ico" /></a></Link> 
                {state !== null ? (
                    <>           
                    <div className="dropdown">
                   <Link href="/user/dashboard"><a><Avatar size={40} src={imageSource(state && state.user)} /></a></Link> 
                        <button className="btn dropdown-toggle text-light" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            {state && state.user && state.user.username}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end text-light" style={{backgroundColor: "rgb(55, 20, 153)"}} aria-labelledby="dropdownMenuButton1">
                            <li>
                                <Link href="/user/dashboard" >
                                <a className={`nav-link dropdown-item ${current === '/user/dashboard' && 'active'}`}>
                                    Dashboard
                                </a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/user/profile/update" >
                                <a className={`nav-link dropdown-item ${current === '/user/profile/update' && 'active'}`}>
                                    Profile
                                </a>
                                </Link>
                            </li>
                            
                        {state.user.role === "Admin" && (
                                <li>
                                <Link href="/admin" >
                                <a className={`nav-link dropdown-item ${current === '/admin' && 'active'}`}>
                                    Admin
                                </a>
                                </Link>
                            </li>
                        )}  

                        <li>
                            <a  onClick={logout} className="nav-link dropdown-item">Logout</a>
                         </li>
                            
                        </ul>
                    </div>
                    </>
                    
                ) : (
                   <>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link href="/login" ><a className="nav-link">Login</a></Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/register"><a className="nav-link">Register</a></Link>
                            </li>
                        </ul>
                    </div>
                    </>
                )}         
            </div>
        </nav>
    );
}
 
export default Navbar;
