import VideoCard from "./VideoCard";
import '../css/MainSeries.css'
const MainSeries = ({

  visibleSeries,
   previewSerie,
  handleNext,
  handlePrev,
  agregarAmiLista,
  isHovered,
  setIsHovered,
  
  startIndex,
  seriesLength,
  titulo,
}) => {
  return (
    <div style={{ marginLeft: '40px',     
    marginRight: '20px',       
    marginBottom: '60px',
     
      }}>
      <h2 style={{position: 'relative',fontSize: '1.4vw',fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: 'white', marginLeft: '11px', marginTop: '40px',top: '5px', zIndex: 2 }}>{titulo}</h2>

      <div
        style={{
           display: 'flex',
    gap: '10px',
    
    paddingLeft: '40px',
    boxSizing: 'border-box',
     
    position: 'relative'       
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        {isHovered && (
          <button
           onClick={handlePrev}
    disabled={startIndex === 0}
  className="carrusel-boton izquierda"
          >
            ◀
          </button>
        )}

       
        <div
         className="carrusel-container"
        >
          {visibleSeries.map((ser) => (
            <VideoCard key={ser.id} serie={ser} agregarAmiLista={agregarAmiLista} />
          ))}
           {previewSerie && (
    <div className="carrusel-preview">
      <VideoCard
        serie={previewSerie}
        modoPreview={true}
        showAddButton={false}
      />
    </div>
  )}
        </div>

      
        {isHovered && (
          <button
  onClick={handleNext}
  disabled={startIndex + 5 >= seriesLength}
  className="carrusel-boton derecha"
>
  ▶
</button>
        )}
      </div>
    </div>
  );
};

export default MainSeries;
