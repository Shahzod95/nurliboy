import { redirect } from "next/navigation";

// Asosiy sahifa — QR kod /register ga olib boradi,
// bosh sahifaga kirganlar ham o'sha yerga yo'naltiriladi
export default function Home() {
  redirect("/register");
}
