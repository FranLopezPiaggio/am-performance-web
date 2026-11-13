import { CONTACT } from '@/lib/constants/contact';

export default function ShowroomMap() {
  return (
    <div className="relative aspect-video border border-white/10 brutal-shadow overflow-hidden bg-brutal-black">
      <iframe
        src={CONTACT.mapsEmbedUrl}
        title="Ubicación del showroom de AM Performance"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full grayscale"
        style={{ border: 0 }}
      />
    </div>
  );
}
