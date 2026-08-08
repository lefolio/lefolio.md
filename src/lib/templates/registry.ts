import type { ResolvedTemplateModule, TemplateModule } from './types';
import {
  DefaultContentPage,
  DefaultHome,
  DefaultSectionIndex,
  DefaultStandalonePage,
} from './defaults';
import { academicTemplate } from '@/templates/academic';
import { showcaseTemplate } from '@/templates/showcase';
import { treasureTemplate } from '@/templates/treasure';
import { portfolioTemplate } from '@/templates/portfolio';
import { collectLocalTemplates } from './collect-local';
import * as localTemplateEntry from 'lefolio-active-template';

const builtins: Record<string, TemplateModule> = {
  academic: academicTemplate,
  showcase: showcaseTemplate,
  treasure: treasureTemplate,
  portfolio: portfolioTemplate,
};

const templates: Record<string, TemplateModule> = { ...builtins };

for (const local of collectLocalTemplates(localTemplateEntry as Record<string, unknown>)) {
  templates[local.id] = local;
}

function withDefaults(template: TemplateModule): ResolvedTemplateModule {
  return {
    ...template,
    Home: template.Home ?? DefaultHome,
    SectionIndex: template.SectionIndex ?? DefaultSectionIndex,
    StandalonePage: template.StandalonePage ?? DefaultStandalonePage,
    ContentPage: template.ContentPage ?? DefaultContentPage,
  };
}

export function getTemplate(id: string): ResolvedTemplateModule {
  const template = templates[id];
  if (template) {
    return withDefaults(template);
  }

  if (typeof console !== 'undefined') {
    console.warn(`Unknown template "${id}", falling back to academic.`);
  }

  return withDefaults(templates.academic);
}

export function resolveTemplateId(manifest: {
  template?: string;
  config?: { template?: string };
}): string {
  return manifest.template ?? manifest.config?.template ?? 'academic';
}
