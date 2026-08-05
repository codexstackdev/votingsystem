"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import {
  PlusIcon,
  SearchIcon,
  MoreVerticalIcon,
  EditIcon,
  TrashIcon,
  PowerIcon,
  SquareIcon,
  CalendarIcon,
  AlertTriangleIcon,
} from "lucide-react";
import {
  activateElection,
  createElection,
  deleteElection,
  endElection,
  getElections,
  updateElection,
} from "../hooks/actions";
import { toast } from "sonner";
import { electionProps } from "../hooks/types";

type ElectionStatus = "draft" | "upcoming" | "active" | "ended";

const StatusBadge = ({ status }: { status: ElectionStatus }) => {
  const variants = {
    draft: "bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400",
    upcoming:
      "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
    active:
      "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400",
    ended:
      "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400",
  };
  return (
    <Badge
      variant="outline"
      className={`rounded-full px-2 py-1 ${variants[status]}`}
    >
      {status}
    </Badge>
  );
};

const ElectionPage: React.FC = () => {
  const [elections, setElections] = useState<electionProps[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingElection, setEditingElection] = useState<electionProps | null>(
    null,
  );
  const [alertType, setAlertType] = useState<"activate" | "end" | "delete" | null>(null);
  const [targetElectionId, setTargetElectionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const getData = async () => {
      const data = await getElections();
      if (data.success) {
        setElections(data.election);
      } else {
        console.log(data);
      }
    };
    getData();
  }, []);

  const itemsPerPage = 10;

  const filteredElections = useMemo(() => {
    return elections.filter((e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [elections, searchQuery]);

  const paginatedElections = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredElections.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredElections, currentPage]);

  const totalPages = Math.ceil(filteredElections.length / itemsPerPage);

  const handleOpenCreate = () => {
    setEditingElection(null);
    setFormData({ title: "", description: "", startDate: "", endDate: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (election: electionProps) => {
    setEditingElection(election);
    setFormData({
      title: election.title,
      description: election.description,
      startDate: election.startAt,
      endDate: election.endAt,
    });
    setIsModalOpen(true);
  };
  const handleSave = async () => {
    setLoading(true);
    if (editingElection) {
      const data = await updateElection(editingElection.id, formData.title, formData.description, formData.startDate, formData.endDate);
      if(data.success){
        setElections((prev) =>
        prev.map((e) =>
          e.id === editingElection.id ? { ...e, ...formData } : e,
        ),
      );
      toast.success(data.message)
      }
      else{
        toast.error(data.message);
      }
    } else {
      const data = await createElection(
        formData.title,
        formData.description,
        formData.startDate,
        formData.endDate,
        "create",
      );
      if (data.success) {
        const newElection: electionProps = {
          id: data.id,
          title: formData.title,
          description: formData.description,
          startAt: formData.startDate,
          endAt: formData.endDate,
          status: "draft",
          isActivated: false,
        };
        toast.success(data.message);
        setElections((prev) => [newElection, ...prev]);
      } else {
        toast.error(data.message);
      }
    }
    setLoading(false);
    setIsModalOpen(false);
  };

  const handleActivate = async (id: string) => {
    setAlertType("activate");
    setTargetElectionId(id);
  };

  const handleEnd = (id: string) => {
    setAlertType("end");
    setTargetElectionId(id);
  };

  const handleDelete = (id: string) => {
    setAlertType("delete");
    setTargetElectionId(id);
  };


  const confirmAction = async () => {
    if (!targetElectionId) return;
    if (alertType === "activate") {
      try {
        const data = await activateElection(targetElectionId, true, "update");
        if (data.success) {
          setElections((prev) =>
            prev.map((e) =>
              e.id === targetElectionId
                ? { ...e, isActivated: true, status: "active" }
                : e,
            ),
          );
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    } else if (alertType === "end") {
      const data = await endElection(targetElectionId, "end");
      if (data.success) {
        setElections((prev) =>
          prev.map((e) =>
            e.id === targetElectionId
              ? { ...e, status: "ended" as ElectionStatus }
              : e,
          ),
        );
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } else if (alertType === "delete") {
      try {
        const data = await deleteElection(targetElectionId);
        if (data.success) {
          setElections((prev) => prev.filter((e) => e.id !== targetElectionId));
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete election");
      }
    }
    setAlertType(null);
    setTargetElectionId(null);
  };

  const activeElection = elections.find((e) => e.id === targetElectionId);
  function formatDateTimeLocal(date: string | Date) {
  const d = new Date(date);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Elections
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage election cycles, schedules, and statuses. ({elections.length}{" "}
            total)
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Create Election
        </Button>
      </div>

      <div className="relative max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search elections..."
          className="pl-9 bg-card border-border/50"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {filteredElections.length === 0 ? (
        <Card className="bg-card border-border/50 shadow-sm flex flex-col items-center justify-center p-12 text-center">
          <CalendarIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <CardTitle className="text-xl font-bold text-foreground mb-2">
            No elections yet
          </CardTitle>
          <CardDescription className="text-base mb-6 max-w-md">
            Create your first election to get started. You can set up positions,
            parties, and candidates later.
          </CardDescription>
          <Button onClick={handleOpenCreate}>
            <PlusIcon className="mr-2 h-4 w-4" /> Create Election
          </Button>
        </Card>
      ) : (
        <>
          <div className="hidden md:block rounded-md border border-border/50 overflow-hidden bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-medium text-muted-foreground">
                    Election Name
                  </TableHead>
                  <TableHead className="font-medium text-muted-foreground">
                    Start Date
                  </TableHead>
                  <TableHead className="font-medium text-muted-foreground">
                    End Date
                  </TableHead>
                  <TableHead className="font-medium text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="font-medium text-muted-foreground text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedElections.map((election) => (
                  <TableRow
                    key={election.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <TableCell className="font-medium text-foreground">
                      <div className="flex flex-col">
                        <span>{election.title}</span>
                        <span className="text-xs text-muted-foreground font-normal line-clamp-1">
                          {election.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(election.startAt).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(election.endAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={election.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-4 w-4 text-muted-foreground">
                          <MoreVerticalIcon />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 bg-card border-border"
                        >
                          <DropdownMenuItem
                            onClick={() => handleOpenEdit(election)}
                            className="text-foreground hover:bg-muted"
                          >
                            <EditIcon className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          {(election.status === "draft" ||
                            election.status === "upcoming") &&
                            !election.isActivated && (
                              <DropdownMenuItem
                                onClick={() => handleActivate(election.id)}
                                className="text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-600 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                              >
                                <PowerIcon className="mr-2 h-4 w-4" /> Activate
                              </DropdownMenuItem>
                            )}
                          {election.status === "active" && (
                            <DropdownMenuItem
                              onClick={() => handleEnd(election.id)}
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <SquareIcon className="mr-2 h-4 w-4" /> End
                              Election
                            </DropdownMenuItem>
                          )}
                          {election.status !== "active" && (
                            <DropdownMenuItem onClick={() => handleDelete(election.id)} className="text-destructive hover:bg-destructive/10">
                              <TrashIcon className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-4">
            {paginatedElections.map((election) => (
              <Card
                key={election.id}
                className="bg-card border-border/50 shadow-sm"
              >
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">
                        {election.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {election.description}
                      </p>
                    </div>
                    <StatusBadge status={election.status} />
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex gap-2">
                      <span className="font-medium">Start:</span>
                      <span>
                        {new Date(election.startAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium">End:</span>
                      <span>
                        {new Date(election.endAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2 border-t border-border/50">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="ml-2 h-3 w-3">
                        Actions <MoreVerticalIcon />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 bg-card border-border"
                      >
                        <DropdownMenuItem
                          onClick={() => handleOpenEdit(election)}
                          className="text-foreground hover:bg-muted"
                        >
                          <EditIcon className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        {(election.status === "draft" ||
                          election.status === "upcoming") &&
                          !election.isActivated && (
                            <DropdownMenuItem
                              onClick={() => handleActivate(election.id)}
                              className="text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-600 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                            >
                              <PowerIcon className="mr-2 h-4 w-4" /> Activate
                            </DropdownMenuItem>
                          )}
                        {election.status === "active" && (
                          <DropdownMenuItem
                            onClick={() => handleEnd(election.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <SquareIcon className="mr-2 h-4 w-4" /> End Election
                          </DropdownMenuItem>
                        )}
                        {election.status === "draft" && (
                          <DropdownMenuItem className="text-destructive hover:bg-destructive/10">
                            <TrashIcon className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-125 bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingElection ? "Edit Election" : "Create Election"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {editingElection
                ? "Update the election details below."
                : "Set up a new election cycle for your students."}
            </DialogDescription>
          </DialogHeader>

          {editingElection?.status === "active" && (
            <div className="flex gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm">
              <AlertTriangleIcon className="h-5 w-5 shrink-0" />
              <p>
                This election is currently active. Changing dates may affect
                ongoing voting.
              </p>
            </div>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-foreground">
                Election Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Student Government 2026"
                className="bg-background border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-foreground">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Shown to students on the election card..."
                rows={3}
                className="bg-background border-border"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate" className="text-foreground">
                  Start Date & Time
                </Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formatDateTimeLocal(formData.startDate)}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="bg-background border-border"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate" className="text-foreground">
                  End Date & Time
                </Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formatDateTimeLocal(formData.endDate)}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="bg-background border-border"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground -mt-4">
              Status is calculated automatically based on these dates once
              activated.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {editingElection ? "Save Changes" : "Create Election"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={alertType === "activate"}
        onOpenChange={(open) => !open && setAlertType(null)}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Activate {activeElection?.title}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Once activated, students will be able to vote once the start date
              is reached. Make sure all positions, parties, and candidates are
              finalized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background text-foreground hover:bg-muted">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Confirm Activation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={alertType === "end"}
        onOpenChange={(open) => !open && setAlertType(null)}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              End {activeElection?.title} now?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will immediately close voting, even if the scheduled end date
              hasn't passed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background text-foreground hover:bg-muted">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm End Election
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={alertType === "delete"}
        onOpenChange={(open) => !open && setAlertType(null)}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Delete {activeElection?.title}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will permanently delete this election and its positions,
              parties, and candidates. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background text-foreground hover:bg-muted">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ElectionPage;
