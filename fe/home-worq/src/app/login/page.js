"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "aws-amplify/auth";
import { configureAmplify } from "../../lib/amplifyClient";
import styles from "../auth.module.css";

configureAmplify();

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setNotice("");
        setIsSubmitting(true);

        try {
            await signIn({ username: email, password });
            setNotice("Signed in successfully. You can navigate back to the app.");
        } catch (err) {
            setError(err?.message || "Unable to sign in. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <section className={styles.brandPanel}>
                    <div className={styles.brandMark}>
                        <span>HW</span>
                        Homeworq
                    </div>
                    <h1 className={styles.headline}>Welcome back.</h1>
                    <p className={styles.subhead}>
                        Pick up where you left off and stay on top of every assignment.
                    </p>
                    <div className={styles.accentCard}>
                        New here? Create an account in seconds and keep homework, notes,
                        and reminders in one place.
                    </div>
                </section>

                <section className={styles.formPanel}>
                    <div className={styles.formHeader}>
                        <h2>Sign in</h2>
                        <p>Use the email you registered with Cognito.</p>
                    </div>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <label className={styles.field}>
                            Email
                            <input
                                className={styles.input}
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </label>

                        <label className={styles.field}>
                            Password
                            <input
                                className={styles.input}
                                type="password"
                                name="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                        </label>

                        <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    {notice ? (
                        <div className={`${styles.message} ${styles.messageSuccess}`}>{notice}</div>
                    ) : null}
                    {error ? (
                        <div className={`${styles.message} ${styles.messageError}`}>{error}</div>
                    ) : null}

                    <div className={styles.footer}>
                        <span className={styles.hint}>Need an account?</span>
                        <Link href="/signup">Create one</Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
