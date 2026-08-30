import {NextResponse} from "next/server";
import {studentInquirySchema} from "@/lib/schemas";

const SUPABASE_URL=process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY=process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY=process.env.RESEND_API_KEY;
const LEAD_NOTIFICATION_EMAIL=process.env.LEAD_NOTIFICATION_EMAIL;
const RESEND_FROM_EMAIL=process.env.RESEND_FROM_EMAIL || "NOOR Classes <onboarding@resend.dev>";

function escapeHtml(value:unknown){return String(value??"").replace(/[&<>'"]/g,(ch)=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[ch]||ch));}

async function saveInquiry(reference:string,inquiry:Record<string,unknown>){
  if(!SUPABASE_URL||!SUPABASE_SERVICE_ROLE_KEY) throw new Error("Storage is not configured");
  const response=await fetch(`${SUPABASE_URL}/rest/v1/inquiries`,{
    method:"POST",
    headers:{
      apikey:SUPABASE_SERVICE_ROLE_KEY,
      Authorization:`Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type":"application/json",
      Prefer:"return=minimal"
    },
    body:JSON.stringify({reference,...inquiry})
  });
  if(!response.ok) throw new Error(`Storage failed: ${response.status}`);
}

async function sendLeadEmail(reference:string,inquiry:Record<string,any>){
  if(!RESEND_API_KEY||!LEAD_NOTIFICATION_EMAIL) return {sent:false,reason:"Email not configured"};
  const response=await fetch("https://api.resend.com/emails",{
    method:"POST",
    headers:{Authorization:`Bearer ${RESEND_API_KEY}`,"Content-Type":"application/json"},
    body:JSON.stringify({
      from:RESEND_FROM_EMAIL,
      to:[LEAD_NOTIFICATION_EMAIL],
      subject:`New NOOR Classes inquiry • ${inquiry.studentName} • Class ${inquiry.grade}`,
      html:`<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111"><h2>New NOOR Classes Lead</h2><p><strong>Reference:</strong> ${escapeHtml(reference)}</p><p><strong>Student:</strong> ${escapeHtml(inquiry.studentName)}<br/><strong>Class:</strong> ${escapeHtml(inquiry.grade)}<br/><strong>Board:</strong> ${escapeHtml(inquiry.board)}<br/><strong>Mode:</strong> ${escapeHtml(inquiry.mode)}<br/><strong>Subjects:</strong> ${escapeHtml((inquiry.subjects||[]).join(", "))}<br/><strong>Goals:</strong> ${escapeHtml((inquiry.goals||[]).join(", "))}</p><p><strong>Location:</strong> ${escapeHtml([inquiry.address,inquiry.sector,inquiry.city,inquiry.country].filter(Boolean).join(", "))}<br/><strong>Schedule:</strong> ${escapeHtml(inquiry.frequency)} • ${escapeHtml(inquiry.preferredTime)}<br/><strong>Timezone:</strong> ${escapeHtml(inquiry.timezone)}</p><p><strong>Parent:</strong> ${escapeHtml(inquiry.parentName)}<br/><strong>WhatsApp:</strong> ${escapeHtml(inquiry.whatsapp)}<br/><strong>Phone:</strong> ${escapeHtml(inquiry.phone)}<br/><strong>Email:</strong> ${escapeHtml(inquiry.email)}</p><p><strong>School:</strong> ${escapeHtml(inquiry.school)}<br/><strong>Current score:</strong> ${escapeHtml(inquiry.currentScore)}<br/><strong>Target score:</strong> ${escapeHtml(inquiry.targetScore)}</p></div>`
    })
  });
  if(!response.ok) throw new Error(`Email failed: ${response.status}`);
  return {sent:true};
}

export async function POST(request:Request){
  try{
    const body=await request.json();
    const result=studentInquirySchema.safeParse(body);
    if(!result.success) return NextResponse.json({success:false,errors:result.error.flatten()},{status:400});

    const reference=`NOOR-${Date.now().toString().slice(-8)}`;
    const inquiry=result.data;

    // Storage is mandatory: never show success if the lead was not saved.
    await saveInquiry(reference,inquiry);

    let emailSent=false;
    try{const emailResult=await sendLeadEmail(reference,inquiry);emailSent=emailResult.sent;}catch(error){console.error("NOOR lead email notification failed",error);}

    return NextResponse.json({success:true,reference,emailSent});
  }catch(error){
    console.error("NOOR inquiry processing failed",error);
    return NextResponse.json({success:false,message:"Unable to save inquiry. Please call or WhatsApp us directly."},{status:500});
  }
}
