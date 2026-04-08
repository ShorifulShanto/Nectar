
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, Github } from "lucide-react";

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        if (!userCred.user.emailVerified) {
          await sendEmailVerification(userCred.user);
          await signOut(auth);
          setIsVerificationSent(true);
          return;
        }
        onClose();
        toast({ title: "Welcome back!" });
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCred.user);
        await signOut(auth);
        setIsVerificationSent(true);
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

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onClose();
      toast({ title: "Welcome to Olipop!" });
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
    setIsVerificationSent(false);
    setIsLogin(true);
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
      <DialogContent className="bg-black border-white/10 text-white sm:max-w-[400px]">
        {isVerificationSent ? (
          <div className="py-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <Mail className="text-white/60" size={32} />
              </div>
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline tracking-widest text-center uppercase">
                Verify Email
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 px-4">
              <p className="text-[12px] text-white/40 uppercase tracking-widest leading-relaxed">
                We have sent you a verification email to <span className="text-white">{email}</span>. 
                Verify it and log in.
              </p>
              <Button 
                onClick={resetState}
                className="w-full bg-white text-black hover:bg-neutral-200 uppercase tracking-widest font-bold h-14 rounded-full mt-4"
              >
                Go to Login
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline tracking-widest text-center uppercase">
                {isLogin ? "Sign In" : "Join Olipop"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              <form onSubmit={handleAuth} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40">Email Address</label>
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-neutral-900 border-white/5 focus:ring-white/20 text-white h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40">Secure Password</label>
                  <Input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-neutral-900 border-white/5 focus:ring-white/20 text-white h-12"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-white text-black hover:bg-neutral-200 uppercase tracking-widest font-bold h-14 rounded-full"
                >
                  {isLoading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/5"></span>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                  <span className="bg-black px-4 text-white/20">Or continue with</span>
                </div>
              </div>

              <Button 
                onClick={handleGoogleSignIn}
                variant="outline"
                disabled={isLoading}
                className="w-full border-white/10 hover:bg-white/5 uppercase tracking-widest font-bold h-14 rounded-full flex gap-3"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>

              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white"
                >
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
