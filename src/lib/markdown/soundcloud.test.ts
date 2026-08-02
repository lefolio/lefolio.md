import { describe, expect, it } from '@jest/globals';
import {
  parseSoundCloudLine,
  parseSoundCloudUrl,
  preprocessSoundCloud,
} from './soundcloud';

describe('parseSoundCloudUrl', () => {
  it('accepts soundcloud.com and on.soundcloud.com URLs', () => {
    expect(parseSoundCloudUrl('https://soundcloud.com/artist/track')).toBe(
      'https://soundcloud.com/artist/track',
    );
    expect(parseSoundCloudUrl('https://on.soundcloud.com/abcd')).toBe(
      'https://on.soundcloud.com/abcd',
    );
    expect(parseSoundCloudUrl('https://www.soundcloud.com/artist/track.')).toBe(
      'https://www.soundcloud.com/artist/track',
    );
  });

  it('rejects unrelated URLs', () => {
    expect(parseSoundCloudUrl(undefined)).toBeNull();
    expect(parseSoundCloudUrl('https://spotify.com/track/1')).toBeNull();
  });
});

describe('parseSoundCloudLine', () => {
  it('accepts bare URLs, angle URLs, and markdown links', () => {
    const url = 'https://soundcloud.com/artist/track';
    expect(parseSoundCloudLine(url)).toBe(url);
    expect(parseSoundCloudLine(`<${url}>`)).toBe(url);
    expect(parseSoundCloudLine(`[listen](${url})`)).toBe(url);
  });
});

describe('preprocessSoundCloud', () => {
  it('replaces a SoundCloud URL line with an embed placeholder', () => {
    const out = preprocessSoundCloud('https://soundcloud.com/artist/track');
    expect(out).toContain('class="content-soundcloud"');
    expect(out).toContain('data-soundcloud-url="https://soundcloud.com/artist/track"');
  });

  it('escapes attribute characters in the URL', () => {
    const out = preprocessSoundCloud('https://soundcloud.com/a/b?x="y"');
    expect(out).toContain('data-soundcloud-url="https://soundcloud.com/a/b?x=&quot;y&quot;"');
  });
});
