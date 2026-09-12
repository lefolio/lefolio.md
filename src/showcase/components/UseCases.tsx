'use client';

import type { MarkdownBlockProps } from '@lefolio/engine/template';
import {
  extractAllImages,
  firstHeading,
  splitByHeading,
  stripHeading,
  stripImages,
} from '@lefolio/engine/parse';
import { AccentedText } from '../lib/accented';

export default function UseCases({ content }: MarkdownBlockProps) {
  const title = firstHeading(content, 2) || 'Use cases';
  const { intro, sections } = splitByHeading(stripHeading(content, title), 4);

  return (
    <section className="showcase-block showcase-block--alt" id="use-cases">
      <div className="showcase-container">
        <h2 className="showcase-block-title">
          <AccentedText text={title} />
        </h2>
        {intro ? <p className="showcase-block-lead">{intro}</p> : null}

        <ul className="showcase-usecases">
          {sections.map((item) => {
            const images = extractAllImages(item.body);
            const body = stripImages(item.body).trim();

            return (
              <li key={item.title} className="showcase-usecase">
                {images.length > 0 ? (
                  <div className="showcase-usecase-stack" aria-hidden={images.every((img) => !img.alt)}>
                    {images.map((image, index) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={image.src}
                        src={image.src}
                        alt={image.alt || `${item.title} illustration ${index + 1}`}
                        width={110}
                        height={147}
                        className="showcase-usecase-sheet"
                        style={{ zIndex: index + 1 }}
                      />
                    ))}
                  </div>
                ) : null}

                <h3 className="showcase-usecase-title">
                  <AccentedText text={item.title} />
                </h3>
                {body ? <p className="showcase-usecase-body">{body}</p> : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
