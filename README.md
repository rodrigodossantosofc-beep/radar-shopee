# Radar Pulse — Google AI Studio + Colab

Interface premium para usar o notebook do Colab como motor temporário de análise.

## Como funciona

1. Abra o notebook **Radar_TikTok_Colab_Motor_API.ipynb** no Google Colab.
2. Execute as células até o final.
3. A última célula gera uma URL parecida com `https://xxxx.trycloudflare.com`.
4. Abra esta interface.
5. Cole a URL em **Conectar motor**.
6. Rode o modo **Em alta** ou **Palavra-chave**.

## Google AI Studio

No Google AI Studio, abra o modo Build e escolha **Importar do GitHub**.  
Use o repositório `rodrigodossantosofc-beep/radar-shopee` e a branch `tiktok-radar-ai-studio`.

O painel não precisa de chave Gemini para funcionar. O frontend conversa diretamente com a API temporária do Colab.

## Segurança

- Não coloque `msToken` ou cookies do TikTok no GitHub.
- O token fica somente no notebook Colab.
- O frontend guarda apenas a URL temporária do motor no `localStorage`.
- O Quick Tunnel é temporário: ao reiniciar o Colab, copie a nova URL para o painel.

## Rodar localmente

```bash
npm install
npm run dev
```
