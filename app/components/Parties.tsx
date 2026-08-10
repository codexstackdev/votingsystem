"use client";
import  { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  PlusIcon,
  MoreVerticalIcon,
  EditIcon,
  TrashIcon,
  FlagIcon,
  CheckIcon,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Party } from "@/hooks/types";
import { createParty, deleteParty, getParties, updateParty } from "@/hooks/actions";
import { toast } from "sonner";
import { usePartyStore } from "@/store/usePartyStore";
import { useElectionStore } from "@/store/useElectionStore";
import { useHydrated } from "@/hooks/useHydrated";

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

const PRESET_COLORS = [
  "#1E3A8A",
  "#0EA5E9",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#64748B",
];

const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 px-4 text-center bg-card/50 rounded-[2rem] border-2 border-dashed border-border"
  >
    <div className="p-6 bg-primary/10 rounded-full mb-6">
      <FlagIcon className="h-12 w-12 text-primary" />
    </div>
    <h3 className="text-2xl font-black tracking-tight text-foreground mb-2">
      No Parties Added Yet
    </h3>
    <p className="text-muted-foreground max-w-sm mb-8 font-medium">
      Add the parties running in this election. You'll need at least one before
      adding candidates.
    </p>
    <Button
      onClick={onAdd}
      className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20"
    >
      <PlusIcon className="mr-2 h-5 w-5" /> Add Party
    </Button>
  </motion.div>
);


