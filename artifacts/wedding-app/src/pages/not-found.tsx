import { Link } from "wouter";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import WeddingButton from "@/components/WeddingButton";

export default function NotFound() {
  return (
    <Layout>
      <PageContainer className="text-center py-20">
        <p className="text-xs text-[#9CAF88] uppercase tracking-wider mb-3">404</p>
        <h1 className="font-serif text-2xl text-[#4A3728] mb-4">Pagina non trovata</h1>
        <p className="text-sm text-[#8B6F5E] mb-8">La pagina che cerchi non esiste.</p>
        <Link href="/">
          <WeddingButton data-testid="button-go-home">Torna alla home</WeddingButton>
        </Link>
      </PageContainer>
    </Layout>
  );
}
