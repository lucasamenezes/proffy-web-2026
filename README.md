Markdown# Proffy Web 2026 — Fluxo de Cadastro e Perfil do Professor

Implementação do fluxo completo de **Dar aulas** (Formulário de Cadastro do Professor, Confirmação de Cadastro e Meu Perfil) na aplicação Proffy Web.

## Como rodar o projeto localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/lucasamenezes/proffy-web-2026/edit/feature/perfil-professor
   cd proffy-web-2026
Instale as dependências:Bashnpm install
Inicie o servidor de desenvolvimento:Bashnpm run dev
Acesse no navegador o endereço local exibido no terminal (por padrão http://localhost:5173). Rotas e Telas ImplementadasRotaComponenteDescrição/HomeTela inicial com botão Dar aula direcionando para /give-classes./give-classesTeacherFormsFormulário de cadastro de professores com validação via Zod, máscara de WhatsApp, limite de 300 caracteres na biografia e lista dinâmica de horários disponíveis./give-classes/register-completedTeacherFormsCompletedTela de confirmação ("Cadastro salvo!") com botão Acessar lista redirecionando para /profile./profileTeacherProfileTela Meu perfil refletindo os dados cadastrados (nome, matéria, e-mail, WhatsApp, biografia, custo da hora-aula e horários disponíveis), permitindo adicionar e excluir horários. Decisões Técnicas RelevantesReact Hook Form + Zod (zodResolver): Validação declarativa e centralizada de todos os campos obrigatórios, garantindo formato válido de WhatsApp, limite de 300 caracteres na biografia, conversão numérica de custo (z.coerce.number().positive()) e validação cruzada de horários (.refine() assegurando que o horário final seja posterior ao inicial).Horários Dinâmicos (useFieldArray): Adição e remoção dinâmica de horários disponíveis sem duplicação de estado.Persistência entre Telas (localStorage): Utilitário src/utils/teacher-storage.ts criado para persistir os dados informados no formulário /give-classes e carregá-los automaticamente na tela /profile.Componentização: Reaproveitamento integral dos componentes InputCustom, Select, TextArea e Finally mantendo o padrão visual com Tailwind CSS.
