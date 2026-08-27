import React from 'react';
import { Link } from 'react-router-dom';

const h2 = { fontSize: '1.15rem', fontWeight: 700, color: '#354f88', marginTop: 30, marginBottom: 10 };
const p = { lineHeight: 1.8, marginBottom: 12 };

export default function Datenschutz() {
  return (
    <div style={{ fontFamily: "'Work Sans', sans-serif", color: '#333', maxWidth: 760, margin: '0 auto', padding: '48px 24px 90px' }}>
      <Link to="/" style={{ color: '#354f88', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>← Zurück zur Startseite</Link>

      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#354f88', margin: '24px 0 32px' }}>Datenschutzerklärung</h1>

      <h2 style={h2}>1. Verantwortlicher</h2>
      <p style={p}>
        Verantwortlich für die Datenverarbeitung auf dieser Website ist:<br />
        [Name / Organisation]<br />
        [Adresse]<br />
        E-Mail: [E-Mail-Adresse]
      </p>

      <h2 style={h2}>2. Erhebung und Speicherung personenbezogener Daten</h2>
      <p style={p}>
        Beim Besuch dieser Website erhebt unser Hosting-Anbieter automatisch Informationen (Server-Logfiles),
        die Ihr Browser übermittelt, u. a. IP-Adresse, Datum und Uhrzeit der Anfrage, Browsertyp und -version.
        Diese Daten dienen der technischen Bereitstellung der Website und werden nicht mit anderen Datenquellen
        zusammengeführt.
      </p>

      <h2 style={h2}>3. Registrierung und Login</h2>
      <p style={p}>
        Wenn Sie sich auf dieser Website registrieren, erheben wir Ihre E-Mail-Adresse und weitere von Ihnen
        angegebene Daten zur Bereitstellung des Nutzerkontos. Die Verarbeitung erfolgt über unseren
        Dienstleister Supabase (Supabase Inc.).
      </p>

      <h2 style={h2}>4. Cookies</h2>
      <p style={p}>
        Diese Website verwendet technisch notwendige Cookies, um die Anmeldefunktion bereitzustellen. Es werden
        keine Cookies zu Werbe- oder Trackingzwecken eingesetzt.
      </p>

      <h2 style={h2}>5. Ihre Rechte</h2>
      <p style={p}>
        Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung oder Einschränkung der Verarbeitung
        Ihrer gespeicherten personenbezogenen Daten sowie ein Widerspruchsrecht gegen die Verarbeitung und ein
        Recht auf Datenübertragbarkeit. Wenden Sie sich hierzu an die oben genannte Kontaktadresse.
      </p>

      <h2 style={h2}>6. Beschwerderecht bei der Aufsichtsbehörde</h2>
      <p style={p}>
        Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer
        personenbezogenen Daten durch uns zu beschweren.
      </p>

      <p style={{ marginTop: 48, padding: 16, background: '#fff6e6', borderRadius: 10, fontSize: 13.5, color: '#7a5c00', lineHeight: 1.6 }}>
        ⚠️ Dies ist eine Vorlage und keine Rechtsberatung. Bitte alle Platzhalter ausfüllen und die Erklärung
        an eure tatsächliche Datenverarbeitung anpassen — im Zweifel mit einem Anwalt oder einem
        Datenschutz-Generator prüfen.
      </p>
    </div>
  );
}
