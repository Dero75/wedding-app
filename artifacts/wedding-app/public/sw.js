/* global self */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      if ("caches" in self) {
        const cacheKeys = await self.caches.keys();
        await Promise.all(cacheKeys.map((cacheKey) => self.caches.delete(cacheKey)));
      }

      await self.clients.claim();
      await self.registration.unregister();
    })(),
  );
});
