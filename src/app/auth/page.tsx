
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
import { Loader2, ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function NectarAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center font-body selection:bg-orange-200">
      {/* Dynamic Cinematic Background */}
      <div className="absolute inset-0 z-0 bg-[#f83a7c]">
        {/* Layered Juice Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f83a7c] via-[#ff7c5c] to-[#ffba42]" />
        
        {/* Floating Ambient Blobs */}
        <div className="absolute top-[-10%] left-[-5%] w-[80%] h-[80%] rounded-full bg-[#ffcd3c] blur-[150px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[70%] h-[70%] rounded-full bg-[#f83a7c] blur-[120px] opacity-30" />
        
        {/* Realistic Liquid Splashes (SVGs) */}
        <div className="absolute top-[15%] left-[10%] w-64 h-64 opacity-20 blur-2xl animate-spin-slow">
           <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M47.1,-63.3C61.4,-56.3,73.5,-42.6,78.8,-26.8C84.1,-11.1,82.5,6.6,76.5,22.2C70.4,37.8,59.8,51.3,46.1,60.8C32.4,70.3,15.6,75.8,-0.9,77.3C-17.3,78.8,-34.7,76.4,-49.2,67.3C-63.7,58.3,-75.4,42.5,-80.6,25.3C-85.8,8.2,-84.6,-10.3,-77.3,-26.7C-70.1,-43.1,-56.9,-57.4,-41.4,-64C-25.9,-70.7,-8.1,-69.6,9.2,-82.2C26.4,-94.8,47.1,-63.3,47.1,-63.3Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="absolute bottom-[10%] right-[15%] w-96 h-96 opacity-10 blur-3xl animate-bounce-slow">
           <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M38.5,-52.1C50.6,-44.8,61.4,-34.5,67.8,-21.7C74.3,-8.9,76.4,6.4,72.3,19.9C68.2,33.4,57.9,45.2,45.2,53.4C32.5,61.6,17.4,66.2,2.3,63.1C-12.8,59.9,-27.9,49.1,-40.1,38.1C-52.3,27.1,-61.6,15.9,-64.5,2.9C-67.4,-10.1,-63.9,-25.1,-54.6,-36.8C-45.3,-48.5,-30.2,-56.9,-16.1,-60.7C-1.9,-64.5,13.8,-63.7,26.4,-59.4C39,-55.1,50.6,-52.1,38.5,-52.1Z" transform="translate(100 100)" />
          </svg>
        </div>

        {/* Dynamic Bokeh Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')] opacity-[0.03] pointer-events-none" />
      </div>

      {/* Main Luxury Auth Card */}
      <div className="relative z-10 w-full max-w-[460px] px-6">
        <div className="backdrop-blur-[80px] bg-white/10 border border-white/40 shadow-[0_40px_100px_rgba(0,0,0,0.15),inset_0_0_30px_rgba(255,255,255,0.2)] rounded-[3.5rem] p-10 md:p-16 relative overflow-hidden transition-all duration-700 group">
          
          {/* Rim Light / Glow Effect */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          
          <div className="text-center space-y-3 mb-12">
            <h1 className="text-5xl font-headline font-bold tracking-[0.3em] uppercase text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
              NECTAR
            </h1>
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/70 font-bold">
              {isLogin ? "Taste Perfection" : "Join the Harvest"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-8">
            <div className="space-y-6">
              {/* Minimalist Line Inputs */}
              <div className="relative group">
                <Mail className="absolute right-0 top-3 text-white/40 group-focus-within:text-white transition-colors" size={18} />
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 h-12 focus-visible:ring-0 focus-visible:border-white placeholder:text-white/30 text-white text-base transition-all"
                  required
                />
              </div>

              <div className="relative group">
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-3 text-white/40 hover:text-white transition-colors z-10"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <Input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Secure Password"
                  className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 h-12 focus-visible:ring-0 focus-visible:border-white placeholder:text-white/30 text-white text-base transition-all pr-10"
                  required
                />
                {isLogin && (
                  <div className="flex justify-end mt-2">
                    <button type="button" className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors font-bold">
                      Forgot Password?
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4">
               <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 bg-white text-[#f83a7c] hover:bg-neutral-50 font-bold uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                  <span className="flex items-center justify-center gap-2">
                    {isLogin ? "Sign In" : "Register"}
                  </span>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-10 relative flex items-center justify-center">
            <div className="absolute w-full border-t border-white/10" />
            <span className="relative bg-transparent px-4 text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">Or</span>
          </div>

          <Button 
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full mt-8 h-14 border-white/30 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all flex items-center justify-center gap-3 backdrop-blur-md active:scale-95"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>

          <div className="mt-12 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/60 hover:text-white transition-all group"
            >
              {isLogin ? "Don't have an Account?" : "Already have an Account?"}
              <span className="block h-px w-0 group-hover:w-full bg-white/40 transition-all duration-500 mx-auto mt-1" />
              <span className="text-white mt-1 block tracking-[0.5em]">{isLogin ? "Register" : "Login"}</span>
            </button>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <Link href="/" className="text-[10px] uppercase tracking-[0.6em] text-white/40 hover:text-white transition-all font-bold group inline-flex items-center gap-2">
            <ArrowRight size={12} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
            Return to the Grove
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-40px) scale(1.08); }
        }
        .animate-spin-slow {
          animation: spin-slow 40s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
