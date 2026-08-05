import { parseTestimonials } from './parse-testimonials';

describe('parseTestimonials', () => {
  it('parses ## name / ### title / body', () => {
    const md = [
      '## Caren Stanley',
      '### Business developer',
      'Working with them was a pleasure.',
      '',
      '## John Gunty',
      '### Business analyst',
      'Video feedback was unbelievable.',
    ].join('\n');

    expect(parseTestimonials(md)).toEqual([
      {
        name: 'Caren Stanley',
        title: 'Business developer',
        bodyMarkdown: 'Working with them was a pleasure.',
      },
      {
        name: 'John Gunty',
        title: 'Business analyst',
        bodyMarkdown: 'Video feedback was unbelievable.',
      },
    ]);
  });

  it('uses the most prioritary heading as name (### / ####)', () => {
    const md = [
      '### Caren Stanley',
      '#### Business developer',
      '> Having the feedback really bolstered me.',
      '### John Gunty',
      '#### Business analyst',
      '> Video feedback was unbelievable!',
    ].join('\n');

    const items = parseTestimonials(md);
    expect(items).toHaveLength(2);
    expect(items[0].name).toBe('Caren Stanley');
    expect(items[0].title).toBe('Business developer');
    expect(items[0].bodyMarkdown).toContain('Having the feedback');
    expect(items[1].name).toBe('John Gunty');
  });

  it('allows name without title', () => {
    const md = ['## Ada', 'Nice.', '## Grace', 'Also nice.'].join('\n');
    expect(parseTestimonials(md)).toEqual([
      { name: 'Ada', bodyMarkdown: 'Nice.' },
      { name: 'Grace', bodyMarkdown: 'Also nice.' },
    ]);
  });

  it('returns empty for blank input', () => {
    expect(parseTestimonials('')).toEqual([]);
    expect(parseTestimonials('   \n')).toEqual([]);
  });
});
