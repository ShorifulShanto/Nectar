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
import { useUser, useFirestore, useDoc, useAuth, useMemoFirebase, useCollection } from "@/firebase";
import { doc, setDoc, deleteDoc, serverTimestamp, collection, query, where } from "firebase/firestore";
import { signOut, deleteUser } from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User as UserIcon, MapPin, Mail, LogOut, Loader2, Phone, Trash2, Package, Star, Heart, Bell, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function ProfileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);

  const ordersQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, "orders"), where("userId", "==", user.uid));
  }, [db, user]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userRef);
  const { data: orders } = useCollection(ordersQuery);

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

      toast({ title: "Profile saved" });
      setIsEditing(false);
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
      await deleteDoc(doc(db, "users", uid));
      await deleteUser(user);
      onClose();
      toast({ title: "Account deleted" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Deletion Failed", description: "Please re-auth before deleting." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/80 backdrop-blur-[60px] border-white/10 text-white sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-[3rem] p-0 shadow-2xl">
        <div className="relative">
          {/* Header Section */}
          <div className="p-8 pb-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                 <span className="text-xl">🧃</span>
              </div>
              <DialogTitle className="text-lg font-headline tracking-widest uppercase">My Profile</DialogTitle>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Bell size={18} className="text-white/60" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <ShoppingCart size={18} className="text-white/60" />
              </button>
            </div>
          </div>

          <div className="p-8 pt-6 space-y-8">
            {/* User Info Card */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#f83a7c] to-[#ff7c5c] flex items-center justify-center border-4 border-white/10 shadow-xl">
                <UserIcon size={36} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-headline font-bold uppercase tracking-tight">
                  {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : user?.email?.split('@')[0]}
                </h3>
                <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest">{user?.email}</p>
                <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[8px] uppercase tracking-widest text-green-400 font-bold">
                  Active
                </div>
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] uppercase tracking-widest font-bold transition-all"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
                    <Package size={14} />
                  </div>
                </div>
                <p className="text-xl font-headline font-bold">{orders?.length || 0}</p>
                <p className="text-[8px] uppercase tracking-widest text-white/40 font-bold">Orders</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">
                    <Heart size={14} />
                  </div>
                </div>
                <p className="text-xl font-headline font-bold">24</p>
                <p className="text-[8px] uppercase tracking-widest text-white/40 font-bold">Favorites</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                    <Star size={14} />
                  </div>
                </div>
                <p className="text-xl font-headline font-bold">4.8</p>
                <p className="text-[8px] uppercase tracking-widest text-white/40 font-bold">Ratings</p>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-white/40 ml-2">First Name</label>
                    <Input 
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="bg-white/5 border-white/10 h-12 text-sm rounded-xl focus:bg-white/10"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-white/40 ml-2">Last Name</label>
                    <Input 
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="bg-white/5 border-white/10 h-12 text-sm rounded-xl focus:bg-white/10"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-white/40 ml-2">Phone</label>
                  <Input 
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="bg-white/5 border-white/10 h-12 text-sm rounded-xl focus:bg-white/10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-white/40 ml-2">Location</label>
                  <Input 
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-white/5 border-white/10 h-12 text-sm rounded-xl focus:bg-white/10"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-14 btn-green-gradient text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-full mt-4"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Save Harvest Profile"}
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold">Recent Order</p>
                     <Link href="/orders" onClick={onClose} className="text-[10px] text-primary uppercase tracking-widest font-bold">View All</Link>
                   </div>
                   {orders?.[0] ? (
                     <div className="bg-white/5 border border-white/10 rounded-3xl p-4 flex items-center gap-4">
                        <div className="w-16 h-16 bg-black/40 rounded-2xl relative overflow-hidden flex-shrink-0">
                          <Image src={orders[0].items[0].image} alt="product" fill className="object-contain p-2" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold uppercase tracking-widest truncate">{orders[0].items[0].name}</h4>
                          <p className="text-[9px] text-white/30 uppercase tracking-widest">{orders[0].items.length} Bottles • 10 Apr 2026</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] uppercase tracking-widest bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-bold">Delivered</span>
                          <p className="text-sm font-headline font-bold text-primary mt-1">${orders[0].totalAmount.toFixed(0)}</p>
                        </div>
                     </div>
                   ) : (
                     <div className="p-8 text-center bg-white/2 border border-dashed border-white/10 rounded-3xl">
                       <p className="text-[10px] uppercase tracking-widest text-white/20">No orders yet</p>
                     </div>
                   )}
                </div>

                <div className="flex flex-col gap-3">
                  <Button 
                    asChild 
                    className="h-14 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 font-bold uppercase tracking-widest text-[10px]"
                  >
                    <Link href="/orders" onClick={onClose}>
                      <Package size={16} className="mr-2" />
                      Manage Orders
                    </Link>
                  </Button>
                  <Button 
                    onClick={handleSignOut}
                    variant="ghost" 
                    className="h-14 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl uppercase tracking-widest text-[10px] font-bold"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </Button>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="w-full py-4 text-[9px] uppercase tracking-[0.4em] text-red-500/40 hover:text-red-500 font-bold transition-colors">
                      Permanently Delete Account
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-black/90 border-white/10 text-white rounded-[2rem]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="uppercase tracking-widest font-headline">End the Harvest?</AlertDialogTitle>
                      <AlertDialogDescription className="text-white/40 text-sm">
                        This will permanently delete your selection, order history, and profile. This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-full">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-500 text-white hover:bg-red-600 rounded-full">Delete Forever</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}