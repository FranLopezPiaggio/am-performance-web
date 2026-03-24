import { Suspense } from 'react';
import LoginFormContent from './LoginFormContent';

// Este componente ahora es un "shell" estático
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brutal-black flex items-center justify-center text-white">Cargando formulario...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}