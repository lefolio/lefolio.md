'use client';

interface YouTubeShortsRowProps {
  ids: string[];
}

export default function YouTubeShortsRow({ ids }: YouTubeShortsRowProps) {
  if (ids.length === 0) return null;

  return (
    <div className="content-shorts-row">
      {ids.map((id) => (
        <div key={id} className="content-short">
          <iframe
            src={`https://www.youtube.com/embed/${encodeURIComponent(id)}`}
            title="YouTube Short"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      ))}
    </div>
  );
}
