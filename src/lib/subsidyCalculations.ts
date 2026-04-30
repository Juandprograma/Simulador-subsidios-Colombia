/**
 * Lógica de Cálculo de Subsidios de Vivienda 2026
 * ===============================================
 * 
 * Funciones para calcular elegibilidad y montos de subsidios
 * según la normativa colombiana vigente.
 */

import { SUBSIDY_CONFIG } from './subsidyConfig';
import { SubsidyResult, EligibilityDetails, UserInputs } from './types';

/**
 * Calcula todos los subsidios disponibles según los inputs del usuario
 */
export function calcularSubsidios(
  ingresoMensual: number,
  ahorros: number,
  valorVivienda: number
): SubsidyResult {
  // Validar entradas
  if (ingresoMensual < 0 || ahorros < 0 || valorVivienda <= 0) {
    throw new Error('Los valores de entrada deben ser positivos');
  }

  const smmlvCount = ingresoMensual / SUBSIDY_CONFIG.CURRENT_SMMLV;
  
  // Calcular elegibilidad
  const eligibilidad = calculateEligibility(smmlvCount, valorVivienda);
  
  // Calcular montos de subsidios
  const miCasaYa = calculateMiCasaYa(smmlvCount, eligibilidad);
  const cajaCompensacion = calculateCajaCompensacion(smmlvCount, valorVivienda, eligibilidad);
  const subsidioConcurrente = calculateSubsidioConcurrente(smmlvCount, miCasaYa, eligibilidad);
  
  const totalSubsidios = miCasaYa + cajaCompensacion + subsidioConcurrente;
  const valorFinanciar = Math.max(0, valorVivienda - ahorros - totalSubsidios);
  const cuotaMensual = calculateMonthlyPayment(valorFinanciar);
  
  // Generar detalles de elegibilidad
  const detalles = generateDetails(
    smmlvCount,
    miCasaYa,
    cajaCompensacion,
    subsidioConcurrente,
    eligibilidad
  );

  return {
    miCasaYa,
    cajaCompensacion,
    subsidioConcurrente,
    totalSubsidios,
    valorFinanciar,
    cuotaMensual,
    eligibilidad: {
      miCasaYaEligible: eligibilidad.miCasaYa30 || eligibilidad.miCasaYa20,
      cajaEligible: eligibilidad.cajaCompensacion,
      concurrenteEligible: eligibilidad.subsidioConcurrente,
    },
    detalles,
  };
}

/**
 * Determina la elegibilidad para cada tipo de subsidio
 */
function calculateEligibility(
  smmlvCount: number,
  valorVivienda: number
): EligibilityDetails {
  const { 
    MI_CASA_YA, 
    CAJA_COMPENSACION, 
    SUBSIDIO_CONCURRENTE,
    VIVIENDA_VIS 
  } = SUBSIDY_CONFIG;

  // Mi Casa Ya 2026: Nuevos umbrales
  // Subsidio Mayor (< 2 SMMLV): $60.000.000
  // Subsidio Estándar (2-4 SMMLV): $40.000.000
  const withinHousingLimits = valorVivienda >= VIVIENDA_VIS.MIN && 
                               valorVivienda <= VIVIENDA_VIS.MAX;
  const miCasaYaMayor = smmlvCount < MI_CASA_YA.SALARY_THRESHOLD_MAYOR && withinHousingLimits;
  const miCasaYaEstandar = smmlvCount >= MI_CASA_YA.SALARY_THRESHOLD_MAYOR && 
                           smmlvCount <= MI_CASA_YA.SALARY_THRESHOLD_ESTANDAR && withinHousingLimits;
  // Legacy para compatibilidad con tipos
  const miCasaYa30 = miCasaYaEstandar;
  const miCasaYa20 = miCasaYaMayor;

  // Caja de Compensación: elegible si ingresos <= 3 SMMLV
  const cajaCompensacion = smmlvCount <= CAJA_COMPENSACION.SALARY_THRESHOLD;

  // Subsidio Concurrente: elegible si ingresos <= 5 SMMLV Y no accede a Mi Casa Ya
  const subsidioConcurrente = smmlvCount <= SUBSIDIO_CONCURRENTE.MAX_TOTAL_INCOME && 
                               !miCasaYa30 && !miCasaYa20;

  return {
    miCasaYa30,
    miCasaYa20,
    cajaCompensacion,
    subsidioConcurrente,
  };
}

/**
 * Calcula el subsidio Mi Casa Ya
 */
function calculateMiCasaYa(
  smmlvCount: number,
  eligibilidad: EligibilityDetails
): number {
  const { MI_CASA_YA } = SUBSIDY_CONFIG;
  
  // Nuevos valores 2026: Mayor (< 2 SMMLV) = $60M, Estándar (2-4 SMMLV) = $40M
  if (eligibilidad.miCasaYa20) {
    return MI_CASA_YA.SUBSIDY_AMOUNT_MAYOR; // $60.000.000
  }
  if (eligibilidad.miCasaYa30) {
    return MI_CASA_YA.SUBSIDY_AMOUNT_ESTANDAR; // $40.000.000
  }
  return 0;
}

/**
 * Calcula el subsidio de Caja de Compensación
 */
