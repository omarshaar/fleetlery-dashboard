import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Home, SearchX } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Page } from "@/eano/components/page/Page";
import { Button } from "@/eano/design-system/shadcn/button";
import { useLanguage } from "@/i18n/hooks";

export default function NotFoundPage() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();

  return (
    <Page className="relative h-full min-h-full max-w-none p-0 sm:p-0 md:p-0">
      <section className="relative h-full min-h-full w-full overflow-hidden rounded-none border-0 bg-background text-foreground">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-background/70 dark:bg-neutral-950/60" />
          <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-rose-500/20 dark:bg-rose-500/10 blur-3xl" />
          <div className="absolute -right-28 -bottom-28 h-80 w-80 rounded-full bg-indigo-500/20 dark:bg-indigo-500/15 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.14)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-size-[22px_22px] opacity-45 dark:opacity-70" />
        </div>

        <div className="relative h-full w-full px-6 py-16 sm:px-10 sm:py-20">
          <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center text-center">
            <motion.div
              className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-foreground/15 bg-background/40 backdrop-blur"
              initial={reduceMotion ? undefined : { opacity: 0, scale: 0.9, y: 6 }}
              animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <SearchX className="h-5 w-5" aria-hidden />
            </motion.div>

            <motion.p
              className="text-sm font-medium text-muted-foreground"
              initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
            >
              404
            </motion.p>

            <motion.h1
              className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl"
              initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
            >
              {t("system.notFound.title") || "Page not found"}
            </motion.h1>

            <motion.p
              className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base"
              initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12, ease: "easeOut" }}
            >
              {t("system.notFound.description") ||
                "The page you’re looking for doesn’t exist or may have been moved."}
            </motion.p>

            <motion.div
              className="mt-10 flex w-full max-w-xl flex-col items-center justify-center gap-3 sm:flex-row"
              initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16, ease: "easeOut" }}
            >
              <Button
                size="lg"
                className="h-11 w-full sm:w-auto"
                asChild
              >
                <Link to="/">
                  <Home className="me-2 h-4 w-4" />
                  {t("system.notFound.actions.home") || "Go to Home"}
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-11 w-full sm:w-auto"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="me-2 h-4 w-4" />
                {t("system.notFound.actions.back") || "Go Back"}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </Page>
  );
}
