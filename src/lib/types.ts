/**
 * Tipos TypeScript para el Simulador de Subsidios de Vivienda 2026
 */

export interface SubsidyResult {
  miCasaYa: number;
  cajaCompensacion: number;
  subsidioConcurrente: number;
  totalSubsidios: number;
  valorFinanciar: number;
  cuotaMensual: number;
  eligibilidad: {
    miCasaYaEligible: boolean;
    cajaEligible: boolean;
    concurrenteEligible: boolean;
  };
  detalles: string[];
}

export interface EligibilityDetails {
  /** @deprecated Usar miCasaYaEstandar - Subsidio estándar (2-4 SMMLV, $40M) */
  miCasaYa30: boolean;
  /** @deprecated Usar miCasaYaMayor - Subsidio mayor (< 2 SMMLV, $60M) */
  miCasaYa20: boolean;
  /** Subsidio estándar Mi Casa Ya (2-4 SMMLV, $40M) */
  miCasaYaEstandar?: boolean;
  /** Subsidio mayor Mi Casa Ya (< 2 SMMLV, $60M) */
  miCasaYaMayor?: boolean;
  cajaCompensacion: boolean;
  subsidioConcurrente: boolean;
}

export interface InputValidation {
  isValid: boolean;
  error?: string;
}

export interface UserInputs {
  ingresoMensual: number;
  ahorros: number;
  valorVivienda: number;
}

export interface SubsidyBreakdown {
  name: string;
  amount: number;
  eligible: boolean;
  description: string;
}
