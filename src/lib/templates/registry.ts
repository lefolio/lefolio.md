import type { TemplateModule } from './types';
import { academicTemplate } from '@/templates/academic';
import { showcaseTemplate } from '@/templates/showcase';
import { treasureTemplate } from '@/templates/treasure';
import { portfolioTemplate } from '@/templates/portfolio';

const templates: Record<string, TemplateModule> = {
  academic: academicTemplate,
  showcase: showcaseTemplate,
  treasure: treasureTemplate,
  portfolio: portfolioTemplate,
};

export function getTemplate(id: string): TemplateModule {
  const template = templates[id];
  if (template) {
    return template;
  }

  if (typeof console !== 'undefined') {
    console.warn(`Unknown template "${id}", falling back to academic.`);
  }

  return templates.academic;
}
