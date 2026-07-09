import Image from 'next/image';
import type { ClientLogo, MediaAsset } from '@prisma/client';

type ClientWithLogo = ClientLogo & { logo: MediaAsset | null };

/**
 * ClientCard — original `.cf-card` (featured) / `.cl-card` (compact). Two
 * densities, same visual language (Section 2.4).
 */
export function ClientCard({
  client,
  variant = 'compact',
}: {
  client: ClientWithLogo;
  variant?: 'featured' | 'compact';
}) {
  const inner = (
    <>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {client.logo ? (
            <Image
              src={client.logo.url}
              alt={client.logo.altText ?? client.name}
              width={variant === 'featured' ? 40 : 28}
              height={variant === 'featured' ? 40 : 28}
              className="rounded-full object-cover"
            />
          ) : (
            <span className="inline-block h-2 w-2 rounded-full bg-teal-bright" aria-hidden />
          )}
          <div>
            <p className="text-[0.95rem] font-medium text-ink">{client.name}</p>
            {client.sector && (
              <p className="mt-0.5 text-[0.7rem] text-ink-muted">{client.sector}</p>
            )}
          </div>
        </div>
      </div>
    </>
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
