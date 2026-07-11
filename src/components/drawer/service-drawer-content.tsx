import { ExternalLink, Sparkles } from 'lucide-react';
import type { MediaAsset, Service } from '@prisma/client';
import { TagPill } from '@/components/ui/tag-pill';
import { Button } from '@/components/ui/button';
import { RichText } from '@/components/ui/rich-text';

type ServiceDetail = Service & { icon: MediaAsset | null };

export function ServiceDrawerContent({ data }: { data: unknown }) {
  const service = data as ServiceDetail;
  return (
    <div className="space-y-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-md border border-teal/20 bg-teal-ultra">
        {service.icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={service.icon.url} alt="" className="h-6 w-6" />
        ) : (
          <Sparkles className="h-6 w-6 text-teal" strokeWidth={1.5} />
        )}
      </div>

      <RichText html={service.description} />

      {service.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {service.tags.map((t) => (
            <TagPill key={t}>{t}</TagPill>
          ))}
        </div>
      )}

      <Button href="/#contact" variant="primary" size="sm">
        Discuter de ce service <ExternalLink className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
