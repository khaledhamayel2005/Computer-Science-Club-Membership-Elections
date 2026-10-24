export function normalizeStudentId(value: string) {
  return value.trim().replace(/[\s-]+/g, "").replace(/[٠-٩]/g, d => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).toUpperCase();
}
export function validateStudent(studentName: string, studentId: string) {
  const name=studentName.trim(), normalizedStudentId=normalizeStudentId(studentId);
  if(name.length<3||name.length>120) throw new Error("اسم الطالب مطلوب ويجب أن يكون صحيحًا");
  if(!/^[A-Z0-9]{4,30}$/.test(normalizedStudentId)) throw new Error("الرقم الجامعي غير صالح");
  return {studentName:name,studentId:studentId.trim(),normalizedStudentId};
}
export function participantDocumentId(electionId:string,normalizedStudentId:string){return `${electionId}__${normalizedStudentId}`}
