import { beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('./defaults', () => ({
  DefaultHome: () => null,
  DefaultSectionIndex: () => null,
  DefaultStandalonePage: () => null,
  DefaultContentPage: () => null,
}));

jest.mock('@/templates/academic', () => ({
  academicTemplate: {
    id: 'academic',
    routing: 'multipage',
    Shell: () => null,
    loadStyles: async () => undefined,
  },
}));
jest.mock('@/templates/showcase', () => ({
  showcaseTemplate: {
    id: 'showcase',
    routing: 'multipage',
    Shell: () => null,
    loadStyles: async () => undefined,
    Home: () => null,
  },
}));
jest.mock('@/templates/treasure', () => ({
  treasureTemplate: {
    id: 'treasure',
    routing: 'multipage',
    Shell: () => null,
    loadStyles: async () => undefined,
  },
}));
jest.mock('@/templates/portfolio', () => ({
  portfolioTemplate: {
    id: 'portfolio',
    routing: 'multipage',
    Shell: () => null,
    loadStyles: async () => undefined,
  },
}));

const localShell = () => null;
jest.mock('lefolio-active-template', () => ({
  templates: [],
  template: undefined,
  default: null,
}));

describe('templates/registry', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('resolveTemplateId prefers manifest.template then config then academic', async () => {
    const { resolveTemplateId } = await import('./registry');
    expect(resolveTemplateId({ template: 'showcase' })).toBe('showcase');
    expect(resolveTemplateId({ config: { template: 'portfolio' } })).toBe('portfolio');
    expect(resolveTemplateId({})).toBe('academic');
  });

  it('getTemplate returns the requested template with defaults filled', async () => {
    const { getTemplate } = await import('./registry');
    const showcase = getTemplate('showcase');
    expect(showcase.id).toBe('showcase');
    expect(typeof showcase.Home).toBe('function');
    expect(typeof showcase.SectionIndex).toBe('function');
    expect(typeof showcase.ContentPage).toBe('function');
  });

  it('getTemplate falls back to academic for unknown ids', async () => {
    const { getTemplate } = await import('./registry');
    const fallback = getTemplate('nope');
    expect(fallback.id).toBe('academic');
    expect(console.warn).toHaveBeenCalled();
  });

  it('merges local templates and lets local id override builtins', async () => {
    jest.doMock('lefolio-active-template', () => ({
      template: {
        id: 'academic',
        routing: 'multipage',
        Shell: localShell,
        loadStyles: async () => undefined,
        Home: () => null,
      },
      templates: [
        {
          id: 'salo',
          routing: 'multipage',
          Shell: localShell,
          loadStyles: async () => undefined,
        },
      ],
      default: null,
    }));

    const { getTemplate } = await import('./registry');
    expect(getTemplate('salo').id).toBe('salo');
    expect(getTemplate('academic').Shell).toBe(localShell);
  });
});
