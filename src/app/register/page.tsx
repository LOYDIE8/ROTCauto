import RegistrationForm from '@/components/RegistrationForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-black border border-dark-grey p-8 shadow-[0_0_15px_rgba(0,255,255,0.1)]">
        <div className="mb-8 border-b border-dark-grey pb-4">
          <h1 className="text-3xl font-mono text-neon-cyan tracking-widest uppercase">NavalCommand</h1>
          <p className="text-gray-400 font-mono text-sm mt-2">SECURE PERSONNEL REGISTRATION // PHASE 1</p>
        </div>

        <RegistrationForm />
      </div>
    </div>
  )
}
