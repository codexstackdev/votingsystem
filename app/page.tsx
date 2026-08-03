"use client"
import { useState } from 'react';
import { AnimatePresence, Variants } from 'framer-motion';
import { LoginFormUI } from './components/Login';
import { RegisterFormUI } from './components/Register';

const formVariants:Variants = {
  hidden: { opacity: 0, x: 50, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, x: -50, scale: 0.95, transition: { duration: 0.3, ease: 'easeIn' } },
};

const AuthPageAnimatedUI: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <AnimatePresence mode="wait">
        {isLogin ? (
          <LoginFormUI onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterFormUI onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthPageAnimatedUI;
