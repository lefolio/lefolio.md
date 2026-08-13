import {
  parseYouTubeVideoId,
  parseYouTubeVideoLine,
  preprocessYouTubeVideos,
} from './youtube';

describe('parseYouTubeVideoId', () => {
  it('parses youtu.be links', () => {
    expect(parseYouTubeVideoId('https://youtu.be/YjB5KjUDaXM')).toBe('YjB5KjUDaXM');
    expect(parseYouTubeVideoId('https://youtu.be/YjB5KjUDaXM?t=12')).toBe('YjB5KjUDaXM');
  });

  it('parses watch URLs', () => {
    expect(parseYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ'
    );
    expect(parseYouTubeVideoId('https://youtube.com/watch?v=dQw4w9WgXcQ&feature=share')).toBe(
      'dQw4w9WgXcQ'
    );
  });

  it('parses embed URLs', () => {
    expect(parseYouTubeVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('ignores shorts URLs', () => {
    expect(parseYouTubeVideoId('https://youtube.com/shorts/abc123XYZ')).toBeNull();
  });

  it('ignores non-youtube URLs', () => {
    expect(parseYouTubeVideoId(undefined)).toBeNull();
    expect(parseYouTubeVideoId('https://example.com')).toBeNull();
  });
});

describe('parseYouTubeVideoLine', () => {
  it('parses image markdown with youtube URL', () => {
    expect(parseYouTubeVideoLine('![](https://youtu.be/YjB5KjUDaXM)')).toBe('YjB5KjUDaXM');
    expect(parseYouTubeVideoLine('![Demo](https://youtu.be/YjB5KjUDaXM)')).toBe('YjB5KjUDaXM');
  });

  it('parses link and bare URL lines', () => {
    expect(parseYouTubeVideoLine('[clip](https://youtu.be/YjB5KjUDaXM)')).toBe('YjB5KjUDaXM');
    expect(parseYouTubeVideoLine('https://youtu.be/YjB5KjUDaXM')).toBe('YjB5KjUDaXM');
  });

  it('ignores lines with extra text', () => {
    expect(parseYouTubeVideoLine('see https://youtu.be/YjB5KjUDaXM')).toBeNull();
  });
});

describe('preprocessYouTubeVideos', () => {
  it('replaces image markdown lines with embed placeholders', () => {
    const out = preprocessYouTubeVideos('![](https://youtu.be/YjB5KjUDaXM)');
    expect(out).toContain('class="content-youtube"');
    expect(out).toContain('data-youtube-id="YjB5KjUDaXM"');
  });

  it('leaves non-youtube lines unchanged', () => {
    const out = preprocessYouTubeVideos('Hello\n\n![](/photo.jpg)\n');
    expect(out).toBe('Hello\n\n![](/photo.jpg)');
  });
});
