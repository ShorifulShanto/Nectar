
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuth, useFirestore } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
  User,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X } from "lucide-react";
import { AuthSocial } from "@/components/auth/AuthSocial";

type AuthView = "login" | "signup";

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  const syncUserToFirestore = async (user: User) => {
    if (!db) return;
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    
    await setDoc(userRef, {
      id: user.uid,
      email: user.email,
      updatedAt: serverTimestamp(),
      ...(snap.exists() ? {} : {
        createdAt: serverTimestamp(),
        firstName: name.split(' ')[0] || user.displayName?.split(' ')[0] || "",
        lastName: name.split(' ').slice(1).join(' ') || user.displayName?.split(' ').slice(1).join(' ') || "",
        phoneNumber: "",
        location: ""
      })
    }, { merge: true });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await setPersistence(auth, browserSessionPersistence);
      
      if (view === "login") {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        await syncUserToFirestore(userCred.user);
        onClose();
        toast({ title: "Welcome back to NECTAR" });
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(userCred.user, { displayName: name });
        }
        await syncUserToFirestore(userCred.user);
        onClose();
        toast({ title: "Welcome to NECTAR" });
      }
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Auth Failed", 
        description: error.message 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCred = await signInWithPopup(auth, provider);
      await syncUserToFirestore(userCred.user);
      onClose();
      toast({ title: "Welcome to NECTAR" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Sign-In Failed", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 border-none bg-black max-w-[900px] h-auto overflow-hidden rounded-[2rem] flex sm:min-h-[500px]">
        <DialogTitle className="sr-only">Authentication</DialogTitle>
        
        <div className="hidden md:flex flex-1 bg-neutral-900 items-center justify-center p-12 relative overflow-hidden">
           <div className="absolute inset-0 opacity-5 pointer-events-none">
             <div className="w-[150%] aspect-square border-[80px] border-primary rounded-full -translate-x-1/2" />
           </div>
           <h1 className="text-primary font-headline font-black text-4xl tracking-widest opacity-30 z-10 hover:opacity-100 transition-opacity duration-500 hover:[text-shadow:0_0_20px_#7AE2CF]">NECTAR</h1>
        </div>

        <div className="flex-1 p-10 md:p-14 relative flex flex-col justify-center bg-black">
          <button onClick={onClose} className="absolute top-6 right-6 text-white/20 hover:text-primary transition-colors">
            <X size={20} />
          </button>
          
          <div className="max-w-[300px] mx-auto w-full space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-headline font-black text-primary uppercase tracking-tight hover:[text-shadow:0_0_15px_#7AE2CF] transition-all">
                {view === "login" ? "Login" : "Sign Up"}
              </h2>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {view === "signup" && (
                <Input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="h-11 bg-white/5 border-none rounded-xl text-white px-4"
                  required
                />
              )}
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="h-11 bg-white/5 border-none rounded-xl text-white px-4"
                required
              />
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="h-11 bg-white/5 border-none rounded-xl text-white px-4"
                required
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-11 bg-primary text-black font-bold rounded-xl text-[11px] uppercase tracking-widest hover:bg-[#7AE2CF] transition-all shadow-[0_0_15px_rgba(29,205,159,0.2)]"
              >
                {isLoading ? <Loader2 className="animate-spin mx-auto" size={18} /> : <span>{view === "login" ? "Sign In" : "Create Account"}</span>}
              </button>
            </form>

            <div className="relative flex items-center gap-4">
              <div className="flex-1 h-[1px] bg-white/10" />
              <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest">or</span>
              <div className="flex-1 h-[1px] bg-white/10" />
            </div>

            <AuthSocial onGoogle={handleGoogleSignIn} isLoading={isLoading} />

            <div className="text-center pt-2">
              <button 
                onClick={() => setView(view === "login" ? "signup" : "login")}
                className="text-[10px] font-bold text-white/40 hover:text-primary transition-colors uppercase tracking-widest hover:[text-shadow:0_0_10px_#7AE2CF]"
              >
                {view === "login" ? "Need an account? Sign Up" : "Already a member? Sign In"}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
