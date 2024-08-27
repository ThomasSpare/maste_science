import React from "react"; 
import {Outlet} from "react-router-dom"; 
import NavBar from "./NavBar";
import { AuthProvider } from "../Auth/AuthContext";
import Footer from "./forms/Footer";


const Layout = () => {   
    
    return (     <> 
    <AuthProvider>
    <NavBar />       
    <Outlet />
    <Footer />
    </AuthProvider>     
    </>   ); }; 
    
    export default Layout;