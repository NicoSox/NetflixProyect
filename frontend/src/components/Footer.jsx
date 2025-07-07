import React, { useState } from 'react'
import '../css/Footer.css'
import '../css/IconsFooter.css'
import {FaFacebookF, FaInstagram,FaTwitter,FaYoutube} from 'react-icons/fa'



const Footer = () => {
  const [codigo, setCodigo] = useState(null)
  const hnadleButton =()=>{
    const parte1 = Math.floor(100 + Math.random() * 900);
    const parte2 = Math.floor(100 + Math.random() * 900);

    setCodigo(`${parte1}-${parte2}`)
 

  }

  return (
   

    
    
     <footer style={{ 
    paddingTop: '8vw',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: '4vw',
    marginLeft: '14vw',
    color: 'gray'
 }}>
      
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{}}>
   <div className='social-bar'>
      <a  href="https://facebook.com" target="_blank" rel="noopener noreferrer">
        <FaFacebookF className='social-icon' />
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
        <FaInstagram className='social-icon' />
      </a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
        <FaTwitter className='social-icon' />
      </a>
      <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
        <FaYoutube  className='social-icon'/>
      </a>
    </div>

      </div>

     

      

       
       <a href="/audio-descriptivo">Audio Descriptivo</a>
       <div style={{paddingBottom: '2px'}}></div>
       
        
        <a href="/avisos-legales">Avisos legales</a>
        <div style={{paddingBottom: '2px'}}></div>


        <div style={{  width: '158px',border: '2px solid white',padding: '5px',display: 'inline-block', zIndex: 1}}>
        {!codigo? ( 
          <button style={{fontSize: 16}} onClick={hnadleButton}>Codigo de servicio</button>
        ) : (<div style={{ width: '80px',display: 'inline-block', padding: '1px', fontWeight: 'bold', zIndex: 2}}>{codigo}</div>)}
        </div>
        <div style={{paddingBottom: '2px'}}></div>
        <p>© 1997-2025 Netflix, Inc.</p>

        </div>

       

         <div style={{paddingLeft:'4vw',paddingTop: '4.7vw', display: 'flex', flexDirection: 'column', gap: '8px' }}>

        <a href="/terminos-uso">Terminos de uso</a>
        <div style={{paddingBottom: '2px'}}></div>
       
        
        </div>

         
     
    
      
     
       </footer>
    
    
  )
}

export default Footer
