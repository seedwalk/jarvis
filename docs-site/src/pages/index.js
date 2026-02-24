import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";

export default function Home() {
  return (
    <Layout title="Inicio" description="Documentacion del proyecto Jarvis">
      <main className="hero-wrapper">
        <section className="hero-content">
          <h1>Jarvis Docs</h1>
          <p>Documentacion tecnica y guias de uso del proyecto.</p>
          <Link className="button button--primary button--lg" to="/docs/intro">
            Ir a la documentacion
          </Link>
        </section>
      </main>
    </Layout>
  );
}
