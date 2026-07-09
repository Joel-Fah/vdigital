import { adminPath } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { TestimonialForm } from '@/components/admin/forms/testimonial-form';
import { createTestimonialAction } from '../actions';

export default function NewTestimonialPage() {
  return (
    <div>
      <AdminHeader title="Nouveau témoignage" />
      <TestimonialForm action={createTestimonialAction} cancelHref={adminPath('testimonials')} />
    </div>
  );
}
