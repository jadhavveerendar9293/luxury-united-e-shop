import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Mail, Phone, MapPin } from "lucide-react";
import { PageShell, PageHeader } from "@/components/site/PageShell";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — Luxury United" }] }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <PageShell>
      <PageHeader eyebrow="Get in touch" title="Contact Us" description="Our concierge replies within one business day." />
      <section className="container-luxury pb-24 md:pb-32 grid md:grid-cols-2 gap-16">
        <form
          onSubmit={(e) => { e.preventDefault(); toast.success("Message sent. We'll be in touch shortly."); }}
          className="space-y-6"
        >
          <Field label="Name" required />
          <Field label="Email" type="email" required />
          <Field label="Subject" />
          <label className="block">
            <span className="eyebrow text-pearl/60 mb-2 block">Message</span>
            <textarea rows={5} required className="w-full bg-transparent border-b border-pearl/20 py-3 text-sm focus:outline-none focus:border-champagne" />
          </label>
          <button className="bg-champagne text-obsidian px-8 py-4 eyebrow hover:bg-pearl transition-colors">Send Message</button>
        </form>
        <aside className="space-y-8">
          <Detail icon={MapPin} title="Atelier" body={"15 Rue de la Paix\n75002 Paris, France"} />
          <Detail icon={Mail} title="Email" body="concierge@luxuryunited.com" />
          <Detail icon={Phone} title="Phone" body="+33 1 42 60 00 00" />
          <div className="bg-card/40 p-8 mt-12">
            <h3 className="font-serif text-xl mb-3">Private appointments</h3>
            <p className="text-sm text-pearl/60 leading-relaxed">
              Visit our flagship for bespoke consultations, restorations, and private viewings.
            </p>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="eyebrow text-pearl/60 mb-2 block">{label}</span>
      <input {...props} className="w-full bg-transparent border-b border-pearl/20 py-3 text-sm focus:outline-none focus:border-champagne transition-colors" />
    </label>
  );
}
function Detail({ icon: Icon, title, body }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }) {
  return (
    <div className="flex gap-4">
      <Icon className="size-5 text-champagne shrink-0 mt-1" />
      <div>
        <p className="eyebrow text-pearl mb-2">{title}</p>
        <p className="text-sm text-pearl/60 whitespace-pre-line leading-relaxed">{body}</p>
      </div>
    </div>
  );
}