const PartiesTab = ({electionId, createdBy} : {electionId: string, createdBy: string}) => {
  const parties = usePartyStore((s) => s.parties);
  const setParties = usePartyStore((s) => s.setParties);
  const addParty = usePartyStore((s) => s.addParty);
  const updateStats = useElectionStore((s) => s.setStats);
  const fetchedId = usePartyStore((s) => s.fetchedElectionId);
  const updatePartyLocal = usePartyStore((s) => s.updateParty);
  const deletePartyLocal = usePartyStore((s) => s.removeParty);
  const hydrated = useHydrated(usePartyStore);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [partyToDelete, setPartyToDelete] = useState<Party | null>(null);

  const [formName, setFormName] = useState("");
  const [formColor, setFormColor] = useState(PRESET_COLORS[0]);
  const [formLogo, setFormLogo] = useState("");

  useEffect(() => {
    const getData = async()=>{
      if(!hydrated) return;
      if(electionId === fetchedId) return;
      const data = await getParties(electionId);
      if(data.success){
        setParties(electionId, data.parties)
      }
      else{
        toast.error(data.message ?? "Failed to load parties");
      }
    }
    getData();
  }, [electionId]);

  const handleAdd = () => {
    setEditingParty(null);
    setFormName("");
    setFormColor(PRESET_COLORS[0]);
    setFormLogo("");
    setIsModalOpen(true);
  };

  const handleEdit = (party: Party) => {
    setEditingParty(party);
    setFormName(party.name);
    setFormColor(party.color);
    setFormLogo(party.logoUrl || "");
    setIsModalOpen(true);
  };

  const handleDeleteClick = (party: Party) => {
    setPartyToDelete(party);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async() => {
    try {
      if(editingParty){
        const data = await updateParty(editingParty._id, formName, formColor, formLogo);
        if(data.success){
          toast.success(data.message);
          updatePartyLocal(editingParty._id, {name: formName, color: formColor, logoUrl: formLogo});
          setIsModalOpen(false);
        }else{
          toast.error(data.mesage);
        }
      }
      else{
        const data = await createParty(electionId, formName, formColor, createdBy, formLogo);
        if(data.success){
          const newParty: Party = {
            _id: data.id,
            name: formName,
            color: formColor,
            logoUrl: formLogo,
            hasCandidates: false
          }
          addParty(newParty);
          updateStats({parties: parties.length + 1});
          toast.success(data.message);
          setIsModalOpen(false);
        }
        else{
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async() => {
    if(!partyToDelete) return;
    try {
      const data = await deleteParty(partyToDelete._id);
      if(data.success){
        deletePartyLocal(partyToDelete._id)
        toast.success(data.message);
        updateStats({parties: parties.length - 1})
        setIsDeleteDialogOpen(false);
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      {parties.length === 0 ? (
        <EmptyState onAdd={handleAdd} />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black tracking-tight text-foreground">
                Parties
              </h2>
              <Badge variant="secondary" className="rounded-full font-bold px-3">
                {parties.length}
              </Badge>
            </div>
            <Button
              onClick={handleAdd}
              size="sm"
              className="rounded-xl font-bold shadow-sm"
            >
              <PlusIcon className="mr-2 h-4 w-4" /> Add Party
            </Button>
          </div>

          <div className="hidden md:block bg-card rounded-[1.5rem] border border-border overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="w-20 font-black uppercase tracking-widest text-[10px]">
                    Color
                  </TableHead>
                  <TableHead className="w-20 font-black uppercase tracking-widest text-[10px]">
                    Logo
                  </TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px]">
                    Party Name
                  </TableHead>
                  <TableHead className="w-25 text-right font-black uppercase tracking-widest text-[10px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parties.map((party) => (
                  <TableRow
                    key={party._id}
                    className="group border-border hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div
                        className="h-6 w-6 rounded-full border border-border/50 shadow-inner"
                        style={{ backgroundColor: party.color }}
                      />
                    </TableCell>
                    <TableCell>
                      <Avatar className="h-8 w-8 rounded-lg border border-border bg-muted">
                        <AvatarImage src={party.logoUrl} />
                        <AvatarFallback className="text-[10px] font-black">
                          {party.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-bold text-foreground">
                      {party.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <PartyActions
                        party={party}
                        onEdit={() => handleEdit(party)}
                        onDelete={() => handleDeleteClick(party)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-3">
            {parties.map((party) => (
              <Card
                key={party._id}
                className="bg-card border-border rounded-2xl shadow-sm overflow-hidden"
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="h-10 w-1 bg-primary rounded-full"
                      style={{ backgroundColor: party.color }}
                    />
                    <Avatar className="h-10 w-10 rounded-xl border border-border bg-muted">
                      <AvatarImage src={party.logoUrl} />
                      <AvatarFallback className="text-xs font-black">
                        {party.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="font-bold text-foreground">{party.name}</h4>
                  </div>
                  <PartyActions
                    party={party}
                    onEdit={() => handleEdit(party)}
                    onDelete={() => handleDeleteClick(party)}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-125 bg-popover border-border rounded-[2rem] p-0 overflow-hidden shadow-2xl">
          <div className="p-8 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight text-foreground">
                {editingParty ? "Edit Party" : "Add Party"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                Create a distinct identity for this party group.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label
                  htmlFor="name"
                  className="text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                >
                  Party Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Unity Party"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="bg-muted/50 border-border rounded-xl h-12 px-4 font-medium focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Brand Color
                </Label>
                <div className="flex flex-wrap gap-3">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormColor(color)}
                      className={`h-8 w-8 rounded-full border-2 transition-all ${
                        formColor === color
                          ? "border-primary scale-110 shadow-md"
                          : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {formColor === color && (
                        <CheckIcon className="h-4 w-4 text-white mx-auto drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="logo"
                  className="text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                >
                  Logo URL (Optional)
                </Label>
                <Input
                  id="logo"
                  placeholder="Paste image URL..."
                  value={formLogo}
                  onChange={(e) => setFormLogo(e.target.value)}
                  className="bg-muted/50 border-border rounded-xl h-12 px-4 font-medium focus:ring-2 focus:ring-primary/20"
                />
                <p className="text-[10px] font-medium text-muted-foreground">
                  Leave blank to use initials.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Live Preview
                </Label>
                <div className="p-4 bg-muted/30 rounded-2xl border border-border border-dashed flex items-center justify-center">
                  <div className="bg-card p-3 rounded-xl border border-border shadow-sm flex items-center gap-3 w-full max-w-60">
                    <div
                      className="h-8 w-1 rounded-full"
                      style={{ backgroundColor: formColor }}
                    />
                    <Avatar className="h-8 w-8 rounded-lg border border-border bg-muted">
                      <AvatarImage src={formLogo} />
                      <AvatarFallback className="text-[10px] font-black">
                        {formName ? formName.substring(0, 2).toUpperCase() : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-bold text-sm text-foreground truncate">
                      {formName || "Party Name"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="bg-muted/30 p-6 sm:p-8 flex flex-col sm:flex-row gap-3">
            <Button
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl font-bold order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="rounded-xl font-bold px-8 shadow-lg shadow-primary/20 order-1 sm:order-2">
              {editingParty ? "Save Changes" : "Add Party"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-popover border-border rounded-[2rem] shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black tracking-tight text-foreground">
              Delete {partyToDelete?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-medium">
              This will permanently remove this party from the election. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-3">
            <AlertDialogCancel className="rounded-xl font-bold">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-bold px-6">
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const PartyActions = ({
  party,
  onEdit,
  onDelete,
}: {
  party: Party;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger  className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-accent">
        <MoreVerticalIcon className="h-4 w-4" />
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      className="w-48 p-2 rounded-xl bg-popover border-border shadow-xl"
    >
      <DropdownMenuItem
        onClick={onEdit}
        className="rounded-lg font-semibold py-2 cursor-pointer"
      >
        <EditIcon className="mr-2 h-4 w-4" /> Edit
      </DropdownMenuItem>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="w-full">
              <DropdownMenuItem
                disabled={party.hasCandidates}
                onClick={onDelete}
                className={`rounded-lg font-semibold py-2 cursor-pointer ${
                  party.hasCandidates
                    ? "opacity-50 grayscale cursor-not-allowed"
                    : "text-destructive focus:text-destructive focus:bg-destructive/10"
                }`}
              >
                <TrashIcon className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </div>
          </TooltipTrigger>
          {party.hasCandidates && (
            <TooltipContent
              side="left"
              className="bg-popover border-border text-foreground font-bold text-xs rounded-lg shadow-lg"
            >
              Cannot delete: candidates are assigned to this party
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default PartiesTab;
