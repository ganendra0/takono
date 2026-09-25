export function cleanQuiz(quiz:any) {
 if(!quiz)return null;
 return {title:quiz.title,questions:(quiz.questions||[]).map((q:any)=>({id:String(q.id),question:q.question,options:q.options.map((o:any)=>({id:String(o.id),text:o.text})),correctOptionId:String(q.correctOptionId),explanation:q.explanation,points:Number(q.points)}))};
}
export const roleLabels:Record<string,string>={traveler:'Traveler',destination_manager:'Pengelola',government:'Pemerintah',super_admin:'Admin'};
export const statusLabels:Record<string,string>={draft:'Draft',published:'Tayang',active:'Aktif',inactive:'Nonaktif',upcoming:'Akan datang',completed:'Selesai',expired:'Kedaluwarsa',out_of_stock:'Habis'};
