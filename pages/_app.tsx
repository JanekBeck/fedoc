import "@/styles/globals.css"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import {SSRProvider} from "react-bootstrap";
import type {AppProps} from "next/app"
import Head from "next/head";

export default function App({Component, pageProps}: AppProps) {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <SSRProvider>
                <Component {...pageProps} />
            </SSRProvider>
        </>
    );
}
