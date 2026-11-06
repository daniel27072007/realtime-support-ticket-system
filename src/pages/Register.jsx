import React, { useState } from 'react';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { auth, registerUserFirestore } from '#/services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'client'
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { id, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }))
  }

  const onSubmitRegister = async (event) => {
    event.preventDefault();
    setLoading(true)
    setError(null)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user
      await registerUserFirestore(user.uid, formData.username, user.email, formData.role);
      if (formData.role === 'agent') {
        navigate('/agent-dashboard');
      } else {
        navigate('/client-dashboard');
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already in use.");
      } else {
        setError("It happend a error when creating a account. Please try again.");
      }
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-white-800 bg-zinc-900/50 p-8 shadow-xl backdrop-blur-sm">
        
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create an Account</h1>
          <p className="text-sm text-zinc-400">Get started with our realtime support ticket platform</p>
          {error && <p className="text-sm text-red-500 font-medium pt-2">{error}</p>}
        </div>

        <form className="space-y-4" onSubmit={onSubmitRegister}>
          
          {/* Input: Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="username">
              Full Name
            </label>
            <Input 
              id="username"
              name="username"
              type="text" 
              placeholder="John Doe" 
              className="bg-zinc-950 border-zinc-800" 
              required 
              value={formData.username}
              onChange={handleChange} // Dispara a nossa função geral
            />
          </div>

          {/* Input: Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="email">
              Email address
            </label>
            <Input 
              id="email"
              name="email"
              type="email" 
              placeholder="name@example.com" 
              className="bg-zinc-950 border-zinc-800" 
              required 
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Input: Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="password">
              Password
            </label>
            <Input 
              id="password"
              name="password"
              type="password" 
              placeholder="••••••••" 
              className="bg-zinc-950 border-zinc-800 tracking-[0.4em]" 
              required 
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Input Select: Role */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="role">
              Account Type
            </label>
            <select
              id="role"
              name="role"
              className="w-full h-8 rounded-lg border border-zinc-800 bg-zinc-950 px-2 text-sm text-zinc-300 outline-none focus:border-blue-500 transition-colors"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="client">Client (Needs Support)</option>
              <option value="agent">Support Agent (Provides Support)</option>
            </select>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-zinc-950 hover:bg-zinc-200 font-semibold h-10 transition-colors"
          >
            {loading ? "Registering..." : "Sign Up"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-zinc-500">Already have an account? </span>
          <button 
            onClick={() => navigate('/login')} 
            className="font-medium text-white hover:underline underline-offset-4"
          >
            Sign In
          </button>
        </div>

      </div>
    </div>
  );
}