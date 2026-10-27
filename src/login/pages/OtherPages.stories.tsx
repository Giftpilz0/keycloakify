import type { Meta, StoryObj } from "@storybook/react-vite";
import type { KcContext } from "../KcContext";
import KcPage from "../KcPage";
import { getKcContextMock } from "../KcPageStory";

// Pages of the login flows that Keycloakify renders with the theme's classes.
function Page({ pageId }: { pageId: KcContext["pageId"] }) {
  return <KcPage kcContext={getKcContextMock({ pageId, overrides: {} })} />;
}

const meta = {
  title: "login/other pages",
  component: Page,
} satisfies Meta<typeof Page>;

export default meta;

type Story = StoryObj<typeof meta>;

const story = (pageId: KcContext["pageId"]): Story => ({ args: { pageId } });

export const SelectAuthenticator = story("select-authenticator.ftl");
export const WebauthnAuthenticate = story("webauthn-authenticate.ftl");
export const WebauthnRegister = story("webauthn-register.ftl");
export const LoginResetPassword = story("login-reset-password.ftl");
export const LoginUpdatePassword = story("login-update-password.ftl");
export const LoginVerifyEmail = story("login-verify-email.ftl");
export const Error = story("error.ftl");
export const Info = story("info.ftl");
export const LogoutConfirm = story("logout-confirm.ftl");
export const LoginPageExpired = story("login-page-expired.ftl");
