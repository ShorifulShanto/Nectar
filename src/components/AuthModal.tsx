
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth, useFirestore } from "@/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        // Central Hub Logging
        if (db) {
          const entryRef = doc(collection(db, "central_hub"));
          setDoc(entryRef, {
            id: entryRef.id,
            type: "signup",
            userId: userCred.user.uid,
            userEmail: email,
            timestamp: new Date().toISOString(),
            createdAt: serverTimestamp()
          });
        }
      }
      onClose();
      toast({ title: isLogin ? "Welcome back!" : "Account created successfully." });
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-white/10 text-white sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline tracking-widest text-center uppercase">
            {isLogin ? "Sign In" : "Join Ollanho"}
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
      </DialogContent>
    </Dialog>
  );
}
