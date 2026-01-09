"use client";

import { Amplify } from "aws-amplify";

const amplifyConfig = {
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
            userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
            loginWith: {
                email: true,
            },
        },
    },
};

let isConfigured = false;

export function configureAmplify() {
    if (isConfigured) {
        return;
    }

    Amplify.configure(amplifyConfig, { ssr: false });
    isConfigured = true;
}
