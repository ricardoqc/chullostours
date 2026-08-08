import React from "react";
import type { Metadata } from "next";
import { ShieldCheck, Eye, Lock, UserCheck, Cookie, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Políticas de Privacidad | Chullos Tours - Agencia de Viajes en Cusco",
  description:
    "Políticas de privacidad y protección de datos personales de Chullos Tours (Viajando con Chullo S.A.C.). Conoce cómo utilizamos tu información.",
};

const sections = [
  {
    title: "Protección de Datos Personales",
    icon: <ShieldCheck className="w-5 h-5 text-[#6b0014]" />,
    content:
      "En Chullos Tours (Viajando con Chullo S.A.C.) nos comprometemos a proteger la privacidad y seguridad de los datos personales suministrados por nuestros usuarios durante el proceso de reserva y consulta de nuestros servicios turísticos. La información recolectada es tratada con estricta confidencialidad.",
  },
  {
    title: "Datos que Recolectamos",
    icon: <Eye className="w-5 h-5 text-[#6b0014]" />,
    content:
      "La información personal recolectada incluye: nombre completo, edad, nacionalidad, número de celular/WhatsApp, número de pasaporte o DNI, correo electrónico, información de vuelos internacionales y nacionales, y condición médica (imprescindible para tours de aventura). Esta información se solicita únicamente al momento de confirmar una reserva.",
  },
  {
    title: "Uso de la Información",
    icon: <UserCheck className="w-5 h-5 text-[#6b0014]" />,
    content:
      "La información personal recolectada se utiliza exclusivamente para: la gestión de boletos de ingreso a Machu Picchu y sitios arqueológicos, emisión de pasajes de tren (Inca Rail / Peru Rail), reservas de tours y actividades, comunicación de confirmaciones y vouchers de reserva, y actualización de nuestra base de datos de clientes. Nunca compartimos tus datos con terceros con fines comerciales.",
  },
  {
    title: "Seguridad de Pagos",
    icon: <Lock className="w-5 h-5 text-[#6b0014]" />,
    content:
      "Todas las transacciones electrónicas son procesadas bajo protocolos de encriptación SSL de 256 bits. Chullos Tours no almacena datos de tarjetas de crédito o débito. Los pagos se procesan a través de plataformas seguras: PayPal, BCP, INTERBANK, YAPE, OPLIN e IZIPAY. Cada transacción genera un comprobante o voucher digital.",
  },
  {
    title: "Cookies y Tecnologías de Rastreo",
    icon: <Cookie className="w-5 h-5 text-[#6b0014]" />,
    content:
      "Nuestro sitio web utiliza cookies para mejorar la experiencia del usuario, analizar el tráfico del sitio mediante Google Analytics 4 (GA4) y personalizar el contenido mostrado. Puedes configurar tu navegador para rechazar cookies, aunque esto puede afectar algunas funcionalidades del sitio. El uso de Google Site Kit nos permite monitorear el rendimiento del sitio de manera anónima.",
  },
  {
    title: "Tus Derechos",
    icon: <UserCheck className="w-5 h-5 text-[#6b0014]" />,
    content:
      "De acuerdo con la legislación peruana de protección de datos personales (Ley N° 29733), tienes derecho a: acceder a tus datos personales, solicitar la rectificación de información incorrecta, solicitar la cancelación o supresión de tus datos, y oponerte al tratamiento de tu información. Para ejercer estos derechos, contáctanos a través de reservas@chullostours.com.",
  },
  {
    title: "Contacto para Privacidad",
    icon: <Mail className="w-5 h-5 text-[#6b0014]" />,
    content:
      "Si tienes preguntas sobre esta política de privacidad o el manejo de tus datos personales, puedes contactarnos en: reservas@chullostours.com | WhatsApp: +51 992 558 512 | Dirección: Centro Comercial San Andrés 218, oficina 14, Cusco, Perú.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col gap-0 pb-16 bg-white">
      {/* Header */}
      <div className="bg-[#6b0014] py-16 px-4 text-center text-white">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-3">
          <span className="text-[#ffc000] text-xs font-bold uppercase tracking-widest">
            VIAJANDO CON CHULLO S.A.C. · RUC: 20611401648
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white">
            Políticas de Privacidad
          </h1>
          <p className="text-white/80 text-sm max-w-xl leading-relaxed">
            Tu privacidad es importante para nosotros. Conoce cómo recopilamos,
            usamos y protegemos tu información personal.
          </p>
        </div>
      </div>

      {/* Last updated */}
      <div className="max-w-4xl mx-auto w-full px-4 mt-8">
        <p className="text-xs text-gray-400">
          Última actualización: enero de 2025 · Ley N° 29733 – Protección de Datos Personales (Perú)
        </p>
      </div>

      {/* Sections */}
      <div className="max-w-4xl mx-auto px-4 w-full flex flex-col gap-6 mt-6">
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

        {/* Footer note */}
        <div className="bg-[#6b0014] text-white rounded-3xl p-6 mt-2">
          <h3 className="font-bold text-base mb-2">Modificaciones a esta Política</h3>
          <p className="text-sm text-white/85 leading-relaxed">
            Chullos Tours se reserva el derecho de modificar esta política de privacidad en cualquier momento.
            Las modificaciones serán publicadas en esta página con la fecha de actualización correspondiente.
            El uso continuado de nuestros servicios después de cualquier cambio constituye tu aceptación
            de los nuevos términos.
          </p>
          <p className="text-xs text-white/60 mt-3">
            © 2025 Viajando con Chullos · Centro Comercial San Andrés 218, of. 14, Cusco, Perú
          </p>
        </div>
      </div>
    </div>
  );
}
