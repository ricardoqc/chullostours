import React from "react";
import type { Metadata } from "next";
import { FileText, AlertCircle, Info, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Chullos Tours - Agencia de Viajes en Cusco",
  description:
    "Conoce los términos y condiciones de los servicios de Chullos Tours: reservas, pagos, cancelaciones, modificaciones y responsabilidades. Viajando con Chullo S.A.C.",
};

const sections = [
  {
    title: "Manejo de Información del Cliente",
    icon: <ShieldCheck className="w-5 h-5 text-[#6b0014]" />,
    content:
      "Para proceder con la reserva, le solicitaremos información personal, la cual será utilizada de manera estrictamente confidencial. Los detalles del cliente incluyen: nombre completo, edad, nacionalidad, número de celular, número de pasaporte, información de vuelos internacionales y nacionales, condición médica (imprescindible para realizar tours de aventura).",
  },
  {
    title: "Reservaciones",
    icon: <FileText className="w-5 h-5 text-[#6b0014]" />,
    content:
      "Para confirmar la reserva de nuestros servicios, deberá efectuar un pago inicial del 30% del precio total. Para los tours a Machu Picchu es necesario hacer la reserva con el 50% del precio del servicio. Los pagos pueden realizarse mediante PAYPAL, depósitos, transferencias bancarias o aplicativos de BCP, INTERBANK, YAPE, OPLIN, IZIPAY. Algunas modalidades de pago generan comisiones, las cuales serán asumidas por el cliente. El pago del saldo pendiente deberá efectuarse de forma presencial y antes del inicio de las actividades programadas en Cusco.",
  },
  {
    title: "Tarifas",
    icon: <Info className="w-5 h-5 text-[#6b0014]" />,
    content:
      "Las tarifas de nuestros programas están sujetas a modificaciones de acuerdo a la tendencia de divisas en el mercado. Los precios no incluyen impuestos de ley para turistas nacionales. En el caso de turistas extranjeros se aplicará la ley N° 919 de acuerdo a las normas que rigen en el país. Para grupos mayores a 4 personas aplica la tarifa con descuento especial vigente todo el año, incluido fechas especiales.",
  },
  {
    title: "Itinerario",
    icon: <FileText className="w-5 h-5 text-[#6b0014]" />,
    content:
      "Las actividades programadas en los diferentes itinerarios pueden tener modificaciones debido a factores externos que no competen a la empresa. La agencia de viajes considerará tomar dichas acciones cuando sea necesario primar la seguridad de nuestros turistas ante casos fortuitos como: problemas sociales, acciones gubernamentales, condiciones climáticas, desastres naturales, epidemias, pandemias o cualquier otro factor que impida el libre desarrollo de actividades. La agencia de viajes no tiene ninguna responsabilidad por dichos acontecimientos.",
  },
  {
    title: "Modificaciones",
    icon: <AlertCircle className="w-5 h-5 text-[#6b0014]" />,
    content:
      "Las modificaciones de fecha solicitadas por el cliente tendrán una penalidad del 5% del precio total. Las modificaciones correspondientes a Machu Picchu no son factibles por ningún motivo, así como las modificaciones antes de las 48 horas de cualquier otro tour. Con respecto a la modificación en hoteles, el cliente está sujeto a las políticas del establecimiento hotelero.",
  },
  {
    title: "Cancelaciones y Anulaciones",
    icon: <AlertCircle className="w-5 h-5 text-[#6b0014]" />,
    content:
      "Toda cancelación o anulación de servicio solicitado por el cliente tendrá una penalidad por gastos administrativos del 25% del precio total de los servicios contratados, exceptuados los tours correspondientes a Machu Picchu que están sujetas a una penalidad del 50%. Los reembolsos se efectuarán dentro de los 30 días útiles luego de recibir la solicitud del cliente. Las cancelaciones de servicios de hoteles están sujetas a términos y condiciones del establecimiento hotelero.",
  },
  {
    title: "NO SHOW",
    icon: <AlertCircle className="w-5 h-5 text-[#6b0014]" />,
    content:
      "En caso de no presentarse al tour, no se hará ningún reembolso, considerándose éste un NO SHOW. Los clientes son responsables de llevar siempre consigo su documentación personal, portar su tarjeta de migraciones y su pasaporte válido y visado. Debe tener en cuenta la protección de sus pertenencias personales durante el uso de transportes internacionales y nacionales. Le recomendamos contar con un seguro de viajes antes de salir de su país.",
  },
  {
    title: "Responsabilidades de la Empresa",
    icon: <ShieldCheck className="w-5 h-5 text-[#6b0014]" />,
    content:
      "Viajando con Chullos Tours está obligado a cumplir con el 100% de los servicios contratados por el cliente. En casos imprevistos si los servicios no llegaran a cumplirse y esta responsabilidad sea atribuible a la empresa, el cliente está en la obligación de exigir el reembolso total por los servicios no prestados. En tales casos, la agencia de viajes se compromete a buscar las mejores alternativas de solución y brindar todas las facilidades para reparar los daños ocasionados.",
  },
];

