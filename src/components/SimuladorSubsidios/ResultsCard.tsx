'use client';

import React from 'react';
import { SubsidyResult } from '@/lib/types';
import { formatCurrency } from '@/lib/subsidyCalculations';
import { SUBSIDY_CONFIG, SMMLV_2026 } from '@/lib/subsidyConfig';

interface ResultsCardProps {
  resultados: SubsidyResult;
  valorVivienda: number;
  ahorros: number;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ resultados, valorVivienda, ahorros }) => {
  const {
    miCasaYa,
    cajaCompensacion,
    subsidioConcurrente,
    totalSubsidios,
    valorFinanciar,
    cuotaMensual,
    eligibilidad,
    detalles,
  } = resultados;

  // Componente para una fila de subsidio
  const SubsidyRow: React.FC<{
    name: string;
    amount: number;
    eligible: boolean;
  }> = ({ name, amount, eligible }) => (
    <div className="flex items-center justify-between py-3 border-b border-bg-tertiary last:border-b-0">
      <div className="flex items-center gap-3">
        <span className={`w-2 h-2 rounded-full ${eligible ? 'bg-success' : 'bg-bg-tertiary'}`} />
        <span className="text-text-secondary text-sm">{name}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className={`font-semibold ${eligible ? 'text-accent-gold' : 'text-text-secondary'}`}>
          {formatCurrency(amount)}
        </span>
        <span className={eligible ? 'badge-success' : 'badge-ineligible'}>
          {eligible ? '✓ Aplica' : '✗ No aplica'}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Cards de Subsidios Disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg border-2 ${
          eligibilidad.miCasaYaEligible 
            ? 'bg-success/10 border-success' 
            : 'bg-bg-secondary border-bg-tertiary'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">Mi Casa Ya</span>
            <span className={eligibilidad.miCasaYaEligible ? 'text-success' : 'text-text-secondary'}>
              {eligibilidad.miCasaYaEligible ? '✓' : '✗'}
            </span>
          </div>
          <p className={`text-xl font-bold ${eligibilidad.miCasaYaEligible ? 'text-accent-gold' : 'text-text-secondary'}`}>
            {formatCurrency(miCasaYa)}
          </p>
          {eligibilidad.miCasaYaEligible && miCasaYa === SUBSIDY_CONFIG.MI_CASA_YA.SUBSIDY_AMOUNT_MAYOR && (
            <p className="text-xs text-success mt-1">Subs. Mayor (&lt;2 SMMLV)</p>
          )}
          {eligibilidad.miCasaYaEligible && miCasaYa === SUBSIDY_CONFIG.MI_CASA_YA.SUBSIDY_AMOUNT_ESTANDAR && (
            <p className="text-xs text-text-secondary mt-1">Subs. Estándar (2-4 SMMLV)</p>
          )}
        </div>

        <div className={`p-4 rounded-lg border-2 ${
          eligibilidad.cajaEligible 
            ? 'bg-success/10 border-success' 
            : 'bg-bg-secondary border-bg-tertiary'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">Caja de Compensación</span>
            <span className={eligibilidad.cajaEligible ? 'text-success' : 'text-text-secondary'}>
              {eligibilidad.cajaEligible ? '✓' : '✗'}
            </span>
          </div>
          <p className={`text-xl font-bold ${eligibilidad.cajaEligible ? 'text-accent-gold' : 'text-text-secondary'}`}>
            {formatCurrency(cajaCompensacion)}
          </p>
          {eligibilidad.cajaEligible && (
            <p className="text-xs text-text-secondary mt-1">15% del valor, máx {formatCurrency(SUBSIDY_CONFIG.CAJA_COMPENSACION.MAX_SUBSIDY)}</p>
          )}
        </div>

        <div className={`p-4 rounded-lg border-2 ${
          eligibilidad.concurrenteEligible 
            ? 'bg-success/10 border-success' 
            : 'bg-bg-secondary border-bg-tertiary'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">Subsidio Concurrente</span>
            <span className={eligibilidad.concurrenteEligible ? 'text-success' : 'text-text-secondary'}>
              {eligibilidad.concurrenteEligible ? '✓' : '✗'}
            </span>
          </div>
          <p className={`text-xl font-bold ${eligibilidad.concurrenteEligible ? 'text-accent-gold' : 'text-text-secondary'}`}>
            {formatCurrency(subsidioConcurrente)}
          </p>
          {eligibilidad.concurrenteEligible && (
            <p className="text-xs text-text-secondary mt-1">Complemento sin Mi Casa Ya</p>
          )}
        </div>
      </div>

      {/* Tabla Financiera Detallada */}
      <div className="premium-card">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Proyección Financiera
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-text-secondary">Valor de la Vivienda</span>
            <span className="text-text-primary font-medium">{formatCurrency(valorVivienda)}</span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-text-secondary">- Ahorros Actuales</span>
            <span className="text-warning font-medium">-{formatCurrency(ahorros)}</span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-text-secondary">- Total Subsidios</span>
            <span className="text-success font-medium">-{formatCurrency(totalSubsidios)}</span>
          </div>
          
          <div className="border-t-2 border-accent-gold my-3" />
          
          <div className="flex justify-between items-center py-2">
            <span className="text-text-primary font-semibold">= Valor a Financiar</span>
            <span className="text-accent-gold font-bold text-lg">{formatCurrency(valorFinanciar)}</span>
          </div>
        </div>

        {/* Cuota Mensual */}
        {cuotaMensual > 0 && (
          <div className="mt-6 p-4 bg-accent-gold/10 rounded-lg border border-accent-gold/30">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <span className="text-text-secondary text-sm">Cuota Mensual Estimada</span>
                <p className="text-xs text-text-secondary mt-1">
                  (20 años, 6.5% anual referencial)
                </p>
              </div>
              <span className="text-2xl md:text-3xl font-bold text-accent-gold">
                {formatCurrency(cuotaMensual)}/mes
              </span>
            </div>
          </div>
        )}

        {cuotaMensual === 0 && (
          <div className="mt-6 p-4 bg-success/10 rounded-lg border border-success">
            <p className="text-success text-center font-medium">
              ¡Felicitaciones! Tus ahorros y subsidios cubren el valor total de la vivienda.
              No necesitas financiación adicional.
            </p>
          </div>
        )}
      </div>

      {/* Detalles de Elegibilidad */}
      <div className="bg-bg-secondary rounded-lg p-4">
        <h4 className="text-sm font-semibold text-text-primary mb-3">
          Detalles de Elegibilidad
        </h4>
        <ul className="space-y-2">
          {detalles.map((detalle, index) => (
            <li 
              key={index} 
              className={`text-sm ${
                detalle.startsWith('✓') 
                  ? 'text-success' 
                  : detalle.startsWith('✗') 
                    ? 'text-text-secondary' 
                    : 'text-text-secondary'
              }`}
            >
              {detalle}
            </li>
          ))}
        </ul>
      </div>

      {/* Recomendaciones Contextuales */}
      <div className="bg-bg-secondary rounded-lg p-4">
        <h4 className="text-sm font-semibold text-text-primary mb-3">
          Recomendaciones
        </h4>
        <ul className="space-y-2 text-sm text-text-secondary">
          {!eligibilidad.miCasaYaEligible && (
            <li className="flex items-start gap-2">
              <span className="text-warning">•</span>
              <span>
                Para acceder a Mi Casa Ya, necesitas ingresos ≤ {SUBSIDY_CONFIG.MI_CASA_YA.SALARY_THRESHOLD_ESTANDAR} SMMLV (${(SUBSIDY_CONFIG.MI_CASA_YA.SALARY_THRESHOLD_ESTANDAR * SMMLV_2026).toLocaleString('es-CO')}). 
                Actualmente estás por encima de este límite.
              </span>
            </li>
          )}
          {eligibilidad.miCasaYaEligible && miCasaYa === SUBSIDY_CONFIG.MI_CASA_YA.SUBSIDY_AMOUNT_ESTANDAR && (
            <li className="flex items-start gap-2">
              <span className="text-accent-gold">•</span>
              <span>
                Si reduces tus ingresos a &lt; {SUBSIDY_CONFIG.MI_CASA_YA.SALARY_THRESHOLD_MAYOR} SMMLV, podrías acceder al Subsidio Mayor de {formatCurrency(SUBSIDY_CONFIG.MI_CASA_YA.SUBSIDY_AMOUNT_MAYOR)}.
              </span>
            </li>
          )}
          {ahorros < valorVivienda * 0.05 && (
            <li className="flex items-start gap-2">
              <span className="text-warning">•</span>
              <span>
                Tus ahorros son menores al 5% del valor de la vivienda. 
                La mayoría de entidades financieras requieren cuota inicial mínima.
              </span>
            </li>
          )}
          {valorVivienda < SUBSIDY_CONFIG.VIVIENDA_VIS.MIN && (
            <li className="flex items-start gap-2">
              <span className="text-danger">•</span>
              <span>
                El valor de vivienda está por debajo del mínimo VIS ({formatCurrency(SUBSIDY_CONFIG.VIVIENDA_VIS.MIN)}). 
                Considera buscar opciones dentro del rango VIS para acceder a más subsidios.
              </span>
            </li>
          )}
          {valorVivienda > SUBSIDY_CONFIG.VIVIENDA_VIS.MAX && !eligibilidad.miCasaYaEligible && (
            <li className="flex items-start gap-2">
              <span className="text-text-secondary">•</span>
              <span>
                Viviendas VIP pueden tener acceso a subsidios diferenciales. 
                Consulta con la entidad oferente.
              </span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ResultsCard;
