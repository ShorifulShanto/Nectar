
"use client";

import { useState, useEffect } from "react";
import { useAuth, useFirestore } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
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
import { Loader2, ArrowRight, Mail, Lock, User as UserIcon, Eye, EyeOff, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function NectarAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

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
        firstName: name.split(' ')[0] || "",
        lastName: name.split(' ').slice(1).join(' ') || "",
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
      
      if (isLogin) {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        await syncUserToFirestore(userCred.user);
        toast({ title: "Welcome back to NECTAR" });
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await syncUserToFirestore(userCred.user);
        toast({ title: "Welcome to the NECTAR family" });
      }
      window.location.href = "/";
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
      toast({ title: "Welcome to NECTAR" });
      window.location.href = "/";
    } catch (error: any) {
      toast({ variant: "destructive", title: "Sign-In Failed", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center font-body bg-black selection:bg-orange-200">
      {/* Dynamic Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1776608949/WhatsApp_Image_2026-04-19_at_8.24.59_PM_e78hs8.jpg"
          alt="NECTAR background"
          fill
          className="object-cover"
          priority
          data-ai-hint="fresh fruit"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
      </div>

      {/* Main Container for Depth */}
      <div className="relative z-10 w-full max-w-[460px] px-6 animate-in fade-in zoom-in duration-1000">
        {/* Main See-Through Glass Card */}
        <div className="bg-white/5 backdrop-blur-[40px] border border-white/20 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
          {/* Internal Reflection Edge */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          
          <div className="text-center space-y-3 mb-10">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner border border-white/10">
                <span className="text-3xl">🧃</span>
              </div>
            </div>
            <h1 className="text-4xl font-headline font-bold tracking-[0.25em] uppercase text-white drop-shadow-lg">
              NECTAR
            </h1>
            <h2 className="text-xl font-headline font-bold text-white/90 tracking-tight">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">
              {isLogin ? "Taste perfection again" : "Join the fruit revolution"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <Input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="bg-white/5 border-white/10 rounded-2xl h-14 pl-12 focus:bg-white/10 focus:ring-0 focus:border-white/40 placeholder:text-white/20 text-white text-base transition-all"
                    required
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="bg-white/5 border-white/10 rounded-2xl h-14 pl-12 focus:bg-white/10 focus:ring-0 focus:border-white/40 placeholder:text-white/20 text-white text-base transition-all"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors z-10"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <Input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="bg-white/5 border-white/10 rounded-2xl h-14 pl-12 pr-12 focus:bg-white/10 focus:ring-0 focus:border-white/40 placeholder:text-white/20 text-white text-base transition-all"
                  required
                />
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <button type="button" className="text-[9px] uppercase tracking-widest text-white/30 hover:text-white transition-colors font-bold">
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            <div className="pt-4">
               <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-[#00c853] to-[#64dd17] text-black font-bold uppercase tracking-[0.2em] text-[11px] rounded-full transition-all duration-300 active:scale-95 shadow-[0_10px_30px_-5px_rgba(0,200,83,0.5)] hover:shadow-[0_15px_40px_-5px_rgba(0,200,83,0.6)]"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                  <span>{isLogin ? "Sign In" : "Sign Up"}</span>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-10 relative flex items-center justify-center">
            <div className="absolute w-full border-t border-white/10" />
            <span className="relative bg-transparent px-4 text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold">OR</span>
          </div>

          <div className="mt-8">
            <Button 
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full h-14 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-[0.1em] text-[10px] rounded-2xl transition-all flex items-center justify-center gap-3 backdrop-blur-md"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>
          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 hover:text-white transition-all group"
            >
              {isLogin ? (
                <>New to the Grove? <span className="text-white">Create Account</span></>
              ) : (
                <>Already a member? <span className="text-white">Sign In</span></>
              )}
            </button>
          </div>
        </div>
        
        {/* Soft Mirror Reflection */}
        <div className="mt-4 mx-auto w-[85%] h-32 bg-white/5 backdrop-blur-[60px] rounded-[3rem] opacity-20 pointer-events-none transform -scale-y-100 mask-reflection" />

        <div className="mt-10 text-center">
          <Link href="/" className="text-[10px] uppercase tracking-[0.6em] text-white/40 hover:text-white transition-all font-bold group inline-flex items-center gap-2">
            <ArrowRight size={12} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
            Back to Selection
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .mask-reflection {
          mask-image: linear-gradient(to bottom, transparent 0%, black 100%);
          filter: blur(8px);
        }
      `}</style>
    </div>
  );
}
