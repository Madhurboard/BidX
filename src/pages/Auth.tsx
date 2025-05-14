
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import BidXLogo from '@/components/BidXLogo';
import { useAuth } from '@/components/AuthProvider';

// Form validation schema
const authSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type AuthFormValues = z.infer<typeof authSchema>;

const Auth = () => {
  const { user, signIn, signUp, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: AuthFormValues) => {
    if (activeTab === 'login') {
      await signIn(values.email, values.password);
    } else {
      await signUp(values.email, values.password);
    }
  };

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-4">
        <div className="flex justify-center mb-6">
          <BidXLogo />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Welcome to BidX</CardTitle>
            <CardDescription className="text-center">
              The premier online auction platform
            </CardDescription>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  
                  <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full bg-auction-blue hover:bg-auction-darkBlue">
                      Sign In
                    </Button>
                    
                    <div className="relative w-full flex items-center justify-center">
                      <hr className="w-full border-t border-gray-300" />
                      <span className="absolute bg-white px-2 text-xs text-gray-500">OR</span>
                    </div>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => signInWithGoogle()}
                    >
                      <img src="https://www.google.com/favicon.ico" alt="Google" className="h-4 w-4 mr-2" />
                      Sign in with Google
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="signup">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage className="text-xs">
                            Must be at least 6 characters long
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  
                  <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full bg-auction-blue hover:bg-auction-darkBlue">
                      Create Account
                    </Button>
                    
                    <div className="relative w-full flex items-center justify-center">
                      <hr className="w-full border-t border-gray-300" />
                      <span className="absolute bg-white px-2 text-xs text-gray-500">OR</span>
                    </div>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => signInWithGoogle()}
                    >
                      <img src="https://www.google.com/favicon.ico" alt="Google" className="h-4 w-4 mr-2" />
                      Sign up with Google
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </Card>
        
        <p className="text-center text-sm mt-4 text-gray-600">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Auth;
