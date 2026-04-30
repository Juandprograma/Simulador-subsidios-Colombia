/**
 * CONFIGURACIÓN DE SUBSIDIOS 2026
 * ==============================
 * 
 * ⚠️ ARCHIVO CRÍTICO - NO MODIFICAR VALORES SIN AUDITORÍA
 * 
 * Este archivo es la ÚNICA fuente de verdad para los valores de subsidios.
 * Si el salario mínimo cambia en 2026, SOLO editar CURRENT_SMMLV.
 * Los cálculos se ajustan automáticamente.
 * 
 * Valores vigentes 2026 - SMMLV = $2.000.000 COP (Oficial)
 */

/** Salario Mínimo Mensual Legal Vigente 2026 */
export const SMMLV_2026 = 2000000;

/** Año de vigencia */
export const YEAR = 2026;

export const SUBSIDY_CONFIG = {
  /** Salario Mínimo Mensual Legal Vigente 2026 */
  CURRENT_SMMLV: SMMLV_2026,
  
  /** Año de vigencia */
  YEAR: YEAR,
  
  /** Programa Mi Casa Ya - NUEVOS VALORES OFICIALES 2026 */
  MI_CASA_YA: {
    /** Umbral de ingresos para subsidio MAYOR: < 2 SMMLV ($60.000.000) */
    SALARY_THRESHOLD_MAYOR: 2,
    /** Umbral de ingresos para subsidio ESTÁNDAR: 2-4 SMMLV ($40.000.000) */
    SALARY_THRESHOLD_ESTANDAR: 4,
    /** Monto de subsidio para < 2 SMMLV: $60.000.000 */
    SUBSIDY_AMOUNT_MAYOR: 60000000,
    /** Monto de subsidio para 2-4 SMMLV: $40.000.000 */
    SUBSIDY_AMOUNT_ESTANDAR: 40000000,
    // Valores legacy para compatibilidad (mapean a los nuevos)
    SALARY_THRESHOLD_30: 4,
    SALARY_THRESHOLD_20: 2,
    SUBSIDY_AMOUNT_30: 40000000,
    SUBSIDY_AMOUNT_20: 60000000,
  },

  /** Topes de Valor de Vivienda - NUEVOS VALORES OFICIALES 2026 */
  VIVIENDA_VIS: {
    /** Mínimo VIS: 35 SMMLV = $70.000.000 */
    MIN: 70000000,
    /** Máximo VIS: 135 SMMLV = $270.000.000 */
    MAX: 270000000,
    /** VIS Ciudades Principales: 150 SMMLV = $300.000.000 */
    MAX_CIUDADES_PRINCIPALES: 300000000,
  },
  
  /** Topes de Valor de Vivienda VIP (Vivienda de Interés Prioritario) */
  VIVIENDA_VIP: {
    /** Mínimo VIP: 90 SMMLV = $180.000.000 */
    MIN: 180000000,
    /** Máximo VIP: 135 SMMLV = $270.000.000 (límite Mi Casa Ya) */
    MAX: 270000000,
  },

  /** Subsidio de Caja de Compensación Familiar */
  CAJA_COMPENSACION: {
    /** Máximo 3 SMMLV para acceder */
    SALARY_THRESHOLD: 3,
    /** 15% del valor de vivienda */
    SUBSIDY_RATE: 0.15,
    /** Máximo $15.000.000 */
    MAX_SUBSIDY: 15000000,
  },

  /** Subsidio Concurrente (complementario) */
  SUBSIDIO_CONCURRENTE: {
    /** Máximo 5 SMMLV para acceder */
    MAX_TOTAL_INCOME: 5,
    /** Monto fijo $25.000.000 COP */
    SUBSIDY_AMOUNT: 25000000,
  },

  /** Parámetros de financiamiento hipotecario */
  FINANCIAMIENTO: {
    /** Tasa de interés anual referencial: 6.5% */
    INTEREST_RATE: 0.065,
    /** Plazo del préstamo: 20 años */
    LOAN_YEARS: 20,
    /** Cuota inicial mínima: 5% */
    DOWN_PAYMENT_PERCENTAGE: 0.05,
  },
} as const;

/** Parámetros de financiamiento hipotecario */
export const FINANCIAMIENTO = {
  /** Tasa de interés anual referencial: 6.5% */
  INTEREST_RATE: 0.065,
  /** Plazo del préstamo: 20 años */
  LOAN_YEARS: 20,
  /** Cuota inicial mínima: 5% */
  DOWN_PAYMENT_PERCENTAGE: 0.05,
} as const;

// ============================================================================
// RANGOS DE INPUT (exportados individualmente para componentes)
// ============================================================================

/** Ingreso mínimo permitido: $1.000.000 */
export const INGRESO_MINIMO = 1000000;

/** Ingreso máximo permitido: $100.000.000 */
export const INGRESO_MAXIMO = 100000000;

/** Ahorros máximo permitido: $200.000.000 */
export const AHORROS_MAXIMO = 200000000;

/** Valor vivienda mínimo: $50.000.000 */
export const VIVIENDA_MINIMO = 50000000;

/** Valor vivienda máximo: $500.000.000 */
export const VIVIENDA_MAXIMO = 500000000;

/** Tipo exportado para uso en el simulador */
export type SubsidyConfig = typeof SUBSIDY_CONFIG;
