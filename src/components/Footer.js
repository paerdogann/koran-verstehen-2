import React from 'react';

export default function Footer() {
  return (
    <footer style={{ background: '#354f88', padding: '44px 24px 36px', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', marginBottom: 18 }}>
        <a href="/uber-uns" style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: '#EDEFF7', textDecoration: 'none' }}>Über uns</a>
        <a href="/kontakt" style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: '#EDEFF7', textDecoration: 'none' }}>Kontakt</a>
        <a href="/impressum" style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: '#EDEFF7', textDecoration: 'none' }}>Impressum</a>
        <a href="/datenschutz" style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: '#EDEFF7', textDecoration: 'none' }}>Datenschutz</a>
      </div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.9rem', color: '#AEB6D6' }}>
        © {new Date().getFullYear()} Koran verstehen. Alle Rechte vorbehalten.
      </div>
    </footer>
  );
}
