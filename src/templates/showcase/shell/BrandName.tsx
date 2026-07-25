interface BrandNameProps {
  name: string;
  className?: string;
  as?: 'span' | 'h1';
}

/**
 * Renders a LeFolio-style wordmark: geometric bold type with navy name + accent `.md`.
 */
export default function BrandName({ name, className = '', as = 'span' }: BrandNameProps) {
  const Tag = as;
  const trimmed = name.trim();
  const mdMatch = trimmed.match(/^(.*?)(\.md)$/i);

  if (mdMatch) {
    return (
      <Tag className={`showcase-brand-name ${className}`.trim()}>
        <span className="showcase-brand-name-core">{mdMatch[1]}</span>
        <span className="showcase-brand-name-ext">{mdMatch[2]}</span>
      </Tag>
    );
  }

  return <Tag className={`showcase-brand-name ${className}`.trim()}>{trimmed}</Tag>;
}
