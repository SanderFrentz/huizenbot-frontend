import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'users/:id',
    renderMode: RenderMode.Server // <-- SSR render only (no prerender)
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender // fallback for everything else
  }
];
