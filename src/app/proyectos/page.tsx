import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';

const ProyectosContent = dynamic(() => import('@/components/proyectos/ProyectosContent'));

export default function ProyectosPage() {
  return (
    <>
      <Navbar />
      <ProyectosContent />
    </>
  );
}
