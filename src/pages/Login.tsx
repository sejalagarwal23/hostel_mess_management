//ye pagebackend k sath connect karna h 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const Login = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState('');
  const login = useAuth(s => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!rollNumber || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login(rollNumber, password, role);

    if (success) {
      navigate(role === 'admin' ? '/admin' : '/student');
    } else {
      setError('Invalid credentials or role mismatch');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary mb-4">
            <img
              src="/nitkkr.png"
              alt="NIT KKR Logo"
              className="w-21 h-21 object-contain rounded-2xl"
            />
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Mess Management System
          </h1>
        </div>

        <Card className="shadow-card">
          <CardHeader className="pb-4">
            
            {/* Role Selector */}
            <div className="flex gap-2 p-1 bg-muted rounded-lg">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${
                  role === 'student'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Student
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${
                  role === 'admin'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Admin
              </button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="space-y-2">
                <Label htmlFor="rollNumber">
                  {role === 'admin' ? 'Admin ID' : 'Roll Number'}
                </Label>
                <Input
                  id="rollNumber"
                  placeholder={role === 'admin' ? 'e.g. ADMIN001' : 'e.g. 2021CS001'}
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full gradient-primary text-primary-foreground"
              >
                Sign In
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Demo: Use <span className="font-medium text-foreground">2021CS001</span> (student) or{' '}
                <span className="font-medium text-foreground">ADMIN001</span> (admin) with any password
              </p>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;