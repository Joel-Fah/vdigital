import { Sparkles } from 'lucide-react';
import type { MediaAsset, Service } from '@prisma/client';
import { TagPill } from '@/components/ui/tag-pill';
import { RichText } from '@/components/ui/rich-text';
import { QuickRequest } from '@/components/drawer/quick-request';

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

      <QuickRequest itemLabel={service.title} kind="service" label="Discuter de ce service" />
    </div>
  );
}
