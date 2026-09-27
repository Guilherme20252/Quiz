# Quiz para Programadores

Projeto que une um menu responsivo (NavBar) e um quiz interativo (Quiz-para-programadores) em uma única página (SPA simples, sem frameworks).

## Estrutura
```
quiz-portfolio/
├── index.html
├── css/style.css
├── js/app.js
└── assets/illustration.jpg
```

## Funcionalidades
- Menu responsivo com hambúrguer no mobile
- Navegação por seções: Início, Quiz, Recorde e Mais
- Correção automática do quiz (8 perguntas, tipos variados: rádio, texto, senha, data, checkbox, upload, select)
- Nota final com mensagem de acordo com a pontuação
- Recorde salvo no navegador via `localStorage` (melhor pontuação, última tentativa, total de tentativas)

## Como rodar
Basta abrir o `index.html` no navegador, ou usar um servidor local (ex: extensão Live Server do VS Code).

## Próximos passos sugeridos
- Trocar o e-mail e o link do GitHub em `index.html` (seção "Mais") pelos seus reais
- Adicionar mais perguntas ao quiz em `index.html` + gabarito correspondente em `js/app.js` (função `corrigirQuiz`)
