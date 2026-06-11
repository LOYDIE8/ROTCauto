'use client'

import { useState } from 'react'
import { registerUser } from '@/app/register/actions'

export default function RegistrationForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    studentId: '',
    email: '',
    phone: '',
    program: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validatePassword = (password: string) => {
    // Minimum 8 characters, at least one letter and one number and one special character
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    return re.test(password)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      setIsLoading(false)
      return
    }

    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters long and contain letters, numbers, and a special character.')
      setIsLoading(false)
      return
    }

    const result = await registerUser(formData)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }

    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="text-center py-10 space-y-4">
        <div className="inline-block border-2 border-neon-cyan p-4 rounded-sm text-neon-cyan mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-2xl font-mono text-white">REGISTRATION INITIATED</h2>
        <p className="text-gray-400 font-mono text-sm max-w-md mx-auto">
          A verification link has been transmitted to your email. You must verify your communication channel before accessing the secure grid.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-200 p-3 text-sm font-mono">
          <span className="font-bold mr-2">ERROR:</span> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">First Name</label>
          <input
            type="text"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full bg-[#111] border border-gray-800 text-white p-2 font-mono text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Last Name</label>
          <input
            type="text"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="w-full bg-[#111] border border-gray-800 text-white p-2 font-mono text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Date of Birth</label>
          <input
            type="date"
            name="dob"
            required
            value={formData.dob}
            onChange={handleChange}
            className="w-full bg-[#111] border border-gray-800 text-white p-2 font-mono text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Student ID</label>
          <input
            type="text"
            name="studentId"
            required
            value={formData.studentId}
            onChange={handleChange}
            className="w-full bg-[#111] border border-gray-800 text-white p-2 font-mono text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Email Address</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-[#111] border border-gray-800 text-white p-2 font-mono text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Contact Number</label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-[#111] border border-gray-800 text-white p-2 font-mono text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Academic Program</label>
        <input
          type="text"
          name="program"
          required
          value={formData.program}
          onChange={handleChange}
          className="w-full bg-[#111] border border-gray-800 text-white p-2 font-mono text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dark-grey">
        <div className="space-y-2">
          <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Password</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-[#111] border border-gray-800 text-white p-2 font-mono text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full bg-[#111] border border-gray-800 text-white p-2 font-mono text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 font-mono">Password must be at least 8 characters, include a number, letter, and special character.</p>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 bg-transparent hover:bg-neon-cyan/10 border border-neon-cyan text-neon-cyan font-mono py-3 px-4 uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Initialize Record'}
      </button>
    </form>
  )
}
