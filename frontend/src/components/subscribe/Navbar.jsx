import React from 'react'
import { Link } from 'react-router-dom';
import '../../styles/css/NavbarLoginHelp.css'
const Navbar = () => {
  return (
    <>
     <div className='card-navbar-suscribe'>
            <div><img className="img img-logo-suscribe" src="/assets/logo.png" alt="Logo" /></div>
            <div></div>
            <div><Link className='button-inisession-suscribe' to={'/'}>iniciar sesión</Link></div>
        </div>
    </>
  )
}

export default Navbar