export default function TermsPage() {
  return (
    <div className="flex flex-col gap-0 pb-16 bg-white">
      {/* Header */}
      <div className="bg-[#6b0014] py-16 px-4 text-center text-white">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-3">
          <span className="text-[#ffc000] text-xs font-bold uppercase tracking-widest">
            VIAJANDO CON CHULLO S.A.C. · RUC: 20611401648
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white">
            Términos y Condiciones
          </h1>
          <p className="text-white/80 text-sm max-w-xl leading-relaxed">
            Al realizar un pago de reserva, acepta los presentes términos y condiciones.
            Por favor léelos cuidadosamente antes de contratar nuestros servicios.
          </p>
        </div>
      </div>

      {/* Alert */}
      <div className="bg-[#ffc000]/10 border-l-4 border-[#ffc000] px-6 py-4 max-w-4xl mx-auto w-full mt-10 rounded-r-2xl">
        <p className="text-sm text-[#1c1c1c] font-semibold">
          ⚠️ Importante: Las tarifas promocionales están sujetas a términos y condiciones de temporada.
          Los precios en Machu Picchu están sujetos a disponibilidad del Estado Peruano.
        </p>
      </div>

      {/* Sections */}
      <div className="max-w-4xl mx-auto px-4 w-full flex flex-col gap-6 mt-10">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="bg-[#f7f7f7] border border-gray-100 rounded-3xl p-6 flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#6b0014]/10 rounded-2xl flex items-center justify-center shrink-0">
                {section.icon}
              </div>
              <h2 className="font-bold text-[#1c1c1c] text-base md:text-lg">
                {idx + 1}. {section.title}
              </h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed pl-12">
              {section.content}
            </p>
          </div>
        ))}

        {/* Consent note */}
        <div className="bg-[#6b0014] text-white rounded-3xl p-6 mt-2">
          <h3 className="font-bold text-base mb-2">Consentimiento y Aceptación</h3>
          <p className="text-sm text-white/85 leading-relaxed">
            Al realizar el pago de la reserva, acepta los términos y condiciones presentes en este documento.
            Otorga su consentimiento libre y expreso para el tratamiento de sus datos personales,
            lo que implica el recojo y la utilización de estos con la única finalidad de actualizarlos en
            nuestra base de datos y para fines de los servicios contratados. A su vez acepta haber sido
            informado y asesorado sobre la exposición que conlleva realizar actividades turísticas
            en sus diferentes modalidades.
          </p>
          <p className="text-xs text-white/60 mt-3">
            © 2025 Viajando con Chullos · Centro Comercial San Andrés 218, of. 14, Cusco, Perú
          </p>
        </div>
      </div>
    </div>
  );
}
