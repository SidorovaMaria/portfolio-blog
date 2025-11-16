import SplitText from "../../../../components/ui/SplitText";
import { sanityFetch } from "@/sanity/lib/live";
import { getAuthorSocialLinksQuery } from "@/sanity/lib/queries";
import ContactLinks from "../../../../components/layout/ContactLinks";
import WhyMe from "../../../../components/layout/WhyMe";
import DownloadCVBtn from "../../../../components/ui/DownloadCvBtn";
import ContactForm from "../../../../components/forms/ContactForm";

const ContactPage = async () => {
  const { data: socials } = await sanityFetch({ query: getAuthorSocialLinksQuery });
  return (
    <main className="mx-[4vw] my-12">
      <DownloadCVBtn />

      <section className="space-y-2">
        <SplitText
          type="chars"
          text="Contact Me"
          className="mx-auto cursor-default text-left text-[min(8vw,54px)] font-bold leading-snug max-sm:leading-tight md:text-center"
        />
        <SplitText
          type="words"
          delay={0.6}
          stagger={0.055}
          text="I'm currently open to new opportunities and collaborations. Please feel free to reach out if you have any questions or just want to say hello!"
          className="mx-auto cursor-default text-left text-[min(5vw,16px)] tracking-wide text-muted-foreground md:max-w-[min(60vw,768px)] md:text-center"
        />
      </section>

      {socials && <ContactLinks socials={socials} />}

      <section className="my-12 grid items-start gap-12 md:grid-cols-2">
        <WhyMe />
        <ContactForm />
      </section>
    </main>
  );
};

export default ContactPage;
