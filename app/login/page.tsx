import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "@/components/login-form";
import { ShieldCheck, Vote } from "lucide-react";

export default async function LoginPage() {
  if (await getSession()) redirect("/dashboard");
  return <main className="relative grid min-h-screen place-items-center overflow-hidden p-5">
    <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(56,189,248,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,.06)_1px,transparent_1px)] [background-size:38px_38px]" />
    <section className="glass relative w-full max-w-md rounded-[2rem] p-7 shadow-glow sm:p-10">
      <div className="mb-8 flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-700 shadow-lg shadow-cyan-500/20"><Vote size={32}/></div>
        <div><p className="text-xs font-bold tracking-[.2em] text-cyan-300">CAC · BIRZEIT</p><h1 className="mt-1 text-2xl font-extrabold">مكتب إدارة الانتخابات</h1></div>
      </div>
      <p className="mb-7 leading-7 text-slate-400">دخول منظّمي انتخابات تخصص الذكاء الاصطناعي — دفعة 125</p>
      <LoginForm />
      <div className="mt-7 flex items-start gap-3 rounded-2xl border border-sky-400/10 bg-sky-400/[.04] p-4 text-xs leading-6 text-slate-400"><ShieldCheck className="mt-0.5 shrink-0 text-cyan-400" size={18}/><span>نظام داخلي محمي لتسجيل استلام ورقة الاقتراع الورقية فقط. لا يتم تسجيل أي اختيار انتخابي إلكتروني.</span></div>
    </section>
  </main>;
}
