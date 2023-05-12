import React from 'react';
function Footer() {
  return (
    <footer className="navbar fixed-bottom">
      <br/>
      <a href="https://www.webucator.com" className="text-light">
        Copyright &copy; {new Date().getFullYear()} Gerasimos 'Geri' Michalitsianos
      </a>
      <br/>
    </footer>
  )
}
export default Footer;
