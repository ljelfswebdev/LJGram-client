import Layout from '../components/layout/layout'
import '../styles/globals.css'
import "bootstrap/dist/css/bootstrap.min.css";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from "../context";
import 'antd/dist/antd.css';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Layout><ToastContainer position="top-center"/><Component {...pageProps} /></Layout>
    </UserProvider> 
  );
}
export default MyApp;