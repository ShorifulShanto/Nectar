
"use client";

import { useState } from "react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Search, ArrowLeft } from "lucide-react";
import { useMemoFirebase } from "@/firebase/provider";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [search, setSearch] = useState("");
  const db = useFirestore();
  const { toast } = useToast();

  const hubQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "central_hub");
  }, [db]);

  const { data: entries, isLoading } = useCollection(hubQuery);

  const filteredEntries = entries?.filter((entry) => 
    entry.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
    entry.type?.toLowerCase().includes(search.toLowerCase()) ||
    entry.id?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, "central_hub", id));
      toast({ title: "Entry deleted" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Delete failed", description: e.message });
    }
  };

  const handleEdit = async (id: string, currentType: string) => {
    if (!db) return;
    const newType = prompt("Update Entry Type:", currentType);
    if (newType && newType !== currentType) {
      try {
        await updateDoc(doc(db, "central_hub", id), { type: newType });
        toast({ title: "Entry updated" });
      } catch (e: any) {
        toast({ variant: "destructive", title: "Update failed", description: e.message });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40 hover:text-white mb-4 transition-colors">
              <ArrowLeft size={12} /> Back to Site
            </Link>
            <h1 className="text-4xl font-headline font-bold tracking-tight uppercase">Central Hub</h1>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] mt-2">Admin Data Management</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <Input 
              placeholder="SEARCH ENTRIES..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-neutral-900 border-white/5 pl-10 h-11 text-[10px] tracking-widest uppercase focus:ring-white/10"
            />
          </div>
        </div>

        <div className="bg-neutral-950 border border-white/5 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-900/50 border-b border-white/5">
                  <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-white/40">ID</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Type</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-white/40">User Email</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Timestamp</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-white/40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-white/20 uppercase tracking-[0.5em] text-[10px]">Loading Data Hub...</td>
                  </tr>
                ) : filteredEntries && filteredEntries.length > 0 ? (
                  filteredEntries.map((entry, i) => (
                    <tr key={entry.id} className={`${i % 2 === 0 ? 'bg-black/20' : 'bg-transparent'} hover:bg-white/5 transition-colors group`}>
                      <td className="p-4 font-mono text-[9px] text-white/30">{entry.id.slice(0, 8)}...</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                          entry.type === 'signup' ? 'bg-blue-500/10 text-blue-400' :
                          entry.type === 'cart_addition' ? 'bg-green-500/10 text-green-400' :
                          'bg-neutral-800 text-white/60'
                        }`}>
                          {entry.type}
                        </span>
                      </td>
                      <td className="p-4 text-[10px] font-medium text-white/80">{entry.userEmail || 'ANONYMOUS'}</td>
                      <td className="p-4 text-[10px] text-white/40">
                        {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 'N/A'}
                      </td>
                      <td className="p-4 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-white/40 hover:text-white"
                          onClick={() => handleEdit(entry.id, entry.type)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-white/40 hover:text-destructive"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-white/20 uppercase tracking-widest text-[10px]">No records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
