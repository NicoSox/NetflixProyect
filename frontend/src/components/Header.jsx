
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
<div style={{ position: 'fixed',
  top: 0,
  left: 0,
  right: 0, // ← corregido
  height: '60px',
  backgroundColor: '#1c1c1c',
  display: 'flex',
  alignItems: 'center',
  padding: '0 20px',
  zIndex: 10,
}}>
 




      <Link to='/series' style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>Series</Link>
      <Link to='/milista' style={{ color: 'white', textDecoration: 'none' }}>Mi Lista</Link>
    </div>
    
  );
};

export default Header;
