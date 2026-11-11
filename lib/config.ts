// Eski navbat tizimi vaqtincha o'chirilgan.
// Qayta yoqish uchun .env faylga QUEUE_ENABLED=true qo'shing va serverni qayta ishga tushiring.
export function isQueueEnabled(): boolean {
  return process.env.QUEUE_ENABLED === "true";
}
