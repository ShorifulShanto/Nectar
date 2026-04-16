
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
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function NectarAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      // Redirect or handle post-auth state
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
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center font-body">
      {/* Vibrant Fruit-Inspired Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#FFFAF0]" />
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#FFB6C1] to-[#FFDAB9] blur-[120px] opacity-60 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tl from-[#FFA500] to-[#FFFFE0] blur-[150px] opacity-50" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-[#FFB6C1] blur-[100px] opacity-40 animate-bounce transition-all duration-[10000ms]" />
        
        {/* Subtle Liquid Splashes (Abstract SVGs) */}
        <svg className="absolute top-1/4 left-1/4 w-64 h-64 text-[#FFA500]/10 blur-xl animate-spin-slow" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.2C87.4,-33.3,90.1,-17.6,89.1,-2.4C88.1,12.8,83.4,27.5,75.1,40.1C66.8,52.7,54.8,63.1,41.2,70.1C27.6,77.1,12.3,80.7,-2.8,85.5C-17.9,90.3,-32.9,96.3,-46.5,92.5C-60.1,88.7,-72.3,75.1,-80.4,60.2C-88.5,45.3,-92.5,29.1,-93.2,12.9C-93.9,-3.3,-91.3,-19.5,-84.5,-33.7C-77.7,-47.9,-66.7,-60.1,-53.4,-67.7C-40.1,-75.3,-24.5,-78.3,-9.4,-82.1C5.7,-85.9,20.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
      </div>

      {/* Glassmorphism Auth Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="backdrop-blur-[40px] bg-white/40 border border-white/40 shadow-[0_8px_32px_0_rgba(255,165,0,0.15)] rounded-[2.5rem] p-10 relative overflow-hidden group transition-all duration-700 hover:shadow-[0_8px_48px_0_rgba(255,165,0,0.25)]">
          {/* Glowing Edge Effect */}
          <div className="absolute inset-0 pointer-events-none rounded-[2.5rem] border-[1.5px] border-white/50 opacity-50 group-hover:opacity-100 transition-opacity" />
          
          <div className="text-center space-y-2 mb-10">
            <h1 className="text-4xl font-headline font-bold tracking-[0.15em] uppercase bg-gradient-to-r from-[#FF7F50] to-[#FFA500] bg-clip-text text-transparent">
              NECTAR
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8B4513]/60 font-medium italic">
              {isLogin ? "Savor the Moment" : "Begin your harvest"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group/field">
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="bg-white/30 border-white/50 focus:border-[#FFA500] focus:ring-[#FFA500]/20 placeholder:text-[#8B4513]/40 text-[#4A2C2A] h-14 rounded-2xl transition-all"
                  required
                />
              </div>
              <div className="relative group/field">
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="bg-white/30 border-white/50 focus:border-[#FFA500] focus:ring-[#FFA500]/20 placeholder:text-[#8B4513]/40 text-[#4A2C2A] h-14 rounded-2xl transition-all"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 bg-gradient-to-r from-[#FF7F50] to-[#FFA500] text-white font-bold uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                <span className="flex items-center gap-2">
                  {isLogin ? "Sign In" : "Join Nectar"}
                  <ArrowRight size={16} />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#8B4513]/10"></span>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-[#8B4513]/30">
              <span className="bg-transparent px-4">OR</span>
            </div>
          </div>

          <Button 
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full mt-8 h-14 border-white/60 bg-white/20 hover:bg-white/40 text-[#4A2C2A] font-bold uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            </svg>
            Google
          </Button>

          <div className="mt-10 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#8B4513]/40 hover:text-[#FF7F50] transition-colors"
            >
              {isLogin ? "New to the grove? Create Account" : "Back to the grove? Sign In"}
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-[10px] uppercase tracking-[0.5em] text-[#8B4513]/30 hover:text-[#8B4513]/60 transition-colors font-bold">
            ← Return to Olipop
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
