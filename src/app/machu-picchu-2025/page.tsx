import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Machu Picchu 2025 | Chullos Tours',
  description: 'Todo Sobre Machu Picchu. Descubre el encanto de Machu Picchu en esta sección, donde cada artículo te guiará para explorar a fondo uno de los destinos más emblemáticos del Perú.',
};

export default function MachuPicchu2025Page() {
  return (
    <main className="min-h-screen bg-[#f7f7f7] text-[#1C1C1C] pb-20">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] md:h-[50vh] bg-[#6b0014] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Machu Picchu <span className="text-[#ffc000]">2025</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            Todo Sobre la Maravilla del Mundo
          </p>
        </div>
      </section>

      {/* Intro Description */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6 text-[#6b0014]">Descubre el encanto de Machu Picchu</h2>
        <p className="text-lg leading-relaxed text-gray-700">
          En esta sección, cada artículo te guiará para explorar a fondo uno de los destinos más emblemáticos del Perú. Desde consejos sobre las mejores fechas de viaje y opciones de transporte, hasta recomendaciones sobre alojamiento y rutas de trekking, aquí encontrarás todo lo necesario para planificar tu aventura. 
        </p>
        <p className="text-lg leading-relaxed mt-4 text-gray-700 font-medium">
          Con el respaldo y la experiencia de <span className="text-[#6b0014] font-bold">Chullos Tours</span>, prepárate para sumergirte en la historia, cultura y belleza natural de Machu Picchu, y vivir una experiencia única e inolvidable.
        </p>
      </section>

      {/* Articles Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#1C1C1C]">Guías y <span className="text-[#6b0014]">Consejos</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#f7f7f7] rounded-xl border-t-4 border-[#ffc000] shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-[#6b0014] mb-3">Mejores Fechas de Viaje</h3>
              <p className="text-gray-600 mb-4">Descubre cuál es la mejor temporada para visitar Machu Picchu, dependiendo del clima y la cantidad de turistas.</p>
              <Link href="#" className="text-[#6b0014] font-bold hover:text-[#ffc000] transition-colors">Leer más &rarr;</Link>
            </div>
            <div className="p-8 bg-[#f7f7f7] rounded-xl border-t-4 border-[#6b0014] shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-[#6b0014] mb-3">¿Cuánto Cuesta Viajar?</h3>
              <p className="text-gray-600 mb-4">Un desglose completo de presupuestos y costos para planificar tu viaje a la ciudadela inca sin sorpresas.</p>
              <Link href="#" className="text-[#6b0014] font-bold hover:text-[#ffc000] transition-colors">Leer más &rarr;</Link>
            </div>
            <div className="p-8 bg-[#f7f7f7] rounded-xl border-t-4 border-[#ffc000] shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-[#6b0014] mb-3">Guía de Viaje Actualizada</h3>
              <p className="text-gray-600 mb-4">Toda la información que necesitas sobre boletos, trenes y requisitos de ingreso actualizados para el 2025.</p>
              <Link href="#" className="text-[#6b0014] font-bold hover:text-[#ffc000] transition-colors">Leer más &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#1C1C1C]">Nuestros Paquetes <span className="text-[#ffc000]">Destacados</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Package 1 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 flex flex-col">
            <div className="h-64 bg-[#6b0014]/10 flex items-center justify-center relative">
              <span className="absolute top-4 left-4 bg-[#ffc000] text-[#1C1C1C] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Featured</span>
              <span className="text-[#6b0014] font-bold text-xl opacity-30">Tren Observatory</span>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-[#1C1C1C]">Machu Picchu Full Day con Tren Observatory</h3>
                <div className="text-right">
                  <p className="text-sm text-gray-500 line-through">$530</p>
                  <p className="text-xl font-bold text-[#6b0014]">$470</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6 flex-1">
                Vive la magia de Machu Picchu Full Day, un tour en tren desde Cusco que te llevará a descubrir la legendaria ciudadela inca con un guía experto. ¡Reserva ahora y disfruta de una experiencia inolvidable!
              </p>
              <Link href="/tours" className="inline-block text-center w-full bg-[#6b0014] text-white font-bold py-3 rounded-lg hover:bg-[#ffc000] hover:text-[#1C1C1C] transition-colors">
                Explorar Tour
              </Link>
            </div>
          </div>

          {/* Package 2 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 flex flex-col">
            <div className="h-64 bg-[#6b0014]/10 flex items-center justify-center relative">
              <span className="absolute top-4 left-4 bg-[#ffc000] text-[#1C1C1C] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Featured</span>
              <span className="text-[#6b0014] font-bold text-xl opacity-30">Tren Vistadome</span>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-[#1C1C1C]">Machupicchu Full Day con Tren Vistadome</h3>
                <div className="text-right">
                  <p className="text-sm text-gray-500 line-through">$435</p>
                  <p className="text-xl font-bold text-[#6b0014]">$390</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6 flex-1">
                Disfruta de vistas panorámicas incomparables durante tu viaje a Machu Picchu. Este tour completo incluye transporte, guía profesional y una experiencia inmersiva en la maravilla del mundo.
              </p>
              <Link href="/tours" className="inline-block text-center w-full bg-[#6b0014] text-white font-bold py-3 rounded-lg hover:bg-[#ffc000] hover:text-[#1C1C1C] transition-colors">
                Explorar Tour
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#ffc000] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#1C1C1C] mb-6">¿Listo para planificar tu viaje a Machu Picchu?</h2>
          <p className="text-[#1C1C1C]/80 mb-8 text-lg">
            Contáctanos hoy mismo y uno de nuestros expertos te ayudará a organizar el itinerario perfecto.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/51992558512" target="_blank" rel="noreferrer" className="bg-[#6b0014] text-white font-bold px-8 py-3 rounded-full hover:bg-[#1C1C1C] transition-colors">
              Chat por WhatsApp
            </a>
            <Link href="/contacto-chullos" className="bg-white text-[#1C1C1C] font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors">
              Página de Contacto
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
