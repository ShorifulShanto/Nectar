"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
import { Loader2, Eye, EyeOff } from "lucide-react";

// MODULAR IMPORTS
import { AuthLogo } from "@/components/auth/AuthLogo";
import { AuthSocial } from "@/components/auth/AuthSocial";
import { AuthOverlayBoxes } from "@/components/auth/AuthOverlayBoxes";

type AuthView = "login" | "signup";

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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
    setName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        setTimeout(resetState, 300);
      }
    }}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none sm:max-w-[420px] z-[500] flex items-center justify-center py-20">
        {/* OUTER BOX FRAME: Mirrors the page design */}
        <div className="absolute inset-0 border-2 border-white/5 rounded-[40px] pointer-events-none bg-white/5 backdrop-blur-[4px]" />

        {/* FULL SCALE LOGIN CARD (Removed scale-[0.6]) */}
        <div className="glass-card-nectar rounded-[24px] p-[32px_30px] animate-card-in w-full max-w-[360px] text-[#3d1a5e] font-body relative overflow-hidden shadow-2xl">
          
          {/* REFERENCE IMAGE OVERLAYS */}
          <AuthOverlayBoxes />

          <DialogHeader className="text-center mb-4">
            <AuthLogo />
            <DialogTitle className="font-headline font-extrabold text-[20px] text-[#3d1a5e] mb-1 text-center">
              {view === "login" ? "Welcome Back!" : "Create Account"}
            </DialogTitle>
            <DialogDescription className="text-[12px] text-[#5a2d6e]/55 text-center">
              {view === "login" ? "Login to enjoy the freshest experience." : "Sign up and start your healthy journey."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAuth} className="space-y-3">
            {view === "signup" && (
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-[#3d1a5e] block">Full Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#7a5a9a]">👤</span>
                  <Input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="bg-[#fff8ee]/48 border-white/40 h-[40px] text-[13px] rounded-[10px]"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[12px] font-semibold text-[#3d1a5e] block">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#7a5a9a]">✉️</span>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#fff8ee]/48 border-white/40 h-[40px] text-[13px] rounded-[10px]"
                  required
                  placeholder="youremail@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-[12px] font-semibold text-[#3d1a5e] block">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#7a5a9a]">🔒</span>
                <Input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#fff8ee]/48 border-white/40 h-[40px] text-[13px] rounded-[10px] pr-10"
                  required
                  placeholder={view === "login" ? "••••••••" : "Create Password"}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-[#7a5a9a] hover:text-[#3d1a5e]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {view === "login" && (
              <div className="text-right -mt-2">
                <a className="text-[12px] text-[#8040c0] font-semibold hover:underline cursor-pointer">Forgot Password?</a>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-[45px] btn-green-gradient text-white font-semibold rounded-[50px] text-[15px] mt-2 active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <span>{view === "login" ? "Login" : "Sign Up"}</span>}
            </button>
          </form>

          <AuthSocial onGoogle={handleGoogleSignIn} isLoading={isLoading} />

          <div className="text-center mt-4 pt-2">
            <button 
              type="button"
              onClick={() => setView(view === "login" ? "signup" : "login")}
              className="text-[12px] text-[#46236e]/58 font-medium hover:text-[#3d1a5e]"
            >
              {view === "login" ? (
                <>Don't have an account? <span className="text-[#8040c0] font-bold ml-1">Sign Up</span></>
              ) : (
                <>Already a member? <span className="text-[#8040c0] font-bold ml-1">Login</span></>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
