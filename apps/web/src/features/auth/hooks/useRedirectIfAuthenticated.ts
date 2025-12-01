import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useRedirectIfAuthenticated(target = "/movies"): void {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(target, { replace: true });
    }
  }, [navigate, target]);
}
