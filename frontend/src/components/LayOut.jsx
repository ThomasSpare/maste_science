import React from "react"; 
import {Outlet} from "react-router-dom"; 
import NavBar from "./NavBar";
import { AuthProvider } from "../Auth/AuthContext";


const Layout = () => {   
    
    return (     <> 
    <AuthProvider>
    <NavBar />       
    <Outlet />
    </AuthProvider>     
    </>   ); }; 
    
    export default Layout;