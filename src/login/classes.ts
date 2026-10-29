import type { ClassKey } from "keycloakify/login";

// Tailwind replacements for Keycloak's PatternFly classes (doUseDefaultCss is off),
// so the pages Keycloakify renders look like the custom ones.
const button =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition cursor-pointer outline-brand focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 disabled:active:scale-100";
const secondary =
  "border border-white/15 bg-white/5 text-white/90 hover:border-white/25 hover:bg-white/10";
const listItem =
  "flex w-full items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-left text-white/90 transition hover:border-brand/50 hover:bg-white/10";

export const classes = {
  kcHtmlClass: "",
  kcBodyClass: "",

  kcFormClass: "space-y-4",
  kcFormGroupClass: "mb-4 space-y-1.5",
  kcLabelWrapperClass: "",
  kcLabelClass: "inline-block text-sm font-medium text-white/70",
  kcInputWrapperClass: "",
  kcInputClass:
    "block w-full rounded-lg border border-white/10 bg-black/25 px-3.5 py-2.5 text-white placeholder:text-white/30 outline-none transition hover:border-white/20 focus:border-brand focus:ring-4 focus:ring-brand/15 aria-invalid:border-red-400 aria-invalid:focus:ring-red-400/15",
  kcInputErrorMessageClass: "block text-sm text-red-300",
  kcInputGroup: "relative [&>input]:pr-11",
  kcFormPasswordVisibilityButtonClass:
    "absolute inset-y-0 right-0 flex cursor-pointer items-center px-3.5 text-white/45 transition-colors hover:text-white",
  kcFormPasswordVisibilityIconShow: "icon icon-eye",
  kcFormPasswordVisibilityIconHide: "icon icon-eye-off",

  kcFormSettingClass:
    "flex flex-wrap items-center justify-between gap-2 text-sm text-white/70",
  kcFormOptionsClass: "text-sm",
  kcFormOptionsWrapperClass: "text-sm",
  kcFormButtonsClass: "pt-2",
  kcFormButtonsWrapperClass: "flex w-full gap-2 [&>*]:flex-1",

  kcButtonClass: button,
  kcButtonPrimaryClass:
    "bg-brand font-semibold text-brand-ink shadow-[0_8px_24px_-8px] shadow-brand/60 hover:bg-brand-hover hover:shadow-brand/80",
  kcButtonDefaultClass: secondary,
  kcButtonBlockClass: "w-full",
  kcButtonLargeClass: "py-3",

  // Choosing an authenticator / passkey / OTP device
  kcSelectAuthListClass: "space-y-2",
  kcSelectAuthListItemClass: listItem,
  kcSelectAuthListItemIconClass: "text-brand",
  kcSelectAuthListItemIconPropertyClass: "",
  kcSelectAuthListItemBodyClass: "flex-1",
  kcSelectAuthListItemHeadingClass: "font-medium",
  kcSelectAuthListItemDescriptionClass: "text-sm text-white/55",
  kcSelectAuthListItemFillClass: "hidden",
  kcSelectAuthListItemArrowClass: "text-white/35",
  kcSelectAuthListItemArrowIconClass: "icon icon-chevron",
  kcSelectAuthListItemTitle: "mb-2 text-sm font-medium text-white/70",
  kcAuthenticatorDefaultClass: "icon icon-lock",
  kcAuthenticatorPasswordClass: "icon icon-lock",
  kcAuthenticatorOTPClass: "icon icon-phone",
  kcAuthenticatorWebAuthnClass: "icon icon-key",
  kcAuthenticatorWebAuthnPasswordlessClass: "icon icon-key",
  kcWebAuthnDefaultIcon: "icon icon-key",
  kcWebAuthnKeyIcon: "icon icon-key",
  kcWebAuthnUnknownIcon: "icon icon-key",

  // <input> directly followed by its <label>
  kcLoginOTPListInputClass: "sr-only",
  kcLoginOTPListClass:
    "mb-2 block cursor-pointer [input:checked+&>span]:border-brand [input:checked+&>span]:bg-brand/10 [input:focus-visible+&>span]:ring-2 [input:focus-visible+&>span]:ring-brand",
  kcLoginOTPListItemHeaderClass: listItem,
  kcLoginOTPListItemIconBodyClass: "text-brand",
  kcLoginOTPListItemIconClass: "icon icon-phone",
  kcLoginOTPListItemTitleClass: "font-medium",

  kcFormSocialAccountSectionClass:
    "mt-6 space-y-3 [&>h2]:text-center [&>h2]:text-sm [&>h2]:text-white/55",
  kcFormSocialAccountListClass: "space-y-2",
  kcFormSocialAccountListGridClass: "grid grid-cols-2 gap-2 space-y-0",
  kcFormSocialAccountListButtonClass: `${button} ${secondary} w-full`,
  kcFormSocialAccountGridItem: "",
  kcFormSocialAccountNameClass: "",
  kcCommonLogoIdP: "",
} satisfies { [key in ClassKey]?: string };
