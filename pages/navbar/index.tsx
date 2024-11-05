import React from 'react';
import Link from 'next/link';
import styles from "./navbar.module.css"

export default function Navbar() {
  return (
    <>
       <nav className={styles.navbarMain}>
            <div className={styles.navbarIn}>
                <h1 className={styles.navbarLogo}>Dashboard</h1>

                {/* Display the image */}
                <img
                    src="https://th.bing.com/th/id/OIP.WPmdNoTzIuLFH4m-D36ArAHaHa?rs=1&pid=ImgDetMain"
                    alt="User icon"
                    className={styles.navbarImage}
                    
                />
            </div>
        </nav>
    </>
  );
}
