import Image from 'next/image';
import type { ClientLogo, MediaAsset } from '@prisma/client';
import { initials } from '@/lib/utils';

type ClientWithLogo = ClientLogo & { logo: MediaAsset | null };

/**
 * ClientCard — original `.cf-card` (featured) / `.cl-card` (compact). Two
 * densities, same visual language. When no logo is set, falls back to a fixed
 * initials avatar (never a bare dot).
 */
export function ClientCard({
  client,
  variant = 'compact',
}: {
  client: ClientWithLogo;
  variant?: 'featured' | 'compact';
}) {
  const size = variant === 'featured' ? 40 : 32;
  const inner = (
    <div className="flex items-center gap-3">
      {client.logo ? (
        <Image
          src={client.logo.url}
          alt={client.logo.altText ?? client.name}
          width={size}
          height={size}
          style={{ width: size, height: size }}
          className="flex-shrink-0 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden
          style={{ width: size, height: size }}
          className="flex flex-shrink-0 items-center justify-center rounded-full bg-teal-light font-display text-[0.75rem] font-bold text-teal"
        >
          {initials(client.name)}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-[0.95rem] font-medium text-ink">{client.name}</p>
        {client.sector && (
          <p className="mt-0.5 truncate text-[0.7rem] text-ink-muted">{client.sector}</p>
        )}
      </div>
    </div>
  );

  const className =
    variant === 'featured'
      ? 'rounded-lg border border-line bg-surface-white p-6 transition-all duration-200 hover:border-teal/30 hover:shadow-soft'
      : 'rounded-md border border-line bg-surface-white p-4 transition-colors duration-200 hover:border-teal/30';

  if (client.link) {
    return (
      <a href={client.link} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }
  return <div className={className}>{inner}</div>;
}
