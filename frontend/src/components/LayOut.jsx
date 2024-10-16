import React from "react"; 
import { Outlet } from "react-router-dom"; 
import NavBar from "./NavBar";
import Footer from "./forms/Footer";
import HamburgerMenu from "./HamburgerMenu";
import "./LayOut.css";


const Layout = () => {   
    
    return (     
    <> 
    <HamburgerMenu />
    <NavBar />       
    <Outlet />
    <Footer />
    </>   
    ); }; 
    
    export default Layout;