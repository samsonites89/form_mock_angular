import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'form/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'preview',
    renderMode: RenderMode.Server,
  },
  {
    path: 'configs',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
];
