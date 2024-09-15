import React from "react"; 
import { Outlet } from "react-router-dom"; 
import NavBar from "./NavBar";
import Footer from "./forms/Footer";


const Layout = () => {   
    
    return (     
    <> 
    <NavBar />       
    <Outlet />
    <Footer />
    </>   
    ); }; 
    
    export default Layout;