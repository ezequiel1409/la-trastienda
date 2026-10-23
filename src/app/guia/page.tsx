import Link from "next/link";
import {
  BookOpen,
  Store,
  Upload,
  CreditCard,
  PackageCheck,
  QrCode,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Copy,
  MessageCircle,
} from "lucide-react";

export default function GuiaUsoPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      {/* HEADER DE LA GUÍA */}
      <div className="text-center space-y-3 border-b border-stone-200 pb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-stone-100 border border-stone-200 px-3 py-1 rounded-full uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Manual de Uso Oficial</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-950 tracking-tight">
          Cómo usar y vender con tu tienda online
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto">
          Guía paso a paso para administrar tu catálogo, configurar tus medios de cobro y empezar a recibir pedidos desde hoy mismo.
        </p>
      </div>

      {/* ÍNDICE RÁPIDO */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
          En esta guía aprenderás:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm font-semibold text-stone-700">
          <a href="#capitulo-1" className="hover:text-stone-950 hover:underline">
            1. Primer ingreso a tu Panel de Control
          </a>
          <a href="#capitulo-2" className="hover:text-stone-950 hover:underline">
            2. Cargar tu primer producto con variantes y stock
          </a>
          <a href="#capitulo-3" className="hover:text-stone-950 hover:underline">
            3. Configurar tus formas de cobro (CBU y Mercado Pago)
          </a>
          <a href="#capitulo-4" className="hover:text-stone-950 hover:underline">
            4. Vender por Instagram y WhatsApp
          </a>
          <a href="#capitulo-5" className="hover:text-stone-950 hover:underline">
            5. Gestión de pedidos y despachos
          </a>
          <a href="#capitulo-6" className="hover:text-stone-950 hover:underline">
            6. Cartel con código QR para tu local físico
          </a>
        </div>
      </div>

      {/* CAPÍTULO 1 */}
      <section id="capitulo-1" className="space-y-4 pt-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-stone-900 text-white font-bold flex items-center justify-center text-sm">
            1
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            Primer ingreso a tu Panel de Control
          </h2>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-xs text-sm text-stone-600 leading-relaxed">
          <p>
            Al finalizar la creación de tu tienda, se te entrega un enlace privado exclusivo para vos. Siempre tiene el formato:
          </p>
          <div className="bg-stone-100 p-3 rounded-xl font-mono text-xs text-stone-800">
            https://tu-tienda.workers.dev/admin
          </div>
          <ul className="space-y-2 list-disc list-inside">
            <li>
              <strong>Usuario:</strong> El correo electrónico que ingresaste en el formulario.
            </li>
            <li>
              <strong>Contraseña:</strong> La clave que elegiste o la contraseña automática que se te mostró en la pantalla de éxito.
            </li>
          </ul>
          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>Recomendación de seguridad:</strong> Guardá esa dirección web en los favoritos de tu navegador en tu celular o computadora para entrar rápido a revisar tus ventas.
            </span>
          </div>
        </div>
      </section>

      {/* CAPÍTULO 2 */}
      <section id="capitulo-2" className="space-y-4 pt-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-stone-900 text-white font-bold flex items-center justify-center text-sm">
            2
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            Cargar tu primer producto con variantes y stock
          </h2>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-xs text-sm text-stone-600 leading-relaxed">
          <p>
            Tu tienda cuenta con un sistema profesional de variantes para evitar sobreventas:
          </p>
          <ol className="space-y-3 list-decimal list-inside">
            <li>
              Andá a la pestaña <strong>Productos</strong> y hacé clic en <strong>+ Nuevo Producto</strong>.
            </li>
            <li>
              Ingresá el <strong>Nombre de la prenda/artículo</strong> y el <strong>Precio</strong>.
            </li>
            <li>
              <strong>Variantes de Color:</strong> Creá los colores disponibles (ej. <em>Negro, Blanco, Beige</em>) y cargá las fotos correspondientes a cada color. Cuando el cliente hace clic en un color, la foto cambia automáticamente.
            </li>
            <li>
              <strong>Talles y Stock:</strong> Para cada color, indicá qué talles tenés en stock (ej: <em>S: 3 unidades, M: 2 unidades, L: 0 unidades</em>).
            </li>
            <li>
              Hacé clic en <strong>Guardar</strong>. El producto ya aparece visible en tu catálogo.
            </li>
          </ol>
        </div>
      </section>

      {/* CAPÍTULO 3 */}
      <section id="capitulo-3" className="space-y-4 pt-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-stone-900 text-white font-bold flex items-center justify-center text-sm">
            3
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            Configurar tus formas de cobro (CBU y Mercado Pago)
          </h2>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-xs text-sm text-stone-600 leading-relaxed">
          <p>
            La Trastienda te permite cobrar sin comisiones intermediarias. Toda la plata va directo a tu cuenta:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-stone-200 p-4 rounded-xl space-y-2">
              <h4 className="font-bold text-stone-900">Transferencia Bancaria</h4>
              <p className="text-xs">
                En <strong>Configuración &gt; Medios de Pago</strong>, ingresá tu Alias, CBU/CVU y titular de cuenta. Podés configurar un <strong>descuento automático (ej: 10% OFF)</strong> para incentivar a que te paguen por transferencia.
              </p>
            </div>

            <div className="border border-stone-200 p-4 rounded-xl space-y-2">
              <h4 className="font-bold text-stone-900">Mercado Pago / Tarjetas</h4>
              <p className="text-xs">
                Si tenés cuenta en Mercado Pago o Payway, pegás tu Access Token de cobranza en el casillero correspondiente. Tus clientes podrán pagar en cuotas y con tarjetas de débito/crédito.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CAPÍTULO 4 */}
      <section id="capitulo-4" className="space-y-4 pt-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-stone-900 text-white font-bold flex items-center justify-center text-sm">
            4
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            Vender por Instagram y WhatsApp
          </h2>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-xs text-sm text-stone-600 leading-relaxed">
          <p>
            Para que tu tienda empiece a traccionar clientes inmediatamente:
          </p>
          <div className="space-y-3">
            <div className="bg-stone-50 p-4 rounded-xl space-y-2">
              <p className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                1. En tu perfil de Instagram / TikTok:
              </p>
              <p className="text-xs">
                Andá a <em>Editar perfil &gt; Enlaces</em> y pegá la URL de tu tienda. En tu descripción agregá una llamada a la acción: <em>&ldquo;Hacé tu pedido directo en nuestra tienda online 🛍️👇&rdquo;</em>.
              </p>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl space-y-2">
              <p className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                2. Plantilla para responder por WhatsApp:
              </p>
              <p className="text-xs italic bg-white p-3 rounded-lg border border-stone-200 text-stone-800">
                &ldquo;¡Hola! Podés ver todos los modelos disponibles, talles y abonar con descuento acá: [link-de-tu-tienda]. ¡Cualquier duda te respondo por acá!&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CAPÍTULO 5 */}
      <section id="capitulo-5" className="space-y-4 pt-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-stone-900 text-white font-bold flex items-center justify-center text-sm">
            5
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            Gestión de pedidos y despachos
          </h2>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-xs text-sm text-stone-600 leading-relaxed">
          <p>
            Cada vez que un cliente confirma una compra:
          </p>
          <ul className="space-y-2 list-disc list-inside">
            <li>
              Te llega una notificación a tu WhatsApp o correo con el resumen de la orden, los artículos y los datos del cliente.
            </li>
            <li>
              En la pestaña <strong>Órdenes</strong> podés verificar el comprobante de transferencia bancaria adjunto.
            </li>
            <li>
              Haciendo clic en <strong>Confirmar Pago</strong>, la prenda se descuenta definitivamente del inventario y se emite el aviso de despacho al comprador.
            </li>
          </ul>
        </div>
      </section>

      {/* CAPÍTULO 6 */}
      <section id="capitulo-6" className="space-y-4 pt-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-stone-900 text-white font-bold flex items-center justify-center text-sm">
            6
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            Cartel con código QR para tu mostrador físico
          </h2>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-xs text-sm text-stone-600 leading-relaxed">
          <p>
            Si tenés un local a la calle, showroom o participás en ferias, descargá tu cartel imprimible con QR desde el panel. Tus clientes pueden escanearlo con la cámara del celular para ver todo tu catálogo sin esperar a ser atendidos.
          </p>
        </div>
      </section>

      {/* CTA DE AYUDA O CREAR TIENDA */}
      <div className="bg-stone-900 text-white rounded-3xl p-8 text-center space-y-4 shadow-md">
        <h3 className="text-2xl font-bold tracking-tight">
          ¿Todavía no creaste tu tienda online?
        </h3>
        <p className="text-stone-400 text-sm max-w-md mx-auto">
          Comenzá con 14 días de prueba gratis. Tu tienda queda activa en 2 minutos sin tarjeta de crédito.
        </p>
        <Link
          href="/nuevo"
          className="inline-flex items-center gap-2 bg-white text-stone-950 hover:bg-stone-100 font-bold text-sm px-6 py-3 rounded-xl transition"
        >
          <span>Crear mi tienda ahora</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
