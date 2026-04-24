
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
import { Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

// MODULAR IMPORTS
import { AuthBackground } from "@/components/auth/AuthBackground";
import { AuthFloatingLabels } from "@/components/auth/AuthFloatingLabels";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { AuthSocial } from "@/components/auth/AuthSocial";
import { AuthOverlayBoxes } from "@/components/auth/AuthOverlayBoxes";

export default function NectarAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center font-body selection:bg-orange-200 py-20">
      <AuthBackground />
      <AuthFloatingLabels />

      {/* Main Orchestrator Container */}
      <div className="relative z-20 w-full max-w-[420px] px-4 flex items-center justify-center min-h-[700px]">
        
        {/* OUTER BOX FRAME: Boundary marker */}
        <div className="absolute inset-0 border-2 border-white/5 rounded-[40px] pointer-events-none bg-white/5 backdrop-blur-[4px]" />

        {/* FULL SCALE LOGIN CARD (Removed scale-[0.6]) */}
        <div className="glass-card-nectar rounded-[24px] p-[32px_30px] animate-card-in relative w-full max-w-[360px] shadow-2xl overflow-hidden">
          
          {/* REFERENCE IMAGE OVERLAYS */}
          <AuthOverlayBoxes />

          <AuthLogo />

          <div className="text-center mb-4">
            <h2 className="font-headline font-extrabold text-[20px] text-[#3d1a5e] mb-1">
              {isLogin ? "Welcome Back!" : "Create Account"}
            </h2>
            <p className="text-[12px] text-[#5a2d6e]/55">
              {isLogin ? "Login to enjoy the freshest experience." : "Sign up and start your healthy journey."}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-3">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-[#3d1a5e] block">Full Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#7a5a9a]">👤</span>
                  <Input 
                    type="text" 
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
                  placeholder="youremail@example.com"
                  className="bg-[#fff8ee]/48 border-[rgba(255,255,255,0.48)] rounded-[12px] h-[40px] pl-10 focus:ring-0 focus:border-[#8040c0] text-[#3d1a5e] text-[13px]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-semibold text-[#3d1a5e] block">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#7a5a9a]">🔒</span>
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-[#7a5a9a] cursor-pointer z-10"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <Input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? "••••••••" : "Create Password"}
                  className="bg-[#fff8ee]/48 border-[rgba(255,255,255,0.48)] rounded-[12px] h-[40px] pl-10 pr-10 focus:ring-0 focus:border-[#8040c0] text-[#3d1a5e] text-[13px]"
                  required
                />
              </div>
            </div>

            {isLogin && (
              <div className="text-right -mt-2">
                <a className="text-[12px] text-[#8040c0] font-semibold hover:underline cursor-pointer">Forgot Password?</a>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-[45px] btn-green-gradient text-white font-semibold rounded-[50px] text-[15px] mt-2 active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                <span>{isLogin ? "Login" : "Sign Up"}</span>
              )}
            </button>
          </form>

          <AuthSocial onGoogle={handleGoogleSignIn} isLoading={isLoading} />

          <div className="text-center mt-4">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[12px] text-[#46236e]/58 font-medium hover:text-[#3d1a5e]"
            >
              {isLogin ? (
                <>Don't have an account? <span className="text-[#8040c0] font-bold ml-1">Sign Up</span></>
              ) : (
                <>Already have an account? <span className="text-[#8040c0] font-bold ml-1">Login</span></>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Back Navigation */}
      <div className="relative z-20 mt-12 text-center pb-12">
        <Link href="/" className="text-[10px] uppercase tracking-[0.5em] text-white/60 hover:text-white transition-all font-bold group inline-flex items-center gap-2">
          <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
          Back to Site
        </Link>
      </div>
    </div>
  );
}
