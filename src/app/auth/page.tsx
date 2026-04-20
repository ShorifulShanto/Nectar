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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center font-body bg-[linear-gradient(145deg,#a04838_0%,#ba4f72_45%,#c87040_100%)] selection:bg-orange-200">
      
      {/* BG FRUITS */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-70">
        <div className="absolute top-[5%] left-[2%] text-[62px] fruit-emoji animate-float" style={{ animationDelay: '0s' }}>🍍</div>
        <div className="absolute top-[55%] left-[1%] text-[70px] fruit-emoji animate-float" style={{ animationDelay: '1s' }}>🍉</div>
        <div className="absolute top-[78%] left-[5%] text-[58px] fruit-emoji animate-float" style={{ animationDelay: '2s' }}>🍌</div>
        <div className="absolute top-[28%] left-[1%] text-[46px] fruit-emoji animate-float" style={{ animationDelay: '0.5s' }}>🍓</div>
        <div className="absolute top-[2%] right-[4%] text-[65px] fruit-emoji animate-float" style={{ animationDelay: '1.5s' }}>🍒</div>
        <div className="absolute top-[38%] right-[1%] text-[68px] fruit-emoji animate-float" style={{ animationDelay: '2.5s' }}>🍊</div>
        <div className="absolute top-[72%] right-[2%] text-[58px] fruit-emoji animate-float" style={{ animationDelay: '0.8s' }}>🍇</div>
        <div className="absolute top-[15%] right-[7%] text-[48px] fruit-emoji animate-float" style={{ animationDelay: '3s' }}>🍋</div>
      </div>

      {/* FLOAT LABELS */}
      <div className="fixed top-[9%] left-[2%] z-10 hidden lg:block font-bold text-[13px] text-white/75 drop-shadow-lg animate-float" style={{ animationDelay: '0.3s' }}>
        Fresh Login<span className="block text-[16px]">↙</span>
      </div>
      <div className="fixed top-[52%] left-[0%] z-10 hidden lg:block font-bold text-[13px] text-white/75 drop-shadow-lg animate-float" style={{ animationDelay: '1.2s' }}>
        Juicy Deals<span className="block text-[16px]">↓</span>
      </div>
      <div className="fixed top-[85%] left-[2%] z-10 hidden lg:block font-bold text-[13px] text-white/75 drop-shadow-lg animate-float" style={{ animationDelay: '2.1s' }}>
        Smooth Experience<span className="block text-[16px]">↗</span>
      </div>
      <div className="fixed top-[3%] right-[12%] z-10 hidden lg:block font-bold text-[13px] text-white/75 drop-shadow-lg animate-float" style={{ animationDelay: '0.7s' }}>
        Quick Access<span className="block text-[16px]">↙</span>
      </div>
      <div className="fixed top-[40%] right-[0%] z-10 hidden lg:block font-bold text-[13px] text-white/75 drop-shadow-lg animate-float" style={{ animationDelay: '1.8s' }}>
        Healthy Choice<span className="block text-[16px]">↙</span>
      </div>

      {/* Main Container */}
      <div className="relative z-20 w-full max-w-[360px] px-6">
        <div className="glass-card-nectar rounded-[24px] p-[32px_30px] animate-card-in">
          
          <div className="text-center mb-4">
            <span className="text-[40px] block drop-shadow-md mb-1">{isLogin ? "🍊" : "🥤"}</span>
            <div className="font-headline font-black text-[30px] leading-none tracking-[3px] bg-gradient-to-br from-[#7030b0] to-[#a03070] bg-clip-text text-transparent">
              NECTAR
            </div>
            <p className="text-[11px] tracking-[1.8px] text-[#7a5a9a] mt-1 font-medium">
              Fresh Fruit Juice
            </p>
          </div>

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
                  👁️
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
              className="w-full h-[45px] btn-nectar-grad text-white font-semibold rounded-[50px] text-[15px] mt-2 active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                <span>{isLogin ? "Login" : "Sign Up"}</span>
              )}
            </button>
          </form>

          {isLogin && (
            <>
              <div className="flex items-center gap-2 my-4 text-[#5a2d6e]/45">
                <div className="flex-1 h-[1px] bg-[rgba(110,50,140,0.18)]" />
                <span className="text-[11px] whitespace-nowrap">or continue with</span>
                <div className="flex-1 h-[1px] bg-[rgba(110,50,140,0.18)]" />
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
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

        {/* Back Navigation */}
        <div className="mt-12 text-center">
          <Link href="/" className="text-[10px] uppercase tracking-[0.5em] text-white/60 hover:text-white transition-all font-bold group inline-flex items-center gap-2">
            <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
            Back to Site
          </Link>
        </div>
      </div>
    </div>
  );
}
