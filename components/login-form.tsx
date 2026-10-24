"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LockKeyhole, UserRound } from "lucide-react";
export default function LoginForm() {
  const router = useRouter(); const [loading,setLoading]=useState(false); const [error,setError]=useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setLoading(true); setError("");
    const form=new FormData(e.currentTarget); const res=await fetch("/api/auth/login",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(Object.fromEntries(form))});
    const data=await res.json(); setLoading(false); if(!res.ok) return setError(data.error); router.replace("/dashboard"); router.refresh();
  }
  return <form onSubmit={submit} className="space-y-4">
    <label className="block"><span className="mb-2 block text-sm font-bold text-slate-300">اسم المستخدم</span><div className="relative"><UserRound className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={19}/><input name="username" required autoFocus autoComplete="username" className="field pr-12" /></div></label>
    <label className="block"><span className="mb-2 block text-sm font-bold text-slate-300">كلمة المرور</span><div className="relative"><LockKeyhole className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={19}/><input name="password" type="password" required autoComplete="current-password" className="field pr-12" /></div></label>
    {error && <p role="alert" className="rounded-xl border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
    <button disabled={loading} className="btn-primary w-full">{loading?<Loader2 className="animate-spin"/>:<LockKeyhole size={19}/>} دخول آمن</button>
  </form>;
}
