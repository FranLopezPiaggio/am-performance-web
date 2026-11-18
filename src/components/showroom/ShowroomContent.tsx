import ShowroomHero from './ShowroomHero';
import ShowroomSpace from './ShowroomSpace';
import ShowroomGallery from './ShowroomGallery';
import ShowroomInfo from './ShowroomInfo';

export default function ShowroomContent() {
  return (
    <section className="min-h-screen bg-brutal-black">
      <ShowroomHero />
      <ShowroomSpace />
      <ShowroomGallery />
      <ShowroomInfo />
    </section>
  );
}
