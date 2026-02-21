import React, { useEffect, useState } from "react";
import axios from "axios";
import MaintenancePage from "./MaintenancePage";

export const withServerCheck = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithServerCheckComponent(props: P) {
    const [isServerOnline, setIsServerOnline] = useState(true);

    useEffect(() => {
      const checkServer = async () => {
        try {
          await axios.get("http://localhost:8080/auth/welcome", {
            timeout: 5000, // 5 seconds timeout
          });
          setIsServerOnline(true);
        } catch (error) {
          if (axios.isAxiosError(error) && !error.response) {
            setIsServerOnline(false);
          }
        }
      };

      checkServer();

      // Check server status every 30 seconds
      const interval = setInterval(checkServer, 30000);

      return () => clearInterval(interval);
    }, []);

    if (!isServerOnline) {
      return <MaintenancePage />;
    }

    return <WrappedComponent {...props} />;
  };
};
