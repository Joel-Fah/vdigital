import { Suspense } from 'react';
import { Nav } from '@/components/layout/nav';
import { Footer } from '@/components/layout/footer';
import { DetailDrawer } from '@/components/drawer/detail-drawer';
import { Analytics } from '@/components/analytics';
import { getSections, getSiteSettings } from '@/lib/content';

/**
 * Public shell: frosted sticky nav + footer around all public pages.
 * Nav links reflect current section visibility so hidden sections drop out of
 * the scrollspy list automatically.
 */
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [sections, settings] = await Promise.all([getSections(), getSiteSettings()]);
  return (
    <>
      <Nav sections={sections} />
      <main>{children}</main>
      <Footer settings={settings} />
      {/* Shared right-side drawer (Section 5.3), available on every public page.
          Suspense boundary is required because it reads useSearchParams. */}
      <Suspense fallback={null}>
        <DetailDrawer />
      </Suspense>
      <Analytics />
    </>
  );
}
