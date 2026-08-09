"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  MenuIcon,
  SunIcon,
  MoonIcon,
  CheckCircle2Icon,
  XCircleIcon,
  GaugeIcon,
  ListChecksIcon,
  UserIcon,
  HistoryIcon,
  ShieldIcon,
  LogOutIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { getUserData, logout } from "../../hooks/actions";
import { userProps } from "../../hooks/types";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

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
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

const sidebarVariants: Variants = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const headerVariants: Variants = {
  hidden: { y: -50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut", delay: 0.1 },
  },
};

const universityLogo =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ--K5gCJ5aDVfy385Aezukf7f-nFOMLFes0538i8j-3-aPDJmYQh2fMwnS&s=10";

const activeElection = {
  title: "Student Government Elections 2026",
  description:
    "Vote for your next student body president, vice president, and senators.",
  hasVoted: false,
  positions: 7,
};

const StudentDashboardUniversityUI: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<userProps | null>(null);
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const data = await getUserData();
      if (data.success) {
        setUser(data.user);
      } else {
        console.log(data);
      }
    };
    getData();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const data = await logout();
      if (data.success) {
        toast.success(data.message);
        router.replace("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const Navigation = () => (
    <nav className="grid gap-2 w-full">
      <Button
        variant={activeTab === "dashboard" ? "secondary" : "ghost"}
        className="justify-start text-base font-medium py-3 px-4 rounded-xl transition-all duration-200 text-foreground hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary w-full"
        onClick={() => {
          setActiveTab("dashboard");
          setIsSidebarOpen(false);
        }}
      >
        <GaugeIcon className="mr-3 h-5 w-5" /> Dashboard
      </Button>
      <Button
        variant={activeTab === "elections" ? "secondary" : "ghost"}
        className="justify-start text-base font-medium py-3 px-4 rounded-xl transition-all duration-200 text-foreground hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary w-full"
        onClick={() => {
          setActiveTab("elections");
          setIsSidebarOpen(false);
        }}
      >
        <ListChecksIcon className="mr-3 h-5 w-5" /> Elections
      </Button>
      <Button
        variant={activeTab === "myvote" ? "secondary" : "ghost"}
        className="justify-start text-base font-medium py-3 px-4 rounded-xl transition-all duration-200 text-foreground hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary w-full"
        onClick={() => {
          setActiveTab("myvote");
          setIsSidebarOpen(false);
        }}
      >
        <HistoryIcon className="mr-3 h-5 w-5" /> My Vote
      </Button>
      <Button
        variant={activeTab === "profile" ? "secondary" : "ghost"}
        className="justify-start text-base font-medium py-3 px-4 rounded-xl transition-all duration-200 text-foreground hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary w-full"
        onClick={() => {
          setActiveTab("profile");
          setIsSidebarOpen(false);
        }}
      >
        <UserIcon className="mr-3 h-5 w-5" /> Profile
      </Button>

      {user?.role === "superadmin" && (
        <Button
          variant={activeTab === "admin" ? "secondary" : "ghost"}
          className="justify-start text-base font-medium py-3 px-4 rounded-xl transition-all duration-200 text-foreground hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary w-full"
          onClick={() => {
            setIsSidebarOpen(false);
            router.replace("/admin");
          }}
        >
          <ShieldIcon className="mr-3 h-5 w-5" /> Admin
        </Button>
      )}

      <div className="mt-4 pt-4 border-t border-border/50 w-full">
        <Button
          variant="destructive"
          className="justify-start text-base font-medium py-3 px-4 rounded-xl transition-all duration-200 w-full"
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? <><Spinner/> Logging out</> : <><LogOutIcon className="mr-3 h-5 w-5" /> Logout</>}
        </Button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger className="bg-card/80 backdrop-blur-md border-border/50 shadow-md">
            <MenuIcon className="h-6 w-6 text-foreground" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[85vw] sm:w-80 bg-card/90 backdrop-blur-xl border-r border-border/50 p-6"
          >
            <div className="flex items-center space-x-3 mb-8">
              <img
                src={universityLogo}
                alt="University Logo"
                className="h-10 w-10 rounded-full object-cover"
              />
              <h2 className="text-xl font-bold text-foreground">UniVote</h2>
            </div>
            <Navigation />
            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setTheme((prev) => (prev === "light" ? "dark" : "light"))
                }
                className="bg-background/50 border-border/50"
              >
                {theme === "light" ? (
                  <SunIcon className="h-5 w-5 text-foreground" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-foreground" />
                )}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <motion.aside
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        className="hidden lg:flex flex-col z-10 w-64 p-6 
                   bg-card/60 backdrop-blur-xl border-r border-border/50 shadow-lg shrink-0 h-screen sticky top-0"
      >
        <div className="flex items-center space-x-3 mb-10">
          <img
            src={universityLogo}
            alt="University Logo"
            className="h-10 w-10 rounded-full object-cover"
          />
          <h2 className="text-2xl font-bold text-foreground">UniVote</h2>
        </div>
        <Navigation />
        <div className="mt-auto flex justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setTheme((prev) => (prev === "light" ? "dark" : "light"))
            }
            className="bg-background/50 border-border/50"
          >
            {theme === "light" ? (
              <SunIcon className="h-5 w-5 text-foreground" />
            ) : (
              <MoonIcon className="h-5 w-5 text-foreground" />
            )}
          </Button>
        </div>
      </motion.aside>

      <main className="grow p-4 sm:p-6 lg:p-8 relative z-10 w-full max-w-7xl mx-auto">
        <motion.header
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 p-4 sm:p-6 bg-card/60 backdrop-blur-xl border border-border/50 shadow-lg rounded-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
                Welcome back, {user?.name}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mt-2">
                Strand: {user?.course} Grade:{user?.gradeLevel} LRN:{" "}
                {user?.lrnNumber}
              </p>
            </div>
            {user?.role === "admin" && (
              <Badge className="bg-primary/20 text-primary border-primary/50 text-base px-4 py-1.5 rounded-full w-fit">
                Administrator
              </Badge>
            )}
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid gap-6 sm:gap-8"
          >
            {activeTab === "dashboard" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              >
                {activeElection ? (
                  <motion.div variants={itemVariants} className="md:col-span-2">
                    <Card className="bg-card/70 backdrop-blur-xl border border-border/50 shadow-xl rounded-2xl h-full flex flex-col">
                      <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
                            {activeElection.title}
                          </CardTitle>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-base px-3 py-1 rounded-full w-fit">
                            Active
                          </Badge>
                        </div>
                        <CardDescription className="text-muted-foreground text-base mt-2">
                          {activeElection.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grow flex flex-col justify-between gap-4">
                        <Button
                          className={`w-full py-6 text-lg font-semibold rounded-xl 
                            ${
                              activeElection.hasVoted
                                ? "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                            }
                          `}
                        >
                          {activeElection.hasVoted
                            ? "View My Vote"
                            : "Vote Now"}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div variants={itemVariants} className="md:col-span-2">
                    <Card className="bg-card/70 backdrop-blur-xl border border-border/50 shadow-xl rounded-2xl h-full flex flex-col items-center justify-center p-8 text-center">
                      <img
                        src="/path/to/empty-state-icon.svg"
                        alt="No active elections"
                        className="h-24 w-24 mb-6 opacity-60"
                      />
                      <CardTitle className="text-2xl font-bold text-foreground mb-2">
                        No active elections at the moment.
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-base">
                        Check back soon for new voting opportunities.
                      </CardDescription>
                    </Card>
                  </motion.div>
                )}

                <div className="grid gap-6 sm:gap-8 md:col-span-2 lg:col-span-1">
                  <motion.div variants={itemVariants}>
                    <Card className="bg-card/70 backdrop-blur-xl border border-border/50 shadow-xl rounded-2xl">
                      <CardHeader>
                        <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                          Voting Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center gap-4">
                        {activeElection.hasVoted ? (
                          <CheckCircle2Icon className="h-8 w-8 text-green-500" />
                        ) : (
                          <XCircleIcon className="h-8 w-8 text-amber-500" />
                        )}
                        <p
                          className={`text-base sm:text-lg font-medium ${activeElection.hasVoted ? "text-green-500" : "text-amber-500"}`}
                        >
                          {activeElection.hasVoted
                            ? `You voted on ${new Date().toLocaleDateString()}`
                            : "You haven't voted yet!"}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {activeElection && (
                    <motion.div variants={itemVariants}>
                      <Card className="bg-card/70 backdrop-blur-xl border border-border/50 shadow-xl rounded-2xl">
                        <CardHeader>
                          <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                            Positions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-5xl font-extrabold text-primary text-center">
                            {activeElection.positions}
                          </p>
                          <p className="text-base sm:text-lg text-muted-foreground text-center mt-2">
                            Positions in this election
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "elections" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Card className="bg-card/70 backdrop-blur-xl border border-border/50 shadow-xl rounded-2xl p-6 sm:p-8">
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                    All Elections
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-base">
                    List of past and upcoming elections.
                  </CardDescription>
                </Card>
              </motion.div>
            )}
            {activeTab === "myvote" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Card className="bg-card/70 backdrop-blur-xl border border-border/50 shadow-xl rounded-2xl p-6 sm:p-8">
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                    My Vote History
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-base">
                    Details of your past votes.
                  </CardDescription>
                </Card>
              </motion.div>
            )}
            {activeTab === "profile" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Card className="bg-card/70 backdrop-blur-xl border border-border/50 shadow-xl rounded-2xl p-6 sm:p-8">
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                    Student Profile
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-base">
                    Your personal and academic information.
                  </CardDescription>
                </Card>
              </motion.div>
            )}
            {activeTab === "admin" && user?.role === "admin" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Card className="bg-card/70 backdrop-blur-xl border border-border/50 shadow-xl rounded-2xl p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldIcon className="h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground">
                      Admin Panel
                    </CardTitle>
                  </div>
                  <CardDescription className="text-muted-foreground text-base">
                    Manage elections, candidates, and view system analytics.
                  </CardDescription>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <Button variant="outline" className="h-24 text-lg">
                      Manage Elections
                    </Button>
                    <Button variant="outline" className="h-24 text-lg">
                      View Analytics
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default StudentDashboardUniversityUI;
