import React from 'react';
import { Button } from 'primereact/button';
import '@/app/src/styles/bienvenida.css';

interface BienvenidaProps {
  onContinue: () => void;
  onLogout: () => void;
}

const BienvenidaSection: React.FC<BienvenidaProps> = ({ onContinue, onLogout }) => {
  return (
    <div className="home-content full-page-layout" id="home">
        <div className="welcome-layout">
      <div className="hero-text">
        <h1 className="hero-title">
          <span className="bienvenida">Bienvenido a</span>
          <span className="restaurant">MedAssist AI</span>
        </h1>
        <p>Potenciando la precisión clínica con inteligencia artificial que escucha y asiste.</p>
        
        <div className="home-buttons">
          {/* Usando Button de PrimeReact para aprovechar tu tema personalizado */}
          <Button label="Comenzar Registro" className="p-button-rounded btn-primary" onClick={onContinue} />
          <Button label="Cerrar Sesión" className="p-button-rounded btn-secondary" onClick={onLogout} />
          <Button label="Ver Demo" className="p-button-rounded p-button-outlined btn-secondary" onClick={onContinue} />
        </div>
      </div>

      <div className="hero-cards-container">
        
        {/* Card 1: Registro Clínico */}
        <div className="glass-card-wrapper">
          <div className="moving-borderr"></div>
          <div className="glass-card">
            <div className="card-bg-image" style={{ backgroundImage: "url('/image2.jfif')" }}></div>
            <div className="card-overlay">
              <h3>REGISTRO CLÍNICO</h3>
            </div>
          </div>
        </div>

        {/* Card 2: Análisis de IA */}
        <div className="glass-card-wrapper">
          <div className="moving-borderr"></div>
          <div className="glass-card">
            <div className="card-bg-image" style={{ backgroundImage: "url('/med9.jpg')" }}></div>
            <div className="card-overlay">
              <h3>ANÁLISIS INTELIGENTE</h3>
            </div>
          </div>
        </div>

        {/* Card 3: Historial Médico */}
        <div className="glass-card-wrapper">
          <div className="moving-borderr"></div>
          <div className="glass-card">
            <div className="card-bg-image" style={{ backgroundImage: "url('/med10.jpg')" }}></div>
            <div className="card-overlay">
              <h3>GESTIÓN DE DATOS</h3>
            </div>
          </div>
        </div>

      </div>
      </div>
    </div>
  );
};

export default BienvenidaSection;