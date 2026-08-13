'use client';

interface YouTubeEmbedProps {
  id: string;
  title?: string;
}

export default function YouTubeEmbed({ id, title }: YouTubeEmbedProps) {
  return (
    <div className="content-youtube">
      <iframe
        src={`https://www.youtube.com/embed/${encodeURIComponent(id)}`}
        title={title?.trim() || 'YouTube video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
