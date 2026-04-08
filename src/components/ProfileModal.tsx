"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, MapPin, Mail, LogOut, Loader2 } from "lucide-react";
import { signOut } from "firebase/auth";
import { useAuth, useMemoFirebase } from "@/firebase";

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
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        location: profile.location || "",
      });
    }
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;
    setIsLoading(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        ...formData,
        email: user.email,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Log to central hub
      await setDoc(doc(db, "central_hub", `profile_update_${Date.now()}`), {
        id: `profile_update_${Date.now()}`,
        type: "profile_update",
        userId: user.uid,
        userEmail: user.email,
        payload: { ...formData },
        timestamp: new Date().toISOString()
      });

      toast({ title: "Profile updated successfully!" });
      onClose();
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Update Failed", 
        description: error.message 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onClose();
      toast({ title: "Signed out successfully" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sign out failed" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-white/10 text-white sm:max-w-[450px]">
        <DialogHeader>
          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <User size={40} className="text-white/40" />
            </div>
            <DialogTitle className="text-2xl font-headline tracking-widest uppercase">
              Customer Profile
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
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40">Last Name</label>
                <Input 
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="bg-neutral-900 border-white/5 h-12 text-sm"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40">Email (Verified)</label>
              <div className="flex items-center gap-3 bg-neutral-900/50 border border-white/5 rounded-md px-4 h-12 opacity-60">
                <Mail size={16} className="text-white/20" />
                <span className="text-xs tracking-wider">{user?.email}</span>
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
                  placeholder="Los Angeles, CA"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-neutral-200 uppercase tracking-widest font-bold h-14 rounded-full"
              >
                {isLoading ? "Saving Changes..." : "Save Profile"}
              </Button>
              <button 
                type="button"
                onClick={handleSignOut}
                className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-white/20 hover:text-white transition-colors"
              >
                <LogOut size={12} />
                Sign Out
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}