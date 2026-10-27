import { useEffect, useState } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";

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
      className="relative flex min-h-screen flex-col items-center justify-center bg-cover bg-center py-16"
      style={{ backgroundImage: `url(${asset("background.webp")})` }}
    >
      <LanguageMenu i18n={i18n} />

      <main className="z-10 mx-4 w-full max-w-112.5 rounded-lg border border-white/50 bg-white/90 p-8 shadow-2xl backdrop-blur-md">
        <header className="mb-6 text-center">
          <img
            src={asset("logo.svg")}
            alt="nixpi"
            className="mx-auto mb-4 h-24 object-contain"
          />
          {displayRequiredFields && (
            <p className="mb-2 text-right text-xs text-gray-500">
              <span className="mr-1 text-red-600">*</span>
              {msg("requiredFields")}
            </p>
          )}
          {showUsername ? (
            <div>
              <p className="font-medium text-gray-700">
                {auth.attemptedUsername}
              </p>
              <a href={url.loginRestartFlowUrl} className="text-sm">
                {msg("restartLoginTooltip")}
              </a>
            </div>
          ) : (
            <h1 className="text-2xl font-light text-gray-800">{headerNode}</h1>
          )}
        </header>

        {displayMessage &&
          message !== undefined &&
          (message.type !== "warning" || !isAppInitiatedAction) && (
            <div
              role="alert"
              className={clsx(
                "mb-4 rounded border-l-4 p-4 text-sm shadow-sm",
                message.type === "error" &&
                  "border-red-500 bg-red-50 text-red-700",
                message.type === "success" &&
                  "border-green-500 bg-green-50 text-green-700",
                message.type === "warning" &&
                  "border-yellow-500 bg-yellow-50 text-yellow-700",
                message.type === "info" &&
                  "border-blue-500 bg-blue-50 text-blue-700",
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
          <div className="mt-4 border-t border-gray-200 pt-4 text-center text-sm text-gray-600">
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
        className="flex cursor-pointer items-center gap-1 rounded bg-black/30 px-3 py-1 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/50"
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
          className="absolute right-0 mt-1 w-36 overflow-hidden rounded bg-white text-left shadow-lg"
        >
          {enabledLanguages.map(({ languageTag, label, href }) => (
            <li key={languageTag} role="none">
              <a
                role="menuitem"
                href={href}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:no-underline"
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
