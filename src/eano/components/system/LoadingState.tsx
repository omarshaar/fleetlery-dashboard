import { Spinner } from "@/components";
import { useLanguage } from "@/i18n/hooks";

export type LoadingStateProps = {
  text?: string;
};

export function LoadingState({ text }: LoadingStateProps) {
  const { t } = useLanguage();

  return (
    <div className="h-full w-full flex justify-center items-center text-muted-foreground">
      {text ??
        t("system.state.loading", {
          ns: "components",
          defaultValue: "Loading...",
        })}{" "}
      <Spinner className="ms-2 " />
    </div>
  );
}