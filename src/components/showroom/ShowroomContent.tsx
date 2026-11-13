import ShowroomHero from './ShowroomHero';
import ShowroomStatement from './ShowroomStatement';
import ShowroomGallery from './ShowroomGallery';
import ShowroomFeatures from './ShowroomFeatures';
import ShowroomInfo from './ShowroomInfo';

export default function ShowroomContent() {
  return (
    <section className="min-h-screen bg-brutal-black">
      <ShowroomHero />
      <ShowroomStatement />
      <ShowroomGallery />
      <ShowroomFeatures />
      <ShowroomInfo />
    </section>
  );
}