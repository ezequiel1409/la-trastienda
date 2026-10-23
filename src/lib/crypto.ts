const PBKDF2_ITERATIONS = 100_000;
const HASH_LENGTH_BYTES = 64; // 512 bits
const SALT_LENGTH_BYTES = 16;

function bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuffer(hex: string): Uint8Array {
  const match = hex.match(/.{1,2}/g);
  if (!match) return new Uint8Array(0);
  return new Uint8Array(match.map((byte) => parseInt(byte, 16)));
}

export function generateSalt(length: number = SALT_LENGTH_BYTES): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bufferToHex(bytes);
}

/**
 * Hashea una contraseña usando PBKDF2-HMAC-SHA512 con 100.000 iteraciones
 * 100% compatible con el sistema de autenticación de aura-studio
 */
export async function hashPassword(
  password: string,
  providedSalt?: string
): Promise<{ hash: string; salt: string }> {
  const saltHex = providedSalt || generateSalt();
  const saltBytes = hexToBuffer(saltHex);

  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes as unknown as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-512",
    },
    passwordKey,
    HASH_LENGTH_BYTES * 8
  );

  const hashHex = bufferToHex(derivedBits);
  return {
    hash: hashHex,
    salt: saltHex,
  };
}

/**
 * Genera una contraseña inicial segura y legible para el comerciante
 * Ej: "Tito-7482"
 */
export function generateRandomPassword(prefix = "Tienda"): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
}
