'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Send, Ruler, Users, Package, ArrowRight, Check } from 'lucide-react';

import Strength from '@/assets/samuel-girven-fqMu99l8sqo-unsplash.jpg';
const Machine = '/img/justin-fisher-cf_JUo9Ezdw-unsplash.jpg';
const LogoAMP = '/logo/AMPerformance_Favicon_verde.png'


// Form types
interface ProjectFormData {
  name: string;
  email: string;
  phone: string;
  squareMeters: string;
  gymStyle: string;
  budget: string;
  requirements: string;
}

export default function ProyectosPage() {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    email: '',
    phone: '',
    squareMeters: '',
    gymStyle: '',
    budget: '',
    requirements: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission - in production, this would call an API or Server Action
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-brutal-black">
      <Navbar />

      {/* A. HERO SECTION WITH FORM */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div style={{ backgroundImage: `url(${LogoAMP})` }} className="absolute inset-0 bg-cover bg-center grayscale opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-brutal-black via-brutal-black/90 to-brutal-black/70" />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-neon-green font-bold uppercase tracking-[0.3em] text-sm mb-4">
                Diseño Profesional
              </p>
              <h1 className="text-5xl md:text-7xl font-display uppercase tracking-tighter leading-none mb-6">
                Diseñamos tu <span className="text-neon-green">Santuario</span>
              </h1>
              <p className="text-xl text-white/70 max-w-lg mb-8">
                Transformamos tu visión en un espacio de entrenamiento de alto rendimiento.
                Consulta gratuita sin compromiso.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 text-white/60">
                  <Check className="text-neon-green" size={20} />
                  <span>Planos 3D</span>
                </div>
                <div className="flex items-center space-x-2 text-white/60">
                  <Check className="text-neon-green" size={20} />
                  <span>Asesoría Experta</span>
                </div>
                <div className="flex items-center space-x-2 text-white/60">
                  <Check className="text-neon-green" size={20} />
                  <span>Equipamiento Premium</span>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/5 border border-white/10 p-8"
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-neon-green rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="text-brutal-black" size={32} />
                  </div>
                  <h3 className="text-2xl font-display uppercase mb-4">¡Consulta Enviada!</h3>
                  <p className="text-white/60">
                    Nos contactaremos contigo en las próximas 24 horas.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-xl font-display uppercase tracking-widest mb-6">
                    Solicitar Cotización
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">
                        Nombre
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-neon-green focus:outline-none transition-colors"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-neon-green focus:outline-none transition-colors"
                        placeholder="Tu teléfono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-neon-green focus:outline-none transition-colors"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">
                        Metros Cuadrados
                      </label>
                      <input
                        type="text"
                        name="squareMeters"
                        value={formData.squareMeters}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-neon-green focus:outline-none transition-colors"
                        placeholder="ej. 100m²"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">
                        Estilo de Gimnasio
                      </label>
                      <select
                        name="gymStyle"
                        value={formData.gymStyle}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-neon-green focus:outline-none transition-colors"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="commercial">Gimnasio Comercial</option>
                        <option value="crossfit">Box CrossFit</option>
                        <option value="boutique">Gimnasio Boutique</option>
                        <option value="home">Home Gym</option>
                        <option value="personal">Estudio Personal</option>
                        <option value="institution">Institución/Club</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">
                      Presupuesto
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-neon-green focus:outline-none transition-colors"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="50k-150k">$50.000 - $150.000</option>
                      <option value="150k-500k">$150.000 - $500.000</option>
                      <option value="500k-1m">$500.000 - $1.000.000</option>
                      <option value="1m+">$1.000.000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">
                      Requisitos Especiales
                    </label>
                    <textarea
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-neon-green focus:outline-none transition-colors resize-none"
                      placeholder="Cuéntanos sobre tu proyecto..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full brutal-btn flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Enviando...</span>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Enviar Consulta</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* B. VALUE PROPOSITION CARDS */}
      <section className="py-24 bg-brutal-black">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-neon-green font-bold uppercase tracking-[0.3em] text-sm mb-4">
              ¿Qué incluye el servicio?
            </p>
            <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tighter">
              Todo lo que necesitás
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Ruler,
                title: 'Planos 3D',
                description: 'Visualizá tu espacio antes de construir. Planos arquitectónicos detallados con renderizados profesionales.'
              },
              {
                icon: Users,
                title: 'Asesoría Experta',
                description: 'Ingenieros y especialistas en equipamiento te guidan en cada decisión para optimizar tu inversión.'
              },
              {
                icon: Package,
                title: 'Equipamiento Premium',
                description: 'Acceso directo a marcas profesionales con garantía oficial y servicio técnico especializado.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group bg-white/5 border border-white/10 p-8 hover:border-white/30 transition-all"
              >
                <div className="w-16 h-16 bg-neon-green/10 flex items-center justify-center mb-6 group-hover:bg-neon-green/20 transition-colors">
                  <item.icon className="text-neon-green" size={32} />
                </div>
                <h3 className="text-xl font-display uppercase tracking-widest mb-4">
                  {item.title}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* C. METHODOLOGY SECTION */}
      <section className="py-24 bg-brutal-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-neon-green font-bold uppercase tracking-[0.3em] text-sm mb-4">
              Nuestro Proceso
            </p>
            <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tighter">
              Cómo Trabajamos
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Consulta', desc: 'Evaluamos tus necesidades y presupuesto' },
              { step: '02', title: 'Diseño', desc: 'Creamos planos 3D personalizados' },
              { step: '03', title: 'Cotización', desc: 'Te presentamos el presupuesto detallado' },
              { step: '04', title: 'Ejecución', desc: 'Instalación y puesta en marcha' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="text-8xl font-display text-white/5 absolute -top-4 -left-2">
                  {item.step}
                </div>
                <div className="relative pt-12">
                  <h3 className="text-xl font-display uppercase tracking-widest mb-3 text-neon-green">
                    {item.title}
                  </h3>
                  <p className="text-white/60">
                    {item.desc}
                  </p>
                </div>
                {index < 3 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-4 text-white/20" size={24} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* D. TARGET AUDIENCE SECTION */}
      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-neon-green font-bold uppercase tracking-[0.3em] text-sm mb-4">
              ¿Para quién es?
            </p>
            <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tighter">
              Dirigido a Emprendedores
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              'Gimnasios Comerciales',
              'Cadenas de Gimnasios',
              'Boxes CrossFit',
              'Gimnasios Boutique',
              'Home Gyms',
              'Estudios Personales',
              'Instituciones y Clubs',
              'Hoteles y Residencias'
            ].map((target, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="px-6 py-3 bg-white/5 border border-white/10 text-white/80 text-sm uppercase tracking-widest hover:bg-neon-green hover:text-brutal-black hover:border-neon-green transition-all cursor-default"
              >
                {target}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* E. BOTTOM CTA */}
      <section className="py-24 bg-brutal-black relative overflow-hidden">
        <div style={{ backgroundImage: `url(${Machine})` }} className="absolute inset-0 bg-cover bg-center grayscale opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-brutal-black via-brutal-black/80 to-brutal-black/60" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-display uppercase tracking-tighter mb-6">
              ¿Listo para construir tu <span className="text-neon-green">sueño</span>?
            </h2>
            <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
              No importa si empezás en tu garage o si pensás en grande.
              Te acompañamos en cada paso.
            </p>
            <a
              href="#contacto"
              className="brutal-btn inline-flex items-center space-x-2"
            >
              <span>Comenzar Mi Proyecto</span>
              <ArrowRight size={20} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="py-8 border-t border-white/10 bg-brutal-black">
        <div className="max-w-7xl mx-auto px-4 text-center text-white/40 text-sm">
          <p className="font-display uppercase tracking-widest">
            AM Performance © 2025
          </p>
        </div>
      </footer>
    </main>
  );
}
