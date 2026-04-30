import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Simulador de Subsidios de Vivienda 2026 | MiSubsidioYa',
  description: 'Calcula en tiempo real los subsidios de vivienda para los que calificas según tus ingresos, ahorros y valor de vivienda deseada. Mi Casa Ya, Caja de Compensación y más.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
