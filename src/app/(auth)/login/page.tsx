"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AscendLogo } from "@/components/logo/ascend-logo";
import { Mail, Lock, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'code'>('email');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    code: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else if (result?.ok) {
        // Check if session is established
        const session = await getSession();
        if (session) {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Logo */}
      <div className="flex justify-center">
        <div className="text-center">
          <AscendLogo 
            size="lg"
            showText={true}
            className="text-primary mb-2"
          />
          <p className="text-sm text-muted-foreground">AI Secretary</p>
        </div>
      </div>

      {/* Login Card */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Login Method Toggle */}
          <div className="flex rounded-lg border p-1">
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              className={cn(
                "flex-1 flex items-center justify-center space-x-2 rounded-md py-2 text-sm font-medium transition-colors",
                loginMethod === 'email'
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('code')}
              className={cn(
                "flex-1 flex items-center justify-center space-x-2 rounded-md py-2 text-sm font-medium transition-colors",
                loginMethod === 'code'
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Smartphone className="h-4 w-4" />
              <span>Code</span>
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {loginMethod === 'email' ? (
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium">
                  Verification Code
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="code"
                    name="code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  We&apos;ll send you a verification code via email
                </p>
              </div>
            )}

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="text-center space-y-2">
            <button className="text-sm text-primary hover:underline">
              Forgot your password?
            </button>
            <div className="text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <button className="text-primary hover:underline">
                Contact your administrator
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Notice */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium">Demo Mode</p>
            <p className="text-xs text-muted-foreground">
              Use any email and password to access the demo dashboard
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

