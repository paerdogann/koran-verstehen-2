import React from 'react';
import { Link } from 'react-router-dom';

export default function Impressum() {
  return (
    <div style={{ fontFamily: "'Work Sans', sans-serif", color: '#333', maxWidth: 760, margin: '0 auto', padding: '48px 24px 90px' }}>
      <Link to="/" style={{ color: '#354f88', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>← Zurück zur Startseite</Link>

      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#354f88', margin: '24px 0 32px' }}>Impressum</h1>

      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#354f88', marginTop: 32, marginBottom: 12 }}>Angaben gemäß § 5 TMG</h2>
      <p style={{ lineHeight: 1.8 }}>
        [Vor- und Nachname bzw. Name der Organisation]<br />
        [Straße und Hausnummer]<br />
        [PLZ und Ort]<br />
        Deutschland
      </p>

      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#354f88', marginTop: 32, marginBottom: 12 }}>Kontakt</h2>
      <p style={{ lineHeight: 1.8 }}>
        Telefon: [Telefonnummer]<br />
        E-Mail: [E-Mail-Adresse]
      </p>

      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#354f88', marginTop: 32, marginBottom: 12 }}>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
      <p style={{ lineHeight: 1.8 }}>
        [Vor- und Nachname]<br />
        [Straße und Hausnummer]<br />
        [PLZ und Ort]
      </p>

      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#354f88', marginTop: 32, marginBottom: 12 }}>EU-Streitschlichtung</h2>
      <p style={{ lineHeight: 1.8 }}>
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
        <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noreferrer" style={{ color: '#354f88' }}>
          https://ec.europa.eu/consumers/odr/
        </a>.<br />
        Unsere E-Mail-Adresse finden Sie oben im Impressum.
      </p>

      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#354f88', marginTop: 32, marginBottom: 12 }}>Haftung für Inhalte</h2>
      <p style={{ lineHeight: 1.8 }}>
        Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen
        Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet,
        übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf
        eine rechtswidrige Tätigkeit hinweisen.
      </p>

      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#354f88', marginTop: 32, marginBottom: 12 }}>Haftung für Links</h2>
      <p style={{ lineHeight: 1.8 }}>
        Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben.
        Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
      </p>

      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#354f88', marginTop: 32, marginBottom: 12 }}>Urheberrecht</h2>
      <p style={{ lineHeight: 1.8 }}>
        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
        Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
        Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
      </p>

      <p style={{ marginTop: 48, padding: 16, background: '#fff6e6', borderRadius: 10, fontSize: 13.5, color: '#7a5c00', lineHeight: 1.6 }}>
        ⚠️ Dies ist eine Vorlage. Bitte alle Platzhalter in eckigen Klammern durch echte Angaben ersetzen.
        Diese Vorlage ersetzt keine Rechtsberatung — bei Unsicherheit einen Anwalt konsultieren.
      </p>
    </div>
  );
}
