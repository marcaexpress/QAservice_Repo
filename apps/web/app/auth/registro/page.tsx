import { RegisterForm } from '@/components/auth/RegisterForm';
import { AuthLayout } from '@/components/auth/AuthLayout';

export default function RegistroPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
