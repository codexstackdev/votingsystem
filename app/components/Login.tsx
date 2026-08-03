"use client";
import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { login } from '../hooks/actions';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }
  },
};

const formVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    scale: 0.98, 
    transition: { duration: 0.4, ease: 'easeIn' } 
  },
};

export const LoginFormUI: React.FC<{ onSwitchToRegister: () => void }> = ({ onSwitchToRegister }) => {
  const [loginData, setLoginData] = useState({
    lrnNumber: "",
    password: ""
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const {name, value} = e.target;
    setLoginData((prev) => ({...prev, [name]:value}))
  }

  const handleSubmit = async(e:React.SubmitEvent)=>{
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(loginData.lrnNumber, loginData.password);
      if(data.success){
        toast.success(data.message);
        router.push("/students");
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error);
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <motion.div
      key="login"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={formVariants}
      className="w-full max-w-md perspective-1000"
    >
      <Card className="relative overflow-hidden bg-card/60 backdrop-blur-2xl border border-border/50 shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] rounded-3xl">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
        
        <CardHeader className="text-center pt-10 pb-6 relative z-10">
          <CardTitle className="text-3xl font-black tracking-tighter text-foreground bg-clip-text">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-muted-foreground/80 text-base font-medium mt-2">
            Sign in to your student portal
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-8 pb-10 relative z-10">
          <motion.form 
            variants={containerVariants}
            initial="hidden"
            onSubmit={handleSubmit}
            animate="visible"
            className="grid gap-6"
          >
            <motion.div variants={itemVariants} className="grid gap-2.5">
              <Label htmlFor="lrnNumber" className="text-sm font-semibold tracking-wide ml-1">
                LRN Number
              </Label>
              <Input
                id="lrnNumber"
                type="number"
                name='lrnNumber'
                value={loginData.lrnNumber}
                onChange={handleChange}
                placeholder="Enter your 12-digit LRN"
                required
                className="h-12 bg-background/40 border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 rounded-xl"
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="grid gap-2.5">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-sm font-semibold tracking-wide">
                  Password
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                name='password'
                value={loginData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="h-12 bg-background/40 border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 rounded-xl"
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="pt-2">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 font-bold text-base rounded-xl"
              >
                {loading ? <Spinner className='size-5'/> : "Sign In"}
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants} className="text-center text-sm font-medium text-muted-foreground/80">
              New to the system?{' '}
              <Button 
                variant="link" 
                onClick={onSwitchToRegister} 
                className="p-0 h-auto font-bold text-primary hover:text-primary/80 transition-all underline-offset-4"
              >
                Create an account
              </Button>
            </motion.div>
          </motion.form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
