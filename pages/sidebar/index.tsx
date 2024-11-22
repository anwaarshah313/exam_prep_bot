import React from 'react'
import Link from 'next/link'; // Importing NavLink from react-router-dom
import { FaHome, FaUser, FaEnvelope, FaSignOutAlt,FaComment  } from 'react-icons/fa'; // Importing icons from Font Awesome
import { ImStatsBars } from "react-icons/im";
import { PiChatsFill } from "react-icons/pi";
import { useRouter } from "next/router";
import { auth } from "../../firebaseConfig"; // Import Firebase auth
import { signOut } from "firebase/auth"; // Import signOut method from Firebase
import styles from "./sidebar.module.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Sidebar() {

    const router = useRouter();
    const isActive = (pathname: string) => router.pathname === pathname;

    const handleLogout = async () => {
        // Ask the user if they are sure they want to logout
        if (window.confirm("Are you sure you want to logout?")) {
            try {
                await signOut(auth); // Firebase logout
                router.push("/login"); // Redirect to login page after logout
                toast.success("Logged out successfully!");
            } catch (error) {
                console.error("Error logging out: ", error);
                toast.error("Failed to logout.");
            }
        }
    };
    

    return (
        <>
              <ToastContainer />
            <div className={styles.sidebar}>
                {/* Desktop/Laptop Sidebar */}
                <ul className={styles.leptopUl}>
                <div>
                    {/* <Link href="/" className={styles.navLink}>
                        <li className={`${styles.sidebarLi} ${isActive('/') ? ` ${styles.active}` : ''}`}>
                            <FaHome className={styles.sidebarIcon} /> Home
                        </li>
                    </Link>
                    <Link href="/about" className={styles.navLink}>
                        <li className={`${styles.sidebarLi} ${isActive('/about') ? ` ${styles.active}` : ''}`}>
                            <FaUser className={styles.sidebarIcon} /> Profile
                        </li>
                    </Link> */}
                    <Link href="/" className={styles.navLink}>
                        <li className={`${styles.sidebarLi} ${isActive('/') ? ` ${styles.active}` : ''}`}>
                        <PiChatsFill className={styles.sidebarIcon} /> Exam Bot
                        </li>
                    </Link>
                    <Link href="/message" className={styles.navLink}>
                        <li className={`${styles.sidebarLi} ${isActive('/message') ? ` ${styles.active}` : ''}`}>
                        <ImStatsBars className={styles.sidebarIcon} /> Exam Stats
                        </li>
                    </Link>
                    </div>
                    <div className={styles.BtnOut}>
                        <button onClick={handleLogout} className={styles.logOutBtn}>
                        Logout  <FaSignOutAlt className={styles.logOutIcon}  /> 
                        </button>
                    </div>
                </ul>

                {/* Mobile Sidebar */}
                <ul className={styles.mobileUl}>
                <div>
                    {/* <Link href="/" className={styles.navLink}>
                        <li className={`${styles.sidebarLi} ${isActive('/') ? ` ${styles.active}` : ''}`}>
                            <FaHome className={styles.sidebarIcon} />
                        </li>
                    </Link>
                    <Link href="/about" className={styles.navLink}>
                        <li className={`${styles.sidebarLi} ${isActive('/about') ? ` ${styles.active}` : ''}`}>
                            <FaUser className={styles.sidebarIcon} />
                        </li>
                    </Link> */}
                    <Link href="/" className={styles.navLink}>
                        <li className={`${styles.sidebarLi} ${isActive('/') ? ` ${styles.active}` : ''}`}>
                        <PiChatsFill className={styles.sidebarIcon} />
                        </li>
                    </Link>
                    <Link href="/message" className={styles.navLink}>
                        <li className={`${styles.sidebarLi} ${isActive('/message') ? ` ${styles.active}` : ''}`}>
                            <ImStatsBars  className={styles.sidebarIcon} />
                        </li>
                    </Link>
                    </div>
                    <div className={styles.MobBtnOut}>
                        <button onClick={handleLogout} className={styles.MoLogOutBtn}>
                         <FaSignOutAlt /> 
                        </button>
                    </div>
                </ul>
            </div>

        </>
    )
}
