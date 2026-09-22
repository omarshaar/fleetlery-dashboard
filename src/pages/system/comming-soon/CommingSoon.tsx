import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Globe, Instagram, Linkedin, Sparkles, Twitter } from "lucide-react";

import { useLanguage } from "@/i18n/hooks";
import { Page } from "@/eano/components/page/Page";
import { Button } from "@/eano/design-system/shadcn/button";
import { Input } from "@/eano/design-system/shadcn/input";

export default function CommingSoonPage() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <Page className="relative h-full min-h-full max-w-none p-0 sm:p-0 md:p-0">
      <section className="relative h-full min-h-full w-full overflow-hidden rounded-none border-0 bg-background text-foreground">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          {/* Soft base wash (must stay UNDER dots) */}
          <div className="absolute inset-0 bg-background/65 dark:bg-neutral-950/55" />

          {/* <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-fuchsia-500/10 to-amber-500/10 dark:from-indigo-500/20 dark:via-fuchsia-500/15 dark:to-amber-500/10" /> */}
          <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-fuchsia-500/30 dark:bg-fuchsia-500/15 blur-3xl" />
          <div className="absolute -right-28 -bottom-28 h-80 w-80 rounded-full bg-indigo-500/20 dark:bg-indigo-500/15 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.14)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-size-[22px_22px] opacity-45 dark:opacity-70" />
        </div>

        <div className="relative h-full w-full px-6 py-16 sm:px-10 sm:py-20">
          <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center text-center">
            <motion.div
              className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-background/40 backdrop-blur"
              initial={reduceMotion ? undefined : { opacity: 0, scale: 0.9, y: 6 }}
              animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <motion.div
                animate={reduceMotion ? undefined : { rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              >
                <Sparkles className="h-5 w-5" />
              </motion.div>
            </motion.div>

            <motion.h1
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
              initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
            >
              {t("navigation.commingSoon") || "Coming Soon"}
            </motion.h1>

            <motion.p
              className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base"
              initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
            >
              {t("system.commingSoon.description") ||
                "Get ready everyone! We are currently working on something awesome."}
            </motion.p>

            <motion.div
              className="mt-10 flex w-full max-w-xl flex-col items-center gap-3 sm:flex-row"
              initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
            >
              <Input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSent(false);
                }}
                placeholder={t("system.commingSoon.email.placeholder") || "Email address"}
                type="email"
                className="h-11 w-full bg-background/40 backdrop-blur text-foreground placeholder:text-muted-foreground border-foreground/20 focus-visible:ring-foreground/20"
              />
              <Button
                type="button"
                size="lg"
                className="h-11 w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90"
                disabled={!email.trim()}
                onClick={() => setSent(true)}
              >
                {t("system.commingSoon.email.cta") || "Notify Me"}
              </Button>
            </motion.div>

            {sent && (
              <motion.div
                className="mt-2 text-xs text-emerald-600 dark:text-emerald-300"
                initial={reduceMotion ? undefined : { opacity: 0, y: 6 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {t("system.commingSoon.email.success") || "Thanks! (demo)"}
              </motion.div>
            )}

            <motion.div
              className="mt-10 flex items-center justify-center gap-3 text-muted-foreground"
              initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                asChild
              >
                <a href="#" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                asChild
              >
                <a href="#" aria-label="X / Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                asChild
              >
                <a href="#" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                asChild
              >
                <a href="#" aria-label="Website">
                  <Globe className="h-4 w-4" />
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </Page>
  );
}
