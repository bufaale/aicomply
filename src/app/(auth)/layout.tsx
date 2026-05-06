import "../aicomply-v2.css";
import { AuthSide, MktHeader } from "@/components/aicomply/atoms";

/**
 * Auth route group layout — renders the v2 split-panel chrome
 * (MktHeader + dark AuthSide left pane + paper form-wrap right pane).
 * Each form page provides only the inside-of-the-form-wrap content; the
 * heading, eyebrow, and Google button live with the form.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MktHeader />
      <div className="aic-auth-stage">
        <AuthSide />
        <div className="aic-auth-form-wrap">
          <div className="aic-auth-form">{children}</div>
        </div>
      </div>
    </>
  );
}
