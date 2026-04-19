
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
import { Loader2, ArrowRight, Mail, Lock, User as UserIcon, Eye, EyeOff, Sparkles, Facebook } from "lucide-react";
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
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center font-body bg-[#1a0b16] selection:bg-orange-200">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 scale-110 blur-[2px]">
        <Image 
          src="https://res.cloudinary.com/drmpjeatm/image/upload/q_auto/f_auto/v1776608949/WhatsApp_Image_2026-04-19_at_8.24.59_PM_e78hs8.jpg"
          alt="NECTAR background"
          fill
          className="object-cover"
          priority
        />
        {/* Warm Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 via-transparent to-orange-500/10 mix-blend-overlay" />
      </div>

      {/* Floating Labels and Arrows (Matching reference image) */}
      <div className="absolute inset-0 pointer-events-none z-10 hidden md:block">
        {/* Fresh Login */}
        <div className="absolute top-[15%] left-[18%] animate-bounce delay-100">
           <div className="relative">
             <p className="text-white text-lg font-accent italic drop-shadow-lg">Fresh Login</p>
             <svg className="absolute -bottom-6 left-8 w-12 h-12 text-white/40 transform rotate-[150deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
             </svg>
           </div>
        </div>

        {/* Juicy Deals */}
        <div className="absolute top-[45%] left-[12%] animate-pulse">
           <div className="relative">
             <p className="text-white text-lg font-accent italic drop-shadow-lg">Juicy Deals</p>
             <svg className="absolute -top-4 right-[-40px] w-12 h-12 text-white/40 transform rotate-[45deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
             </svg>
           </div>
        </div>

        {/* Smooth Experience */}
        <div className="absolute bottom-[10%] left-[20%]">
           <div className="relative">
             <p className="text-white text-lg font-accent italic drop-shadow-lg">Smooth Experience</p>
             <svg className="absolute -top-10 left-10 w-12 h-12 text-white/40 transform rotate-[-45deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
             </svg>
           </div>
        </div>

        {/* Quick Access */}
        <div className="absolute top-[12%] right-[18%] animate-bounce">
           <div className="relative text-right">
             <p className="text-white text-lg font-accent italic drop-shadow-lg">Quick Access</p>
             <svg className="absolute -bottom-8 right-12 w-12 h-12 text-white/40 transform rotate-[-150deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
             </svg>
           </div>
        </div>

        {/* Healthy Choice */}
        <div className="absolute top-[40%] right-[15%]">
           <div className="relative text-right">
             <p className="text-white text-lg font-accent italic drop-shadow-lg">Healthy Choice</p>
             <svg className="absolute -bottom-6 right-16 w-12 h-12 text-white/40 transform rotate-[-170deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
             </svg>
           </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-20 w-full max-w-[480px] px-6 flex flex-col items-center">
        {/* Soft Mirror Reflection */}
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[90%] h-64 bg-white/5 backdrop-blur-[60px] rounded-[4rem] opacity-20 pointer-events-none transform -scale-y-100 border border-white/10" style={{ maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)' }} />

        {/* High-End Glassmorphism Card */}
        <div className="w-full bg-white/[0.08] backdrop-blur-[80px] border border-white/20 rounded-[3.5rem] p-10 md:p-14 shadow-[0_40px_100px_-15px_rgba(0,0,0,0.4)] relative overflow-hidden group">
          {/* Internal Glow Rim */}
          <div className="absolute inset-0 rounded-[3.5rem] border border-white/10 pointer-events-none" />
          
          <div className="text-center space-y-3 mb-10">
            <div className="flex justify-center mb-6">
              <div className="relative w-20 h-20 bg-gradient-to-br from-orange-400 to-yellow-300 rounded-full flex items-center justify-center shadow-xl transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <span className="text-4xl">🍹</span>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1.5 h-3 bg-white rounded-full transform rotate-45" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-headline font-bold tracking-[0.2em] uppercase text-[#6a1b9a] drop-shadow-sm">
              NECTAR
            </h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#6a1b9a]/60 font-bold">
              Fresh Fruit Juice
            </p>

            <div className="pt-6 space-y-2">
               <h2 className="text-2xl font-headline font-bold text-[#4a148c] tracking-tight">
                {isLogin ? "Welcome Back!" : "Join the Grove"}
              </h2>
              <p className="text-[11px] text-black/40 font-medium max-w-[200px] mx-auto leading-relaxed">
                {isLogin ? "Login to enjoy the freshest experience." : "Sign up to start your healthy harvest."}
              </p>
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-5">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-black/50 ml-2 uppercase tracking-widest">Name</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-[#6a1b9a] transition-colors" size={18} />
                    <Input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className="bg-white/40 border-transparent rounded-2xl h-14 pl-14 focus:bg-white/60 focus:ring-2 focus:ring-[#6a1b9a]/10 focus:border-white placeholder:text-black/20 text-black text-base transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                 <label className="text-[10px] font-bold text-black/50 ml-2 uppercase tracking-widest">Email</label>
                 <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-[#6a1b9a] transition-colors" size={18} />
                  <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="youremail@example.com"
                    className="bg-white/40 border-transparent rounded-2xl h-14 pl-14 focus:bg-white/60 focus:ring-2 focus:ring-[#6a1b9a]/10 focus:border-white placeholder:text-black/20 text-black text-base transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-black/50 ml-2 uppercase tracking-widest">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-[#6a1b9a] transition-colors" size={18} />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-black/30 hover:text-[#6a1b9a] transition-colors z-10"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-white/40 border-transparent rounded-2xl h-14 pl-14 pr-14 focus:bg-white/60 focus:ring-2 focus:ring-[#6a1b9a]/10 focus:border-white placeholder:text-black/20 text-black text-base transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]"
                    required
                  />
                </div>
                {isLogin && (
                  <div className="flex justify-end pr-2 pt-1">
                    <button type="button" className="text-[10px] font-bold text-[#6a1b9a] hover:text-[#4a148c] transition-colors">
                      Forgot Password?
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
               <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-[#7b1fa2] via-[#c2185b] to-[#f57c00] text-white font-bold rounded-full transition-all duration-300 active:scale-95 shadow-[0_15px_30px_-5px_rgba(123,31,162,0.4)] hover:shadow-[0_20px_45px_-5px_rgba(123,31,162,0.6)] hover:brightness-110"
              >
                {isLoading ? <Loader2 className="animate-spin" size={22} /> : (
                  <span>{isLogin ? "Login" : "Sign Up"}</span>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-10 relative flex items-center justify-center">
            <div className="absolute w-full border-t border-black/5" />
            <span className="relative bg-transparent px-4 text-[10px] uppercase tracking-widest text-black/30 font-bold">or continue with</span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <Button 
              onClick={handleGoogleSignIn}
              variant="outline"
              className="h-14 border-transparent bg-white/40 hover:bg-white/60 text-black font-bold text-[11px] rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>
            <Button 
              variant="outline"
              className="h-14 border-transparent bg-white/40 hover:bg-white/60 text-black font-bold text-[11px] rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Facebook className="w-4 h-4 text-[#1877F2] fill-[#1877F2]" />
              Facebook
            </Button>
          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[11px] font-medium text-black/50 hover:text-black transition-all group"
            >
              {isLogin ? (
                <>Don't have an account? <span className="text-[#6a1b9a] font-bold border-b border-transparent group-hover:border-[#6a1b9a] transition-all ml-1">Sign Up</span></>
              ) : (
                <>Already a member? <span className="text-[#6a1b9a] font-bold border-b border-transparent group-hover:border-[#6a1b9a] transition-all ml-1">Login</span></>
              )}
            </button>
          </div>
        </div>

        {/* Back Navigation */}
        <div className="mt-12 text-center">
          <Link href="/" className="text-[10px] uppercase tracking-[0.5em] text-white/40 hover:text-white transition-all font-bold group inline-flex items-center gap-2">
            <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
            Back to Site
          </Link>
        </div>
      </div>
    </div>
  );
}
