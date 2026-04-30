import { LoginForm } from "@/modules/auth";

/**
 * Halaman Login (Route Page).
 * Sebagai 'Thin Page', file ini hanya bertugas memanggil komponen LoginForm dari modul auth.
 */
export default function LoginPage() {
  return <LoginForm />;
}
