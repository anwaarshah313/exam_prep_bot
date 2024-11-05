import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Navbar from "./navbar";
import { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./login";
import Signup from "./signup"; // Import the Signup component
import Sidebar from "./sidebar";

export default function App({ Component, pageProps }: AppProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const currentPath = router.pathname;

  useEffect(() => {
    // Check if the user is logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        // If user is logged in, prevent access to login or signup pages
        if (currentPath === "/login" || currentPath === "/signup") {
          router.push("/"); // Redirect logged-in user to home (or any other protected route)
        }
      } else {
        setIsLoggedIn(false);
        // If not logged in and not already on login or signup page, redirect to login
        if (currentPath !== "/login" && currentPath !== "/signup") {
          router.push("/login");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [router, currentPath]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user is logged in, render the main component
  if (isLoggedIn) {
    return (
      <>
       <div className="navbar-area">
          <Navbar /> 
        </div>

        <div className="content-out">

          <div className="sidebar-area">
            <Sidebar/>
          </div>
        
          <div className="content-area">

        {/* Render the main component */}
        <Component {...pageProps} />
        </div>
        
        </div>
      </>
    );
  }

  // If the user is not logged in, display login or signup form based on the current path
  return (
    <>
      {/* Navbar not needed for login/signup pages */}
      
      {/* Pathname displayed in a div */}
      {/* <div style={{ padding: "10px" }}>Current Path: {currentPath}</div> */}

      {/* Render Login or Signup based on the pathname */}
      {currentPath === "/login" && <Login />}
      {currentPath === "/signup" && <Signup />}
    </>
  );
}
