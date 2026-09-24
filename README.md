# Lumière — tema Shopify para joalheria

Tema Online Store 2.0 inspirado no layout da 77 Diamonds: barra de anúncios rotativa, mega menu, banner principal, diferenciais, coleção assinatura em carrossel, compra por formato, blocos de categoria, sob medida, imprensa, depoimentos, showroom e newsletter.

## Rodar / publicar

```bash
shopify theme dev --store sualoja.myshopify.com   # preview local com hot reload
shopify theme check                               # lint
shopify theme push --unpublished                  # envia como novo tema (não publicado)
```

## Configuração na loja

1. **Menu principal** (`main-menu`): até 3 níveis. O 2º nível vira coluna do mega menu e o 3º nível, a lista de links dessa coluna.
   Para colocar uma imagem no mega menu: *Cabeçalho > Adicionar bloco "Imagem do mega menu"* e digite o nome exato do item do menu.
2. **Menus do rodapé**: crie menus (ex.: `footer`, `sobre-nos`, `legal`) e selecione-os nos blocos do rodapé.
3. **Páginas**: crie as páginas e atribua os modelos:
   - `page.appointment`: agendamento de visita (data, horário, showroom)
   - `page.contact`: contato
   - `page.faq`: perguntas frequentes
4. **Filtros de coleção**: instale o app *Shopify Search & Discovery* e crie os filtros (metal, formato, preço…).
5. **Amostras de metal**: em *Produtos > Opções*, use a categoria com cores/imagens (ex.: Ouro amarelo, Ouro branco, Platina); o seletor exibe as amostras automaticamente.
6. **WhatsApp**: *Configurações do tema > WhatsApp*, número com DDI (ex.: 5511999999999).

## Estrutura

| Pasta | Conteúdo |
| --- | --- |
| `sections/` | Seções editáveis (hero, features, featured-collection, category-tiles, shop-by-shape, image-with-text, logo-list, testimonials, faq, newsletter, product, collection, cart, cart-drawer…) |
| `snippets/` | `product-card`, `price`, `facets`, `cart-line-items`, `icon`, `localization-form`… |
| `assets/` | `critical.css` (design system e tokens) e `theme.js` (API do carrinho, sliders, animações) |
| `locales/` | `pt-BR.json` e `en.default.json` |

Cores, fontes, arredondamento dos botões e proporção das imagens ficam em *Configurações do tema*.
