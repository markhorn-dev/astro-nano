import { useEffect, useState } from "react";
import GiftsTable from "./GiftsTable";
import type { GiftProps } from "@models/type";

export const Gifts = ({ admin }: GiftProps) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const password = urlParams.get("password");

    if (password !== import.meta.env.PUBLIC_GIFTS_PASSWORD && !admin) {
      window.location.href = "/forbidden";
    } else {
      setIsAuthorized(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    // Add loading component later
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return null; // Don't show anything until we've checked authorization
  }

  return (
    <div id="gifts-container">
      <GiftsTable admin={admin} />
    </div>
  );
};
