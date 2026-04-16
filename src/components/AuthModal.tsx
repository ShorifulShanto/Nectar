
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth, useFirestore } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence,
  User
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

type AuthView = "login" | "signup" | "verify" | "forgot" | "reset_sent";

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    if (!snap.exists()) {
      const hubRef = doc(db, "central_hub", `signup_${user.uid}_${Date.now()}`);
      await setDoc(hubRef, {
        id: hubRef.id,
        type: "signup",
        userId: user.uid,
        userEmail: user.email,
        timestamp: new Date().toISOString()
      });
    }
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setView("reset_sent");
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: error.message 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCred = await signInWithPopup(auth, provider);
      await syncUserToFirestore(userCred.user);
      onClose();
      toast({ title: "Welcome to NECTAR" });
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Google Sign-In Failed", 
        description: error.message 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setView("login");
    setEmail("");
    setPassword("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        setTimeout(resetState, 300);
      }
    }}>
      <DialogContent className="bg-black/80 backdrop-blur-[60px] border-white/10 text-white sm:max-w-[420px] overflow-hidden z-[500] rounded-[3rem] shadow-2xl">
        {view === "verify" ? (
          <div className="py-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-inner">
                <Mail className="text-white/60" size={36} />
              </div>
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline tracking-[0.2em] text-center uppercase">
                Verify Email
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 px-4">
              <p className="text-[11px] text-white/50 uppercase tracking-widest leading-relaxed">
                We have sent a verification email to <span className="text-white">{email}</span>. 
                Please verify it to continue.
              </p>
              <Button 
                onClick={resetState}
                className="w-full bg-white text-black hover:bg-neutral-100 uppercase tracking-widest font-bold h-14 rounded-full mt-4"
              >
                Go to Login
              </Button>
            </div>
          </div>
        ) : view === "reset_sent" ? (
          <div className="py-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-inner">
                <ShieldCheck className="text-white/60" size={36} />
              </div>
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline tracking-[0.2em] text-center uppercase">
                Reset Sent
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 px-4">
              <p className="text-[11px] text-white/50 uppercase tracking-widest leading-relaxed">
                We sent a password reset link to <span className="text-white">{email}</span>.
              </p>
              <Button 
                onClick={resetState}
                className="w-full bg-white text-black hover:bg-neutral-100 uppercase tracking-widest font-bold h-14 rounded-full mt-4"
              >
                Sign In
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center relative mb-6">
                {(view === "forgot" || view === "signup") && (
                   <button onClick={() => setView("login")} className="absolute left-0 text-white/40 hover:text-white transition-colors">
                     <ArrowLeft size={20} />
                   </button>
                )}
                <DialogTitle className="text-3xl font-headline tracking-[0.3em] text-center uppercase">
                  {view === "login" ? "NECTAR" : view === "signup" ? "JOIN US" : "RESET"}
                </DialogTitle>
              </div>
              <p className="text-center text-[10px] uppercase tracking-[0.4em] text-white/30 -mt-2">
                {view === "login" ? "Taste Perfection" : view === "signup" ? "The Grove Awaits" : "Recovery"}
              </p>
            </DialogHeader>
            
            <div className="space-y-6 pt-6">
              {view === "forgot" ? (
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Email Address</label>
                    <Input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-neutral-900/50 border-white/10 focus:ring-white/20 text-white h-12 rounded-xl"
                      required
                      placeholder="email@example.com"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-white text-black hover:bg-neutral-100 uppercase tracking-widest font-bold h-14 rounded-full shadow-lg"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Send Link"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleAuth} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Email Address</label>
                    <Input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-neutral-900/50 border-white/10 focus:ring-white/20 text-white h-12 rounded-xl"
                      required
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Password</label>
                      {view === "login" && (
                        <button 
                          type="button" 
                          onClick={() => setView("forgot")}
                          className="text-[9px] uppercase tracking-widest text-white/20 hover:text-white"
                        >
                          Forgot?
                        </button>
                      )}
                    </div>
                    <Input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-neutral-900/50 border-white/10 focus:ring-white/20 text-white h-12 rounded-xl"
                      required
                      placeholder="••••••••"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-white text-black hover:bg-neutral-100 uppercase tracking-widest font-bold h-14 rounded-full shadow-lg active:scale-95 transition-all"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : view === "login" ? "Sign In" : "Register"}
                  </Button>
                </form>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/5"></span>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                  <span className="bg-black/0 px-4 text-white/20">Or</span>
                </div>
              </div>

              <Button 
                onClick={handleGoogleSignIn}
                variant="outline"
                disabled={isLoading}
                className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white uppercase tracking-widest font-bold h-14 rounded-full flex gap-3 backdrop-blur-md active:scale-95 transition-all"
              >
                {!isLoading && (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Continue with Google"}
              </Button>

              <div className="text-center pb-4">
                <button 
                  type="button"
                  onClick={() => setView(view === "login" ? "signup" : "login")}
                  className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-all font-bold"
                >
                  {view === "login" ? "Join the Grove" : "Back to Sign In"}
                </button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
