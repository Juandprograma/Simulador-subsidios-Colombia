'use client';

import React from 'react';
import { SUBSIDY_CONFIG, INGRESO_MINIMO, INGRESO_MAXIMO, AHORROS_MAXIMO, VIVIENDA_MINIMO, VIVIENDA_MAXIMO } from '@/lib/subsidyConfig';

interface InputSectionProps {
  ingresoMensual: number;
  ahorros: number;
  valorVivienda: number;
  smmlvActual: number;
  errors: {
    ingreso?: string;
    ahorros?: string;
    vivienda?: string;
  };
  onIngresoChange: (value: number) => void;
  onAhorrosChange: (value: number) => void;
  onViviendaChange: (value: number) => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  ingresoMensual,
  ahorros,
  valorVivienda,
  smmlvActual,
  errors,
  onIngresoChange,
  onAhorrosChange,
  onViviendaChange,
}) => {
  // Formatear número como COP
  const formatNumber = (value: number): string => {
    return value.toLocaleString('es-CO');
  };

  // Parsear input numérico
  const parseInput = (value: string): number => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    return parseInt(cleanValue, 10) || 0;
  };

  // Input con slider combinado
  const NumberInput: React.FC<{
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    error?: string;
    onChange: (value: number) => void;
    showSmmlv?: boolean;
    smmlvValue?: number;
    suffix?: string;
  }> = ({ label, value, min, max, step, error, onChange, showSmmlv, smmlvValue, suffix }) => {
    const inputId = label.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="mb-6">
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-text-secondary mb-2"
        >
          {label}
        </label>
        
        <div className="relative">
          <input
            id={inputId}
            type="text"
            inputMode="numeric"
            value={formatNumber(value)}
            onChange={(e) => onChange(parseInput(e.target.value))}
            className={`w-full input-gold text-lg font-semibold ${
              error ? 'border-danger' : ''
            }`}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary text-sm">
            {suffix || 'COP'}
          </span>
        </div>

        {showSmmlv && smmlvValue !== undefined && (
          <p className="mt-1 text-sm text-accent-gold">
            = {smmlvValue.toFixed(2)} SMMLV
          </p>
        )}

        {error && (
          <p 
            id={`${inputId}-error`}
            className="mt-1 text-sm text-danger"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Slider */}
        <div className="mt-3">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="slider-gold"
            aria-label={`${label} slider`}
          />
          <div className="flex justify-between text-xs text-text-secondary mt-1">
            <span>${formatNumber(min)}</span>
            <span>${formatNumber(max)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section aria-label="Datos de entrada" className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary mb-6 border-b border-bg-tertiary pb-3">
        Ingresa tus datos
      </h2>

      <NumberInput
        label="Ingresos del Hogar Mensual"
        value={ingresoMensual}
        min={INGRESO_MINIMO}
        max={INGRESO_MAXIMO}
        step={100000}
        error={errors.ingreso}
        onChange={onIngresoChange}
        showSmmlv={true}
        smmlvValue={smmlvActual}
      />

      <NumberInput
        label="Ahorros Actuales"
        value={ahorros}
        min={0}
        max={AHORROS_MAXIMO}
        step={1000000}
        error={errors.ahorros}
        onChange={onAhorrosChange}
      />

      <NumberInput
        label="Valor de la Vivienda Deseada"
        value={valorVivienda}
        min={VIVIENDA_MINIMO}
        max={VIVIENDA_MAXIMO}
        step={5000000}
        error={errors.vivienda}
        onChange={onViviendaChange}
      />

      {/* Indicador de tipo de vivienda */}
      <div className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg">
        <span className="text-text-secondary text-sm">Tipo de vivienda:</span>
        <span className={`text-sm font-medium px-2 py-1 rounded ${
          valorVivienda >= SUBSIDY_CONFIG.VIVIENDA_VIS.MIN && 
          valorVivienda <= SUBSIDY_CONFIG.VIVIENDA_VIS.MAX
            ? 'bg-success/20 text-success'
            : valorVivienda > SUBSIDY_CONFIG.VIVIENDA_VIS.MAX && 
              valorVivienda <= SUBSIDY_CONFIG.VIVIENDA_VIP.MAX
            ? 'bg-warning/20 text-warning'
            : 'bg-danger/20 text-danger'
        }`}>
          {valorVivienda >= SUBSIDY_CONFIG.VIVIENDA_VIS.MIN && 
           valorVivienda <= SUBSIDY_CONFIG.VIVIENDA_VIS.MAX
            ? 'VIS (Vivienda de Interés Social)'
            : valorVivienda > SUBSIDY_CONFIG.VIVIENDA_VIS.MAX && 
              valorVivienda <= SUBSIDY_CONFIG.VIVIENDA_VIP.MAX
            ? 'VIP (Vivienda de Interés Prioritario)'
            : 'Fuera de rangos VIS/VIP'}
        </span>
      </div>
    </section>
  );
};

export default InputSection;
