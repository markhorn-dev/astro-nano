import React, { useEffect, useState } from "react";

const Gifts = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const password = urlParams.get('password');
    
    if (password !== import.meta.env.PUBLIC_GIFTS_PASSWORD) {
      window.location.href = '/forbidden';
    } else {
      setIsAuthorized(true)
    }
    setIsLoading(false)
  }, []);

  if (isLoading) {
    // Add loading component later
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return null;  // Don't show anything until we've checked authorization
  }

  return(
    <div>
      Gifts!
    </div>
  )
}

export default Gifts