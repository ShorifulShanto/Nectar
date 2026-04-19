
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
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence,
  User
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, ShieldCheck, ArrowLeft, Loader2, Sparkles, Eye, EyeOff, Lock } from "lucide-react";
import Image from "next/image";

type AuthView = "login" | "signup" | "verify" | "forgot" | "reset_sent";

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
    setShowPassword(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        setTimeout(resetState, 300);
      }
    }}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none sm:max-w-[440px] z-[500] rounded-[3.5rem] overflow-hidden">
        <div className="relative w-full min-h-[600px] flex flex-col p-10 md:p-12 overflow-hidden bg-black">
          {/* Immersive Background Layer */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1776608949/WhatsApp_Image_2026-04-19_at_8.24.59_PM_e78hs8.jpg"
              alt="Auth Background"
              fill
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[40px]" />
          </div>

          {/* Ambient Light Effects */}
          <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
          <div className="absolute bottom-[10%] right-[10%] w-64 h-64 bg-pink-500/10 rounded-full blur-[100px] animate-pulse delay-1000 pointer-events-none" />

          {/* Mirror Reflection (Bottom) */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[90%] h-32 bg-white/5 backdrop-blur-[60px] rounded-[3rem] opacity-20 pointer-events-none transform -scale-y-100 border border-white/10" style={{ maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, transparent 100%)' }} />

          <div className="relative z-10 flex-1 flex flex-col">
            {view === "verify" ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-lg">
                  <Mail className="text-white/60" size={32} />
                </div>
                <div className="space-y-2">
                  <DialogTitle className="text-2xl font-headline font-bold tracking-[0.2em] uppercase">Verify Email</DialogTitle>
                  <DialogDescription className="text-[10px] text-white/50 uppercase tracking-widest leading-relaxed px-4">
                    Check your inbox at <span className="text-white font-bold">{email}</span> to continue your harvest.
                  </DialogDescription>
                </div>
                <Button 
                  onClick={resetState}
                  className="w-full bg-white text-black hover:bg-neutral-100 uppercase tracking-widest font-bold h-14 rounded-full mt-4"
                >
                  Return to Login
                </Button>
              </div>
            ) : view === "reset_sent" ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-lg">
                  <ShieldCheck className="text-white/60" size={32} />
                </div>
                <div className="space-y-2">
                  <DialogTitle className="text-2xl font-headline font-bold tracking-[0.2em] uppercase">Reset Sent</DialogTitle>
                  <DialogDescription className="text-[10px] text-white/50 uppercase tracking-widest leading-relaxed">
                    Check your email for the magic link.
                  </DialogDescription>
                </div>
                <Button 
                  onClick={resetState}
                  className="w-full bg-white text-black hover:bg-neutral-100 uppercase tracking-widest font-bold h-14 rounded-full mt-4"
                >
                  Sign In
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-10">
                  <div className="flex items-center justify-between relative mb-8">
                    {(view === "forgot" || view === "signup") && (
                       <button onClick={() => setView("login")} className="text-white/40 hover:text-white transition-colors">
                         <ArrowLeft size={18} />
                       </button>
                    )}
                    <div className="flex-1 text-center">
                       <DialogTitle className="text-3xl font-headline font-bold tracking-[0.3em] uppercase">NECTAR</DialogTitle>
                       <DialogDescription className="text-[9px] uppercase tracking-[0.4em] text-white/30 mt-1">
                        {view === "login" ? "Taste Perfection" : view === "signup" ? "Join the Grove" : "Recovery"}
                       </DialogDescription>
                    </div>
                    {(view === "forgot" || view === "signup") && <div className="w-[18px]" />}
                  </div>
                </div>
                
                <div className="space-y-6">
                  {view === "forgot" ? (
                    <form onSubmit={handleForgotPassword} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.4em] text-white/40 font-bold ml-2">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                          <Input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white/5 border-white/10 text-white h-14 rounded-2xl pl-14 focus:bg-white/10 transition-all placeholder:text-white/20"
                            required
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-15 bg-gradient-to-r from-[#00c853] to-[#64dd17] text-black font-bold uppercase tracking-[0.25em] text-[11px] rounded-full shadow-[0_15px_30px_-5px_rgba(0,200,83,0.4)]"
                      >
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Send Link"}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleAuth} className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-[0.4em] text-white/40 font-bold ml-2">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                            <Input 
                              type="email" 
                              value={email} 
                              onChange={(e) => setEmail(e.target.value)}
                              className="bg-white/5 border-white/10 text-white h-14 rounded-2xl pl-14 focus:bg-white/10 transition-all placeholder:text-white/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
                              required
                              placeholder="your@email.com"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center ml-2">
                            <label className="text-[9px] uppercase tracking-[0.4em] text-white/40 font-bold">Password</label>
                            {view === "login" && (
                              <button 
                                type="button" 
                                onClick={() => setView("forgot")}
                                className="text-[8px] uppercase tracking-widest text-white/20 hover:text-white"
                              >
                                Forgot?
                              </button>
                            )}
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              value={password} 
                              onChange={(e) => setPassword(e.target.value)}
                              className="bg-white/5 border-white/10 text-white h-14 rounded-2xl pl-14 pr-14 focus:bg-white/10 transition-all placeholder:text-white/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
                              required
                              placeholder="••••••••"
                            />
                            <button 
                              type="button" 
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          type="submit" 
                          disabled={isLoading}
                          className="w-full h-15 bg-gradient-to-r from-[#00c853] to-[#64dd17] text-black font-bold uppercase tracking-[0.25em] text-[11px] rounded-full shadow-[0_15px_30px_-5px_rgba(0,200,83,0.4)] active:scale-95 transition-all"
                        >
                          {isLoading ? <Loader2 className="animate-spin" size={18} /> : view === "login" ? "Sign In" : "Register"}
                        </Button>
                      </div>
                    </form>
                  )}

                  <div className="relative flex items-center justify-center py-4">
                    <div className="absolute w-full border-t border-white/10" />
                    <span className="relative bg-transparent px-4 text-[9px] uppercase tracking-[0.5em] text-white/20 font-bold">OR</span>
                  </div>

                  <Button 
                    onClick={handleGoogleSignIn}
                    variant="outline"
                    disabled={isLoading}
                    className="w-full h-14 border-white/10 bg-white/5 hover:bg-white/10 text-white uppercase tracking-widest font-bold h-14 rounded-2xl flex gap-3 backdrop-blur-md active:scale-95 transition-all shadow-lg"
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

                  <div className="text-center pt-8">
                    <button 
                      type="button"
                      onClick={() => setView(view === "login" ? "signup" : "login")}
                      className="text-[9px] uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all font-bold"
                    >
                      {view === "login" ? "New to the Grove? Join" : "Back to Sign In"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
