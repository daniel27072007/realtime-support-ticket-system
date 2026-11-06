import React, { useState } from 'react';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { auth, getUserRole } from '#/services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth'

export default function Login() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const onSubmitLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      const role = await getUserRole(user.uid);
      setSuccess('User loged. Redirecting to dashboard...')
      setTimeout(() => {
        if (role === 'agent') {
          navigate('/agent-dashboard');
        } else {
          navigate('/client-dashboard');
        }
      }, 2500)
    } catch (error) {
      console.error(error);
      if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        setError("Email or Password are invalid.");
      } else {
        setError("Error while login the account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  
return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-xl backdrop-blur-sm">
        
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-sm text-zinc-400">Enter your credentials to access your support panel</p>
          {error && <p className="text-sm text-red-500 font-medium pt-2">{error}</p>}
          {success && <p className="text-sm text-green-500 font-medium pt-2">{success}</p>}
        </div>

        <form className="space-y-4" onSubmit={onSubmitLogin}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="email">
              Email address
            </label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              className="bg-zinc-950 border-zinc-800" 
              required 
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="password">
              Password
            </label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              className="bg-zinc-950 border-zinc-800 tracking-[0.4em]" 
              required 
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-zinc-950 hover:bg-zinc-200 font-semibold h-10 transition-colors"
          >
            {loading ? "A entrar..." : "Sign In"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-zinc-500">Don't have an account? </span>
          <button 
            onClick={() => navigate('/register')} 
            className="font-medium text-white hover:underline underline-offset-4"
          >
            Create an account
          </button>
        </div>

      </div>
    </div>
  );
}