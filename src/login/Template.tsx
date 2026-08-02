import { useEffect, useState } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";

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
        children
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;

    const { realm, auth, url, message, isAppInitiatedAction } = kcContext;
    const pageTitle = documentTitle ?? msgStr("loginTitle", realm.displayName || realm.name);

    const [bgImage, setBgImage] = useState<string>("");
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

    useEffect(() => {
        const closeMenu = (e: MouseEvent) => {
            if (isLanguageMenuOpen && !(e.target as Element).closest("#language-switch-container")) {
                setIsLanguageMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", closeMenu);
        return () => document.removeEventListener("mousedown", closeMenu);
    }, [isLanguageMenuOpen]);

    useEffect(() => {
        document.title = pageTitle;
        const num = Math.floor(Math.random() * 1) + 1;
        setBgImage(`${import.meta.env.BASE_URL}assets/${num}.webp`);
    }, [pageTitle]);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        return null;
    }

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative font-sans text-gray-900"
            style={{ backgroundImage: bgImage ? `url(${bgImage})` : undefined }}
        >
            {/* Dark overlay to ensure text contrast if needed */}
            {/* <div className="absolute inset-0 bg-black/10"></div> */}

            <div className="w-full max-w-112.5 p-8 bg-white/90 backdrop-blur-md shadow-2xl rounded-lg z-10 mx-4 border border-white/50">
                <header className="text-center mb-6">
                    {/* Logo */}
                    <img src={`${import.meta.env.BASE_URL}assets/logo.svg`} alt="Nixpi Logo" className="h-24 mx-auto mb-4 object-contain" />

                    {/* Language Switcher */}
                    {enabledLanguages.length > 1 && (
                        <div className="absolute top-4 right-4 z-50" id="language-switch-container">
                            <div className="relative">
                                <button
                                    onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                                    className="text-white bg-black/30 hover:bg-black/50 px-3 py-1 rounded text-sm backdrop-blur-sm transition-colors flex items-center gap-1"
                                >
                                    {currentLanguage.label}
                                    <svg
                                        className={`w-4 h-4 transition-transform ${isLanguageMenuOpen ? "rotate-180" : ""}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                {isLanguageMenuOpen && (
                                    <ul className="absolute right-0 mt-1 w-32 bg-white rounded shadow-lg overflow-hidden z-50 text-left">
                                        {enabledLanguages.map(({ languageTag, label, href }) => (
                                            <li key={languageTag}>
                                                <a
                                                    href={href}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[--color-jlu-blue]"
                                                >
                                                    {label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}

                    {(() => {
                        const node = !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                            <h1 className="text-2xl font-light text-gray-800 mb-6">{headerNode}</h1>
                        ) : (
                            <div className="text-center mb-6">
                                <label className="block text-gray-700 font-medium mb-1">{auth.attemptedUsername}</label>
                                <a
                                    href={url.loginRestartFlowUrl}
                                    className="text-sm text-[--color-nixpi-blue] hover:underline flex items-center justify-center gap-1"
                                    aria-label={msgStr("restartLoginTooltip")}
                                >
                                    <span className="kc-tooltip-text">{msg("restartLoginTooltip")}</span>
                                </a>
                            </div>
                        );

                        if (displayRequiredFields) {
                            return (
                                <div className="space-y-2 mb-4">
                                    <div className="text-right text-xs text-gray-500">
                                        <span className="text-red-600 mr-1">*</span>
                                        {msg("requiredFields")}
                                    </div>
                                    {node}
                                </div>
                            );
                        }

                        return node;
                    })()}
                </header>

                <div id="kc-content">
                    <div id="kc-content-wrapper">
                        {/* Alerts / Messages */}
                        {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                            <div
                                className={clsx(
                                    "mb-4 p-4 rounded text-sm border-l-4 shadow-sm",
                                    message.type === "error" && "bg-red-50 border-red-500 text-red-700",
                                    message.type === "success" && "bg-green-50 border-green-500 text-green-700",
                                    message.type === "warning" && "bg-yellow-50 border-yellow-500 text-yellow-700",
                                    message.type === "info" && "bg-blue-50 border-blue-500 text-blue-700"
                                )}
                            >
                                <span dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
                            </div>
                        )}

                        {children}

                        {/* Try Another Way */}
                        {auth !== undefined && auth.showTryAnotherWayLink && (
                            <form id="kc-select-try-another-way-form" action={url.loginAction} method="post" className="mt-4">
                                <div className={kcClsx("kcFormGroupClass")}>
                                    <input type="hidden" name="tryAnotherWay" value="on" />
                                    <a
                                        href="#"
                                        id="try-another-way"
                                        className="text-sm text-[--color-nixpi-blue] hover:underline block text-center"
                                        onClick={event => {
                                            document.forms["kc-select-try-another-way-form" as never].requestSubmit();
                                            event.preventDefault();
                                            return false;
                                        }}
                                    >
                                        {msg("doTryAnotherWay")}
                                    </a>
                                </div>
                            </form>
                        )}

                        {socialProvidersNode}

                        {displayInfo && (
                            <div id="kc-info" className="mt-4 pt-4 text-center text-sm text-gray-600 mx-0! mb-0! p-0!">
                                <div id="kc-info-wrapper" className="m-0! p-0! bg-transparent! border-0!">
                                    {infoNode}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full bg-white/80 backdrop-blur-md py-3 text-center text-xs text-gray-600 fixed bottom-0 border-t border-gray-200 z-20">
                <div className="flex justify-center space-x-6 flex-wrap"></div>
            </footer>
        </div>
    );
}
