"use client";

import { FormEvent, useState } from "react";

type Product = {
  itemId: string; shopId: string; name: string; price: number | null;
  sales: number | null; rating: number | null; reviewCount: number | null;
  imageUrl: string | null; productUrl: string;
};

export default function Home() {
  const [query,setQuery]=useState("aparelho abdominal");
  const [products,setProducts]=useState<Product[]>([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [collectedAt,setCollectedAt]=useState("");

  async function search(e?: FormEvent) {
    e?.preventDefault(); setLoading(true); setError("");
    try {
      const res=await fetch(`/api/marketplace/search?q=${encodeURIComponent(query)}&limit=30`);
      const data=await res.json();
      if(!res.ok || !data.ok) throw new Error(data.error || "Falha na coleta");
      setProducts(data.products || []); setCollectedAt(data.collectedAt || "");
    } catch(err) {
      setProducts([]); setError(err instanceof Error ? err.message : "Falha na coleta");
    } finally { setLoading(false); }
  }

  const withSales=products.filter(p=>p.sales!=null).length;
  const avgRating=products.filter(p=>p.rating!=null).reduce((a,p)=>a+(p.rating||0),0)/(products.filter(p=>p.rating!=null).length||1);

  return <main className="shell">
    <aside className="sidebar">
      <div className="logo"><span className="logoMark">R</span><div>RADAR <b>SHOPEE</b></div></div>
      <nav>
        <a className="active">◈ Visão geral</a><a>⌕ Produtos</a><a>↗ Em aceleração</a>
        <a>◇ Categorias</a><a>▣ Lojas</a><a>☆ Monitorados</a>
      </nav>
      <div className="sideBottom"><div className="liveDot"/> Coletor marketplace<div className="small">Fonte pública • Brasil</div></div>
    </aside>

    <section className="content">
      <header><div><div className="eyebrow">INTELIGÊNCIA DE MERCADO</div><h1>Descubra o que está <span>ganhando tração.</span></h1></div><div className="status">● RADAR ATIVO</div></header>

      <form className="search" onSubmit={search}>
        <span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pesquise um produto, nicho ou palavra-chave..." />
        <button disabled={loading}>{loading ? "COLETANDO..." : "ANALISAR SHOPEE"}</button>
      </form>

      <div className="metrics">
        <div className="metric"><label>RESULTADOS DA COLETA</label><strong>{products.length}</strong><small>produtos encontrados</small></div>
        <div className="metric"><label>COM DADO DE VENDAS</label><strong>{withSales}</strong><small>quando exposto pela fonte</small></div>
        <div className="metric"><label>AVALIAÇÃO MÉDIA</label><strong>{products.length ? avgRating.toFixed(2) : "—"}</strong><small>nos resultados disponíveis</small></div>
        <div className="metric hot"><label>ACELERAÇÃO 24H</label><strong>—</strong><small>começa após snapshots</small></div>
      </div>

      <div className="sectionTitle"><div><b>Radar de produtos</b><span>{collectedAt ? "Última coleta: "+new Date(collectedAt).toLocaleString("pt-BR") : "Faça a primeira busca real"}</span></div><div className="legend">● DADOS COLETADOS AO VIVO</div></div>

      {error && <div className="error"><b>A coleta não respondeu.</b><span>{error}</span><small>Não substituímos falhas por números fictícios.</small></div>}

      <div className="table">
        <div className="tr th"><div>PRODUTO</div><div>PREÇO</div><div>VENDIDOS</div><div>AVALIAÇÃO</div><div>REVIEWS</div><div>SINAL</div></div>
        {!loading && products.length===0 && !error && <div className="empty"><b>Seu radar está pronto.</b><span>Pesquise acima para puxar os primeiros produtos reais da Shopee.</span></div>}
        {products.map((p,i)=><a className="tr product" key={p.itemId} href={p.productUrl} target="_blank" rel="noreferrer">
          <div className="prod"><div className="rank">{String(i+1).padStart(2,"0")}</div>{p.imageUrl ? <img src={p.imageUrl} alt="" />:<div className="imgPh"/>}<div><b>{p.name}</b><small>ID {p.itemId}</small></div></div>
          <div>{p.price!=null ? p.price.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}) : "—"}</div>
          <div>{p.sales!=null ? p.sales.toLocaleString("pt-BR") : "—"}</div>
          <div>{p.rating!=null ? "★ "+p.rating.toFixed(2) : "—"}</div>
          <div>{p.reviewCount!=null ? p.reviewCount.toLocaleString("pt-BR") : "—"}</div>
          <div><span className="waiting">OBSERVANDO</span></div>
        </a>)}
      </div>
      <footer>RADAR SHOPEE • Dados ausentes permanecem como “—”. Velocidade e aceleração serão calculadas somente com histórico real.</footer>
    </section>
  </main>
}
