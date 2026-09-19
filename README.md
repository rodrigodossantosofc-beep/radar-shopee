# Radar Shopee

Painel de inteligência de mercado para Shopee Brasil, inspirado na experiência de análise do Kalodata.

## Objetivo

Coletar dados reais disponíveis via Shopee Affiliate/Open APIs e fontes públicas permitidas, armazenar snapshots históricos e calcular sinais próprios de:

- velocidade de vendas observada
- aceleração
- tendência
- variação de preço
- crescimento de avaliações
- concorrência
- score de oportunidade

## Arquitetura inicial

```
Shopee API / fontes públicas
          ↓
       Collector
          ↓
      PostgreSQL
          ↓
   Analytics Engine
          ↓
     REST API
          ↓
   Dashboard Web
```

## Status

MVP em construção.

> Regra do projeto: não inventar métricas. Cada dado será marcado como coletado, calculado ou indisponível.
