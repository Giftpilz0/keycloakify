import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

// Keycloak's default OTP policy; change it here if the realm's policy changes.
const OTP_DIGITS = 6;

export default function LoginOtp(
  props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const { otpLogin, url, messagesPerField } = kcContext;

  const { msg, msgStr } = i18n;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [code, setCode] = useState("");
  const boxes = useRef<(HTMLInputElement | null)[]>([]);
  const hasError = messagesPerField.existsError("totp");

  useEffect(() => boxes.current[0]?.focus(), []);

  // Typing, pasting or autofill into any box fills the code from that box on.
  const enter = (index: number, value: string) => {
    const digits = value.replace(/\D/g, "");
    const next = (
      code.slice(0, index).padEnd(index, " ") +
      digits +
      code.slice(index + digits.length)
    ).slice(0, OTP_DIGITS);
    setCode(digits ? next : code.slice(0, index) + " " + code.slice(index + 1));
    boxes.current[Math.min(index + digits.length, OTP_DIGITS - 1)]?.focus();
  };

  const onKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index]?.trim() && index > 0) {
      setCode(code.slice(0, index - 1) + " " + code.slice(index));
      boxes.current[index - 1]?.focus();
      e.preventDefault();
    } else if (e.key === "ArrowLeft" && index > 0) {
      boxes.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_DIGITS - 1) {
      boxes.current[index + 1]?.focus();
    }
  };

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!messagesPerField.existsError("totp")}
      headerNode={msg("doLogIn")}
    >
      <form
        id="kc-otp-login-form"
        className={kcClsx("kcFormClass")}
        action={url.loginAction}
        onSubmit={() => {
          setIsSubmitting(true);
          return true;
        }}
        method="post"
      >
        {otpLogin.userOtpCredentials.length > 1 && (
          <div className={kcClsx("kcFormGroupClass")}>
            <div className={kcClsx("kcInputWrapperClass")}>
              {otpLogin.userOtpCredentials.map((otpCredential, index) => (
                <Fragment key={index}>
                  <input
                    id={`kc-otp-credential-${index}`}
                    className={kcClsx("kcLoginOTPListInputClass")}
                    type="radio"
                    name="selectedCredentialId"
                    value={otpCredential.id}
                    defaultChecked={
                      otpCredential.id === otpLogin.selectedCredentialId
                    }
                  />
                  <label
                    htmlFor={`kc-otp-credential-${index}`}
                    className={kcClsx("kcLoginOTPListClass")}
                  >
                    <span className={kcClsx("kcLoginOTPListItemHeaderClass")}>
                      <span
                        className={kcClsx("kcLoginOTPListItemIconBodyClass")}
                      >
                        <i
                          className={kcClsx("kcLoginOTPListItemIconClass")}
                          aria-hidden="true"
                        ></i>
                      </span>
                      <span className={kcClsx("kcLoginOTPListItemTitleClass")}>
                        {otpCredential.userLabel}
                      </span>
                    </span>
                  </label>
                </Fragment>
              ))}
            </div>
          </div>
        )}

        <div className={kcClsx("kcFormGroupClass")}>
          <p id="otp-label" className={kcClsx("kcLabelClass")}>
            {msg("loginOtpOneTime")}
          </p>
          <input type="hidden" name="otp" value={code.replace(/\s/g, "")} />
          <div
            role="group"
            aria-labelledby="otp-label"
            className="mb-4 flex justify-between gap-2"
          >
            {Array.from({ length: OTP_DIGITS }, (_, index) => (
              <input
                key={index}
                ref={(el) => {
                  boxes.current[index] = el;
                }}
                id={index === 0 ? "otp" : undefined}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                aria-label={`${index + 1} / ${OTP_DIGITS}`}
                aria-invalid={hasError}
                aria-describedby={hasError ? "input-error-otp-code" : undefined}
                className="size-12 rounded-lg border border-white/10 bg-black/25 text-center text-xl text-white tabular-nums outline-none transition hover:border-white/20 focus:border-brand focus:ring-4 focus:ring-brand/15 aria-invalid:border-red-400"
                value={code[index]?.trim() ?? ""}
                onChange={(e) => enter(index, e.target.value)}
                onKeyDown={(e) => onKeyDown(index, e)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>
          <div>
            {messagesPerField.existsError("totp") && (
              <span
                id="input-error-otp-code"
                className={kcClsx("kcInputErrorMessageClass")}
                aria-live="polite"
                dangerouslySetInnerHTML={{
                  __html: kcSanitize(messagesPerField.get("totp")),
                }}
              />
            )}
          </div>
        </div>

        <div className={kcClsx("kcFormGroupClass")}>
          <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
            <div className={kcClsx("kcFormOptionsWrapperClass")}></div>
          </div>
          <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
            <input
              className={kcClsx(
                "kcButtonClass",
                "kcButtonPrimaryClass",
                "kcButtonBlockClass",
                "kcButtonLargeClass",
              )}
              name="login"
              id="kc-login"
              type="submit"
              value={msgStr("doLogIn")}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </form>
    </Template>
  );
}
