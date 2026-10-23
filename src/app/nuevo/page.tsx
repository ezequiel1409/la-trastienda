"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Store, ArrowRight, ArrowLeft, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";

function WizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    rubro: "MODA_INDUMENTARIA",
    whatsappNumber: "",
    adminEmail: "",
    adminPassword: "",
    enabledPaymentGateways: ["TRANSFER", "MERCADOPAGO", "CASH"],
    bankName: "",
    cbu: "",
    alias: "",
  });

  // Prellenar si viene query param desde el hero
  useEffect(() => {
    const initialName = searchParams.get("name");
    if (initialName) {
      handleNameChange(initialName);
    }
  }, [searchParams]);

  const handleNameChange = (name: string) => {
    const autoSlug = name
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setFormData((prev) => ({
      ...prev,
      name,
      slug: autoSlug,
    }));
  };

  const togglePayment = (key: string) => {
    setFormData((prev) => {
      const exists = prev.enabledPaymentGateways.includes(key);
      const updated = exists
        ? prev.enabledPaymentGateways.filter((g) => g !== key)
        : [...prev.enabledPaymentGateways, key];
      return { ...prev, enabledPaymentGateways: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ocurrió un error al crear la tienda.");
      }

      router.push(`/status/${data.jobId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {/* HEADER WIZARD */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center justify-center w-11 h-11 bg-stone-100 text-stone-800 rounded-xl mb-1 shadow-xs">
          <Store className="w-5 h-5" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Crear Tienda Online
        </h1>
        <p className="text-sm text-stone-600">
          Completá los datos iniciales para aprovisionar tu plataforma de ecommerce con 14 días gratis.
        </p>

        {/* INDICADOR DE PASOS */}
        <div className="flex items-center justify-center gap-2 pt-3">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step ? "w-8 bg-stone-900" : s < step ? "w-4 bg-stone-700" : "w-4 bg-stone-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* FORMULARIO */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PASO 1: DATOS DE LA TIENDA */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
                Paso 1: Identificación del comercio
              </h2>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">
                  Nombre comercial
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Tienda Martinez"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">
                  Dirección web inicial (subdominio)
                </label>
                <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-stone-900 bg-stone-50">
                  <input
                    type="text"
                    required
                    placeholder="tienda-martinez"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white focus:outline-none font-mono text-sm"
                  />
                  <span className="px-3 text-xs text-stone-500 font-mono select-none">
                    .workers.dev
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Podrás conectar un dominio personalizado propio (.com o .com.ar) posteriormente.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">
                  Rubro principal
                </label>
                <select
                  value={formData.rubro}
                  onChange={(e) => setFormData({ ...formData, rubro: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white font-medium text-sm"
                >
                  <option value="MODA_INDUMENTARIA">👗 Indumentaria y Moda (Variantes por Talle y Color)</option>
                  <option value="CALZADO">👟 Calzado y Zapatos (Curva de Talles)</option>
                  <option value="FERRETERIA">🔩 Ferretería y Artículos del Hogar</option>
                  <option value="ALMACEN_KIOSCO">🛒 Almacén, Kiosco y Alimentos</option>
                  <option value="DECO_HOGAR">🛋️ Muebles y Decoración</option>
                  <option value="GENERAL">📦 Catálogo General</option>
                </select>
                <p className="text-xs text-stone-500 mt-1">
                  Se precargarán las categorías y atributos estándar recomendados para este sector.
                </p>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!formData.name || !formData.slug}
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition"
                >
                  <span>Continuar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* PASO 2: CONTACTO Y ADMIN */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
                Paso 2: Datos de contacto y acceso
              </h2>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">
                  Número de WhatsApp oficial
                </label>
                <input
                  type="text"
                  required
                  placeholder="+54 9 11 1234 5678"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 font-medium text-sm"
                />
                <p className="text-xs text-stone-500 mt-1">
                  Utilizado para las notificaciones de nuevos pedidos y consultas de clientes.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">
                  Correo electrónico del administrador
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@tucomercio.com"
                  value={formData.adminEmail}
                  onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">
                  Contraseña de acceso al panel (opcional)
                </label>
                <input
                  type="password"
                  placeholder="Dejá este campo vacío para generar una clave aleatoria segura"
                  value={formData.adminPassword}
                  onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 font-medium text-sm"
                />
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 font-semibold text-sm px-4 py-2 rounded-xl transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Atrás</span>
                </button>

                <button
                  type="button"
                  disabled={!formData.whatsappNumber || !formData.adminEmail}
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition"
                >
                  <span>Continuar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* PASO 3: MEDIOS DE PAGO Y CONFIRMACIÓN */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
                Paso 3: Métodos de cobro iniciales
              </h2>

              <p className="text-sm text-stone-600">
                Seleccioná las vías de cobro que querés habilitar al iniciar (podrás modificarlas o cargar credenciales desde el panel de control):
              </p>

              <div className="space-y-3">
                {[
                  {
                    id: "TRANSFER",
                    title: "Transferencia bancaria directa (CBU / CVU / Alias)",
                    desc: "Habilita el pago mediante homebanking con descuento opcional por transferencia y carga de comprobante.",
                  },
                  {
                    id: "MERCADOPAGO",
                    title: "Mercado Pago",
                    desc: "Cobro con tarjetas de débito, crédito y saldo disponible en cuenta.",
                  },
                  {
                    id: "CASH",
                    title: "Efectivo contra entrega / Retiro en punto físico",
                    desc: "Permite abonar al momento de la entrega o al retirar en local.",
                  },
                ].map((item) => {
                  const checked = formData.enabledPaymentGateways.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => togglePayment(item.id)}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition select-none ${
                        checked
                          ? "border-stone-900 bg-stone-50"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <div className="mt-0.5">
                        <CheckCircle2
                          className={`w-5 h-5 ${checked ? "text-stone-900" : "text-stone-300"}`}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-stone-900 text-sm">{item.title}</p>
                        <p className="text-xs text-stone-500 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl text-xs text-stone-700 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Período de prueba de 14 días sin costo:</strong> No se solicitan datos de tarjeta de crédito para iniciar. Al término de la prueba, podés activar el abono mensual o dar de baja el servicio sin penalidades.
                </p>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={loading}
                  className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 font-semibold text-sm px-4 py-2 rounded-xl transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Atrás</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-xs transition"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Configurando tienda...</span>
                    </>
                  ) : (
                    <>
                      <span>Crear Tienda Online</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default function NuevoComercioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-stone-900" />
        </div>
      }
    >
      <WizardContent />
    </Suspense>
  );
}
