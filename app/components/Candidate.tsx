"use client";
import React, { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  MoreVerticalIcon,
  EditIcon,
  TrashIcon,
  UserPlusIcon,
  SearchIcon,
  CheckCircle2Icon,
  XCircleIcon,
  AlertCircleIcon,
  UserIcon,
  FilterIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Candidate, CandidateStatus } from "@/hooks/types";





const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const StatusBadge = ({ status }: { status: CandidateStatus }) => {
  const variants = {
    pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    approved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    disqualified: "bg-destructive/10 text-destructive border-destructive/20",
  };
  return (
    <Badge variant="outline" className={`rounded-full px-2 py-0.5 font-bold text-[10px] uppercase tracking-wider ${variants[status]}`}>
      {status}
    </Badge>
  );
};

const EmptyState = ({ 
  isBlocked, 
  onAdd, 
  onGoToPositions, 
  onGoToParties 
}: { 
  isBlocked: boolean; 
  onAdd: () => void;
  onGoToPositions: () => void;
  onGoToParties: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 px-4 text-center bg-card/50 rounded-[2rem] border-2 border-dashed border-border"
  >
    <div className={`p-6 ${isBlocked ? "bg-muted" : "bg-primary/10"} rounded-full mb-6`}>
      {isBlocked ? (
        <AlertCircleIcon className="h-12 w-12 text-muted-foreground" />
      ) : (
        <UserPlusIcon className="h-12 w-12 text-primary" />
      )}
    </div>
    <h3 className="text-2xl font-black tracking-tight text-foreground mb-2">
      {isBlocked ? "Setup Required" : "No Candidates Added Yet"}
    </h3>
    <p className="text-muted-foreground max-w-sm mb-8 font-medium">
      {isBlocked 
        ? "Add at least one position and one party before adding candidates. These are required to link a student's candidacy."
        : "Add candidates once your positions and parties are set up. Each candidate is linked to a registered student."}
    </p>
    
    {isBlocked ? (
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={onGoToPositions} variant="outline" className="rounded-xl font-bold">
          Go to Positions
        </Button>
        <Button onClick={onGoToParties} variant="outline" className="rounded-xl font-bold">
          Go to Parties
        </Button>
      </div>
    ) : (
      <Button
        onClick={onAdd}
        className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20"
      >
        <PlusIcon className="mr-2 h-5 w-5" /> Add Candidate
      </Button>
    )}
  </motion.div>
);

const CandidatesTab = () => {
  const [hasPositions] = useState(true);
  const [hasParties] = useState(true);
  const [candidates] = useState<Candidate[]>([
    {
      id: "1",
      student: { name: "Marcus Aurelius", lrn: "102938475612", avatarUrl: "" },
      position: "President",
      party: { name: "Unity Party", color: "#1E3A8A" },
      status: "approved",
      platform: "Building a unified student community through transparency.",
    },
    {
      id: "2",
      student: { name: "Hypatia of Alexandria", lrn: "987654321012", avatarUrl: "" },
      position: "Secretary",
      party: { name: "Progress Coalition", color: "#10B981" },
      status: "pending",
      platform: "Leveraging technology to streamline student services.",
    },
    {
      id: "3",
      student: { name: "Leonidas I", lrn: "112233445566", avatarUrl: "" },
      position: "Senators",
      party: { name: "Independent", color: "#64748B" },
      status: "disqualified",
      platform: "Strong leadership for a stronger campus.",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<"approve" | "disqualify" | "delete" | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const handleAction = (type: "approve" | "disqualify" | "delete", cand: Candidate) => {
    setSelectedCandidate(cand);
    setAlertType(type);
    setIsAlertOpen(true);
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch = c.student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.student.lrn.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {(!hasPositions || !hasParties) ? (
        <EmptyState 
          isBlocked={true} 
          onAdd={() => {}} 
          onGoToPositions={() => {}} 
          onGoToParties={() => {}} 
        />
      ) : candidates.length === 0 ? (
        <EmptyState 
          isBlocked={false} 
          onAdd={() => setIsModalOpen(true)} 
          onGoToPositions={() => {}} 
          onGoToParties={() => {}} 
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header & Filters */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                  Candidates
                </h2>
                <Badge variant="secondary" className="rounded-full font-bold px-3">
                  {candidates.length}
                </Badge>
              </div>
              <Button
                onClick={() => setIsModalOpen(true)}
                size="sm"
                className="rounded-xl font-bold shadow-sm"
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Add Candidate
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or student number..."
                  className="pl-10 bg-card border-border rounded-xl h-11"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter}>
                <SelectTrigger className="w-full sm:w-45 bg-card border-border rounded-xl h-11 font-bold">
                  <div className="flex items-center gap-2">
                    <FilterIcon className="h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-popover border-border rounded-xl">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="disqualified">Disqualified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="hidden lg:block bg-card rounded-[1.5rem] border border-border overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="font-black uppercase tracking-widest text-[10px]">Student</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px]">Position</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px]">Party</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px]">Status</TableHead>
                  <TableHead className="w-25 text-right font-black uppercase tracking-widest text-[10px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.map((cand) => (
                  <TableRow key={cand.id} className="group border-border hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 rounded-xl border border-border">
                          <AvatarImage src={cand.student.avatarUrl} />
                          <AvatarFallback className="bg-primary/5 text-primary font-black text-xs">
                            {cand.student.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground leading-tight">{cand.student.name}</span>
                          <span className="text-xs text-muted-foreground font-medium">{cand.student.lrn}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="rounded-lg font-bold text-[10px] px-2 py-0.5">
                        {cand.position}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cand.party.color }} />
                        <span className="text-sm font-bold text-foreground">{cand.party.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={cand.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <CandidateActions cand={cand} onAction={handleAction} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="lg:hidden space-y-4">
            {filteredCandidates.map((cand) => (
              <Card key={cand.id} className="bg-card border-border rounded-2xl shadow-sm overflow-hidden">
                <CardContent className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 rounded-2xl border border-border">
                        <AvatarFallback className="bg-primary/5 text-primary font-black">
                          {cand.student.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <h4 className="font-black text-foreground">{cand.student.name}</h4>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-tight">{cand.student.lrn}</span>
                      </div>
                    </div>
                    <CandidateActions cand={cand} onAction={handleAction} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="rounded-lg font-bold text-[10px]">{cand.position}</Badge>
                    <div className="flex items-center gap-2 px-2 py-0.5 bg-muted rounded-lg border border-border">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cand.party.color }} />
                      <span className="text-[10px] font-black uppercase tracking-tight text-foreground">{cand.party.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <StatusBadge status={cand.status} />
                    <Button variant="ghost" size="sm" className="text-primary font-bold h-8 px-2">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-137.5bg-popover border-border rounded-[2rem] p-0 overflow-hidden shadow-2xl">
          <div className="p-8 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight text-foreground">Add Candidate</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">Link a student to a position and party.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Student</Label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search name or LRN..." className="pl-10 bg-muted/50 border-border rounded-xl h-12 font-medium" />
                </div>
                <p className="text-[10px] font-medium text-muted-foreground italic">Search to find a registered student in the system.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Position</Label>
                  <Select>
                    <SelectTrigger className="bg-muted/50 border-border rounded-xl h-12 font-bold">
                      <SelectValue placeholder="Select Position" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border rounded-xl">
                      <SelectItem value="pres">President</SelectItem>
                      <SelectItem value="vp">Vice President</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Party</Label>
                  <Select>
                    <SelectTrigger className="bg-muted/50 border-border rounded-xl h-12 font-bold">
                      <SelectValue placeholder="Select Party" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border rounded-xl">
                      <SelectItem value="unity">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-[#1E3A8A]" />
                          Unity Party
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Platform / Advocacy</Label>
                <Textarea 
                  placeholder="Describe the candidate's goals..." 
                  className="bg-muted/50 border-border rounded-xl min-h-25 p-4 font-medium" 
                />
              </div>

              <div className="flex gap-2 p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                <AlertCircleIcon className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] font-medium text-amber-700 dark:text-amber-400 leading-tight">
                  New candidates start as <span className="font-black">Pending</span> and require approval before appearing on the ballot.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="bg-muted/30 p-6 sm:p-8 flex flex-col sm:flex-row gap-3">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl font-bold order-2 sm:order-1">Cancel</Button>
            <Button className="rounded-xl font-bold px-8 shadow-lg shadow-primary/20 order-1 sm:order-2">Add Candidate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-popover border-border rounded-[2rem] shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black tracking-tight text-foreground">
              {alertType === "approve" ? `Approve ${selectedCandidate?.student.name}?` :
               alertType === "disqualify" ? `Disqualify ${selectedCandidate?.student.name}?` :
               `Delete ${selectedCandidate?.student.name}?`}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-medium">
              {alertType === "approve" ? "This candidate will become visible to students on the ballot once the election is active." :
               alertType === "disqualify" ? "This candidate will be removed from the ballot and marked disqualified." :
               "This will permanently remove this candidacy. This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-3">
            <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className={`rounded-xl font-bold px-6 ${
                alertType === "approve" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              }`}
            >
              {alertType === "approve" ? "Confirm Approval" : alertType === "disqualify" ? "Disqualify Candidate" : "Confirm Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const CandidateActions = ({ 
  cand, 
  onAction 
}: { 
  cand: Candidate; 
  onAction: (type: "approve" | "disqualify" | "delete", cand: Candidate) => void 
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-accent">
        <MoreVerticalIcon className="h-4 w-4" />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl bg-popover border-border shadow-xl">
      <DropdownMenuItem className="rounded-lg font-semibold py-2 cursor-pointer">
        <EditIcon className="mr-2 h-4 w-4" /> Edit Details
      </DropdownMenuItem>
      
      {cand.status === "pending" && (
        <DropdownMenuItem 
          onClick={() => onAction("approve", cand)}
          className="rounded-lg font-semibold py-2 cursor-pointer text-emerald-600 dark:text-emerald-400 focus:text-emerald-600 focus:bg-emerald-50 dark:focus:bg-emerald-900/20"
        >
          <CheckCircle2Icon className="mr-2 h-4 w-4" /> Approve Candidate
        </DropdownMenuItem>
      )}
      
      {(cand.status === "pending" || cand.status === "approved") && (
        <DropdownMenuItem 
          onClick={() => onAction("disqualify", cand)}
          className="rounded-lg font-semibold py-2 cursor-pointer text-amber-600 dark:text-amber-400 focus:text-amber-600 focus:bg-amber-50 dark:focus:bg-amber-900/20"
        >
          <XCircleIcon className="mr-2 h-4 w-4" /> Disqualify Candidate
        </DropdownMenuItem>
      )}
      
      <DropdownMenuItem 
        onClick={() => onAction("delete", cand)}
        className="rounded-lg font-semibold py-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
      >
        <TrashIcon className="mr-2 h-4 w-4" /> Delete Candidacy
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default CandidatesTab;
