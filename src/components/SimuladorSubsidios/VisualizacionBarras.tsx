'use client';

import React from 'react';
import { SubsidyResult } from '@/lib/types';

interface VisualizacionBarrasProps {
  resultados: SubsidyResult;
  valorVivienda: number;
  ahorros: number;
}

const VisualizacionBarras: React.FC<VisualizacionBarrasProps> = ({
  resultados,
  valorVivienda,
  ahorros,
}) => {
  const { miCasaYa, cajaCompensacion, subsidioConcurrente, valorFinanciar } = resultados;

  // Calcular porcentajes para las barras
  const total = valorVivienda;
  
  const data = [
    {
      label: 'Ahorros',
      value: ahorros,
      percentage: total > 0 ? (ahorros / total) * 100 : 0,
      color: '#d4af37', // accent-gold dorado
      eligible: ahorros > 0,
    },
    {
      label: 'Mi Casa Ya',
      value: miCasaYa,
      percentage: total > 0 ? (miCasaYa / total) * 100 : 0,
      color: '#f4d03f', // accent-yellow dorado brillante
      eligible: miCasaYa > 0,
    },
    {
      label: 'Caja Comp.',
      value: cajaCompensacion,
      percentage: total > 0 ? (cajaCompensacion / total) * 100 : 0,
      color: '#b8860b', // darkgoldenrod dorado oscuro
      eligible: cajaCompensacion > 0,
    },
    {
      label: 'Concurrente',
      value: subsidioConcurrente,
      percentage: total > 0 ? (subsidioConcurrente / total) * 100 : 0,
      color: '#daa520', // goldenrod dorado medio
      eligible: subsidioConcurrente > 0,
    },
    {
      label: 'A Financiar',
      value: valorFinanciar,
      percentage: total > 0 ? (valorFinanciar / total) * 100 : 0,
      color: '#f59e0b', // warning/naranja dorado cálido
      eligible: valorFinanciar > 0,
    },
  ];

  // Filtrar solo elementos con valor > 0
  const activeData = data.filter(item => item.value > 0);

  const formatCurrency = (value: number): string => {
    return `$${Math.round(value).toLocaleString('es-CO')}`;
  };

  return (
    <div className="bg-bg-secondary rounded-lg p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-6 text-center">
        Distribución del Valor de la Vivienda
      </h3>

      {/* Barra apilada horizontal */}
      <div className="relative">
        <div 
          className="flex h-12 rounded-lg overflow-hidden"
          role="img"
          aria-label="Gráfico de distribución del valor de vivienda"
        >
          {activeData.map((item, index) => (
            <div
              key={item.label}
              className="h-full transition-all duration-500 ease-out relative group"
              style={{ 
                width: `${item.percentage}%`,
                backgroundColor: item.color,
                minWidth: item.percentage > 0 ? '4px' : '0',
              }}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-bg-tertiary rounded-lg border border-accent-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                <p className="text-text-primary font-semibold text-sm">{item.label}</p>
                <p className="text-accent-gold text-sm">{formatCurrency(item.value)}</p>
                <p className="text-text-secondary text-xs">{item.percentage.toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>

        {/* Valor total debajo */}
        <p className="text-center mt-3 text-text-secondary text-sm">
          Total: <span className="text-text-primary font-semibold">{formatCurrency(valorVivienda)}</span>
        </p>
      </div>

      {/* Leyenda */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {activeData.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-text-secondary text-xs truncate">{item.label}</p>
              <p className="text-text-primary text-sm font-medium truncate">
                {formatCurrency(item.value)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Barras individuales verticales */}
      <div className="mt-8 grid grid-cols-5 gap-2">
        {activeData.map((item) => {
          const barHeight = Math.max(20, (item.percentage / 100) * 150);
          
          return (
            <div key={item.label} className="flex flex-col items-center">
              <div className="relative w-full flex items-end justify-center" style={{ height: '160px' }}>
                <div
                  className="w-full max-w-[40px] rounded-t-lg transition-all duration-500 ease-out"
                  style={{ 
                    height: `${barHeight}px`,
                    backgroundColor: item.color,
                    opacity: 0.8,
                  }}
                />
              </div>
              <p className="text-text-secondary text-xs mt-2 text-center truncate w-full">
                {item.label}
              </p>
              <p className="text-text-primary text-xs font-medium text-center">
                {item.percentage.toFixed(0)}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VisualizacionBarras;
