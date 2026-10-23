"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ExternalLink,
  Store,
  QrCode,
  ShieldAlert,
  Loader2,
  Copy,
  Check,
} from "lucide-react";

interface ProvisionLog {
  step: string;
  message: string;
  timestamp: number;
  status: "IN_PROGRESS" | "SUCCESS" | "FAILED";
}

interface JobData {
  id: string;
  storeSlug: string;
  storeName: string;
  currentStep: string;
  status: "RUNNING" | "COMPLETED" | "FAILED" | "ROLLED_BACK";
  progressPercentage: number;
  logs: ProvisionLog[];
  error?: string;
  liveUrl?: string;
  repoUrl?: string;
  adminInitialPassword?: string;
  adminEmail?: string;
}

export default function ProvisionStatusPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const resolvedParams = use(params);
  const jobId = resolvedParams.jobId;

  const [job, setJob] = useState<JobData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/provision/${jobId}`);
        if (res.ok) {
          const data = await res.json();
          setJob(data);

          if (data.status === "COMPLETED" || data.status === "FAILED" || data.status === "ROLLED_BACK") {
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error("Error consultando el estado del job:", err);
      }
    };

    fetchStatus();
    interval = setInterval(fetchStatus, 1500);

    return () => clearInterval(interval);
  }, [jobId]);

  const copyUrl = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!job) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-9 h-9 animate-spin text-stone-900" />
        <p className="text-stone-600 font-medium text-sm">Consultando estado del aprovisionamiento...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-8">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          {job.status === "COMPLETED"
            ? "¡Tu tienda online está activa y en línea!"
            : job.status === "FAILED" || job.status === "ROLLED_BACK"
            ? "Fallo en el aprovisionamiento"
            : "Aprovisionando tu plataforma de ecommerce..."}
        </h1>
        <p className="text-stone-600 text-sm">
          Comercio: <strong>{job.storeName}</strong> ({job.storeSlug})
        </p>
      </div>

      {/* BARRA DE PROGRESO */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between text-sm font-bold text-stone-700">
          <span className="flex items-center gap-2">
            {job.status === "RUNNING" && <Loader2 className="w-4 h-4 animate-spin text-stone-800" />}
            {job.status === "COMPLETED" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            {job.status === "FAILED" && <ShieldAlert className="w-4 h-4 text-red-600" />}
            <span>Paso: {job.currentStep}</span>
          </span>
          <span className="text-stone-900 font-mono text-sm">{job.progressPercentage}%</span>
        </div>

        <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              job.status === "FAILED"
                ? "bg-red-500"
                : job.status === "COMPLETED"
                ? "bg-emerald-600"
                : "bg-stone-900"
            }`}
            style={{ width: `${job.progressPercentage}%` }}
          />
        </div>
      </div>

      {/* CASO: EXITOSO */}
      {job.status === "COMPLETED" && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-xs">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-950">Tu plataforma fue configurada con éxito</h3>
                <p className="text-xs text-emerald-800">
                  Período de prueba de 14 días activo. Base de datos D1 y catálogo listos para operar.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* LINK TIENDA PUBLICA */}
              <div className="bg-white border border-emerald-200 rounded-xl p-4 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Tienda Pública (Catálogo)
                </span>
                <p className="font-mono text-xs font-bold text-stone-900 truncate">
                  {job.liveUrl || `https://${job.storeSlug}.latrastienda.workers.dev`}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={job.liveUrl || `https://${job.storeSlug}.latrastienda.workers.dev`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>Abrir tienda</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => copyUrl(job.liveUrl || `https://${job.storeSlug}.latrastienda.workers.dev`)}
                    className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-700"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? "Copiado" : "Copiar"}</span>
                  </button>
                </div>
              </div>

              {/* LINK PANEL ADMIN */}
              <div className="bg-white border border-emerald-200 rounded-xl p-4 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Panel de Administración
                </span>
                <p className="font-mono text-xs font-bold text-stone-900 truncate">
                  {job.liveUrl ? `${job.liveUrl}/admin` : `https://${job.storeSlug}.latrastienda.workers.dev/admin`}
                </p>
                <div className="pt-1">
                  <a
                    href={job.liveUrl ? `${job.liveUrl}/admin` : `https://${job.storeSlug}.latrastienda.workers.dev/admin`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                  >
                    <span>Ingresar al Panel</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* KIT QR Y MANUAL DE USO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md">
                <QrCode className="w-3.5 h-3.5" />
                <span>Punto de venta físico</span>
              </div>
              <h4 className="text-sm font-bold text-stone-900">Cartel con QR para mostrador</h4>
              <p className="text-xs text-stone-500">
                Descargá el cartel en PDF para que tus clientes escaneen y vean tu catálogo desde el local.
              </p>
              <button
                onClick={() => alert("Generando PDF con el código QR para imprimir.")}
                className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
              >
                <QrCode className="w-3.5 h-3.5 text-stone-300" />
                <span>Descargar Cartel QR</span>
              </button>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md">
                <Store className="w-3.5 h-3.5" />
                <span>Aprender a usar la tienda</span>
              </div>
              <h4 className="text-sm font-bold text-stone-900">Manual de Uso Paso a Paso</h4>
              <p className="text-xs text-stone-500">
                Aprendé cómo subir tus primeros productos, variantes de talle/color y configurar tus cobros.
              </p>
              <Link
                href="/guia"
                target="_blank"
                className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-3.5 py-2 rounded-xl transition"
              >
                <span>Abrir Manual de Uso</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CASO: ERROR / ROLLBACK */}
      {(job.status === "FAILED" || job.status === "ROLLED_BACK") && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 space-y-3">
          <h3 className="font-bold text-red-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-700" />
            <span>Fallo durante el aprovisionamiento</span>
          </h3>
          <p className="text-sm text-red-800">{job.error || "Ocurrió un error inesperado al configurar los servicios."}</p>
          <div className="bg-white/80 p-3 rounded-xl text-xs text-stone-600 font-mono">
            <strong>Transacción compensada:</strong> Se ejecutó el rollback para remover recursos huérfanos y no incurrir en costos.
          </div>
          <div className="pt-2">
            <Link
              href="/nuevo"
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
            >
              <span>Reintentar</span>
            </Link>
          </div>
        </div>
      )}

      {/* REGISTRO DE LOGS EN VIVO */}
      <div className="bg-stone-950 text-stone-300 rounded-2xl p-5 font-mono text-xs space-y-2 shadow-inner">
        <div className="flex items-center justify-between border-b border-stone-800 pb-2 text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
          <span>Registro de eventos</span>
          <span>{job.logs.length} eventos</span>
        </div>
        <div className="space-y-1.5 max-h-56 overflow-y-auto">
          {job.logs.map((log, index) => (
            <div key={index} className="flex items-start gap-2 leading-relaxed">
              <span className="text-stone-500 shrink-0">
                {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}
              </span>
              <span
                className={
                  log.status === "FAILED"
                    ? "text-red-400 font-bold"
                    : log.status === "SUCCESS"
                    ? "text-emerald-400"
                    : "text-amber-300"
                }
              >
                [{log.step}]
              </span>
              <span className="text-stone-300">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
