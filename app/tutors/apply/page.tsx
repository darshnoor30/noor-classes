import Link from "next/link";
import {ArrowLeft, GraduationCap, Phone} from "lucide-react";

export default function TutorApply() {
  return (
    <main className="min-h-screen bg-[#071021] px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/70">
          <ArrowLeft size={16} aria-hidden="true"/> Back to NOOR Classes
        </Link>
        <section className="mt-16 rounded-3xl border border-[#F4D03F]/20 bg-[#F4D03F]/5 p-8 md:p-12">
          <GraduationCap size={44} className="text-[#F4D03F]" aria-hidden="true"/>
          <p className="mt-6 text-sm tracking-widest text-[#F4D03F]">TUTOR RECRUITMENT</p>
          <h1 className="mt-4 text-4xl font-semibold md:text-5xl">Teach with NOOR Classes.</h1>
          <p className="mt-6 text-lg leading-8 text-white/75">
            Online tutor applications are not open yet. To discuss teaching opportunities,
            please call our team for the current application process.
          </p>
          <p className="mt-4 leading-7 text-white/65">
            This page does not collect or submit an application. Please keep identity
            documents private until the team explains its verification process.
          </p>
          <a href="tel:+918264126698" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#F4D03F] px-6 py-3 font-medium text-[#071021]">
            <Phone size={18} aria-hidden="true"/> Call +91 82641 26698
          </a>
        </section>
      </div>
    </main>
  );
}
