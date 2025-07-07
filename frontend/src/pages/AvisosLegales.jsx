import React, { useState } from 'react'

const AvisosLegales = () => {
    const [mostrar, setMostrar] = useState(false)
    const listaDeAvisos = [
    { texto: 'plataforma para dispositivos listos para netflix', url: 'https://help.nflxext.com/legal/NRDP_Third_Party_Notices.pdf' },
    { texto: 'Android TV', url: 'https://help.nflxext.com/legal/Android%20TV%20-%20Third%20Party%20Notices%20.pdf' },
    { texto: 'App para android', url: 'https://help.nflxext.com/legal/Android%20App%20-%20Third%20Party%20Notices%20.pdf' },
    { texto: 'Apple TV', url: 'https://help.nflxext.com/legal/Apple%20TV%20-%20Third%20Party%20Notices%20.pdf' },
    { texto: 'App para IOS', url: 'https://help.nflxext.com/legal/Apple%20iOS%20App%20-%20Third%20Party%20Notices%20.pdf' },
    { texto: 'Juegos', url: 'https://help.nflxext.com/legal/Games%20SDK%20-%20Third%20Party%20Notices%20.pdf' },
  ];

    const botonmanejo = () =>{
        setMostrar(!mostrar)
    }
  return (
    <>
    <div>
    <div style={{backgroundColor: 'gray', paddingTop: '5vw', paddingLeft: '8vw'}}>
       
      <b>Los tiempos de espera para la asistencia telefónica son más largos que lo habitual</b>
      <hr />
      
     <b>Los tiempos de espera para la asistencia por chat son más largos que lo habitual</b>
     <p style={{marginTop: '2px'}}>Vuelve a intentarlo más tarde o busca las respuestas en nuestro Centro de ayuda.</p>
     </div>
     
     

     <div style={{backgroundColor: 'white', paddingRight: '10vw', paddingLeft: '8vw'}}>
        <h1>Avisos Legales</h1>
        <p> El servicio de Netflix, incluidos todos los contenidos del servicio de Netflix, está protegido por las leyes de derechos de autor, marcas registradas, secreto comercial u otras leyes o tratados de propiedad intelectual.
        <br />
        <h2>Derechos de autor</h2>
        <p>Los derechos de autor del contenido de nuestro servicio son propiedad de productores y empresas de producción importantes, Netflix entre ellas. Si considera que se están violando los derechos de autor propios o de alguien más en el servicio de Netflix, complete el formulario de reclamación de violación de derechos de autor.</p>
        <a href="www.netflix.com/copyrights">(www.netflix.com/copyrights)</a>
</p>
        <br />
        <h2>Marcas registradas</h2>
        <p>Netflix, el logotipo N y el identificador sónico Tudum son marcas registradas de Netflix, Inc.</p>
        <p>No se puede usar ninguna marca registrada de Netflix como si fuera una marca propia o patrocinada a menos que se cuente con el permiso explícito de Netflix.</p>
        <p>Cualquier producto con el nombre o el logotipo de Netflix es un reflejo directo de Netflix. A menos que se tenga licencia, está terminantemente prohibido fabricar, vender o ceder bienes o servicios con nuestro nombre o logotipo impreso.</p>
        <br />

        <h2>Patentes</h2>
        <p>Los servicios y las aplicaciones de Netflix están patentados. Para obtener más información sobre patentes relacionadas con nuestros servicios, visite</p>
        <a style={{color: 'red'}} href="www.netflix.com/patents.">www.netflix.com/patents.</a>
        <br />
        <h2>Avisos de terceros</h2>
        <p>Las aplicaciones de Netflix, los kits de desarrollo de software (SDK) y otros productos de Netflix pueden contener software de código abierto o licencias gratuitas («Software de código abierto»). Los términos de uso de Netflix no modifican ningún derecho u obligación que usted pueda tener con esas licencias de software de código abierto. Para obtener más información sobre software de código abierto, incluidos los reconocimientos requeridos, los términos de licencia y avisos, consulte a continuación.</p>
        
        <button  onClick={botonmanejo} style={{ color: 'black', fontSize: '2' }}>{mostrar?'▼Avisos':'▶Avisos'}</button>
        
         {mostrar && (
        <ul>
          {listaDeAvisos.map((aviso, idx) => (
            <li key={idx}>
              <a href={aviso.url} target="_blank" rel="noopener noreferrer">
                {aviso.texto}
              </a>
            </li>
          ))}
        </ul>
      )}



     </div>
      
      </div>
      </>
    
  )
}

export default AvisosLegales
