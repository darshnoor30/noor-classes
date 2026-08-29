import { z } from "zod";
export const studentInquirySchema = z.object({
  mode: z.enum(["home","online"]), studentName: z.string().min(2), grade: z.coerce.number().min(1).max(12), board: z.string().min(1), school: z.string().optional(), currentScore: z.string().optional(), targetScore: z.string().optional(), subjects: z.array(z.string()).min(1), goals: z.array(z.string()).min(1), address: z.string().optional(), sector: z.string().optional(), city: z.string().min(1), country: z.string().optional(), timezone: z.string().optional(), frequency: z.string().min(1), preferredTime: z.string().min(1), parentName: z.string().min(2), whatsapp: z.string().min(10), phone: z.string().min(10), email: z.string().email()
});
export type StudentInquiry = z.infer<typeof studentInquirySchema>;
