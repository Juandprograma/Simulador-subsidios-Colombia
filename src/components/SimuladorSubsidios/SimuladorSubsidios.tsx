'use client';

import React, { useState, useMemo } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import InputSection from './InputSection';
import ResultsCard from './ResultsCard';
import VisualizacionBarras from './VisualizacionBarras';
import { calcularSubsidios, calculateSMMLV } from '@/lib/subsidyCalculations';
import { SUBSIDY_CONFIG, SMMLV_2026, INGRESO_MINIMO, INGRESO_MAXIMO, AHORROS_MAXIMO, VIVIENDA_MINIMO, VIVIENDA_MAXIMO } from '@/lib/subsidyConfig';

const SimuladorSubsidios: React.FC = () => {
  // Estado de inputs
  const [ingresoMensual, setIngresoMensual] = useState<number>(SMMLV_2026 * 2);
  const [ahorros, setAhorros] = useState<number>(40000000);
  const [valorVivienda, setValorVivienda] = useState<number>(180000000);
  
  // Estado de errores
  const [errors, setErrors] = useState<{
    ingreso?: string;
    ahorros?: string;
    vivienda?: string;
  }>({});

  // Validación de entradas
  const validateInputs = () => {
    const newErrors: { ingreso?: string; ahorros?: string; vivienda?: string } = {};
    
    if (ingresoMensual < INGRESO_MINIMO) {
      newErrors.ingreso = `El ingreso mínimo es $${INGRESO_MINIMO.toLocaleString('es-CO')}`;
    } else if (ingresoMensual > INGRESO_MAXIMO) {
      newErrors.ingreso = `El ingreso máximo es $${INGRESO_MAXIMO.toLocaleString('es-CO')}`;
    }
    
    if (ahorros < 0) {
      newErrors.ahorros = 'Los ahorros no pueden ser negativos';
    } else if (ahorros > AHORROS_MAXIMO) {
      newErrors.ahorros = `El máximo de ahorros es $${AHORROS_MAXIMO.toLocaleString('es-CO')}`;
    } else if (ahorros >= valorVivienda) {
      newErrors.ahorros = 'Los ahorros no pueden superar el valor de la vivienda';
    }
    
    if (valorVivienda < VIVIENDA_MINIMO) {
      newErrors.vivienda = `El valor mínimo es $${VIVIENDA_MINIMO.toLocaleString('es-CO')}`;
    } else if (valorVivienda > VIVIENDA_MAXIMO) {
      newErrors.vivienda = `El valor máximo es $${VIVIENDA_MAXIMO.toLocaleString('es-CO')}`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Debounced validation
  const debouncedValidate = useDebouncedCallback(validateInputs, 300);

  // Handlers de cambio
  const handleIngresoChange = (value: number) => {
    setIngresoMensual(value);
    debouncedValidate();
  };

  const handleAhorrosChange = (value: number) => {
    setAhorros(value);
    debouncedValidate();
  };

  const handleViviendaChange = (value: number) => {
    setValorVivienda(value);
    debouncedValidate();
  };

  // Cálculo de resultados memoizado
  const resultados = useMemo(() => {
    if (Object.keys(errors).length > 0) {
      return null;
    }
    try {
      return calcularSubsidios(ingresoMensual, ahorros, valorVivienda);
    } catch {
      return null;
    }
  }, [ingresoMensual, ahorros, valorVivienda, errors]);

  // Calcular SMMLV actual
  const smmlvActual = useMemo(() => calculateSMMLV(ingresoMensual), [ingresoMensual]);

  return (
    <div className="w-full max-w-simulador mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
          Simulador de Subsidios de Vivienda
        </h1>
        <p className="text-text-secondary text-base md:text-lg">
          Calcula en tiempo real los subsidios para los que calificas en 2026
        </p>
        <div className="mt-3 inline-block px-4 py-1 bg-bg-secondary rounded-full border border-accent-gold/30">
          <span className="text-accent-gold text-sm font-medium">
            SMMLV 2026: ${SUBSIDY_CONFIG.CURRENT_SMMLV.toLocaleString('es-CO')}
          </span>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div 
        className="bg-bg-primary rounded-simulador p-6 md:p-10 premium-border shadow-premium"
        role="main"
        aria-label="Simulador de subsidios de vivienda"
      >
        {/* Sección de Inputs */}
        <InputSection
          ingresoMensual={ingresoMensual}
          ahorros={ahorros}
          valorVivienda={valorVivienda}
          smmlvActual={smmlvActual}
          errors={errors}
          onIngresoChange={handleIngresoChange}
          onAhorrosChange={handleAhorrosChange}
          onViviendaChange={handleViviendaChange}
        />

        {/* Sección de Resultados */}
        {resultados && (
          <div className="mt-10 animate-fade-in">
            <h2 className="text-xl font-semibold text-text-primary mb-6 text-center">
              Resultados del Simulador
            </h2>
            
            <ResultsCard resultados={resultados} valorVivienda={valorVivienda} ahorros={ahorros} />
            
            <div className="mt-8">
              <VisualizacionBarras 
                resultados={resultados} 
                valorVivienda={valorVivienda}
                ahorros={ahorros}
              />
            </div>

            {/* Disclaimer */}
            <div className="mt-8 p-4 bg-bg-secondary rounded-lg border border-bg-tertiary">
              <p className="text-text-secondary text-sm text-center">
                <span className="text-accent-gold">⚠️</span>{' '}
                Este simulador es <strong className="text-text-primary">informativo</strong>. 
                Verifica los montos exactos con la entidad oferente antes de tomar decisiones financieras.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center">
        <p className="text-text-secondary text-sm">
          © 2026 MiSubsidioYa - Simulador de Subsidios de Vivienda Colombia
        </p>
      </footer>

      {/* Animaciones CSS */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SimuladorSubsidios;
