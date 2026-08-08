declare module 'lefolio-active-template' {
  import type { TemplateModule } from '@/lib/templates/types';

  export const template: TemplateModule | undefined;
  export const templates: TemplateModule[] | undefined;
  const defaultExport: TemplateModule | null | undefined;
  export default defaultExport;
}
