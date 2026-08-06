"use client";
import React, { useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MenuIcon,
  SunIcon,
  MoonIcon,
  UsersIcon,
  UserCheckIcon,
  VoteIcon,
  TrendingUpIcon,
  BellIcon,
  LogOutIcon,
  LayoutDashboardIcon,
  ListChecksIcon,
  ShieldIcon,
  UsersRoundIcon,
  GraduationCapIcon,
  BarChart3Icon,
  FileTextIcon,
  SettingsIcon,
  ArrowRightIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { logout } from "../hooks/actions";
import { Spinner } from "@/components/ui/spinner";
import Election from "../components/Election";

const sidebarVariants: Variants = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const universityLogo =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ--K5gCJ5aDVfy385Aezukf7f-nFOMLFes0538i8j-3-aPDJmYQh2fMwnS&s=10";

const adminName = "Dr. Sarah Connor";

const turnoutData = [
  { date: "8AM", votes: 120 },
  { date: "10AM", votes: 450 },
  { date: "12PM", votes: 890 },
  { date: "2PM", votes: 1350 },
  { date: "4PM", votes: 1890 },
  { date: "6PM", votes: 2450 },
];

const votesPerPositionData = [
  {
    position: "President",
    "Alice Smith": 450,
    "Bob Jones": 380,
  },
  {
    position: "Vice President",
    "Charlie Brown": 410,
    "Diana Prince": 420,
  },
  {
    position: "Secretary",
    "Evan Wright": 390,
    "Fiona Gallagher": 440,
  },
];

const pendingCandidates = [
  { name: "George Harrison", course: "BS Computer Science", year: 3 },
  { name: "Hannah Montana", course: "BS Information Technology", year: 2 },
  { name: "Ivan Petrov", course: "BS Business Administration", year: 4 },
];

const recentElections = [
  { name: "Student Government 2026", status: "Active", dates: "Aug 1 - Aug 5" },
  {
    name: "Department Officers",
    status: "Completed",
    dates: "Jul 15 - Jul 17",
  },
  {
    name: "Freshman Representatives",
    status: "Upcoming",
    dates: "Aug 10 - Aug 12",
  },
];

const SuperAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
      {[
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
        { id: "elections", label: "Elections", icon: ListChecksIcon },
        { id: "parties", label: "Parties", icon: UsersRoundIcon },
        { id: "candidates", label: "Candidates", icon: UserCheckIcon },
        { id: "students", label: "Students", icon: GraduationCapIcon },
        { id: "results", label: "Results", icon: BarChart3Icon },
        { id: "reports", label: "Reports", icon: FileTextIcon },
        { id: "settings", label: "Settings", icon: SettingsIcon },
      ].map((item) => (
        <Button
          key={item.id}
          variant={activeTab === item.id ? "secondary" : "ghost"}
          className="justify-start text-base font-medium py-3 px-4 rounded-xl transition-all duration-200 text-foreground hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary w-full"
          onClick={() => {
            setActiveTab(item.id);
            setIsSidebarOpen(false);
          }}
        >
          <item.icon className="mr-3 h-5 w-5" /> {item.label}
        </Button>
      ))}
      <div className="mt-4 pt-4 border-t border-border/50 w-full">
        <Button
          variant="ghost"
          disabled={loading}
          onClick={handleLogout}
          className="justify-start text-base font-medium py-3 px-4 rounded-xl transition-all duration-200 text-muted-foreground hover:bg-destructive/10 hover:text-destructive w-full"
        >
          {loading ? <><Spinner className="size-5"/> Logging out</>  : <><LogOutIcon className="mr-3 h-5 w-5" /> Logout</>}
        </Button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground relative overflow-hidden">
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
              <h2 className="text-xl font-bold text-foreground">
                UniVote Admin
              </h2>
            </div>
            <Navigation />
          </SheetContent>
        </Sheet>
      </div>

      <motion.aside
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        className="hidden lg:flex flex-col z-10 w-64 p-6 bg-card border-r border-border/50 shadow-sm shrink-0 h-screen sticky top-0"
      >
        <div className="flex items-center space-x-3 mb-10">
          <img
            src={universityLogo}
            alt="University Logo"
            className="h-10 w-10 rounded-full object-cover"
          />
          <h2 className="text-xl font-bold text-foreground">UniVote Admin</h2>
        </div>
        <Navigation />
      </motion.aside>

      <main className="grow flex flex-col relative z-10 w-full max-w-[1600px] mx-auto">
        <header className="flex items-center justify-between p-4 sm:px-8 lg:px-10 border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="hidden md:flex items-center text-sm text-muted-foreground">
            Election Committee Control Center
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-3 border-l border-border/50 pl-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-foreground">
                  {adminName}
                </div>
                <div className="text-xs text-muted-foreground">Super Admin</div>
              </div>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setTheme((prev) => (prev === "light" ? "dark" : "light"))
                }
                className="ml-2"
              >
                {theme === "light" ? (
                  <SunIcon className="h-4 w-4" />
                ) : (
                  <MoonIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-10 space-y-8 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Dashboard
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Active Election:{" "}
                    <span className="font-semibold text-primary">
                      Student Government 2026
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    {
                      label: "Total Students",
                      value: "2,450",
                      icon: UsersIcon,
                      color: "text-blue-600 dark:text-blue-400",
                    },
                    {
                      label: "Total Candidates",
                      value: "42",
                      icon: UserCheckIcon,
                      color: "text-purple-600 dark:text-purple-400",
                    },
                    {
                      label: "Active Elections",
                      value: "1",
                      icon: VoteIcon,
                      color: "text-green-600 dark:text-green-400",
                    },
                    {
                      label: "Votes Cast",
                      value: "1,890",
                      icon: TrendingUpIcon,
                      color: "text-emerald-600 dark:text-emerald-400",
                    },
                    {
                      label: "Voter Turnout",
                      value: "77.1%",
                      icon: TrendingUpIcon,
                      color: "text-amber-600 dark:text-amber-400",
                    },
                  ].map((stat, i) => (
                    <Card
                      key={i}
                      className="bg-card border-border/50 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <CardContent className="flex items-center p-6 gap-4">
                        <div
                          className={`p-3 rounded-lg bg-primary/10 ${stat.color}`}
                        >
                          <stat.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {stat.label}
                          </p>
                          <p className="text-2xl font-bold text-foreground">
                            {stat.value}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-card border-border/50 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-foreground">
                        Voter Turnout Over Time
                      </CardTitle>
                      <CardDescription>
                        Total votes cast throughout the day
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-75 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={turnoutData}>
                          <defs>
                            <linearGradient
                              id="colorVotes"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="oklch(45% 0.15 250)"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="oklch(45% 0.15 250)"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="stroke-border/50"
                          />
                          <XAxis
                            dataKey="date"
                            className="text-muted-foreground text-xs"
                          />
                          <YAxis className="text-muted-foreground text-xs" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "oklch(100% 0 0)",
                              border: "1px solid oklch(90% 0 0)",
                              borderRadius: "8px",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="votes"
                            stroke="oklch(45% 0.15 250)"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorVotes)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border/50 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-foreground">
                        Votes per Position
                      </CardTitle>
                      <CardDescription>
                        Distribution of votes among top candidates
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-75 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={votesPerPositionData}
                          layout="vertical"
                          margin={{ left: 20 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={false}
                            className="stroke-border/50"
                          />
                          <XAxis
                            type="number"
                            className="text-muted-foreground text-xs"
                          />
                          <YAxis
                            type="category"
                            dataKey="position"
                            width={100}
                            className="text-muted-foreground text-xs"
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "oklch(100% 0 0)",
                              border: "1px solid oklch(90% 0 0)",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                          <Bar
                            dataKey="Alice Smith"
                            fill="oklch(45% 0.15 250)"
                            radius={[0, 4, 4, 0]}
                          />
                          <Bar
                            dataKey="Bob Jones"
                            fill="oklch(60% 0.15 180)"
                            radius={[0, 4, 4, 0]}
                          />
                          <Bar
                            dataKey="Charlie Brown"
                            fill="oklch(70% 0.15 180)"
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="bg-card border-border/50 shadow-sm lg:col-span-1">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-foreground">
                          Pending Approvals
                        </CardTitle>
                        <Badge
                          variant="destructive"
                          className="rounded-full px-2 py-1"
                        >
                          3 New
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {pendingCandidates.map((candidate, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/30"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                {candidate.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {candidate.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {candidate.course} • Year {candidate.year}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary hover:text-primary hover:bg-primary/10"
                            >
                              Review
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border/50 shadow-sm lg:col-span-2">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-foreground">
                          Recent Elections
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          View all <ArrowRightIcon className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border border-border/50 overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr className="border-b border-border/50">
                              <th className="text-left p-3 font-medium text-muted-foreground">
                                Election Name
                              </th>
                              <th className="text-left p-3 font-medium text-muted-foreground">
                                Status
                              </th>
                              <th className="text-left p-3 font-medium text-muted-foreground">
                                Dates
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentElections.map((election, i) => (
                              <tr
                                key={i}
                                className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                              >
                                <td className="p-3 font-medium text-foreground">
                                  {election.name}
                                </td>
                                <td className="p-3">
                                  <Badge
                                    variant="outline"
                                    className={`rounded-full px-2 py-1 ${
                                      election.status === "Active"
                                        ? "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400"
                                        : election.status === "Completed"
                                          ? "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400"
                                          : "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400"
                                    }`}
                                  >
                                    {election.status}
                                  </Badge>
                                </td>
                                <td className="p-3 text-muted-foreground">
                                  {election.dates}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeTab === "elections" && (
              <Election/>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
