import { Metadata } from 'next';
import Link from 'next/link';
import { Award, Leaf, HeartHandshake, Map, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Acerca de Chullos Tours | Agencia de Viajes en Cusco, Perú',
  description: 'Una Agencia de Viajes Disruptiva - En Chullos Tours nos dedicamos a diseñar experiencias únicas que te conecten con la cultura, la historia y los paisajes impresionantes de Perú.',
};

const PILLARS = [
  {
    title: 'Profesionalismo Garantizado',
    description: 'Un equipo experto asegura que cada experiencia sea inolvidable y de la más alta calidad.',
    icon: Award,
    color: 'from-amber-400 to-amber-600',
  },
  {
    title: 'Turismo Responsable',
    description: 'Comprometidos con el cuidado del medio ambiente y el apoyo a todas las comunidades locales dependientes.',
    icon: Leaf,
    color: 'from-green-500 to-emerald-700',
  },
  {
    title: 'Atención Personalizada',
    description: 'Cada detalle cuenta. Creamos viajes adaptados a las necesidades y expectativas de nuestros clientes.',
    icon: HeartHandshake,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'Cultura y Tradición',
    description: 'Explora lo mejor de la cultura peruana, manteniendo vivas sus raíces a través de experiencias únicas.',
    icon: Map,
    color: 'from-[#6b0014] to-rose-900',
  },
];

const TIMELINE = [
  { year: '2020', title: 'Fundación', desc: 'Nace Chullos Tours con la misión de ofrecer experiencias auténticas en Perú, destacando su rica cultura, historia y paisajes. Desde el inicio, la empresa se enfocó en brindar servicios personalizados y de alta calidad.', image: '/tours/city-tour-cusco/01.jpg' },
  { year: '2020', title: 'Adaptación', desc: 'La pandemia global trajo grandes retos. Implementamos estrictos protocolos de bioseguridad y mantuvimos la conexión con nuestros viajeros promoviendo la planificación de futuros viajes a través de contenido virtual.', image: '/tours/laguna-humantay-tour-cusco/01.jpg' },
  { year: '2021', title: 'Reactivación', desc: 'Con el retorno del turismo, priorizamos el mercado nacional y reforzamos nuestro compromiso con el turismo sostenible, estableciendo nuevas estrategias para apoyar a las comunidades locales.', image: '/tours/machupicchu-full-day-con-tren-vistadome/01.jpg' },
  { year: '2023', title: 'Innovación', desc: 'Un año de innovación tecnológica. Lanzamos una nueva plataforma web para facilitar reservas y adoptamos herramientas digitales para mejorar la gestión y comunicación con nuestros clientes.', image: '/tours/montana-colores-vinicunca-tour/01.jpg' },
  { year: '2023', title: 'Crecimiento', desc: 'Expandimos nuestros servicios hacia destinos como Puno y Arequipa. Formamos alianzas estratégicas locales y diversificamos nuestros paquetes para familias, grupos y aventureros.', image: '/tours/tour-lago-titicaca-2-dias/01.jpg' },
  { year: '2024', title: 'Reconocimiento', desc: 'Atrajimos a más viajeros internacionales mediante una sólida estrategia digital y presencia en ferias de turismo, consolidando nuestra reputación como una agencia altamente confiable.', image: '/tours/valle-sagrado-vip-tour-cusco/01.jpg' },
  { year: '2025', title: 'Proyección', desc: 'Trabajamos en el diseño de nuevos paquetes exclusivos y personalizados. Buscamos consolidarnos como líderes en Perú, fortaleciendo nuestra presencia digital con prácticas sostenibles.', image: '/img/familia-background_v4.png' },
];

const BULLET_POINTS = [
  "Autenticidad en experiencias",
  "Compromiso con la calidad",
  "Atención personalizada constante",
  "Respeto por la cultura",
  "Turismo sostenible responsable",
  "Equipo altamente profesional",
  "Conexión con la naturaleza",
];

