<div align="center">

# ☕ Varanda Amarela

**Café coado na hora, na varanda mais amarela do bairro.**

Site demonstrativo de uma cafeteria fictícia, com cardápio interativo e pedido pelo WhatsApp.

[**Ver site no ar →**](https://varandaamarela.vercel.app/)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## Sobre o projeto

A Varanda Amarela é um projeto de portfólio da **GRL**. A ideia é mostrar como um site simples pode ajudar um comércio local a vender mais: o cliente vê o cardápio, monta o pedido e envia direto para o WhatsApp da loja.

Todo o site foi escrito do zero, sem template, framework ou construtor pronto.

## Funcionalidades

- 🟢 **Aberto agora:** o selo no topo mostra se a cafeteria está aberta, com base no horário de Fortaleza.
- 📋 **Cardápio em abas:** cafés, gelados, salgados e doces.
- 🛒 **Pedido pelo WhatsApp:** adicione itens, ajuste as quantidades e envie a lista pronta, com o total.
- 📅 **Horários:** o dia de hoje aparece destacado na tabela.
- ♨️ **Ilustração animada:** a xícara do topo é feita em SVG, com vapor animado.
- 📱 **Responsivo:** pensado primeiro para o celular.
- ♿ **Acessível:** navegação por teclado, foco visível e respeito à preferência de reduzir animações.

## Estrutura

```
varanda-amarela/
├── index.html    # estrutura da página
├── style.css     # visual e responsividade
├── script.js     # cardápio, pedido e horário de funcionamento
└── favicon.svg   # ícone da aba
```

## Como personalizar

Tudo o que muda de uma cafeteria para outra fica no topo do `script.js`:

| O que | Onde |
| --- | --- |
| Número do WhatsApp | `const WHATSAPP` |
| Horários de funcionamento | `const HORARIOS` |
| Itens, descrições e preços | `const CARDAPIO` |

## Rodando localmente

Não precisa instalar nada. Basta abrir o `index.html` no navegador.

---

<div align="center">

**Projeto demonstrativo.** A cafeteria, o endereço e os preços são fictícios.

Feito pela **GRL**, sites feitos do zero · [Instagram @somosgrl](https://www.instagram.com/somosgrl/)

</div>
