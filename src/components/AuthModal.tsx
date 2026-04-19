
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth, useFirestore } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
  User
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, Loader2, Eye, EyeOff, Lock } from "lucide-react";
import Image from "next/image";

type AuthView = "login" | "signup" | "verify";

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        firstName: "",
        lastName: "",
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
        if (!userCred.user.emailVerified) {
          await sendEmailVerification(userCred.user);
          await signOut(auth);
          setView("verify");
          return;
        }
        await syncUserToFirestore(userCred.user);
        onClose();
        toast({ title: "Welcome back to NECTAR" });
      } else if (view === "signup") {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCred.user);
        await syncUserToFirestore(userCred.user);
        await signOut(auth);
        setView("verify");
      }
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Authentication Failed", 
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
      toast({ variant: "destructive", title: "Google Sign-In Failed", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setView("login");
    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        setTimeout(resetState, 300);
      }
    }}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none sm:max-w-[460px] z-[500] rounded-[3.5rem] overflow-hidden">
        <div className="relative w-full min-h-[600px] flex flex-col p-10 md:p-14 overflow-hidden bg-white/5 backdrop-blur-2xl">
          {/* Background Layer - High Visibility */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1776608949/WhatsApp_Image_2026-04-19_at_8.24.59_PM_e78hs8.jpg"
              alt="Background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="relative z-10 flex-1 flex flex-col">
            {view === "verify" ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                  <Mail className="text-white" size={32} />
                </div>
                <div className="space-y-2">
                  <DialogTitle className="text-2xl font-headline font-bold text-[#4a148c] uppercase tracking-widest">Verify Email</DialogTitle>
                  <DialogDescription className="text-[11px] text-black/60 font-bold uppercase tracking-widest px-4">
                    Check your inbox at <span className="text-[#6a1b9a]">{email}</span> to continue your harvest.
                  </DialogDescription>
                </div>
                <Button 
                  onClick={resetState}
                  className="w-full bg-[#6a1b9a] text-white hover:bg-[#4a148c] uppercase tracking-widest font-bold h-14 rounded-full mt-4"
                >
                  Return to Login
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center space-y-2">
                  <div className="flex justify-center mb-4">
                     <span className="text-5xl">🍹</span>
                  </div>
                  <DialogTitle className="text-4xl font-headline font-bold tracking-[0.2em] uppercase text-[#6a1b9a]">
                    NECTAR
                  </DialogTitle>
                  <DialogDescription className="text-[9px] uppercase tracking-[0.5em] text-[#6a1b9a]/60 font-bold">
                    Fresh Fruit Juice
                  </DialogDescription>
                  
                  <div className="pt-6">
                    <h2 className="text-2xl font-headline font-bold text-[#4a148c] tracking-tight">
                      {view === "login" ? "Welcome Back!" : "Join the Grove"}
                    </h2>
                    <p className="text-[11px] text-black/40 font-medium max-w-[200px] mx-auto leading-relaxed">
                      {view === "login" ? "Login to enjoy the freshest experience." : "Start your journey to healthy hydration."}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleAuth} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-black/50 ml-2 uppercase tracking-widest">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30" size={18} />
                      <Input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/40 border-transparent text-black h-14 rounded-2xl pl-14 focus:bg-white/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]"
                        required
                        placeholder="youremail@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-black/50 ml-2 uppercase tracking-widest">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30" size={18} />
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white/40 border-transparent text-black h-14 rounded-2xl pl-14 pr-14 focus:bg-white/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]"
                        required
                        placeholder="••••••••"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-black/30 hover:text-black"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full h-14 bg-gradient-to-r from-[#7b1fa2] via-[#c2185b] to-[#f57c00] text-white font-bold rounded-full shadow-[0_15px_30px_-5px_rgba(123,31,162,0.3)] active:scale-95 transition-all"
                    >
                      {isLoading ? <Loader2 className="animate-spin" size={18} /> : view === "login" ? "Login" : "Register"}
                    </Button>
                  </div>
                </form>

                <div className="relative flex items-center justify-center my-8">
                  <div className="absolute w-full border-t border-black/5" />
                  <span className="relative bg-transparent px-4 text-[9px] uppercase tracking-widest text-black/30 font-bold">or continue with</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={handleGoogleSignIn}
                    variant="outline"
                    className="h-14 border-transparent bg-white/40 hover:bg-white/60 text-black font-bold text-[11px] rounded-2xl"
                  >
                    Google
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-14 border-transparent bg-white/40 hover:bg-white/60 text-black font-bold text-[11px] rounded-2xl"
                  >
                    Facebook
                  </Button>
                </div>

                <div className="text-center pt-8">
                  <button 
                    type="button"
                    onClick={() => setView(view === "login" ? "signup" : "login")}
                    className="text-[11px] font-medium text-black/50 hover:text-black transition-all group"
                  >
                    {view === "login" ? (
                      <>Don't have an account? <span className="text-[#6a1b9a] font-bold ml-1">Sign Up</span></>
                    ) : (
                      <>Already a member? <span className="text-[#6a1b9a] font-bold ml-1">Login</span></>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
