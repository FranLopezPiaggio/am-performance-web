const items = ['Envíos a todo el país', 'Garantía Oficial', 'Pagos Seguros', 'Soporte 24/7'];

export default function TrustBar() {
  return (
    <section className="bg-white text-brutal-black py-[17.5px] mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
        {items.map((title) => (
          <h4 key={title} className="font-bold uppercase tracking-widest text-xs">
            {title}
          </h4>
        ))}
      </div>
    </section>
  );
}
