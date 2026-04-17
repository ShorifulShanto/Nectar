
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { useUser, useFirestore, useDoc, useAuth, useMemoFirebase } from "@/firebase";
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { signOut, deleteUser } from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, MapPin, Mail, LogOut, Loader2, Phone, Trash2, Package } from "lucide-react";
import Link from "next/link";

export function ProfileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userRef);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    location: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        location: profile.location || "",
        phoneNumber: profile.phoneNumber || "",
      });
    }
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;
    setIsLoading(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        ...formData,
        email: user.email,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      await setDoc(doc(db, "central_hub", `profile_update_${user.uid}_${Date.now()}`), {
        id: `profile_update_${user.uid}_${Date.now()}`,
        type: "profile_update",
        userId: user.uid,
        userEmail: user.email,
        payload: { ...formData },
        timestamp: new Date().toISOString()
      });

      toast({ title: "Profile saved" });
      onClose();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Update Failed", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onClose();
      toast({ title: "Signed out" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sign out failed" });
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !db) return;
    setIsLoading(true);
    try {
      const uid = user.uid;
      const email = user.email;

      await setDoc(doc(db, "central_hub", `deletion_${uid}_${Date.now()}`), {
        id: `deletion_${uid}_${Date.now()}`,
        type: "account_deletion",
        userId: uid,
        userEmail: email,
        timestamp: new Date().toISOString()
      });

      await deleteDoc(doc(db, "users", uid));
      await deleteUser(user);
      
      onClose();
      toast({ title: "Account deleted" });
    } catch (e: any) {
      toast({ 
        variant: "destructive", 
        title: "Deletion Failed", 
        description: "Please sign in again before deleting your account for security." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-white/10 text-white sm:max-w-[450px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <User size={40} className="text-white/40" />
            </div>
            <DialogTitle className="text-2xl font-headline tracking-widest uppercase">
              Profile
            </DialogTitle>
          </div>
        </DialogHeader>

        {isProfileLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="animate-spin text-white/20" size={32} />
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40">First Name</label>
                <Input 
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="bg-neutral-900 border-white/5 h-12 text-sm"
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40">Last Name</label>
                <Input 
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="bg-neutral-900 border-white/5 h-12 text-sm"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40">Email</label>
              <div className="flex items-center gap-3 bg-neutral-900/50 border border-white/5 rounded-md px-4 h-12 opacity-60">
                <Mail size={16} className="text-white/20" />
                <span className="text-xs tracking-wider">{user?.email}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <Input 
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="bg-neutral-900 border-white/5 pl-12 h-12 text-sm"
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <Input 
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-neutral-900 border-white/5 pl-12 h-12 text-sm"
                  placeholder="City, State"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-white text-black hover:bg-neutral-200 uppercase tracking-widest font-bold h-14 rounded-full"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  className="border-white/10 bg-white/5 hover:bg-white/10 uppercase tracking-widest font-bold h-14 rounded-full"
                >
                  <Link href="/orders" onClick={onClose}>
                    <Package size={16} className="mr-2" />
                    Orders
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-between px-2 pt-2 border-t border-white/5">
                <button 
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/20 hover:text-white transition-colors"
                >
                  <LogOut size={12} />
                  Sign Out
                </button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button 
                      type="button"
                      className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-destructive/60 hover:text-destructive transition-colors"
                    >
                      <Trash2 size={12} />
                      Delete Account
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-black border-white/10 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="uppercase tracking-widest font-headline">Permanently Delete?</AlertDialogTitle>
                      <AlertDialogDescription className="text-white/40">
                        This will delete your profile and all account data. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete Forever
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
