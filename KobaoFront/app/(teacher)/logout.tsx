import { useEffect } from "react";
import { logout } from "@/src/auth";
import { router } from "expo-router";

export default function LogoutScreen() {
  useEffect(() => {
    (async () => {
      await logout();
      router.replace("/login");
    })();
  }, []);
  return null;
}