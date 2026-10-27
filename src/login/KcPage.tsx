import { Suspense, lazy } from "react";
import DefaultPage from "keycloakify/login/DefaultPage";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import { classes } from "./classes";
import Template from "./Template";

const UserProfileFormFields = lazy(
  () => import("keycloakify/login/UserProfileFormFields"),
);
const Login = lazy(() => import("./pages/Login"));
const LoginOtp = lazy(() => import("./pages/LoginOtp"));
const LoginConfigTotp = lazy(() => import("./pages/LoginConfigTotp"));

export default function KcPage({ kcContext }: { kcContext: KcContext }) {
  const { i18n } = useI18n({ kcContext });
  const props = { i18n, classes, Template, doUseDefaultCss: false };

  return (
    <Suspense>
      {(() => {
        switch (kcContext.pageId) {
          case "login.ftl":
            return <Login kcContext={kcContext} {...props} />;
          case "login-otp.ftl":
            return <LoginOtp kcContext={kcContext} {...props} />;
          case "login-config-totp.ftl":
            return <LoginConfigTotp kcContext={kcContext} {...props} />;
          default:
            return (
              <DefaultPage
                kcContext={kcContext}
                {...props}
                UserProfileFormFields={UserProfileFormFields}
                doMakeUserConfirmPassword={true}
              />
            );
        }
      })()}
    </Suspense>
  );
}
