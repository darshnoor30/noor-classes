export const BOARDS = ["CBSE", "ICSE / ISC", "IB", "Cambridge", "State Board"] as const;
export const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);
const primary = ["All Core Subjects","Mathematics","Science / EVS","English","Hindi","Computer / Coding","Foundation Maths & Science"];
const senior = ["Mathematics","Physics","Chemistry","Biology","Computer Science / IP","Accountancy","Economics","English"];
export function getSubjects(board: string, grade: number) {
  if (board === "IB") {
    if (grade <= 5) return ["PYP Integrated Learning","Mathematics","English","Science","Coding"];
    if (grade <= 10) return ["MYP Mathematics","Physics","Chemistry","Biology","English","Individuals & Societies","Computer Science"];
    return ["Mathematics AA","Mathematics AI","Physics","Chemistry","Biology","Economics","English","Computer Science","IA / EE Support"];
  }
  if (board === "Cambridge") {
    if (grade <= 8) return primary;
    return ["IGCSE / A-Level Mathematics","Physics","Chemistry","Biology","Computer Science","Economics","Business Studies","English"];
  }
  return grade <= 8 ? primary : senior;
}
