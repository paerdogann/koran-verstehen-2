import React from 'react';
import { useParams, Link } from 'react-router-dom';
const DATA = {
  offenbarung: { title:'Gott', icon:'📖', color:'#354f88', text:'Die Gott des Korans an den Propheten Muhammad ist eines der zentralen Glaubensprinzipien des Islam.' },
  gotteslob: { title:'Mensch', icon:'🤲', color:'#9ebb9d', text:'Das Lob Gottes ist ein zentrales Thema im Koran. Die erste Sure, Al-Fatiha, beginnt mit dem Lob Gottes.' },
  'mensch-verantwortung': { title:'Handlung', icon:'🌍', color:'#e79209', text:'Der Koran betont die besondere Stellung des Menschen als Statthalter Gottes auf Erden.' },
  'ethik-gerechtigkeit': { title:'Erkenntnis', icon:'⚖️', color:'#446296', text:'Gerechtigkeit ist eines der wichtigsten Prinzipien im Koran.' },
  geschichte: { title:'Geschichte', icon:'🏛️', color:'#354f88', text:'Der Koran enthält zahlreiche historische Erzählungen über frühere Propheten und Völker.' },
};
export default function TopicPage() {
  const { slug } = useParams();
  const topic = DATA[slug];
  if (!topic) return (
    <div style={{ textAlign:'center', padding:80 }}>
      <h2>Nicht gefunden</h2>
      <Link to="/">← Zurück</Link>
    </div>
  );
  return (
    <div style={{ maxWidth:760, margin:'48px auto', padding:'0 24px' }}>
      <div style={{ background:'white', borderRadius:18, padding:'40px 36px', boxShadow:'0 4px 24px rgba(53,79,136,.1)', borderLeft:'5px solid '+topic.color, marginBottom:32, textAlign:'center' }}>
        <div style={{ fontSize:'3rem', marginBottom:12 }}>{topic.icon}</div>
        <h1 style={{ fontFamily:'Playfair Display,serif', color:topic.color, fontSize:'2rem', marginBottom:16 }}>{topic.title}</h1>
        <p style={{ color:'#5a6378', lineHeight:1.75 }}>{topic.text}</p>
      </div>
      <Link to="/" style={{ color:'#354f88', fontWeight:600, textDecoration:'none' }}>← Zurück zur Übersicht</Link>
    </div>
  );
}
