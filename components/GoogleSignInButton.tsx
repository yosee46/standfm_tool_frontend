import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

export function GoogleSignInButton() {
  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      auth.tenantId = "standfm-sso-pqh3q";  // テナントIDを設定
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google認証エラー:", error);
    }
  };

  return (
    <Button onClick={handleSignIn}>
      Googleでサインイン
    </Button>
  );
}