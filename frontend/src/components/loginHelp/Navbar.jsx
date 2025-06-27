import React from 'react'
import { Link } from 'react-router-dom';
import '../../styles/css/NavbarLoginHelp.css'
const Navbar = () => {
  return (
    <>
     <div className='card-navbar-loginhelp'>
            <div><img className="img img-logo-loginhelp" src="/assets/logo.png" alt="Logo" /></div>
            <div className="navbar-bg-image"></div>
            <div><Link className='button-inisession-help' to={'/'}>iniciar sesión</Link></div>
        </div>
    </>
  )
}

export default Navbar
