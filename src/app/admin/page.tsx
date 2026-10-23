"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StoreTenant } from "@/domain/store/types";
import {
  ShieldCheck,
  Calendar,
  Trash2,
  PauseCircle,
  ExternalLink,
  PlusCircle,
  Database,
  RefreshCw,
  Search,
  LogOut,
  Loader2,
} from "lucide-react";

export default function AdminFleetPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<StoreTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Verifica autenticación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/auth/check");
        const data = await res.json();
        if (!data.authenticated) {
          router.replace("/admin/login");
          return;
        }
        setCheckingAuth(false);
        fetchTenants();
      } catch {
        router.replace("/admin/login");
      }
    };
    checkAuth();
  }, [router]);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tenants");
      if (res.ok) {
        const data = await res.json();
        setTenants(data);
      }
    } catch (err) {
      console.error("Error al cargar comercios:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  const handleRenew = async (slug: string) => {
    if (!confirm(`¿Confirmás la acreditación de 30 días para '${slug}'?`)) return;
    setActionLoading(slug);
    try {
      const res = await fetch("/api/admin/renew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, days: 30 }),
      });
      if (res.ok) {
        await fetchTenants();
      }
    } catch (err) {
      alert("Error al renovar la suscripción: " + String(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handlePause = async (slug: string) => {
    if (!confirm(`¿Pausar la tienda '${slug}'?`)) return;
    setActionLoading(slug);
    try {
      const res = await fetch("/api/admin/pause", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (res.ok) {
        await fetchTenants();
      }
    } catch (err) {
      alert("Error al pausar la tienda: " + String(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeprovision = async (slug: string) => {
    if (
      !confirm(
        `⚠️ ATENCIÓN: Esto eliminará la base de datos D1 en Cloudflare para liberar el cupo. ¿Proceder para '${slug}'?`
      )
    )
      return;
    setActionLoading(slug);
    try {
      const res = await fetch("/api/admin/deprovision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (res.ok) {
        await fetchTenants();
      }
    } catch (err) {
      alert("Error al desaprovisionar: " + String(err));
    } finally {
      setActionLoading(null);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-stone-900" />
        <p className="text-xs text-stone-500 font-medium">Verificando credenciales...</p>
      </div>
    );
  }

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase()) ||
      t.whatsappNumber.includes(search)
  );

  const activeD1DatabasesCount = tenants.filter(
    (t) => t.subscriptionStatus !== "DEPROVISIONED" && t.cloudD1DatabaseId
  ).length;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Panel de Administración Privado</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Gestión de Tiendas
          </h1>
          <p className="text-sm text-stone-500">
            Monitoreá tu flota de comercios, confirmá transferencias y administrá cupos de Cloudflare.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchTenants}
            disabled={loading}
            className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold px-3 py-2 rounded-xl transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Actualizar</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-700 text-xs font-bold px-3 py-2 rounded-xl transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Salir</span>
          </button>
        </div>
      </div>

      {/* METRICAS RAPIDAS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase">Total Tiendas</span>
          <p className="text-3xl font-black text-stone-900 mt-1">{tenants.length}</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase">Cupos Cloudflare D1 Usados</span>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-black text-stone-900">{activeD1DatabasesCount}</p>
            <span className="text-stone-400 font-bold text-sm">/ 10 gratis</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {10 - activeD1DatabasesCount > 0
              ? `${10 - activeD1DatabasesCount} bases de datos gratuitas disponibles.`
              : "Límite gratuito alcanzado. Desaprovisioná las inactivas."}
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase">Abono Mensual Configurado</span>
          <p className="text-3xl font-black text-emerald-700 mt-1">$15.000 <span className="text-xs font-normal text-stone-500">ARS/mes</span></p>
          <p className="text-[11px] text-stone-500 mt-1">0% comisión · Pago directo a tu cuenta</p>
        </div>
      </div>

      {/* BUSCADOR */}
      <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl px-4 py-2.5 max-w-md shadow-xs">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          type="text"
          placeholder="Buscar por comercio, subdominio o teléfono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm focus:outline-none bg-transparent"
        />
      </div>

      {/* TABLA DE TIENDAS */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-600 uppercase">
              <tr>
                <th className="px-5 py-3.5">Comercio</th>
                <th className="px-5 py-3.5">Contacto</th>
                <th className="px-5 py-3.5">Estado</th>
                <th className="px-5 py-3.5">Vencimiento</th>
                <th className="px-5 py-3.5">Base D1</th>
                <th className="px-5 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-stone-400 text-sm">
                    No hay comercios registrados aún.
                  </td>
                </tr>
              ) : (
                filteredTenants.map((t) => {
                  const now = Date.now();
                  const isTrial = t.subscriptionStatus === "TRIAL_ACTIVE";
                  const targetDate = isTrial ? t.trialEndsAt : t.paidUntil;
                  const daysLeft = targetDate
                    ? Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24))
                    : 0;

                  return (
                    <tr key={t.id} className="hover:bg-stone-50/70 transition">
                      <td className="px-5 py-4">
                        <div className="font-bold text-stone-900">{t.name}</div>
                        <div className="text-xs text-stone-500 font-mono flex items-center gap-1.5 mt-0.5">
                          <span>{t.slug}</span>
                          {t.liveUrl && (
                            <a
                              href={t.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-stone-700 hover:text-stone-900"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="text-xs font-semibold text-stone-800">{t.whatsappNumber}</div>
                        <div className="text-xs text-stone-500">{t.adminEmail}</div>
                      </td>

                      <td className="px-5 py-4">
                        {t.subscriptionStatus === "TRIAL_ACTIVE" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            Prueba Activa
                          </span>
                        )}
                        {t.subscriptionStatus === "ACTIVE_PAID" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Activo Pago
                          </span>
                        )}
                        {t.subscriptionStatus === "SUSPENDED" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-800 border border-red-200">
                            Pausado
                          </span>
                        )}
                        {t.subscriptionStatus === "DEPROVISIONED" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-600 border border-stone-200">
                            Liberado
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span className={daysLeft <= 2 ? "font-bold text-red-600" : "text-stone-700"}>
                            {daysLeft > 0 ? `${daysLeft} días restantes` : "Vencido"}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {t.cloudD1DatabaseId ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                            <Database className="w-3 h-3 text-stone-700" />
                            {t.cloudD1DatabaseName}
                          </span>
                        ) : (
                          <span className="text-xs text-stone-400 italic">Sin base asignada</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* BOTON RENOVAR +30 DIAS */}
                          <button
                            onClick={() => handleRenew(t.slug)}
                            disabled={actionLoading === t.slug}
                            title="Confirmar transferencia y acreditar 30 días"
                            className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg transition"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>+30 días</span>
                          </button>

                          {/* BOTON PAUSAR */}
                          {t.subscriptionStatus !== "SUSPENDED" && t.subscriptionStatus !== "DEPROVISIONED" && (
                            <button
                              onClick={() => handlePause(t.slug)}
                              disabled={actionLoading === t.slug}
                              title="Pausar tienda"
                              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition"
                            >
                              <PauseCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* BOTON LIBERAR D1 */}
                          {t.cloudD1DatabaseId && (
                            <button
                              onClick={() => handleDeprovision(t.slug)}
                              disabled={actionLoading === t.slug}
                              title="Liberar cupo de Cloudflare D1"
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
