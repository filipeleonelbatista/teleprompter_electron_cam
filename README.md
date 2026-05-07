<h1 align="center">
  <img src="./public/icon.png" alt="Teleprompter Electron Cam" width="128">
  <br>
  Teleprompter Electron Cam
</h1>

Overlay de teleprompter transparente para apresentações e transmissões ao vivo. Compatível com OBS e outras ferramentas de captura de tela.

## Recursos

- Overlay transparente sobre qualquer aplicação
- Editor de texto com suporte a Markdown
- Ajuste de velocidade de scroll
- Controle de fonte, tamanho e opacidade
- Modo Always on Top
- Controles via teclado
- Tema claro/escuro

## Download

Acesse a [página de downloads](https://filipeleonelbatista.github.io/teleprompter_electron_cam/download.html) para baixar a versão do seu sistema operacional.

## Controles

| Tecla | Ação |
|------|------|
| `Space` | Play/Pause |
| `R` | Reiniciar scroll |
| `F` | Alternar tela cheia |
| `T` | Alternar tema |
| `E` | Abrir/fechar editor |
| `↑/↓` | Ajustar velocidade |
| `+/−` | Ajustar tamanho da fonte |

## Desenvolvimento

```bash
# Instalar dependências
npm install

#Modo desenvolvimento
npm run dev

# Build
npm run build        # Todos
npm run build:win    # Windows
npm run build:mac   # macOS
npm run build:linux  # Linux
```

## Testes

```bash
npm run test        # Executar testes
npm run test:watch #Modo watch
npm run test:cov   # Com coverage
```

## Tech Stack

- Electron
- React + TypeScript
- Vite
- TailwindCSS
- Vitest

## Licença

MIT