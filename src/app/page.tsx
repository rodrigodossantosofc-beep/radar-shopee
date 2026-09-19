const products = [
  { name: "Aparelho abdominal com ventosa", price: "—", sales: "—", delta: "—", accel: "Aguardando histórico", score: "—" },
  { name: "Mini seladora portátil", price: "—", sales: "—", delta: "—", accel: "Aguardando histórico", score: "—" },
  { name: "Luminária LED magnética", price: "—", sales: "—", delta: "—", accel: "Aguardando histórico", score: "—" },
];

export default function Home() {
  return (
    <main className="wrap">
      <div className="top">
        <div>
          <div className="brand">Radar Shopee</div>
          <div className="muted">Inteligência de mercado • Shopee Brasil</div>
        </div>
        <span className="badge">MVP conectado</span>
      </div>

      <div className="grid">
        <div className="card"><div className="muted">Produtos monitorados</div><div className="big">0</div></div>
        <div className="card"><div className="muted">Em aceleração</div><div className="big">0</div></div>
        <div className="card"><div className="muted">Oportunidades</div><div className="big">0</div></div>
        <div className="card"><div className="muted">Última coleta</div><div className="big">—</div></div>
      </div>

      <div className="panel">
        <div className="row head">
          <div>Produto</div><div>Preço</div><div className="hide">Vendidos</div><div className="hide">Δ 24h</div><div>Aceleração</div><div>Score</div>
        </div>
        {products.map((p) => (
          <div className="row" key={p.name}>
            <div>{p.name}</div><div>{p.price}</div><div className="hide">{p.sales}</div><div className="hide">{p.delta}</div><div>{p.accel}</div><div className="score">{p.score}</div>
          </div>
        ))}
      </div>

      <p className="muted">
        Nenhuma métrica simulada é exibida como dado real. O painel só preenche os campos depois das coletas.
      </p>
    </main>
  );
}
