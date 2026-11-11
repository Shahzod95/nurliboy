import { connection } from "next/server";
import { isQueueEnabled } from "@/lib/config";
import QueueForm from "./QueueForm";
import IssueForm from "./IssueForm";

// QR kod shu sahifaga olib boradi.
// Eski navbat o'chiq bo'lsa (default) — xizmatlardagi muammolar formasi ko'rsatiladi.
export default async function RegisterPage() {
  // Sozlama build paytida emas, har so'rovda o'qilsin
  await connection();
  return isQueueEnabled() ? <QueueForm /> : <IssueForm />;
}
