"use client";
import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  ChevronLeftIcon, 
  MoreVerticalIcon, 
  CalendarIcon, 
  UsersIcon, 
  UserPlusIcon, 
  BriefcaseIcon, 
  FileCheckIcon, 
  AlertCircleIcon,
  EditIcon,
  PowerIcon,
  SquareIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 15, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
};

type ElectionStatus = "draft" | "upcoming" | "active" | "ended";

const StatusBadge = ({ status }: { status: ElectionStatus }) => {
  const variants = {
    draft: "bg-muted text-muted-foreground border-border",
    upcoming: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    active: "bg-primary/10 text-primary border-primary/20",
    ended: "bg-secondary text-secondary-foreground border-border",
  };
  return (
    <Badge variant="outline" className={`rounded-full px-3 py-0.5 font-bold text-xs uppercase tracking-wider ${variants[status]}`}>
      {status}
    </Badge>
  );
};

const ElectionDetailPage: React.FC<{ id: string }> = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(true);
  const router = useRouter();
  
  const election = {
    title: "Student Government Elections 2026",
    description: "Annual general election for the student body executive board and college representatives.",
    status: "draft" as ElectionStatus,
    startAt: "2026-08-15T08:00:00",
    endAt: "2026-08-16T17:00:00",
    stats: {
      positions: 12,
      parties: 3,
      candidates: 45,
      ballots: 0
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 p-6 lg:p-10 max-w-7xl mx-auto">
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-10 w-96" />
              <Skeleton className="h-4 w-full max-w-125" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 space-y-8">
        
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Button onClick={() => router.back()} variant="ghost" className="group text-muted-foreground hover:text-primary p-0 h-auto font-semibold transition-colors">
            <ChevronLeftIcon className="mr-1 h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Back to Elections
          </Button>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          
          {isSettingUp && (
            <motion.div variants={itemVariants}>
              <Alert className="bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl shadow-sm">
                <AlertCircleIcon className="h-5 w-5" />
                <AlertTitle className="font-bold">Incomplete Setup</AlertTitle>
                <AlertDescription className="font-medium">
                  This election isn't fully set up yet — add positions, parties, and candidates before activating.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
                  {election.title}
                </h1>
                <StatusBadge status={election.status} />
              </div>
              <p className="text-muted-foreground text-lg font-medium max-w-3xl">
                {election.description}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button variant="outline" className="hidden md:flex border-border rounded-xl font-bold hover:bg-accent transition-all shadow-sm">
                <EditIcon className="mr-2 h-4 w-4" /> Edit Election
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-xl border-border shadow-sm ml-auto md:ml-0">
                    <MoreVerticalIcon className="h-5 w-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl bg-popover border-border shadow-xl">
                  <DropdownMenuItem className="md:hidden rounded-lg font-semibold py-2">
                    <EditIcon className="mr-2 h-4 w-4" /> Edit Election
                  </DropdownMenuItem>
                  {election.status === "draft" && (
                    <DropdownMenuItem className="rounded-lg font-semibold py-2 text-primary focus:text-primary focus:bg-primary/10">
                      <PowerIcon className="mr-2 h-4 w-4" /> Activate Election
                    </DropdownMenuItem>
                  )}
                  {election.status === "active" && (
                    <DropdownMenuItem className="rounded-lg font-semibold py-2 text-destructive focus:text-destructive focus:bg-destructive/10">
                      <SquareIcon className="mr-2 h-4 w-4" /> End Election
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-6 items-center py-4 px-6 bg-card rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Start Date</p>
                <p className="text-sm font-bold text-foreground">
                  {new Date(election.startAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
            </div>
            <div className="h-8 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">End Date</p>
                <p className="text-sm font-bold text-foreground">
                  {new Date(election.endAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard icon={<BriefcaseIcon size={24} />} label="Positions" value={election.stats.positions} />
            <StatCard icon={<UsersIcon size={24} />} label="Parties" value={election.stats.parties} />
            <StatCard icon={<UserPlusIcon size={24} />} label="Candidates" value={election.stats.candidates} />
            <StatCard icon={<FileCheckIcon size={24} />} label="Ballots Cast" value={election.stats.ballots} />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <Tabs defaultValue="positions" className="w-full">
              <div className="border-b border-border w-full mb-6 overflow-x-auto">
                <TabsList className="bg-transparent h-auto p-0 gap-6 sm:gap-8 rounded-none flex-nowrap whitespace-nowrap">
                  <TabsTrigger 
                    value="positions" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-4 font-bold text-base text-muted-foreground data-[state=active]:text-primary transition-all"
                  >
                    Positions
                  </TabsTrigger>
                  <TabsTrigger 
                    value="parties" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-4 font-bold text-base text-muted-foreground data-[state=active]:text-primary transition-all"
                  >
                    Parties
                  </TabsTrigger>
                  <TabsTrigger 
                    value="candidates" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-4 font-bold text-base text-muted-foreground data-[state=active]:text-primary transition-all"
                  >
                    Candidates
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="min-h-75 sm:min-h-100 bg-muted/30 border-2 border-dashed border-border rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center p-4">
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground font-bold">Sub-page Content Rendering Slot</p>
                  <p className="text-xs text-muted-foreground/50 uppercase tracking-widest font-black">URL: /admin/elections/[id]/tab</p>
                </div>
              </div>
            </Tabs>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) => {
  return (
    <Card className="group cursor-pointer bg-card border border-border shadow-sm rounded-[1.5rem] sm:rounded-[2rem] transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-md">
      <CardContent className="p-6 sm:p-8 flex items-center gap-4 sm:gap-6">
        <div className="p-3 sm:p-4 rounded-2xl transition-transform group-hover:rotate-6 bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground font-black text-[10px] uppercase tracking-widest">{label}</p>
          <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default ElectionDetailPage;