function calculateCajaCompensacion(
  smmlvCount: number,
  valorVivienda: number,
  eligibilidad: EligibilityDetails
): number {
  if (!eligibilidad.cajaCompensacion) {
    return 0;
  }
  
  const { CAJA_COMPENSACION } = SUBSIDY_CONFIG;
  const calculatedSubsidy = valorVivienda * CAJA_COMPENSACION.SUBSIDY_RATE;
  
  return Math.min(calculatedSubsidy, CAJA_COMPENSACION.MAX_SUBSIDY);
}

/**
 * Calcula el Subsidio Concurrente (complementario)
 */
function calculateSubsidioConcurrente(
  smmlvCount: number,
  miCasaYaAmount: number,
  eligibilidad: EligibilityDetails
): number {
  if (!eligibilidad.subsidioConcurrente) {
    return 0;
  }
  
  return SUBSIDY_CONFIG.SUBSIDIO_CONCURRENTE.SUBSIDY_AMOUNT;
}

/**
 * Calcula la cuota mensual estimada usando fórmula de amortización
 * P = (PV * r * (1+r)^n) / ((1+r)^n - 1)
 * Donde: PV = valor presente, r = tasa mensual, n = número de pagos
 */
function calculateMonthlyPayment(valorFinanciar: number): number {
  if (valorFinanciar <= 0) {
    return 0;
  }
  
  const { INTEREST_RATE, LOAN_YEARS } = SUBSIDY_CONFIG.FINANCIAMIENTO;
  
  const monthlyRate = INTEREST_RATE / 12;
  const numberOfPayments = LOAN_YEARS * 12;
  
  // Fórmula de amortización francesa
  const monthlyPayment = 
    (valorFinanciar * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  return Math.round(monthlyPayment);
}

/**
 * Genera mensajes descriptivos sobre la elegibilidad
 */
function generateDetails(
  smmlvCount: number,
  miCasaYa: number,
  cajaCompensacion: number,
  subsidioConcurrente: number,
  eligibilidad: EligibilityDetails
): string[] {
  const details: string[] = [];
  const roundedSmmlv = Math.round(smmlvCount * 10) / 10;
  
  details.push(`Ingresos: ${roundedSmmlv.toFixed(1)} SMMLV ($${SUBSIDY_CONFIG.CURRENT_SMMLV.toLocaleString('es-CO')})`);
  
  if (eligibilidad.miCasaYa20) {
    details.push(`✓ Calificas para Mi Casa Ya - Subsidio Mayor (${formatCurrency(SUBSIDY_CONFIG.MI_CASA_YA.SUBSIDY_AMOUNT_MAYOR)}) por ingresos < ${SUBSIDY_CONFIG.MI_CASA_YA.SALARY_THRESHOLD_MAYOR} SMMLV`);
  } else if (eligibilidad.miCasaYa30) {
    details.push(`✓ Calificas para Mi Casa Ya - Subsidio Estándar (${formatCurrency(SUBSIDY_CONFIG.MI_CASA_YA.SUBSIDY_AMOUNT_ESTANDAR)}) por ingresos ${SUBSIDY_CONFIG.MI_CASA_YA.SALARY_THRESHOLD_MAYOR}-${SUBSIDY_CONFIG.MI_CASA_YA.SALARY_THRESHOLD_ESTANDAR} SMMLV`);
  } else {
    details.push(`✗ No calificas para Mi Casa Ya (requiere ingresos ≤ ${SUBSIDY_CONFIG.MI_CASA_YA.SALARY_THRESHOLD_ESTANDAR} SMMLV)`);
  }
  
  if (eligibilidad.cajaCompensacion) {
    const cajaAmount = Math.round(cajaCompensacion).toLocaleString('es-CO');
    const maxCaja = formatCurrency(SUBSIDY_CONFIG.CAJA_COMPENSACION.MAX_SUBSIDY);
    details.push(`✓ Calificas para Caja de Compensación: $${cajaAmount} (15% de la vivienda, máx ${maxCaja})`);
  } else {
    details.push(`✗ No calificas para Caja de Compensación (requiere ingresos ≤ ${SUBSIDY_CONFIG.CAJA_COMPENSACION.SALARY_THRESHOLD} SMMLV)`);
  }
  
  if (eligibilidad.subsidioConcurrente) {
    details.push('✓ Calificas para Subsidio Concurrente ($25M) como complemento');
  } else if (!eligibilidad.miCasaYa30 && !eligibilidad.miCasaYa20) {
    details.push('✗ No calificas para Subsidio Concurrente (solo si no accedes a Mi Casa Ya y tienes ≤ 5 SMMLV)');
  }
  
  return details;
}

/**
 * Formatea un valor numérico como pesos colombianos
 */
export function formatCOP(value: number): string {
  return `$${Math.round(value).toLocaleString('es-CO')} COP`;
}

/**
 * Formatea un valor numérico como moneda sin decimales
 */
export function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString('es-CO')}`;
}

/**
 * Calcula el número de SMMLV a partir de un ingreso
 */
export function calculateSMMLV(ingreso: number): number {
  return ingreso / SUBSIDY_CONFIG.CURRENT_SMMLV;
}
