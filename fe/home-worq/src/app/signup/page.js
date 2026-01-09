"use client";

import Link from "next/link";
import { useState } from "react";
import { confirmSignUp, signUp } from "aws-amplify/auth";
import { configureAmplify } from "../../lib/amplifyClient";
import styles from "../auth.module.css";

configureAmplify();

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmationCode, setConfirmationCode] = useState("");
    const [stage, setStage] = useState("signup");
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSignup = async (event) => {
        event.preventDefault();
        setError("");
        setNotice("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);

        try {
            const { nextStep } = await signUp({
                username: email,
                password,
                options: {
                    userAttributes: { email },
                },
            });

            if (nextStep?.signUpStep === "CONFIRM_SIGN_UP") {
                setStage("confirm");
                setNotice("Check your email for the confirmation code.");
            } else {
                setNotice("Account created. You can now sign in.");
            }
        } catch (err) {
            setError(err?.message || "Unable to create account. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirm = async (event) => {
        event.preventDefault();
        setError("");
        setNotice("");
        setIsSubmitting(true);

        try {
            await confirmSignUp({ username: email, confirmationCode });
            setNotice("Your account is confirmed. You can sign in now.");
            setStage("confirmed");
        } catch (err) {
            setError(err?.message || "Unable to confirm signup. Please try again.");
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
                    <h1 className={styles.headline}>Join the studio.</h1>
                    <p className={styles.subhead}>
                        Organize every assignment with a calm, focused workspace.
                    </p>
                    <div className={styles.accentCard}>
                        Amplify + Cognito handle authentication so you can stay focused
                        on what matters next.
                    </div>
                </section>

                <section className={styles.formPanel}>
                    <div className={styles.formHeader}>
                        <h2>Create your account</h2>
                        <p>We will send a verification code to your email.</p>
                    </div>

                    {stage === "confirm" ? (
                        <form className={styles.form} onSubmit={handleConfirm}>
                            <label className={styles.field}>
                                Confirmation code
                                <input
                                    className={styles.input}
                                    type="text"
                                    name="code"
                                    autoComplete="one-time-code"
                                    value={confirmationCode}
                                    onChange={(event) => setConfirmationCode(event.target.value)}
                                    required
                                />
                            </label>

                            <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Confirming..." : "Confirm account"}
                            </button>
                        </form>
                    ) : (
                        <form className={styles.form} onSubmit={handleSignup}>
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
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                />
                            </label>

                            <label className={styles.field}>
                                Confirm password
                                <input
                                    className={styles.input}
                                    type="password"
                                    name="confirmPassword"
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    required
                                />
                            </label>

                            <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Creating account..." : "Create account"}
                            </button>
                        </form>
                    )}

                    {notice ? (
                        <div className={`${styles.message} ${styles.messageSuccess}`}>{notice}</div>
                    ) : null}
                    {error ? (
                        <div className={`${styles.message} ${styles.messageError}`}>{error}</div>
                    ) : null}

                    <div className={styles.footer}>
                        <span className={styles.hint}>Already have an account?</span>
                        <Link href="/login">Sign in</Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
