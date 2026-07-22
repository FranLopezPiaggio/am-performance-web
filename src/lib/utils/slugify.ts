// src/lib/utils/slugify.ts
// Canonical slugification algorithm per IMS spec
//
// Reglas:
// - Normalizar a minúsculas
// - Remover tildes y caracteres no alfanuméricos (excepto espacios)
// - Reemplazar espacios por guiones
// - Colapsar guiones múltiples
// - Recortar a máximo 80 caracteres

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')          // sacar tildes
    .replace(/[^a-z0-9\s-]/g, '')              // solo alfanuméricos + espacios + guiones
    .replace(/\s+/g, '-')                       // espacios → guiones
    .replace(/-+/g, '-')                        // colapsar guiones múltiples
    .replace(/^-+|-+$/g, '')                    // trim guiones
    .slice(0, 80);
}

// ponytail: sin lógica de colisión (sufijo -2, -3).
// Por ahora el public_id incluye UUID, así que colisión de slug es virtualmente imposible.
// Agregar cuando se necesite para names determinísticos sin UUID en la ruta.
