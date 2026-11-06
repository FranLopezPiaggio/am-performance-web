import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ShowroomContent from '@/components/showroom/ShowroomContent';

export const metadata: Metadata = {
  title: 'Showroom | AM Performance',
  description: 'Visitá nuestro showroom: conocé en persona las máquinas y el equipamiento para gimnasios de nuestro catálogo, sus materiales y su calidad.',
};

export default function ShowroomPage() {
  return (
    <>
      <Navbar />
      <ShowroomContent />
      <Footer />
    </>
  );
}