"use client";
const ACCESS_KEY = process.env.NEXT_PUBLIC_ACCESS_KEY_WEB3FORM;
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CheckCheck, X } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Mind sharing your full name or superhero alias?"),
  email: z.email("Hmm… that doesn't look like an email..."),
  message: z.string().min(10, "Message is shy — it needs at least 10 characters."),
});

type FormInput = z.infer<typeof contactSchema>;

const ContactForm = () => {
  const form = useForm<FormInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    mode: "onChange",
  });
  const root = useRef<HTMLFormElement | null>(null);
  const successMessageRef = useRef<HTMLDivElement | null>(null);
  const errorMessageRef = useRef<HTMLDivElement | null>(null);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = form;
  const onSubmit = async (data: FormInput) => {
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name: data.name,
          email: data.email,
          message: data.message,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setFormSubmitted(true);
        form.reset();
      } else {
        setFormError(true);
      }
    } catch (error) {
      alert("An error occurred while submitting the form. Please try again later.");
    }
  };
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [formError, setFormError] = React.useState(false);

  useGSAP(
    (context, contextSafe) => {
      const el = root.current;
      const fl = gsap.timeline({ defaults: { ease: "sine.out" } });
      fl.fromTo(
        el,
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        ">3"
      );
      const tl = gsap.timeline();
      if (!el) return;
      if (formSubmitted) {
        tl.fromTo(
          el,
          { opacity: 1, y: 20 },
          { opacity: 0, y: 0, scaleY: 0, duration: 0.6, ease: "power2.out" }
        );
        tl.to(el, {
          display: "none",
        });
        const successMessageEl = successMessageRef.current;
        if (successMessageEl) {
          tl.fromTo(
            successMessageEl,
            { opacity: 0, scaleY: 0, transformOrigin: "top top", display: "none" },
            { opacity: 1, scaleY: 1, display: "block", duration: 1.2, ease: "power2.out" },
            "> "
          );
        }
      }
      if (formError) {
        tl.fromTo(
          el,
          { opacity: 1, y: 20 },
          { opacity: 0, y: 0, scaleY: 0, duration: 0.6, ease: "power2.out" }
        );
        tl.to(el, {
          display: "none",
        });
        const errorMessageEl = errorMessageRef.current;
        if (errorMessageEl) {
          tl.fromTo(
            errorMessageEl,
            { opacity: 0, scaleY: 0, transformOrigin: "top top", display: "none" },
            { opacity: 1, scaleY: 1, display: "block", duration: 1.2, ease: "power2.out" },
            "> "
          );
        }
      }
    },
    [formSubmitted, formError]
  );

  return (
    <>
      <form
        ref={root}
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl p-4 bg-linear-to-b from-bg/30 to-primary/30 backdrop-blur-md h-full flex flex-col justify-between gap-2 origin-bottom-left contact-form"
      >
        <div className="input-field">
          <label htmlFor="name" className="block font-medium mb-2 pl-1 name-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Your name (or secret superhero alias)"
            {...register("name")}
            className="w-full px-4 py-2 border border-primary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/70 backdrop-blur-[1px] text-fg"
          />
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </div>
        <div className="input-field">
          <label htmlFor="email" className="block font-medium mb-2 pl-1 email-label">
            Email
          </label>
          <input
            type="text"
            id="email"
            {...register("email")}
            className="w-full px-4 py-2 border border-primary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/70 backdrop-blur-[1px] text-fg"
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>
        <div className="input-field">
          <label htmlFor="message" className="block font-medium mb-2 pl-1 message-label">
            Let me know what&apos;s on your mind
          </label>
          <textarea
            id="message"
            rows={5}
            {...register("message")}
            className="w-full px-4 py-2 border border-primary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/70 backdrop-blur-[1px] text-fg"
          ></textarea>
          {errors.message && <p className="error-message">{errors.message.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-bg font-semibold py-4 px-4 rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
      <div
        className="p-6 bg-linear-to-br from-bg to-green-300 dark:to-green-900 border border-green-300 dark:border-green-900  rounded-xl shadow-lg scale-y-0 origin-top hidden"
        ref={successMessageRef}
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-green-800 rounded-full shrink-0 mt-1">
            <CheckCheck className="text-white" />
          </div>
          <div>
            <h4 className=" font-semibold mb-1">Thank you for reaching out!</h4>
            <p className=" text-sm leading-relaxed">
              Your message has been sent successfully. I really appreciate you taking the time to
              contact me, and I&apos;ll get back to you as soon as possible - usually within 24
              hours!
            </p>
          </div>
        </div>
      </div>
      <div
        ref={errorMessageRef}
        className="p-6 bg-linear-to-br from-bg to-red-300 dark:to-red-900 border border-red-300 dark:border-red-900 rounded-xl shadow-lg origin-top scale-y-0 hidden
        "
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-red-800 rounded-full shrink-0 mt-1">
            <X className="text-white" />
          </div>
          <div>
            <h4 className=" font-semibold mb-1">Oops! Something went wrong.</h4>
            <p className=" text-sm leading-relaxed">
              There was an error sending your message. I will try to fix this issue as soon as
              possible. Come back later or contact me directly at{" "}
              <a href="mailto:your-email@example.com" className="underline font-medium">
                sidmashav@icloud.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactForm;