export default function AcercaDePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 mt-6 mb-12">
        <div className="relative w-full min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden rounded-[2rem] shadow-xl">
          {/* Background Base */}
          <div className="absolute inset-0 bg-[url('/tours/camino-inca-2-dias/01.jpg')] bg-cover bg-center" />
          
          {/* Decorational Elements */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/90 via-[#6b0014]/60 to-transparent z-10" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#ffc000] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
          
          <div className="relative z-20 text-center px-4 max-w-3xl mx-auto flex flex-col items-center py-16">
            <span className="text-[#ffc000] font-bold tracking-widest uppercase text-sm mb-4">Sobre Nosotros</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 font-title tracking-tight leading-tight">
              Una Agencia de Viajes <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffc000] to-amber-200">Disruptiva</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 font-light max-w-2xl leading-relaxed">
              Diseñamos experiencias únicas que te conectan con la cultura, la historia y los paisajes impresionantes del Perú.
            </p>
          </div>
        </div>
      </section>

      {/* Intro & Stats Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            {/* Abstract images composition placeholder */}
            <div className="grid grid-cols-2 gap-4">
              <div className="h-64 rounded-3xl bg-slate-200 overflow-hidden shadow-lg transform translate-y-8">
                <img src="/tours/tour-machu-picchu-2-dias/01.jpg" alt="Machu Picchu" className="w-full h-full object-cover" />
              </div>
              <div className="h-64 rounded-3xl bg-slate-200 overflow-hidden shadow-lg">
                <img src="/tours/city-tour-cusco/06.jpg" alt="Cultura viva" className="w-full h-full object-cover" />
              </div>
            </div>
            
            {/* Floating Stats Card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white flex gap-8 whitespace-nowrap">
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-black text-[#6b0014]">5</p>
                <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Años de<br/>Experiencia</p>
              </div>
              <div className="w-px bg-slate-200"></div>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-black text-[#6b0014]">1,200+</p>
                <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Viajes<br/>Felices</p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex flex-col gap-6">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-title leading-tight">
              Descubre los tesoros de Perú de manera <span className="text-[#6b0014]">auténtica y responsable</span>
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg font-light">
              Nuestro compromiso es ofrecerte servicios de calidad con atención personalizada, asegurándonos de que cada detalle de tu viaje sea inolvidable. Con años de experiencia en el sector turístico, somos especialistas en crear itinerarios que combinan <strong>aventura, cultura y comodidad.</strong>
            </p>
            <p className="text-slate-600 leading-relaxed text-lg font-light">
              Desde las majestuosas ruinas de Machu Picchu hasta los coloridos paisajes del Valle Sagrado, te acompañamos en cada paso.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mt-4">
              {BULLET_POINTS.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#34E0A1] shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="bg-white py-20 md:py-28 relative overflow-hidden">
        {/* Light theme background with subtle texture */}
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #e2e8f0 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#6b0014] font-bold tracking-widest uppercase text-sm mb-4 block">Nuestro ADN</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-title">Nuestros Pilares Fundamentales</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="bg-slate-50 border border-slate-200 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group shadow-sm hover:shadow-xl">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 font-title">{pillar.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-5xl mx-auto px-4 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[#6b0014] font-bold tracking-widest uppercase text-sm mb-4 block">Road Map</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-title">Nuestra Historia</h2>
          <p className="text-slate-600 mt-4">El camino que hemos recorrido para convertirnos en los expertos de tu próxima aventura.</p>
        </div>

        <div className="relative max-w-5xl mx-auto ml-4 md:ml-8 border-l-4 border-slate-200">
          
          <div className="space-y-12">
          {TIMELINE.map((item, idx) => {
            return (
              <div key={idx} className="relative flex flex-col items-start w-full pb-6">
                {/* Year Marker */}
                <div className="absolute left-[-15px] w-6 h-6 rounded-full bg-white border-4 border-[#ffc000] z-10 shadow-md flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#6b0014]" />
                </div>
                
                {/* Content Card */}
                <div className="w-full pl-8 md:pl-12">
                  <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-slate-100 relative group flex flex-col gap-3 items-start w-full">
                    <div className="text-[#ffc000] font-black text-5xl opacity-20 absolute top-4 right-4 group-hover:scale-110 transition-transform">
                      {item.year}
                    </div>
                    <span className="inline-block px-3 py-1 bg-[#6b0014]/10 text-[#6b0014] text-xs font-black rounded-full w-max">
                      {item.year}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 font-title">{item.title}</h3>
                    
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light relative z-10 max-w-4xl">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-[#ffc000] to-amber-500 rounded-3xl p-10 md:p-14 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-6 font-title relative z-10">
            ¿Listo para escribir la historia de tu próximo viaje?
          </h2>
          <Link href="/tours" className="inline-block bg-slate-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-slate-800 transition-colors relative z-10 shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200">
            Explorar Nuestros Tours
          </Link>
        </div>
      </section>
    </main>
  );
}
