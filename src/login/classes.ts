import type { ClassKey } from "keycloakify/login";

// Tailwind replacements for Keycloak's PatternFly classes (doUseDefaultCss is off),
// so the pages Keycloakify renders look like the custom ones.
const button =
  "inline-flex items-center justify-center gap-2 rounded px-4 py-2 font-medium transition-colors cursor-pointer outline-brand focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
const listItem =
  "flex w-full items-center gap-3 rounded border border-gray-200 bg-white p-3 text-left hover:border-brand hover:bg-gray-50";

export const classes = {
  kcHtmlClass: "",
  kcBodyClass: "",

  kcFormClass: "space-y-4",
  kcFormGroupClass: "mb-4 space-y-1",
  kcLabelWrapperClass: "",
  kcLabelClass: "inline-block text-sm font-medium text-gray-700",
  kcInputWrapperClass: "",
  kcInputClass:
    "block w-full rounded border border-gray-300 bg-white px-3 py-2 outline-none focus:border-brand focus:ring-1 focus:ring-brand aria-invalid:border-red-500",
  kcInputErrorMessageClass: "block text-sm text-red-600",
  kcInputGroup: "relative [&>input]:pr-10",
  kcFormPasswordVisibilityButtonClass:
    "absolute inset-y-0 right-0 flex cursor-pointer items-center px-3 text-gray-500 hover:text-gray-800",
  kcFormPasswordVisibilityIconShow: "icon icon-eye",
  kcFormPasswordVisibilityIconHide: "icon icon-eye-off",

  kcFormSettingClass:
    "flex flex-wrap items-center justify-between gap-2 text-sm",
  kcFormOptionsClass: "text-sm",
  kcFormOptionsWrapperClass: "text-sm",
  kcFormButtonsClass: "pt-2",

  kcButtonClass: button,
  kcButtonPrimaryClass: "bg-brand text-white hover:bg-brand-dark",
  kcButtonDefaultClass:
    "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50",
  kcButtonBlockClass: "w-full",
  kcButtonLargeClass: "py-2.5",

  // Choosing an authenticator / passkey / OTP device
  kcSelectAuthListClass: "space-y-2",
  kcSelectAuthListItemClass: listItem,
  kcSelectAuthListItemIconClass: "text-brand",
  kcSelectAuthListItemIconPropertyClass: "",
  kcSelectAuthListItemBodyClass: "flex-1",
  kcSelectAuthListItemHeadingClass: "font-medium",
  kcSelectAuthListItemDescriptionClass: "text-sm text-gray-600",
  kcSelectAuthListItemFillClass: "hidden",
  kcSelectAuthListItemArrowClass: "text-gray-400",
  kcSelectAuthListItemArrowIconClass: "icon icon-chevron",
  kcSelectAuthListItemTitle: "mb-2 text-sm font-medium text-gray-700",
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
    "mb-2 block cursor-pointer [input:checked+&>span]:border-brand [input:checked+&>span]:bg-brand/5 [input:focus-visible+&>span]:ring-2 [input:focus-visible+&>span]:ring-brand",
  kcLoginOTPListItemHeaderClass: listItem,
  kcLoginOTPListItemIconBodyClass: "text-brand",
  kcLoginOTPListItemIconClass: "icon icon-phone",
  kcLoginOTPListItemTitleClass: "font-medium",

  kcFormSocialAccountSectionClass:
    "mt-6 space-y-3 border-t border-gray-200 pt-4",
  kcFormSocialAccountListClass: "space-y-2",
  kcFormSocialAccountListGridClass: "grid grid-cols-2 gap-2 space-y-0",
  kcFormSocialAccountListButtonClass: `${button} w-full border border-gray-300 bg-white text-gray-800 hover:bg-gray-50`,
  kcFormSocialAccountGridItem: "",
  kcFormSocialAccountNameClass: "",
  kcCommonLogoIdP: "",
} satisfies { [key in ClassKey]?: string };
