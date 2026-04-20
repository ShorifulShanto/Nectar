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
  User,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type AuthView = "login" | "signup" | "verify";

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
        if (name) {
          await updateProfile(userCred.user, { displayName: name });
        }
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
    setName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        setTimeout(resetState, 300);
      }
    }}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none sm:max-w-[360px] z-[500]">
        <div className="glass-card-nectar rounded-[24px] p-[32px_30px] animate-card-in w-full text-[#3d1a5e] font-body relative overflow-hidden">
          
          {view === "verify" ? (
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
              <span className="text-[50px] mb-2">✉️</span>
              <div>
                <DialogTitle className="font-headline font-extrabold text-[20px] text-[#3d1a5e] uppercase tracking-widest">Verify Email</DialogTitle>
                <DialogDescription className="text-[12px] text-[#5a2d6e]/55 mt-2">
                  Check your inbox to continue your harvest.
                </DialogDescription>
              </div>
              <Button 
                onClick={resetState}
                className="w-full btn-nectar-grad text-white font-semibold h-[45px] rounded-[50px] mt-4"
              >
                Return to Login
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-4">
                <DialogTitle className="font-headline font-black text-[30px] leading-none tracking-[3px] bg-gradient-to-br from-[#7030b0] to-[#a03070] bg-clip-text text-transparent">
                  NECTAR
                </DialogTitle>
                <DialogDescription className="text-[11px] tracking-[1.8px] text-[#7a5a9a] mt-1 font-medium">
                  Fresh Fruit Juice
                </DialogDescription>
              </div>

              <div className="text-center mb-4">
                <h2 className="font-headline font-extrabold text-[20px] text-[#3d1a5e] mb-1">
                  {view === "login" ? "Welcome Back!" : "Create Account"}
                </h2>
                <p className="text-[12px] text-[#5a2d6e]/55">
                  {view === "login" ? "Login to enjoy the freshest experience." : "Sign up and start your healthy journey."}
                </p>
              </div>

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
                        className="bg-[#fff8ee]/48 border-[rgba(255,255,255,0.48)] rounded-[12px] h-[40px] pl-10 focus:ring-0 focus:border-[#8040c0] text-[#3d1a5e] text-[13px]"
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
                      className="bg-[#fff8ee]/48 border-[rgba(255,255,255,0.48)] rounded-[12px] h-[40px] pl-10 focus:ring-0 focus:border-[#8040c0] text-[#3d1a5e] text-[13px]"
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
                      className="bg-[#fff8ee]/48 border-[rgba(255,255,255,0.48)] rounded-[12px] h-[40px] pl-10 pr-10 focus:ring-0 focus:border-[#8040c0] text-[#3d1a5e] text-[13px]"
                      required
                      placeholder={view === "login" ? "••••••••" : "Create Password"}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-[#7a5a9a] hover:text-[#3d1a5e]"
                    >
                      {showPassword ? "🙈" : "👁️"}
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
                  className="w-full h-[45px] btn-nectar-grad text-white font-semibold rounded-[50px] text-[15px] mt-2 active:scale-95 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : <span>{view === "login" ? "Login" : "Sign Up"}</span>}
                </button>
              </form>

              {view === "login" && (
                <>
                  <div className="flex items-center gap-2 my-4 text-[#5a2d6e]/45">
                    <div className="flex-1 h-[1px] bg-[rgba(110,50,140,0.18)]" />
                    <span className="text-[11px] whitespace-nowrap">or continue with</span>
                    <div className="flex-1 h-[1px] bg-[rgba(110,50,140,0.18)]" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={handleGoogleSignIn}
                      className="flex items-center justify-center gap-2 h-[40px] bg-[#ffffff]/48 border border-[rgba(255,255,255,0.55)] rounded-[12px] text-[#3d1a5e] text-[13px] font-semibold hover:bg-white/60 transition-colors"
                    >
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-[18px] h-[18px]"/> Google
                    </button>
                    <button 
                      className="flex items-center justify-center gap-2 h-[40px] bg-[#ffffff]/48 border border-[rgba(255,255,255,0.55)] rounded-[12px] text-[#3d1a5e] text-[13px] font-semibold hover:bg-white/60 transition-colors"
                    >
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/facebook.svg" alt="F" className="w-[18px] h-[18px]"/> Facebook
                    </button>
                  </div>
                </>
              )}

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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
