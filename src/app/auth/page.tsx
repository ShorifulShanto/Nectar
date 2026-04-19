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
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center font-body bg-[#f83a7c] selection:bg-orange-200">
      {/* Vibrant Blurred Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Warm Liquid Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f83a7c] via-[#ff7c5c] to-[#ffba42] animate-pulse duration-[10s]" />
        
        {/* Animated Ambient Blobs */}
        <div className="absolute top-[-10%] left-[-5%] w-[120%] h-[120%] rounded-full bg-[#ffcd3c] blur-[180px] opacity-40 animate-slow-float" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[100%] h-[100%] rounded-full bg-[#f83a7c] blur-[150px] opacity-30 animate-slow-float-reverse" />
        
        {/* Sparkles Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Sparkles className="absolute top-[20%] left-[10%] text-white animate-pulse" size={40} />
          <Sparkles className="absolute bottom-[30%] right-[15%] text-white animate-pulse delay-700" size={30} />
          <Sparkles className="absolute top-[60%] right-[25%] text-white animate-pulse delay-1000" size={20} />
        </div>

        {/* Decorative Floating Fruits (Simulated with Blur Effects) */}
        <div className="absolute top-[10%] left-[15%] w-32 h-32 bg-orange-400/20 blur-2xl rounded-full" />
        <div className="absolute bottom-[20%] left-[20%] w-48 h-48 bg-yellow-300/10 blur-3xl rounded-full" />
        <div className="absolute top-[30%] right-[10%] w-40 h-40 bg-pink-400/20 blur-2xl rounded-full" />
      </div>

      {/* Main Glassmorphism Auth Card */}
      <div className="relative z-10 w-full max-w-[480px] px-6 animate-in fade-in zoom-in duration-700">
        <div className="glass-card rounded-[3.5rem] p-10 md:p-14 relative overflow-hidden transition-all duration-700 group border-white/40">
          
          {/* Internal Glows */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          
          <div className="text-center space-y-3 mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg border border-white/20">
                <span className="text-3xl">🧃</span>
              </div>
            </div>
            <h1 className="text-4xl font-headline font-bold tracking-[0.2em] uppercase text-white drop-shadow-md">
              NECTAR
            </h1>
            <h2 className="text-xl font-headline font-bold text-white/90">
              {isLogin ? "Welcome Back!" : "Create Account"}
            </h2>
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/60 font-bold">
              {isLogin ? "Login to enjoy the freshest experience" : "Sign up and start your healthy journey"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-4">
              {!isLogin && (
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" size={18} />
                  <Input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="bg-white/10 border-white/10 rounded-2xl h-14 pl-12 focus:bg-white/20 focus:ring-0 focus:border-white placeholder:text-white/30 text-white text-base transition-all"
                    required
                  />
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" size={18} />
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="bg-white/10 border-white/10 rounded-2xl h-14 pl-12 focus:bg-white/20 focus:ring-0 focus:border-white placeholder:text-white/30 text-white text-base transition-all"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" size={18} />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors z-10"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <Input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? "Password" : "Create Password"}
                  className="bg-white/10 border-white/10 rounded-2xl h-14 pl-12 pr-12 focus:bg-white/20 focus:ring-0 focus:border-white placeholder:text-white/30 text-white text-base transition-all"
                  required
                />
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <button type="button" className="text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-colors font-bold">
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            <div className="pt-4">
               <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 btn-green-gradient text-white font-bold uppercase tracking-[0.2em] text-[11px] rounded-full transition-all duration-300 active:scale-95"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                  <span>{isLogin ? "Login" : "Sign Up"}</span>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-10 relative flex items-center justify-center">
            <div className="absolute w-full border-t border-white/10" />
            <span className="relative bg-transparent px-4 text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">or continue with</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <Button 
              onClick={handleGoogleSignIn}
              variant="outline"
              className="h-14 border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-[0.1em] text-[10px] rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>
            <Button 
              variant="outline"
              className="h-14 border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-[0.1em] text-[10px] rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2.04c-5.5 0-10 4.5-10 10 0 4.97 3.64 9.09 8.44 9.84v-6.96h-2.53v-2.88h2.53v-2.2c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.19 2.23.19v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.77l-.44 2.88h-2.33v6.96c4.8-.75 8.44-4.87 8.44-9.84 0-5.5-4.5-10-10-10z" />
              </svg>
              Facebook
            </Button>
          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/60 hover:text-white transition-all group"
            >
              {isLogin ? (
                <>Don't have an account? <span className="text-white">Sign Up</span></>
              ) : (
                <>Already have an account? <span className="text-white">Login</span></>
              )}
            </button>
          </div>
        </div>
        
        {/* Mirror Reflection */}
        <div className="reflection-soft -mt-8 mx-auto w-[90%] glass-card rounded-[3.5rem] h-64" />

        <div className="mt-10 text-center">
          <Link href="/" className="text-[10px] uppercase tracking-[0.6em] text-white/40 hover:text-white transition-all font-bold group inline-flex items-center gap-2">
            <ArrowRight size={12} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
            Return to the Grove
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slow-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 40px) scale(0.9); }
        }
        @keyframes slow-float-reverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 30px) scale(0.9); }
          66% { transform: translate(30px, -20px) scale(1.1); }
        }
        .animate-slow-float {
          animation: slow-float 25s ease-in-out infinite;
        }
        .animate-slow-float-reverse {
          animation: slow-float-reverse 30s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
