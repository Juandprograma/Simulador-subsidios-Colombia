import SimuladorSubsidios from '@/components/SimuladorSubsidios/SimuladorSubsidios'

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-primary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-simulador mx-auto">
        <SimuladorSubsidios />
      </div>
    </main>
  )
}
