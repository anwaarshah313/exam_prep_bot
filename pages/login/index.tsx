import { useState } from "react";
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence, sendPasswordResetEmail, browserLocalPersistence } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useRouter } from "next/router";
import Link from 'next/link';
import styles from './login.module.css';

interface LoginProps {
    // You can define props types here if there are any props
}

const Login: React.FC<LoginProps> = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const router = useRouter();
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // Set persistence based on the remember me checkbox
            setIsLoggingIn(true);
            await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
            await signInWithEmailAndPassword(auth, email, password);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userId = user.uid; // This is the Firebase User ID
            console.log("User ID:", userId); // You can use this ID as needed
            router.push("/"); // Redirect to home page
        } catch (err: any) {
            setError(err.message);
            setIsLoggingIn(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError("Please enter your email address.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            setError("Password reset email sent!"); // Use a more appropriate message or state for notifications
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.signUpMain}>
            <div className={styles.formOutDiv}>
                <form onSubmit={handleLogin} className={styles.from}>
                    <h2 className={styles.formHeading}>Log In</h2>
                    <div className={styles.inputOut}>
                        <label htmlFor="email" className={styles.placeholder}>
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputOut}>
                        <label htmlFor="password" className={styles.placeholder}>
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.forgot}>
                        <a href="#" onClick={(e: React.MouseEvent) => { e.preventDefault(); handleForgotPassword(); }} style={{ cursor: 'pointer' }}>Forgot Password?</a>
                    </div>

                    <div className={styles.checkBoxDiv}>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className={styles.checkInput}
                        />
                        <label className={styles.checkText}> Remember Me
                        </label>
                    </div>

                    <button type="submit" className={styles.formBtn}>
                    {isLoggingIn ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
                {error && <p style={{ color: "red" }}>{error}</p>}

                <p className={styles.loginPra}><Link href="/signup">Sign Up Now</Link></p>
            </div>
        </div>
    );
}

export default Login;
