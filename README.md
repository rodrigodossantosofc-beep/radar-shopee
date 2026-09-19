# Radar Shopee

Painel próprio de inteligência de mercado para Shopee Brasil.

## Fluxo

Shopee Brasil pública → coletor → snapshots históricos → PostgreSQL → motor de inteligência → dashboard.

## Coletor público

A primeira fonte não depende de conta de afiliado.

- `GET /api/marketplace/search?q=aparelho%20abdominal&limit=30`
- `GET /api/marketplace/product?itemId=...&shopId=...`

O coletor mantém ausentes como `null`: não inventamos quantidade vendida, avaliações ou qualquer métrica que a fonte não exponha.

Endpoints públicos da Shopee podem mudar ou aplicar proteção anti-bot. Por isso a arquitetura separa a fonte do restante do sistema; podemos trocar/adicionar provedores sem reescrever o painel.

## Próxima camada

Persistência automática dos snapshots no PostgreSQL e cálculo de velocidade, aceleração e score de oportunidade.
