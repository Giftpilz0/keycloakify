import { useEffect, useState } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import { Ambience } from "./Ambience";

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;

export default function Template(props: TemplateProps<KcContext, I18n>) {
  const {
    displayInfo = false,
    displayMessage = true,
    displayRequiredFields = false,
    headerNode,
    socialProvidersNode = null,
    infoNode = null,
    documentTitle,
    bodyClassName,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
    children,
  } = props;

  const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
  const { msg, msgStr } = i18n;
  const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

  useEffect(() => {
    document.title =
      documentTitle ?? msgStr("loginTitle", realm.displayName || realm.name);
  }, [documentTitle]);

  useSetClassName({ qualifiedName: "html", className: kcClsx("kcHtmlClass") });
  useSetClassName({
    qualifiedName: "body",
    className: bodyClassName ?? kcClsx("kcBodyClass"),
  });

  const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });
  if (!isReadyToRender) {
    return null;
  }

  const showUsername =
    auth !== undefined && auth.showUsername && !auth.showResetCredentials;

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center bg-night bg-cover bg-center px-4 py-16"
      style={{ backgroundImage: `url(${asset("background.webp")})` }}
    >
      <div
        aria-hidden
        className="aurora pointer-events-none fixed -inset-[10%]"
      />
      <Ambience />
      <LanguageMenu i18n={i18n} />

      <main className="z-10 w-full max-w-md animate-rise rounded-2xl border border-white/10 bg-night/55 p-8 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.7)] ring-1 ring-white/5 ring-inset backdrop-blur-2xl backdrop-saturate-150 motion-reduce:animate-none sm:p-10">
        <header className="mb-8 text-center">
          <img
            src={asset("logo-dark-mode.svg")}
            alt="nixpi"
            className="mx-auto mb-6 h-14 object-contain"
          />
          {displayRequiredFields && (
            <p className="mb-2 text-right text-xs text-white/45">
              <span className="mr-1 text-red-300">*</span>
              {msg("requiredFields")}
            </p>
          )}
          {showUsername ? (
            <div className="flex flex-col items-center gap-2">
              <p className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-medium text-white/90">
                {auth.attemptedUsername}
              </p>
              <a href={url.loginRestartFlowUrl} className="text-sm">
                {msg("restartLoginTooltip")}
              </a>
            </div>
          ) : (
            <h1 className="font-display text-2xl font-semibold tracking-tight text-balance text-white">
              {headerNode}
            </h1>
          )}
        </header>

        {displayMessage &&
          message !== undefined &&
          (message.type !== "warning" || !isAppInitiatedAction) && (
            <div
              role="alert"
              className={clsx(
                "mb-6 rounded-lg border px-4 py-3 text-sm",
                message.type === "error" &&
                  "border-red-400/30 bg-red-500/10 text-red-200",
                message.type === "success" &&
                  "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
                message.type === "warning" &&
                  "border-amber-400/30 bg-amber-500/10 text-amber-200",
                message.type === "info" &&
                  "border-sky-400/30 bg-sky-500/10 text-sky-200",
              )}
              dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }}
            />
          )}

        {children}

        {auth !== undefined && auth.showTryAnotherWayLink && (
          <form
            id="kc-select-try-another-way-form"
            action={url.loginAction}
            method="post"
            className="mt-4 text-center"
          >
            <input type="hidden" name="tryAnotherWay" value="on" />
            <button
              type="submit"
              className="cursor-pointer text-sm text-brand hover:underline"
            >
              {msg("doTryAnotherWay")}
            </button>
          </form>
        )}

        {socialProvidersNode}

        {displayInfo && (
          <div className="mt-6 border-t border-white/10 pt-5 text-center text-sm text-white/55">
            {infoNode}
          </div>
        )}
      </main>
    </div>
  );
}

function LanguageMenu({ i18n }: { i18n: I18n }) {
  const { currentLanguage, enabledLanguages } = i18n;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const close = (e: Event) => {
      if (
        e instanceof KeyboardEvent
          ? e.key === "Escape"
          : !(e.target as Element).closest("#language-menu")
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [isOpen]);

  if (enabledLanguages.length <= 1) {
    return null;
  }

  return (
    <div id="language-menu" className="absolute top-4 right-4 z-50">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center gap-1 rounded-full border border-white/10 bg-night/40 px-3.5 py-1.5 text-sm text-white/80 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
      >
        {currentLanguage.label}
        <span
          className={clsx(
            "icon icon-chevron size-4 transition-transform",
            isOpen ? "-rotate-90" : "rotate-90",
          )}
          aria-hidden
        />
      </button>
      {isOpen && (
        <ul
          role="menu"
          className="absolute right-0 mt-2 max-h-[min(24rem,calc(100dvh-5rem))] w-44 overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-night/90 p-1 text-left shadow-xl [scrollbar-color:rgb(255_255_255/0.2)_transparent] [scrollbar-width:thin] backdrop-blur-xl"
        >
          {enabledLanguages.map(({ languageTag, label, href }) => (
            <li key={languageTag} role="none">
              <a
                role="menuitem"
                href={href}
                className="block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white hover:no-underline"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
