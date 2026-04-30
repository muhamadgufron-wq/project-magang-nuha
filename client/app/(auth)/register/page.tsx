import { RegisterForm } from "@/modules/auth";

/**
 * Halaman Register (Route Page).
 * Sebagai 'Thin Page', file ini hanya bertugas memanggil komponen RegisterForm dari modul auth.
 */
export default function RegisterPage() {
  return <RegisterForm />;
}
