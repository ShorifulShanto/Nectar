
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  signOut 
} from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

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

  const resetState = () => {
    setIsVerificationSent(false);
    setIsLogin(true);
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
            <form onSubmit={handleAuth} className="space-y-6 pt-4">
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
              <div className="text-center pt-4">
                <button 
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white"
                >
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
