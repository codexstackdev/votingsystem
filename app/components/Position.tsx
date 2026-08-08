"use client";
import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  PlusIcon,
  MoreVerticalIcon,
  EditIcon,
  TrashIcon,
  GripVerticalIcon,
  BriefcaseIcon,
  InfoIcon,
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
import { Position } from "../hooks/types";

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

const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 px-4 text-center bg-card/50 rounded-[2rem] border-2 border-dashed border-border"
  >
    <div className="p-6 bg-primary/10 rounded-full mb-6">
      <BriefcaseIcon className="h-12 w-12 text-primary" />
    </div>
    <h3 className="text-2xl font-black tracking-tight text-foreground mb-2">
      No Positions Added Yet
    </h3>
    <p className="text-muted-foreground max-w-sm mb-8 font-medium">
      Start building your election by adding the first position. You'll need at
      least one to activate the election.
    </p>
    <Button
      onClick={onAdd}
      className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20"
    >
      <PlusIcon className="mr-2 h-5 w-5" /> Add Position
    </Button>
  </motion.div>
);

const PositionsTab = () => {
  const [positions, setPositions] = useState<Position[]>([
    { id: "1", title: "President", maxVotes: 1, order: 1, hasCandidates: true },
    { id: "2", title: "Vice President", maxVotes: 1, order: 2, hasCandidates: true },
    { id: "3", title: "Secretary", maxVotes: 1, order: 3, hasCandidates: false },
    { id: "4", title: "Treasurer", maxVotes: 1, order: 4, hasCandidates: false },
    { id: "5", title: "Senators", maxVotes: 12, order: 5, hasCandidates: false },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [positionToDelete, setPositionToDelete] = useState<Position | null>(null);

  const handleAdd = () => {
    setEditingPosition(null);
    setIsModalOpen(true);
  };

  const handleEdit = (pos: Position) => {
    setEditingPosition(pos);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (pos: Position) => {
    setPositionToDelete(pos);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {positions.length === 0 ? (
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
                Positions
              </h2>
              <Badge variant="secondary" className="rounded-full font-bold px-3">
                {positions.length}
              </Badge>
            </div>
            <Button
              onClick={handleAdd}
              size="sm"
              className="rounded-xl font-bold shadow-sm"
            >
              <PlusIcon className="mr-2 h-4 w-4" /> Add Position
            </Button>
          </div>

          <div className="hidden md:block bg-card rounded-[1.5rem] border border-border overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="w-20 font-black uppercase tracking-widest text-[10px]">
                    Order
                  </TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px]">
                    Position Title
                  </TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px]">
                    Max Votes
                  </TableHead>
                  <TableHead className="w-25 text-right font-black uppercase tracking-widest text-[10px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((pos) => (
                  <TableRow
                    key={pos.id}
                    className="group border-border hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2 font-bold text-muted-foreground">
                        <GripVerticalIcon className="h-4 w-4 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity" />
                        {pos.order}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-foreground">
                      {pos.title}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="rounded-lg border-primary/20 bg-primary/5 text-primary font-bold"
                      >
                        {pos.maxVotes === 1 ? "Single Choice" : `Up to ${pos.maxVotes}`}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <PositionActions
                        pos={pos}
                        onEdit={() => handleEdit(pos)}
                        onDelete={() => handleDeleteClick(pos)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-3">
            {positions.map((pos) => (
              <Card
                key={pos.id}
                className="bg-card border-border rounded-2xl shadow-sm overflow-hidden"
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center h-10 w-10 bg-muted rounded-xl font-black text-muted-foreground text-xs">
                      {pos.order}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-foreground">{pos.title}</h4>
                      <Badge
                        variant="outline"
                        className="rounded-md text-[10px] h-5 border-primary/20 bg-primary/5 text-primary font-bold px-2"
                      >
                        {pos.maxVotes === 1 ? "1 Vote" : `${pos.maxVotes} Votes`}
                      </Badge>
                    </div>
                  </div>
                  <PositionActions
                    pos={pos}
                    onEdit={() => handleEdit(pos)}
                    onDelete={() => handleDeleteClick(pos)}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-112.5 bg-popover border-border rounded-[2rem] p-0 overflow-hidden shadow-2xl">
          <div className="p-8 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight text-foreground">
                {editingPosition ? "Edit Position" : "Add Position"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                Define the rules for this voting category.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label
                  htmlFor="title"
                  className="text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                >
                  Position Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. President"
                  defaultValue={editingPosition?.title}
                  className="bg-muted/50 border-border rounded-xl h-12 px-4 font-medium focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="maxVotes"
                    className="text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                  >
                    Max Votes
                  </Label>
                  <Input
                    id="maxVotes"
                    type="number"
                    min="1"
                    defaultValue={editingPosition?.maxVotes || 1}
                    className="bg-muted/50 border-border rounded-xl h-12 px-4 font-medium focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="order"
                    className="text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                  >
                    Display Order
                  </Label>
                  <Input
                    id="order"
                    type="number"
                    defaultValue={editingPosition?.order || positions.length + 1}
                    className="bg-muted/50 border-border rounded-xl h-12 px-4 font-medium focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex gap-2 p-3 bg-primary/5 rounded-xl border border-primary/10">
                <InfoIcon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-[11px] font-medium text-primary/80 leading-tight">
                  1 = single choice. Set higher for multi-seat positions like Senators.
                </p>
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
            <Button className="rounded-xl font-bold px-8 shadow-lg shadow-primary/20 order-1 sm:order-2">
              {editingPosition ? "Save Changes" : "Add Position"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-popover border-border rounded-[2rem] shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black tracking-tight text-foreground">
              Delete {positionToDelete?.title}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-medium">
              This will permanently remove this position from the election. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-3">
            <AlertDialogCancel className="rounded-xl font-bold">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-bold px-6">
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const PositionActions = ({
  pos,
  onEdit,
  onDelete,
}: {
  pos: Position;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-accent">
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
                disabled={pos.hasCandidates}
                onClick={onDelete}
                className={`rounded-lg font-semibold py-2 cursor-pointer ${
                  pos.hasCandidates
                    ? "opacity-50 grayscale cursor-not-allowed"
                    : "text-destructive focus:text-destructive focus:bg-destructive/10"
                }`}
              >
                <TrashIcon className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </div>
          </TooltipTrigger>
          {pos.hasCandidates && (
            <TooltipContent 
              side="left" 
              className="bg-popover border-border text-foreground font-bold text-xs rounded-lg shadow-lg"
            >
              Cannot delete: candidates are assigned to this position
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default PositionsTab;
