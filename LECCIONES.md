# LECCIONES — AMPerformance Web

## 2026-11-13 · TASK-008 · lección

**Qué pasó:** El `<video>` del hero se renderizaba con poster pero nunca cargaba: faltaba el prop `src`. Se detectó con el fondo azul de debug + script Playwright que reportaba `readyState: 0, currentSrc: ''`. Además, React no hidrata el atributo `muted` (issue #10389), y los constants referenciaban imágenes que nunca existieron (404 silenciosos, incluido el placeholder `download.jpg` de la DB).

**Por qué:** Los elementos de media no fallan ruidosamente — un video sin `src` se ve como imagen congelada (el poster) y un fondo CSS inexistente solo 404ea en el network tab. El ojo humano no alcanza; hace falta un test de browser que afirme reproducción real.

**Regla nueva:**
- Toda integración de media se verifica con un script headless (`scripts/verify-hero.mjs`): assert de `currentTime` avanzando + 0 recursos 404, no solo presencia del tag.
- Al usar `<video>` en React: `src` explícito SIEMPRE, y `muted` por ref en `useEffect` (quirk de hidratación).
- Debug de media: fondo de color distintivo (azul) detrás del elemento — si se ve el color, el media no está cargando.
- Los assets referenciados por constants deben existir en disco: verificar con un script (glob) antes de commitear.
