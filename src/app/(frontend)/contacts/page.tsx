import SplitText from "../../../../components/ui/SplitText";
import { sanityFetch } from "@/sanity/lib/live";
import { getAuthorSocialLinksQuery } from "@/sanity/lib/queries";
import ContactLinks from "../../../../components/layout/ContactLinks";
import ContactForm from "../../../../components/forms/ContactForm";
import WhyMe from "../../../../components/layout/WhyMe";
import DownloadCVBtn from "../../../../components/ui/DownloadCvBtn";

const ContactPage = async () => {
  const { data: socials } = await sanityFetch({ query: getAuthorSocialLinksQuery });
  return (
    <main className="my-12 mx-[4vw]">
      <DownloadCVBtn />
      <div className="space-y-2">
        <SplitText
          type="chars"
          text={"Contact Me"}
          className="text-left md:text-center text-[min(8vw,54px)] mx-auto leading-snug max-sm:leading-tight cursor-default font-bold
          headline"
        />
        <SplitText
          type="words"
          delay={0.6}
          stagger={0.055}
          text={
            "I'm currently open to new opportunities and collaborations. Please feel free to reach out if you have any questions or just want to say hello!"
          }
          className="text-left md:text-center text-[min(5vw,16px)] md:max-w-[min(60vw,768px)] mx-auto  text-muted-foreground tracking-wide cursor-default
           "
        />
      </div>
      <ContactLinks socials={socials} />
      <div className="grid md:grid-cols-2 gap-12 items-start my-12">
        <WhyMe />
        <ContactForm />
      </div>
    </main>
  );
};

export default ContactPage;
