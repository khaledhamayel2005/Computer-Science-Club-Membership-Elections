import { Component, StrictMode, type ErrorInfo, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
class ErrorBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true}}
  componentDidCatch(error:Error,info:ErrorInfo){console.error("CAC application error",error,info)}
  render(){return this.state.failed?<main dir="rtl" className="grid min-h-screen place-items-center p-5"><section className="glass max-w-lg rounded-3xl p-8 text-center"><h1 className="text-2xl font-extrabold">تعذر تشغيل النظام</h1><p className="mt-3 leading-7 text-slate-400">حدث خطأ غير متوقع. يرجى تحديث الصفحة، وإن استمر الخطأ تواصل مع مسؤول النظام.</p></section></main>:this.props.children}
}
createRoot(document.getElementById("root")!).render(<StrictMode><ErrorBoundary><App/></ErrorBoundary></StrictMode>);
