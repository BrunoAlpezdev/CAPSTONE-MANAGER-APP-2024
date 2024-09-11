# INFORMACIÓN
- Los archivos del proyecto como: Diagrama de la base de datos, arquitecturas, etc. Se encuentran en la carpeta de "documents" en "gestorio" que es nuestro proyecto

# SETUP
- En el proyecto utilizamos [pnpm], por lo tanto con "pnpm i" o "pnpm install" se descargarán las dependencias
- En el caso de dar errores extraños o de imprevisto, tener en cuenta el lintern "ESLint" que tenemos configurado en el proyecto, este a veces se bugea por motivos que se escapan de nuestro poder, es mas que nada por conflictos con el linter de nextJS

# Reuniones y Bitacora
- [Bitácora Notion](https://www.notion.so/Reuniones-y-Bit-cora-1088f8a163e942c6aff647b58f98194c)

# Estructura de Proyecto
```
└── 📁gestorio
    └── 📁.vscode
        └── settings.json
    └── 📁documents
        └── Acta de Constitución.docx
        └── Arquitectura.png
        └── Caso de uso 1.1.jpg
        └── Database2.0.pdf
        └── edt.jpg
        └── Mockups.docx
        └── ...
    └── 📁public
        └── background.svg
        └── block.svg
        └── inventario.svg
        └── menu.svg
        └── mock.png
        └── POS.svg
        └── proveedores.svg
        └── reportes.svg
        └── SAVANNALOGOpng.png
        └── user.svg
        └── ...
    └── 📁src
        └── 📁app
            └── 📁(system)
                └── 📁home
                    └── page.tsx
                └── layout.tsx
            └── 📁components
                └── footer.component.tsx
                └── header.component.tsx
            └── 📁styles
                └── globals.css
                └── system.css
            └── favicon.ico
            └── layout.tsx
            └── page.tsx
            └── ...
    └── .eslintrc.json
    └── .gitignore
    └── .prettierrc
    └── next-env.d.ts
    └── next.config.mjs
    └── package.json
    └── pnpm-lock.yaml
    └── postcss.config.mjs
    └── README.md
    └── tailwind.config.ts
    └── tsconfig.json
```
