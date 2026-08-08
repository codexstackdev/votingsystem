"use client";
import React, { useEffect, useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
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
  SquareIcon,
  PlusIcon,
  InfoIcon,
  Trash2Icon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useRouter } from "next/navigation";
import { Decrypt } from "@/app/hooks/secrue";
import {
  activateElection,
  deleteElection,
  endElection,
  getElections,
  updateElection,
} from "@/app/hooks/actions";
import { toast } from "sonner";
import { useElectionStore } from "@/app/store/useElectionStore";
import { Spinner } from "@/components/ui/spinner";

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
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

type ElectionStatus = "draft" | "upcoming" | "active" | "ended";

const StatusBadge = ({ status }: { status: ElectionStatus }) => {
  const variants = {
    draft: "bg-muted text-muted-foreground border-border",
    upcoming:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    active: "bg-primary/10 text-primary border-primary/20",
    ended: "bg-secondary text-secondary-foreground border-border",
  };
  return (
    <Badge
      variant="outline"
      className={`rounded-full px-3 py-0.5 font-bold text-xs uppercase tracking-wider ${variants[status]}`}
    >
      {status}
    </Badge>
  );
};

const EmptySubPage = ({
  type,
}: {
  type: "Positions" | "Parties" | "Candidates";
}) => {
  const icons = {
    Positions: <BriefcaseIcon className="h-12 w-12 text-muted-foreground/40" />,
    Parties: <UsersIcon className="h-12 w-12 text-muted-foreground/40" />,
    Candidates: <UserPlusIcon className="h-12 w-12 text-muted-foreground/40" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center bg-card/50 rounded-[2.5rem] border-2 border-dashed border-border"
    >
      <div className="p-6 bg-muted rounded-full mb-6">{icons[type]}</div>
      <h3 className="text-2xl font-black tracking-tight text-foreground mb-2">
        No {type} Added Yet
      </h3>
      <p className="text-muted-foreground max-w-sm mb-8 font-medium">
        Start building your election by adding the first {type.toLowerCase()}.
        You'll need at least one to activate the election.
      </p>
      <Button className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20">
        <PlusIcon className="mr-2 h-5 w-5" /> Add {type.slice(0, -1)}
      </Button>
    </motion.div>
  );
};

const ElectionDetailPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startAt: "",
    endAt: "",
  });

  const election = useElectionStore((s) => s.selectedElection);
  const setSelectedElection = useElectionStore((s) => s.setSelectedElection);
  const updateElectionLocal = useElectionStore((s) => s.updateElection);
  const removeElection = useElectionStore((s) => s.removeElection);
  const stats = useElectionStore((s) => s.stats);
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const decryptId = Decrypt(String(id));

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        if (!decryptId) return;
        if (election?.id === decryptId) return;
        const data = await getElections(decryptId);
        if (data.success) {
          setSelectedElection(data.election, data.stats);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [decryptId]);

  const handleActivate = async () => {
    setLoading(true);
    try {
      const data = await activateElection(String(decryptId), true, "update");
      if (data.success) {
        updateElectionLocal(String(decryptId), {
          isActivated: true,
          status: "active",
        });
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnd = async () => {
    setLoading(true);
    try {
      const data = await endElection(String(decryptId), "end");
      if (data.success) {
        updateElectionLocal(String(decryptId), {
          status: "ended",
        });
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const data = await deleteElection(String(decryptId));
      if (data.success) {
        removeElection(String(decryptId));
        toast.success(data.message);
        router.replace("/admin");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = () => {
    if(!election) return;
    setFormData({
      title: election.title,
      description: election.description,
      startAt: election.startAt,
      endAt: election.endAt
    });
    setIsEditModalOpen(true);
  }

  const handleUpdate = async() => {
    try {
      const data = await updateElection(String(decryptId), formData.title, formData.description, formData.startAt, formData.endAt);
      if(data.success){
        toast.success(data.message);
        updateElectionLocal(String(decryptId), formData);
        setIsEditModalOpen(false);
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
    }
  }

  function formatDateTimeLocal(date: string | Date) {
    const d = new Date(date);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

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
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    );
  }
  if (!election) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="group text-muted-foreground hover:text-primary p-0 h-auto font-semibold transition-colors"
          >
            <ChevronLeftIcon className="mr-1 h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Back to Elections
          </Button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {isSettingUp && (
            <motion.div variants={itemVariants}>
              <Alert className="bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl shadow-sm">
                <AlertCircleIcon className="h-5 w-5" />
                <AlertTitle className="font-bold">Incomplete Setup</AlertTitle>
                <AlertDescription className="font-medium">
                  This election isn't fully set up yet — add positions, parties,
                  and candidates before activating.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row justify-between items-start gap-4"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
                  {election?.title}
                </h1>
                <StatusBadge status={election!.status} />
              </div>
              <p className="text-muted-foreground text-lg font-medium max-w-3xl">
                {election?.description}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button
                onClick={handleOpenModal}
                variant="outline"
                className="hidden md:flex border-border rounded-xl font-bold hover:bg-accent transition-all shadow-sm"
              >
                <EditIcon className="mr-2 h-4 w-4" /> Edit Election
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-xl border-border shadow-sm ml-auto md:ml-0 p-2 hover:bg-accent transition-colors">
                  <MoreVerticalIcon className="h-5 w-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 p-2 rounded-xl bg-popover border-border shadow-xl"
                >
                  <DropdownMenuItem
                    onClick={() => setIsEditModalOpen(true)}
                    className="md:hidden rounded-lg font-semibold py-2"
                  >
                    <EditIcon className="mr-2 h-4 w-4" /> Edit Election
                  </DropdownMenuItem>
                  {election?.status === "draft" && (
                    <DropdownMenuItem
                      disabled={loading}
                      onClick={handleActivate}
                      className="rounded-lg font-semibold py-2 text-primary focus:text-primary focus:bg-primary/10"
                    >
                      {loading ? (
                        <>
                          <Spinner className="size-4" /> Activating
                        </>
                      ) : (
                        <>
                          <PowerIcon className="mr-2 h-4 w-4" /> Activate
                          Election
                        </>
                      )}
                    </DropdownMenuItem>
                  )}
                  {election?.status === "active" && (
                    <DropdownMenuItem
                      onClick={handleEnd}
                      className="rounded-lg font-semibold py-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <SquareIcon className="mr-2 h-4 w-4" /> End Election
                    </DropdownMenuItem>
                  )}
                  {election?.status === "ended" && (
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="rounded-lg font-semibold py-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <Trash2Icon className="mr-2 h-4 w-4" /> Delete Election
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-6 items-center py-4 px-6 bg-card rounded-2xl border border-border shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Start Date
                </p>
                <p className="text-sm font-bold text-foreground">
                  {new Date(election!.startAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
            <div className="h-8 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  End Date
                </p>
                <p className="text-sm font-bold text-foreground">
                  {new Date(election!.endAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            <StatCard
              icon={<BriefcaseIcon size={24} />}
              label="Positions"
              value={stats?.positions ? stats.positions : 0}
            />
            <StatCard
              icon={<UsersIcon size={24} />}
              label="Parties"
              value={stats?.parties ? stats.parties : 0}
            />
            <StatCard
              icon={<UserPlusIcon size={24} />}
              label="Candidates"
              value={stats?.candidates ? stats.candidates : 0}
            />
            <StatCard
              icon={<FileCheckIcon size={24} />}
              label="Ballots Cast"
              value={stats?.ballots ? stats.ballots : 0}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <Tabs defaultValue="positions" className="w-full">
              <div className="border-b border-border w-full mb-8 overflow-x-auto">
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

              <TabsContent value="positions" className="mt-0 outline-none">
                <EmptySubPage type="Positions" />
              </TabsContent>
              <TabsContent value="parties" className="mt-0 outline-none">
                <EmptySubPage type="Parties" />
              </TabsContent>
              <TabsContent value="candidates" className="mt-0 outline-none">
                <EmptySubPage type="Candidates" />
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-150 bg-popover border-border rounded-[2rem] p-0 overflow-hidden shadow-2xl">
          <div className="p-8 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black tracking-tight text-foreground">
                Edit Election
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                Update the core details of your election cycle. Changes will
                reflect immediately.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-black uppercase tracking-widest text-muted-foreground"
                >
                  Election Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="bg-muted/50 border-border rounded-xl h-12 px-4 font-medium focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-black uppercase tracking-widest text-muted-foreground"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  onChange={handleChange}
                  value={formData.description}
                  className="bg-muted/50 border-border rounded-xl min-h-25 p-4 font-medium focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="start"
                    className="text-sm font-black uppercase tracking-widest text-muted-foreground"
                  >
                    Start Date & Time
                  </Label>
                  <Input
                    id="start"
                    name="startAt"
                    onChange={handleChange}
                    type="datetime-local"
                    value={formatDateTimeLocal(formData.startAt)}
                    className="bg-muted/50 border-border rounded-xl h-12 px-4 font-medium focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="end"
                    className="text-sm font-black uppercase tracking-widest text-muted-foreground"
                  >
                    End Date & Time
                  </Label>
                  <Input
                    id="end"
                    name="endAt"
                    onChange={handleChange}
                    type="datetime-local"
                    value={formatDateTimeLocal(formData.endAt)}
                    className="bg-muted/50 border-border rounded-xl h-12 px-4 font-medium focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            <Alert className="bg-primary/5 border-primary/10 rounded-2xl">
              <InfoIcon className="h-5 w-5 text-primary" />
              <AlertDescription className="text-xs font-bold text-primary/80 uppercase tracking-tight">
                Election status (Active/Upcoming) is automatically calculated
                based on these dates.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter className="bg-muted/30 p-6 sm:p-8 flex flex-col sm:flex-row gap-3">
            <Button
              variant="ghost"
              onClick={() => setIsEditModalOpen(false)}
              className="rounded-xl font-bold order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} className="rounded-xl font-bold px-8 shadow-lg shadow-primary/20 order-1 sm:order-2">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) => {
  return (
    <Card className="group cursor-pointer bg-card border border-border shadow-sm rounded-[1.5rem] sm:rounded-[2rem] transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-md">
      <CardContent className="p-6 sm:p-8 flex items-center gap-4 sm:gap-6">
        <div className="p-3 sm:p-4 rounded-2xl transition-transform group-hover:rotate-6 bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground font-black text-[10px] uppercase tracking-widest">
            {label}
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            {value}
          </h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default ElectionDetailPage;
