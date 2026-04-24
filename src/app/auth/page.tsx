
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
  User,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AuthSocial } from "@/components/auth/AuthSocial";

export default function NectarAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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
      
      if (isLogin) {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        await syncUserToFirestore(userCred.user);
        toast({ title: "Welcome back to NECTAR" });
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(userCred.user, { displayName: name });
        }
        await syncUserToFirestore(userCred.user);
        toast({ title: "Welcome to NECTAR" });
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
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 sm:p-10 font-body">
      <div className="relative w-full max-w-[1100px] aspect-[16/10] bg-primary/10 border-[12px] border-primary/5 shadow-2xl rounded-[3rem] overflow-hidden flex">
        
        <div className="hidden lg:flex flex-1 bg-black relative overflow-hidden items-center justify-center rounded-[2.2rem]">
          <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
            <div className="w-[80%] aspect-square border-[40px] border-primary/20 rounded-full flex items-center justify-center">
              <div className="w-[60%] aspect-square border-[40px] border-primary/20 rounded-full" />
            </div>
          </div>
          <div className="relative z-10 text-center">
            <h1 className="text-primary font-headline font-black text-6xl tracking-[0.2em] opacity-30 hover:opacity-100 transition-opacity duration-500 hover:[text-shadow:0_0_20px_#7AE2CF]">NECTAR</h1>
          </div>
        </div>

        <div className="flex-1 bg-black flex flex-col items-center justify-center p-8 md:p-16 relative">
          <div className="w-full max-w-[340px] space-y-8">
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/40 font-bold mb-2">Welcome to Nectar</p>
              <h2 className="text-4xl font-headline font-black text-primary uppercase tracking-tight hover:[text-shadow:0_0_15px_#7AE2CF] transition-all">
                {isLogin ? "Login" : "Sign Up"}
              </h2>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Full Name</label>
                  <Input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="h-12 bg-white/5 border-none rounded-xl text-white px-4 focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Email Address</label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="h-12 bg-white/5 border-none rounded-xl text-white px-4 focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Password</label>
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 bg-white/5 border-none rounded-xl text-white px-4 focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-primary text-black font-bold rounded-xl text-sm uppercase tracking-widest hover:bg-[#7AE2CF] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(29,205,159,0.2)]"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <span>{isLogin ? "Sign In" : "Create Account"}</span>}
              </button>
            </form>

            <div className="relative flex items-center gap-4">
              <div className="flex-1 h-[1px] bg-white/10" />
              <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">or</span>
              <div className="flex-1 h-[1px] bg-white/10" />
            </div>

            <AuthSocial onGoogle={handleGoogleSignIn} isLoading={isLoading} />

            <div className="text-center pt-4">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-[11px] font-bold text-white/40 hover:text-primary transition-colors uppercase tracking-widest hover:[text-shadow:0_0_10px_#7AE2CF]"
              >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Link href="/" className="fixed bottom-8 text-[10px] uppercase tracking-[0.5em] text-white/40 hover:text-primary transition-all font-bold flex items-center gap-2 z-50">
        <ArrowRight size={14} className="rotate-180" /> Back to Selection
      </Link>
    </div>
  );
}
