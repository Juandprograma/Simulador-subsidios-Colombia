# Simulador de Subsidios de Vivienda 2026. Funcional en:https://simulador.misubsidioya.com/ 

Simulador interactivo para calcular subsidios de vivienda según normativa colombiana vigente (Mi Casa Ya, Caja de Compensación, Subsidio Concurrente).

## Características

- Cálculo en tiempo real de subsidios disponibles
- Interfaz premium con diseño minimalista dorado/negro
- Responsive (mobile-first)
- Accesibilidad WCAG AA
- 100% TypeScript con strict mode

## Stack Tecnológico

- **Framework:** Next.js 14+ (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v3+
- **Deployment:** Static Export

## Instalación

```bash
npm install
npm run dev
```

## Estructura de Directorios

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── SimuladorSubsidios/
│       ├── SimuladorSubsidios.tsx
│       ├── InputSection.tsx
│       ├── ResultsCard.tsx
│       └── VisualizacionBarras.tsx
└── lib/
    ├── subsidyConfig.ts      # CONFIG CRÍTICA
    ├── subsidyCalculations.ts
    ├── subsidyCalculations.test.ts
    └── types.ts
```

## Configuración de Subsidios

Para actualizar valores de subsidios, editar únicamente `src/lib/subsidyConfig.ts`:

```typescript
export const SUBSIDY_CONFIG = {
  CURRENT_SMMLV: 1391384,  // ← Actualizar solo este valor
  // ... resto de configuración
};
```

⚠️ **NO modificar** la lógica de cálculo sin auditoría.

## Scripts

- `npm run dev` - Desarrollo
- `npm run build` - Build estático
- `npm test` - Tests unitarios

## Normativa Aplicable

- Programa Mi Casa Ya (Ministerio de Vivienda)
- Subsidios Caja de Compensación Familiar
- Subsidio Concurrente Complementario

---

© 2026 MiSubsidioYa - Informativo, no constituye oferta vinculante.
