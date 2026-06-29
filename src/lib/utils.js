import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Normaliza texto: mayúsculas + sin acentos + sin diéresis
 * Ej: "María José Pérez" → "MARIA JOSE PEREZ"
 *     "pingüino"         → "PINGUINO"
 *     "acción"           → "ACCION"
 */
export function normalizeText(text) {
  if (!text) return ''
  return String(text)
    .normalize('NFD')                // Descompone caracteres: á → a + ́
    .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos (tildes, diéresis)
    .replace(/ñ/g, 'N')              // ñ → N
    .replace(/Ñ/g, 'N')              // Ñ → N
    .toUpperCase()                   // Mayúsculas
    .trim()                          // Sin espacios al inicio/final
}
