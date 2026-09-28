import type { Metadata } from 'next';
import { PageHead } from '../_components/page-head';
import { FirstVisit } from '../_components/sections';
import { AppointmentCalendar, Checklist, EnquiryForm } from '../_components/tools';

export const metadata: Metadata = { title: 'Your first visit', description: 'What happens at your first osteopathy appointment at No.72, what to bring, and how to book.' };

export default function FirstVisitPage() {
  return (
    <main>
      <PageHead crumbs={[{ label: 'First visit' }]} title={<>Your first visit, <em>step by step.</em></>} intro="No GP referral needed. Here’s what happens, what to bring, and how to get a time." />
      <FirstVisit />
      <section className="mx-auto grid max-w-[1600px] gap-3 px-5 py-3 md:grid-cols-2 md:px-8">
        <Checklist />
        <AppointmentCalendar />
      </section>
      <section className="mx-auto max-w-[1600px] px-5 py-3 md:px-8">
        <EnquiryForm />
      </section>
    </main>
  );
}
