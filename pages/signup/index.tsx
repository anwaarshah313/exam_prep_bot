import { useState, FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useRouter } from "next/router";
import Link from 'next/link';
import styles from './signup.module.css';

export default function Signup() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/"); 
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className={styles.signUpMain}>
        <div className={styles.formOutDiv}>
      <form onSubmit={handleSignup} className={styles.from}>
      <h2 className={styles.formHeading}>Sign Up</h2>

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

        <button type="submit"  className={styles.formBtn}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
     
        <p className={styles.loginPra}>
            Already have an account? <Link href="/login">Log in</Link>
          </p>
    </div>
    </div>
  );
}
