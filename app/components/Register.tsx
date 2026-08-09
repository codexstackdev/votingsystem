"use client";
import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { register } from "@/hooks/actions";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

const formVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: { duration: 0.4, ease: "easeIn" },
  },
};

export const RegisterFormUI: React.FC<{ onSwitchToLogin: () => void }> = ({
  onSwitchToLogin,
}) => {
  const [registerData, setRegisterData] = useState({
    lrnNumber: "",
    name: "",
    password: "",
    email: "",
    course: "",
    gradeLevel: "",
  });
  const [secondPass, setSecondPass] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { course, email, gradeLevel, name, password, lrnNumber } =
        registerData;
      if (
        !course ||
        !email ||
        !gradeLevel ||
        !name ||
        !password ||
        !lrnNumber
      ) {
        toast.error("Missing credentials");
        return;
      }
      if (secondPass !== password) {
        toast.info("Your passwords don't match. Please try again.");
        return;
      }
      const data = await register(
        registerData.lrnNumber,
        registerData.name,
        registerData.email,
        registerData.password,
        registerData.course.toUpperCase(),
        Number(registerData.gradeLevel)
      );
      if (data.success) {
        toast.success(data.message);
        onSwitchToLogin();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <motion.div
      key="register"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={formVariants}
      className="w-full max-w-md perspective-1000"
    >
      <Card className="relative overflow-hidden bg-card/60 backdrop-blur-2xl border border-border/50 shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] rounded-3xl">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />

        <CardHeader className="text-center pt-8 pb-4 relative z-10">
          <CardTitle className="text-3xl font-black tracking-tighter text-foreground bg-clip-text">
            Create Account
          </CardTitle>
          <CardDescription className="text-muted-foreground/80 text-base font-medium mt-1">
            Join the student voting community
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8 relative z-10">
          <motion.form
            variants={containerVariants}
            initial="hidden"
            onSubmit={handleSubmit}
            animate="visible"
            className="grid gap-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.div variants={itemVariants} className="grid gap-2">
                <Label
                  htmlFor="regLrnNumber"
                  className="text-sm font-semibold tracking-wide ml-1"
                >
                  LRN Number
                </Label>
                <Input
                  id="regLrnNumber"
                  type="text"
                  name="lrnNumber"
                  value={registerData.lrnNumber}
                  onChange={handleChange}
                  placeholder="12-digit LRN"
                  required
                  className="h-11 bg-background/40 border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 rounded-xl"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="grid gap-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-semibold tracking-wide ml-1"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={registerData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="h-11 bg-background/40 border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 rounded-xl"
                />
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="grid gap-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold tracking-wide ml-1"
              >
                School Email
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleChange}
                placeholder="student@school.edu"
                required
                className="h-11 bg-background/40 border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 rounded-xl"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="grid gap-2">
              <Label
                htmlFor="regPassword"
                className="text-sm font-semibold tracking-wide ml-1"
              >
                Password
              </Label>
              <Input
                id="regPassword"
                type="password"
                name="password"
                value={registerData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
                className="h-11 bg-background/40 border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 rounded-xl"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="grid gap-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-semibold tracking-wide ml-1"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Retype password"
                required
                value={secondPass}
                onChange={(e) => setSecondPass(e.target.value)}
                className="h-11 bg-background/40 border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 rounded-xl"
              />
              {secondPass.trim().length > 0 &&
                registerData.password !== secondPass && (
                  <div className="flex items-center gap-2 mt-1.5 ml-1 animate-fade-in">
                    <svg
                      className="h-4 w-4 text-destructive shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <Label
                      htmlFor="info"
                      className="text-xs text-destructive font-medium tracking-normal"
                    >
                      Please make sure your passwords match.
                    </Label>
                  </div>
                )}
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div variants={itemVariants} className="grid gap-2">
                <Label
                  htmlFor="course"
                  className="text-sm font-semibold tracking-wide ml-1"
                >
                  Course
                </Label>
                <Input
                  id="course"
                  type="text"
                  name="course"
                  value={registerData.course}
                  onChange={handleChange}
                  placeholder="e.g., BSCS"
                  required
                  className="h-11 bg-background/40 border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 rounded-xl"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="grid gap-2">
                <Label
                  htmlFor="gradeLevel"
                  className="text-sm font-semibold tracking-wide ml-1"
                >
                  Grade Level
                </Label>
                <Select
                  name="gradeLevel"
                  value={registerData.gradeLevel || ""}
                  onValueChange={(value) => {
                    if (!value) return;
                    setRegisterData((prev) => ({ ...prev, gradeLevel: value }));
                  }}
                >
                  <SelectTrigger
                    id="gradeLevel"
                    className="h-11 bg-background/40 border-border/40 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 rounded-xl"
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover/90 backdrop-blur-xl border-border/50 rounded-xl">
                    {[...Array(6)].map((_, i) => {
                      const gradeNum = i + 7;
                      return (
                        <SelectItem key={gradeNum} value={gradeNum.toString()}>
                          Grade {gradeNum}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 font-bold text-base rounded-xl"
              >
                {loading ? <Spinner className="size-5" /> : "Create Account"}
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="text-center text-sm font-medium text-muted-foreground/80"
            >
              Already have an account?{" "}
              <Button
                variant="link"
                onClick={onSwitchToLogin}
                className="p-0 h-auto font-bold text-primary hover:text-primary/80 transition-all underline-offset-4"
              >
                Sign In
              </Button>
            </motion.div>
          </motion.form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
