/**
 * ContactForm Component
 *
 * A client-side contact form component that integrates with Web3Forms API for message submission.
 * Features form validation using Zod schema, animated transitions with GSAP, and success/error state handling.
 *
 * @component
 * @example
 * ```tsx
 * <ContactForm />
 * ```
 *
 * @remarks
 * This component requires the following environment variable:
 * - `NEXT_PUBLIC_ACCESS_KEY_WEB3FORM`: Web3Forms API access key
 *
 * Features:
 * - Real-time form validation with custom error messages
 * - Animated form entrance and state transitions using GSAP
 * - Success and error message displays with smooth animations
 * - Accessible form fields with proper labels and error handling
 * - Responsive design with Tailwind CSS classes
 *
 * Form Fields:
 * - Name: Minimum 2 characters required
 * - Email: Must be a valid email format
 * - Message: Minimum 10 characters required
 *
 * @returns {JSX.Element} A form component with input fields, submit button, and status messages
 */
"use client";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CheckCheck, X } from "lucide-react";
const ACCESS_KEY = process.env.NEXT_PUBLIC_ACCESS_KEY_WEB3FORM;

const contactSchema = z.object({
  name: z.string().min(2, "Mind sharing your full name?"),
  email: z.string().email("Hmm… that doesn't look like an email..."),
  message: z.string().min(10, "Message is shy — it needs at least 10 characters."),
});

type FormInput = z.infer<typeof contactSchema>;

const ContactForm = () => {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const formRef = useRef<HTMLFormElement | null>(null);
  const successMessageRef = useRef<HTMLDivElement | null>(null);
  const errorMessageRef = useRef<HTMLDivElement | null>(null);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    mode: "onChange",
  });
  const onSubmit = async (data: FormInput) => {
    if (!ACCESS_KEY) {
      console.error("Missing NEXT_PUBLIC_ACCESS_KEY_WEB3FORM");
      setStatus("error");
      return;
    }
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name: data.name,
          email: data.email,
          message: data.message,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setStatus("success");
        reset();
      } else {
        console.error("Web3Forms error:", result);
        setStatus("error");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setStatus("error");
    }
  };
  useGSAP(() => {
    const el = formRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { y: -20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        // Delay hard coded to allow for other animations to complete first
        delay: 3,
        ease: "power2.out",
      }
    );
  }, []);
  useGSAP(() => {
    const formEl = formRef.current;
    if (!formEl || status === "idle") return;

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.fromTo(
      formEl,
      { opacity: 1, y: 20, scaleY: 1 },
      { opacity: 0, y: 0, scaleY: 0, duration: 0.6 }
    ).set(formEl, { display: "none" });

    const messageEl = status === "success" ? successMessageRef.current : errorMessageRef.current;

    if (messageEl) {
      tl.fromTo(
        messageEl,
        {
          opacity: 0,
          scaleY: 0,
          transformOrigin: "top top",
          display: "none",
        },
        {
          opacity: 1,
          scaleY: 1,
          display: "block",
          duration: 1.2,
        },
        ">"
      );
    }
  }, [status]);
  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="contact-form origin-bottom-left flex h-full flex-col justify-between gap-2 rounded-2xl bg-linear-to-b from-bg/30 to-primary/30 p-4 backdrop-blur-md"
      >
        {/* Name */}
        <div className="input-field">
          <label htmlFor="name" className="name-label mb-2 block pl-1 font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Your name (or secret superhero alias)"
            {...register("name")}
            className="w-full rounded-lg border border-primary/50 px-4 py-2 text-fg backdrop-blur-[1px] focus:outline-none focus:ring-2 focus:ring-primary/70"
          />
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </div>
        {/* Email */}
        <div className="input-field">
          <label htmlFor="email" className="email-label mb-2 block pl-1 font-medium">
            Email
          </label>
          <input
            type="text"
            id="email"
            {...register("email")}
            className="w-full rounded-lg border border-primary/50 px-4 py-2 text-fg backdrop-blur-[1px] focus:outline-none focus:ring-2 focus:ring-primary/70"
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>
        {/* Message */}
        <div className="input-field">
          <label htmlFor="message" className="message-label mb-2 block pl-1 font-medium">
            Let me know what&apos;s on your mind
          </label>
          <textarea
            id="message"
            rows={5}
            {...register("message")}
            className="w-full rounded-lg border border-primary/50 px-4 py-2 text-fg backdrop-blur-[1px] focus:outline-none focus:ring-2 focus:ring-primary/70"
          />
          {errors.message && <p className="error-message">{errors.message.message}</p>}
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer rounded-lg bg-primary px-4 py-4 font-semibold text-bg transition-colors hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
      {/* Success and Error Messages after submission */}
      {/* Success Message */}
      <div
        ref={successMessageRef}
        className="hidden origin-top scale-y-0 rounded-xl border border-green-300 bg-linear-to-br from-bg to-green-300 p-6 shadow-lg dark:border-green-900 dark:to-green-900"
      >
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-800">
            <CheckCheck className="text-white" />
          </div>
          <div>
            <h4 className="mb-1 font-semibold">Thank you for reaching out!</h4>
            <p className="text-sm leading-relaxed">
              Your message has been sent successfully. I really appreciate you taking the time to
              contact me, and I&apos;ll get back to you as soon as possible — usually within 24
              hours!
            </p>
          </div>
        </div>
      </div>
      {/* Error Message */}
      <div
        ref={errorMessageRef}
        className="hidden origin-top scale-y-0 rounded-xl border border-red-300 bg-linear-to-br from-bg to-red-300 p-6 shadow-lg dark:border-red-900 dark:to-red-900"
      >
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-800">
            <X className="text-white" />
          </div>
          <div>
            <h4 className="mb-1 font-semibold">Oops! Something went wrong.</h4>
            <p className="text-sm leading-relaxed">
              There was an error sending your message. I&apos;ll try to fix this issue as soon as
              possible. You can also contact me directly at{" "}
              <a href="mailto:sidmashav@icloud.com" className="font-medium underline">
                sidmashav@icloud.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactForm;
