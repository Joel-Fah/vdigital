import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { adminPath } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { TestimonialForm } from '@/components/admin/forms/testimonial-form';
import { updateTestimonialAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
    include: { photo: true },
  });
  if (!testimonial) notFound();
  return (
    <div>
      <AdminHeader title="Modifier le témoignage" subtitle={testimonial.author} />
      <TestimonialForm
        action={updateTestimonialAction.bind(null, testimonial.id)}
        cancelHref={adminPath('testimonials')}
        testimonial={testimonial}
        photoAsset={testimonial.photo}
      />
    </div>
  );
}
