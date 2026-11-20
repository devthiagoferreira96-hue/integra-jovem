

export type Nivel = "Iniciante" | "Intermediário" | "Avançado";

export type Categoria =
  | "Educação Financeira"
  | "Carreira e Futuro"
  | "Autoconhecimento"
  | "Vida Prática"
  | "Bem-Estar Digital";

export const categorias: Categoria[] = [
  "Educação Financeira",
  "Carreira e Futuro",
  "Autoconhecimento",
  "Vida Prática",
  "Bem-Estar Digital",
];

export type Aula = {

  id: string;
  titulo: string;
  duracao: string;
  tipo: "Leitura curta" | "Atividade prática" | "Reflexão" | "Vídeo";

  concluida: boolean;

  conteudo?: string;

  pergunta?: string;

  temPlanoInterativo?: boolean;

  bonus?: "primeiro-gasto";
};

export type Modulo = {
  titulo: string;
  resumo: string;
  aulas: Aula[];
};

export type Curso = {
  slug: string;
  titulo: string;
  categoria: Categoria;
  nivel: Nivel;
  descricao: string;
  resumoLongo: string;
  duracao: string;
  blocos: number;
  xp: number;
  progresso: number;
  avaliacao: number;
  destaque?: boolean;
  modulos: Modulo[];
};

const slugificar = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const aula = (
  titulo: string,
  duracao: string,
  tipo: Aula["tipo"],
  concluida = false,
  extras?: {
    conteudo?: string;
    pergunta?: string;
    temPlanoInterativo?: boolean;
    bonus?: Aula["bonus"];
  },
): Aula => ({
  id: slugificar(titulo),
  titulo,
  duracao,
  tipo,
  concluida,
  ...extras,
});

export const proximaTrilha: Partial<Record<string, string>> = {
  "primeiro-dinheiro": "saude-emocional",
  "saude-emocional": "descobrindo-profissoes",
  "descobrindo-profissoes": "quem-eu-sou",
  "quem-eu-sou": "vida-adulta-burocracia",
  "vida-adulta-burocracia": "uso-consciente-tecnologia",
};

export const cursos: Curso[] = [
  {
    slug: "primeiro-dinheiro",
    titulo: "Seu primeiro dinheiro",
    categoria: "Educação Financeira",
    nivel: "Iniciante",
    descricao:
      "Renda, gastos, escolhas do dia a dia e planejamento — os primeiros conceitos para administrar seu próprio dinheiro.",
    resumoLongo:
      "Uma trilha completa de referência sobre organização financeira: de onde vem seu dinheiro, para onde ele vai, como decidir entre necessidade e vontade, montar um orçamento, definir metas e criar uma reserva para imprevistos.",
    duracao: "1h 07min",
    blocos: 12,
    xp: 320,
    progresso: 64,
    avaliacao: 4.8,
    destaque: true,
    modulos: [
      {
        titulo: "Módulo 1 — Entendendo seu dinheiro",
        resumo: "Primeiros conceitos e organização financeira.",
        aulas: [
          aula("Dinheiro não aparece do nada", "4 min", "Leitura curta", false, {
            conteudo:
              "Todo dinheiro tem uma origem: pode ser renda fixa (mesada, salário), renda variável (bicos, vendas, freelas) ou renda extra (presentes, prêmios). Entender de onde vem o dinheiro é o primeiro passo para saber quanto realmente se tem disponível em um período — a renda variável muda de mês a mês, então não deve ser tratada como garantida.",
            pergunta: "Liste três fontes de dinheiro que você já recebeu, classificando cada uma como fixa, variável ou extra.",
          }),
          aula("Para onde seu dinheiro vai?", "6 min", "Atividade prática", false, {
            conteudo:
              "Receita é tudo o que entra; despesa é tudo o que sai. A diferença entre as duas é o saldo, que pode ser positivo (sobra) ou negativo (falta). Organizar os gastos em categorias — como alimentação, lazer e transporte — ajuda a enxergar padrões de consumo que passam despercebidos.",
            pergunta: "No Controle de Gastos, anote suas receitas e despesas do mês e calcule seu saldo.",
            bonus: "primeiro-gasto",
          }),
          aula("Necessidade ou vontade?", "5 min", "Leitura curta", false, {
            conteudo:
              "Necessidades são itens essenciais para a vida cotidiana (moradia, alimentação, material escolar); vontades são desejos que trazem satisfação, mas não são indispensáveis no momento. A mesma coisa pode ser necessidade para uma pessoa e vontade para outra, dependendo do contexto — por isso não existe uma lista fixa e universal.",
            pergunta: "Pense na sua última compra: ela era necessidade, vontade, ou dependeu do contexto?",
          }),
          aula("Seu primeiro orçamento", "7 min", "Atividade prática", false, {
            conteudo:
              "Um orçamento é a organização da renda em categorias, definindo quanto será destinado a cada uma antes de gastar — e não depois. Isso ajuda a evitar surpresas no fim do mês e a direcionar o dinheiro para o que realmente importa, sem deixar nenhuma categoria essencial descoberta nem ultrapassar a renda disponível.",
            pergunta: "No simulador de Orçamento, distribua uma renda fictícia entre categorias até fechar com saldo zero ou positivo.",
          }),
        ],
      },
      {
        titulo: "Módulo 2 — Escolhas do dia a dia",
        resumo: "Consumo consciente e custo-benefício.",
        aulas: [
          aula("“Eu mereço”", "5 min", "Leitura curta", false, {
            conteudo:
              "Custo de oportunidade é o que se deixa de ganhar ou fazer ao escolher uma opção em vez de outra. Toda escolha financeira tem um custo invisível: o que você abre mão para tê-la.",
            pergunta: "Pense num dinheiro extra que você recebeu: o que você \"abriu mão\" com a escolha que fez sobre ele?",
          }),
          aula("O barato pode sair caro", "5 min", "Leitura curta", false, {
            conteudo:
              "Preço baixo nem sempre significa economia. Durabilidade e qualidade influenciam o custo real de um produto ao longo do tempo — às vezes pagar mais uma vez sai mais barato do que comprar várias vezes o item mais barato.",
            pergunta: "Compare dois produtos parecidos que você conhece: qual tem melhor custo-benefício, considerando preço e durabilidade?",
          }),
          aula("Promoção!", "4 min", "Leitura curta", false, {
            conteudo:
              "Publicidade e promoções são feitas para despertar desejo de compra, muitas vezes por impulso. Uma promoção só representa economia real quando o item já era necessário ou planejado — caso contrário, é um gasto novo disfarçado de vantagem.",
            pergunta: "Lembre de uma promoção que você viu recentemente: o item já estava nos seus planos, ou seria um gasto novo?",
          }),
          aula("Desafio do mês", "8 min", "Atividade prática", false, {
            conteudo:
              "Quando um objetivo não cabe no orçamento atual, é preciso revisar as categorias de gastos e encontrar ajustes possíveis, sem comprometer o que é essencial. Pequenos cortes em categorias não essenciais, mantidos por algumas semanas, podem liberar espaço para um objetivo maior.",
            pergunta: "No simulador de Orçamento, ajuste categorias até sobrar o suficiente para um objetivo específico, sem zerar nada essencial.",
          }),
        ],
      },
      {
        titulo: "Módulo 3 — Começando a planejar",
        resumo: "Metas, reserva e plano financeiro.",
        aulas: [
          aula("Meta não é vontade", "4 min", "Leitura curta", false, {
            conteudo:
              "Uma vontade vira meta quando ganha três elementos: o que se quer, quanto custa e até quando se pretende alcançar. Sem esses três elementos, fica difícil planejar qualquer ação concreta.",
            pergunta: "Transforme uma vontade sua em meta: escreva o que é, quanto custa e em quanto tempo quer alcançá-la.",
          }),
          aula("Quanto preciso guardar?", "6 min", "Atividade prática", false, {
            conteudo:
              "Para alcançar uma meta, basta dividir o valor total pelo número de períodos disponíveis. Esse cálculo simples mostra se a meta é realista dentro da renda disponível — comparando o aporte necessário com o que você realmente recebe.",
            pergunta: "No Simulador de Juros Compostos, calcule quanto guardar por mês para alcançar uma meta sua em um prazo definido.",
          }),
          aula("Imprevistos acontecem", "5 min", "Leitura curta", false, {
            conteudo:
              "Imprevistos são despesas inesperadas que fogem do planejamento normal. Ter uma reserva financeira — mesmo pequena — ajuda a lidar com essas situações sem comprometer totalmente outras metas.",
            pergunta: "Defina, no Controle de Gastos, uma meta de reserva de emergência para imprevistos.",
          }),
          aula("Seu primeiro plano financeiro", "8 min", "Atividade prática", false, {
            conteudo:
              "Um plano financeiro reúne renda, orçamento por categorias, uma meta com valor e prazo, e uma reserva para imprevistos — formando uma visão completa de como organizar o dinheiro. Você já praticou cada uma dessas partes separadamente nesta trilha; agora é hora de juntar tudo.",
            pergunta: "Monte um plano fictício completo: renda, orçamento por categoria, uma meta e uma reserva, usando o Controle de Gastos e os simuladores.",
            temPlanoInterativo: true,
          }),
        ],
      },
    ],
  },
  {
    slug: "descobrindo-profissoes",
    titulo: "Dominando o orçamento",
    categoria: "Educação Financeira",
    nivel: "Intermediário",
    descricao:
      "Renda, gastos invisíveis, déficit e cortes — aprofunde o controle do seu orçamento em cenários reais.",
    resumoLongo:
      "Uma trilha para aprofundar o controle de renda, gastos e planejamento: identificar gastos invisíveis, ajustar um orçamento no negativo, decidir o que cortar sem abrir mão do essencial, e montar orçamentos realistas para cenários como o primeiro emprego e morar sozinho.",
    duracao: "53min",
    blocos: 9,
    xp: 280,
    progresso: 30,
    avaliacao: 4.7,
    destaque: true,
    modulos: [
      {
        titulo: "Módulo 1 — De onde vem e para onde vai",
        resumo: "Renda, gastos invisíveis e tipos de despesa.",
        aulas: [
          aula("Quanto realmente entra?", "5 min", "Leitura curta", false, {
            conteudo:
              "Renda fixa é previsível e se repete todo período; renda variável muda de valor; renda extra é ocasional. Além disso, o valor recebido nem sempre é o valor disponível — é preciso descontar compromissos já assumidos antes de decidir o que fazer com o dinheiro.",
            pergunta: "No Controle de Gastos, registre sua renda do mês e veja quanto realmente sobra depois dos gastos fixos.",
          }),
          aula("Gastos invisíveis", "4 min", "Leitura curta", false, {
            conteudo:
              "Gastos invisíveis são despesas pequenas e recorrentes que parecem insignificantes isoladamente, mas se acumulam em valores altos ao longo do tempo — R$ 5 por dia, 20 dias no mês, já são R$ 100 que muitas vezes passam despercebidos.",
            pergunta: "Liste três gastos pequenos e recorrentes que você faz sem perceber ao longo da semana.",
          }),
          aula("Fixos x variáveis", "6 min", "Atividade prática", false, {
            conteudo:
              "Despesas fixas se repetem com valor semelhante todo período (como uma assinatura); despesas variáveis mudam conforme o uso ou a decisão (como lanches e lazer). Reconhecer essa diferença ajuda a prever melhor o orçamento.",
            pergunta: "No Controle de Gastos, categorize seus lançamentos do mês e identifique quais são fixos e quais são variáveis.",
          }),
        ],
      },
      {
        titulo: "Módulo 2 — Ajustando o orçamento",
        resumo: "Déficit, cortes e flexibilidade.",
        aulas: [
          aula("Seu orçamento está negativo", "5 min", "Leitura curta", false, {
            conteudo:
              "Déficit é quando as despesas superam a renda disponível em um período. Identificar em quais categorias o gasto ultrapassou o planejado é o primeiro passo para reorganizar o orçamento.",
            pergunta: "No Controle de Gastos, veja se algum mês fechou no negativo e identifique a categoria que mais pesou.",
          }),
          aula("O que cortar?", "6 min", "Atividade prática", false, {
            conteudo:
              "Cortar gastos não significa eliminar tudo, mas priorizar: reduzir primeiro o que tem menor impacto na rotina e manter o que é essencial ou traz mais valor. Cada corte tem uma consequência diferente.",
            pergunta: "Escolha uma categoria de gasto não essencial e defina um corte específico para o próximo mês.",
          }),
          aula("Orçamento flexível", "5 min", "Leitura curta", false, {
            conteudo:
              "Um orçamento eficiente não elimina o prazer, apenas organiza espaço para ele. Reservar uma categoria de lazer dentro do planejamento é diferente de gastar sem controle — o problema não é gastar, é gastar sem saber quanto sobra.",
            pergunta: "No seu orçamento, reserve conscientemente um valor para lazer sem gerar déficit.",
          }),
        ],
      },
      {
        titulo: "Módulo 3 — Orçamento na prática",
        resumo: "Cenários reais e desafio final.",
        aulas: [
          aula("Primeiro emprego", "7 min", "Atividade prática", false, {
            conteudo:
              "O primeiro emprego costuma trazer novas responsabilidades, como transporte até o trabalho e alimentação fora de casa, que precisam entrar no orçamento junto com o lazer e a poupança.",
            pergunta: "Monte, no simulador de Orçamento, um orçamento fictício para uma renda de primeiro emprego, cobrindo transporte, alimentação, lazer e reserva.",
          }),
          aula("Morando sozinho", "7 min", "Atividade prática", false, {
            conteudo:
              "Morar sozinho envolve despesas que muitas vezes passam despercebidas na adolescência, como aluguel, contas de água e luz, alimentação e transporte, além do lazer e da reserva.",
            pergunta: "Distribua uma renda fictícia mais alta entre aluguel, contas, alimentação, transporte, lazer e reserva — sem deixar nada essencial descoberto.",
          }),
          aula("Monte seu orçamento", "8 min", "Atividade prática", false, {
            conteudo:
              "Um orçamento bem construído equilibra renda e despesas essenciais, reserva espaço para lazer e imprevistos, e evita déficit, sem ser rígido a ponto de ser abandonado.",
            pergunta: "Monte um orçamento fictício completo no Controle de Gastos, cobrindo despesas essenciais, lazer planejado e uma reserva.",
          }),
        ],
      },
    ],
  },
  {
    slug: "quem-eu-sou",
    titulo: "Cartão, crédito e dívidas",
    categoria: "Educação Financeira",
    nivel: "Intermediário",
    descricao:
      "Limite, fatura, juros e parcelamento — use o crédito com responsabilidade e evite dívidas.",
    resumoLongo:
      "Como funcionam crédito, parcelamento, juros e endividamento: a diferença entre limite e dinheiro próprio, como a fatura se forma, o custo real de pagar o mínimo, o efeito bola de neve das dívidas, e como decidir entre comprar à vista ou parcelado.",
    duracao: "48min",
    blocos: 9,
    xp: 280,
    progresso: 100,
    avaliacao: 4.6,
    modulos: [
      {
        titulo: "Módulo 1 — Entendendo o crédito",
        resumo: "Limite, fatura e parcelamento.",
        aulas: [
          aula("Seu limite não é seu dinheiro", "5 min", "Leitura curta", false, {
            conteudo:
              "O limite de crédito é o valor máximo que uma instituição permite gastar antes de cobrar — não é dinheiro que pertence a você. Diferente da renda disponível, o limite precisa ser pago depois, e usar tudo pode comprometer o orçamento dos próximos meses.",
            pergunta: "Pense num gasto recente: ele foi pago com renda disponível ou comprometeu um limite de crédito futuro?",
          }),
          aula("A fatura", "4 min", "Leitura curta", false, {
            conteudo:
              "A fatura reúne todas as compras feitas no cartão dentro de um período, somando-as em um único valor a pagar numa data específica. Compras pequenas e frequentes podem somar um valor alto sem que a pessoa perceba durante o mês.",
            pergunta: "Se você fizesse 5 compras de R$ 40 ao longo do mês, qual seria o total da fatura?",
          }),
          aula("Parcelamento", "6 min", "Atividade prática", false, {
            conteudo:
              "Parcelar divide um valor em pagamentos menores ao longo do tempo, mas compromete parte da renda dos meses seguintes — não apenas do mês da compra. Antes de parcelar, é importante considerar se as parcelas futuras cabem no orçamento de cada mês.",
            pergunta: "No Controle de Gastos, simule uma compra parcelada e veja o impacto da parcela nos próximos meses.",
          }),
        ],
      },
      {
        titulo: "Módulo 2 — O custo do crédito",
        resumo: "Juros, pagamento mínimo e endividamento.",
        aulas: [
          aula("Juros", "5 min", "Leitura curta", false, {
            conteudo:
              "Juros são o custo cobrado por usar dinheiro emprestado, incluindo o crédito do cartão. Quando uma fatura não é paga integralmente, os juros passam a incidir sobre o valor restante, aumentando a dívida — R$ 200 não pagos podem virar R$ 230 no mês seguinte.",
            pergunta: "No Simulador de Juros Compostos, veja como uma dívida cresce mês a mês quando não é paga.",
          }),
          aula("Pagamento mínimo", "5 min", "Leitura curta", false, {
            conteudo:
              "O pagamento mínimo evita que a fatura fique totalmente em aberto, mas o restante continua gerando juros, muitas vezes altos. Repetir esse padrão por vários meses pode fazer a dívida crescer rapidamente.",
            pergunta: "Compare: pagar uma fatura de R$ 300 integralmente versus pagar só o mínimo por três meses seguidos.",
          }),
          aula("Bola de neve", "5 min", "Leitura curta", false, {
            conteudo:
              "Quando novos compromissos se somam a dívidas já existentes, o orçamento fica cada vez mais comprometido, dificultando o pagamento de tudo em dia — esse efeito é chamado de 'bola de neve' das dívidas.",
            pergunta: "Liste, num orçamento fictício, o que aconteceria se um novo parcelamento se somasse às suas dívidas atuais.",
          }),
        ],
      },
      {
        titulo: "Módulo 3 — Decidindo com crédito",
        resumo: "Comparações de compra e desafio final.",
        aulas: [
          aula("Comprar ou esperar?", "5 min", "Leitura curta", false, {
            conteudo:
              "Nem toda compra desejada precisa ser feita imediatamente. Avaliar se o orçamento atual comporta a compra, e se ela compromete outros objetivos, ajuda a decidir entre comprar agora ou esperar.",
            pergunta: "Pense numa compra que você adiou: o que pesou mais na decisão, o orçamento ou uma meta em andamento?",
          }),
          aula("À vista ou parcelado?", "6 min", "Atividade prática", false, {
            conteudo:
              "Pagar à vista costuma preservar a renda dos meses seguintes, mas exige mais dinheiro disponível agora. Parcelar reduz o impacto imediato, mas compromete parte da renda futura por vários meses.",
            pergunta: "Para uma compra fictícia de R$ 300, compare pagar à vista versus parcelar em 6x de R$ 50.",
          }),
          aula("Desafio da fatura", "7 min", "Atividade prática", false, {
            conteudo:
              "Organizar uma fatura envolve conhecer a renda disponível, priorizar o pagamento total sempre que possível, evitar o pagamento mínimo repetido e avaliar parcelamentos considerando os meses seguintes.",
            pergunta: "No Controle de Gastos, organize uma fatura fictícia dentro da sua renda, sem gerar dívida para o mês seguinte.",
          }),
        ],
      },
    ],
  },
  {
    slug: "vida-adulta-burocracia",
    titulo: "Guardar, poupar e investir",
    categoria: "Educação Financeira",
    nivel: "Intermediário",
    descricao:
      "Reserva, risco, diversificação — entenda como guardar e investir com consciência, sem fórmulas mágicas.",
    resumoLongo:
      "Os fundamentos de reserva, investimento, risco e diversificação, sem recomendar produtos específicos: por que guardar, como definir uma meta financeira, a diferença entre guardar e investir, e como o tempo e os aportes influenciam a construção de patrimônio.",
    duracao: "47min",
    blocos: 9,
    xp: 280,
    progresso: 0,
    avaliacao: 4.8,
    modulos: [
      {
        titulo: "Módulo 1 — Fundamentos de guardar",
        resumo: "Objetivos, metas e reserva financeira.",
        aulas: [
          aula("Por que guardar?", "4 min", "Leitura curta", false, {
            conteudo:
              "Guardar dinheiro serve a diferentes propósitos: alcançar objetivos futuros, lidar com imprevistos e ter mais segurança para tomar decisões sem depender apenas do próximo dinheiro que entrar.",
            pergunta: "Liste dois motivos pessoais para guardar dinheiro: um objetivo e uma questão de segurança.",
          }),
          aula("Meta financeira", "6 min", "Atividade prática", false, {
            conteudo:
              "Uma meta financeira bem definida tem quatro elementos: o objetivo, o valor necessário, o prazo desejado e o valor que precisa ser guardado periodicamente para alcançá-la.",
            pergunta: "No Simulador de Juros Compostos, defina uma meta com valor e prazo e veja o aporte mensal necessário.",
          }),
          aula("Reserva", "4 min", "Leitura curta", false, {
            conteudo:
              "Separar o dinheiro reservado do dinheiro de uso imediato ajuda a proteger metas e objetivos de gastos do dia a dia — manter esse valor separado torna mais difícil gastá-lo por impulso.",
            pergunta: "No Controle de Gastos, defina uma meta de reserva separada dos seus gastos do dia a dia.",
          }),
        ],
      },
      {
        titulo: "Módulo 2 — Investindo com consciência",
        resumo: "Diferença entre guardar e investir, risco e diversificação.",
        aulas: [
          aula("Guardar ≠ investir", "5 min", "Leitura curta", false, {
            conteudo:
              "Guardar é separar dinheiro para um uso futuro; investir é destinar esse dinheiro a alternativas que buscam fazê-lo render ao longo do tempo, envolvendo diferentes níveis de risco. Este conteúdo explica fundamentos gerais, sem recomendar produtos específicos.",
            pergunta: "Pense num valor que você guardou recentemente: ele ficou parado ou foi destinado a algo que busca render?",
          }),
          aula("Risco e retorno", "5 min", "Leitura curta", false, {
            conteudo:
              "De forma geral, alternativas com potencial de retorno maior tendem a envolver mais risco e oscilação de valor; alternativas mais estáveis tendem a ter potencial de retorno menor. Não existe alternativa sem nenhum risco, e retorno maior nunca é garantido.",
            pergunta: "No simulador de Carteira de Investimentos, compare uma distribuição mais conservadora com uma mais arriscada.",
          }),
          aula("Diversificação", "5 min", "Leitura curta", false, {
            conteudo:
              "Diversificar significa distribuir recursos entre diferentes alternativas, em vez de concentrar tudo em uma só. Isso reduz o impacto de uma eventual perda em um único lugar, mas não elimina o risco por completo.",
            pergunta: "No simulador de Carteira de Investimentos, distribua um valor fictício entre categorias diferentes de risco.",
          }),
        ],
      },
      {
        titulo: "Módulo 3 — Construindo patrimônio",
        resumo: "Tempo, aportes e carteira fictícia.",
        aulas: [
          aula("O tempo importa", "5 min", "Leitura curta", false, {
            conteudo:
              "Quanto mais tempo um valor permanece destinado a uma alternativa que rende, maior a possibilidade de crescimento acumulado. Começar mais cedo, mesmo com valores pequenos, tende a fazer diferença no resultado final.",
            pergunta: "No Simulador de Juros Compostos, compare guardar o mesmo valor mensal por 10 anos e por 20 anos.",
          }),
          aula("Aportes mensais", "6 min", "Atividade prática", false, {
            conteudo:
              "Aumentar o valor guardado ou investido periodicamente tende a aumentar o resultado final acumulado, além do próprio valor investido, especialmente aliado a um prazo mais longo.",
            pergunta: "No Simulador de Juros Compostos, ajuste o aporte mensal e veja como o resultado final muda.",
          }),
          aula("Monte sua carteira fictícia", "7 min", "Atividade prática", false, {
            conteudo:
              "Montar uma carteira envolve decidir como distribuir um valor entre diferentes categorias fictícias de alternativas, equilibrando risco e estabilidade de acordo com um objetivo e um prazo definidos.",
            pergunta: "No simulador de Carteira de Investimentos, monte uma carteira fictícia coerente com um objetivo de longo prazo.",
          }),
        ],
      },
    ],
  },
  {
    slug: "uso-consciente-tecnologia",
    titulo: "Juros compostos",
    categoria: "Educação Financeira",
    nivel: "Intermediário",
    descricao:
      "O efeito do tempo, dos aportes e do crescimento do dinheiro — na prática, com simulações.",
    resumoLongo:
      "O efeito do tempo, dos aportes e do crescimento do dinheiro por meio de juros compostos, usando simulações práticas em vez de fórmulas decoradas: a diferença entre juros simples e compostos, e como prazo e aporte mudam o resultado final.",
    duracao: "34min",
    blocos: 6,
    xp: 220,
    progresso: 12,
    avaliacao: 4.9,
    destaque: true,
    modulos: [
      {
        titulo: "Módulo 1 — Entendendo os juros compostos",
        resumo: "Diferença entre juros simples e compostos.",
        aulas: [
          aula("Juros simples", "4 min", "Leitura curta", false, {
            conteudo:
              "Nos juros simples, o rendimento é calculado sempre sobre o valor original, e cresce de forma linear e previsível a cada período, sem se acumular sobre os juros já ganhos. R$ 100 rendendo R$ 10 por período crescem sempre R$ 10: R$ 110, R$ 120, R$ 130...",
            pergunta: "Preveja: quanto renderiam R$ 100 em 3 períodos de juros simples de R$ 10 cada?",
          }),
          aula("Juros compostos", "5 min", "Leitura curta", false, {
            conteudo:
              "Nos juros compostos, o rendimento de cada período é calculado sobre o valor total acumulado até ali — incluindo os juros já ganhos — e não apenas sobre o valor original. R$ 100 a 10%: no 1º período rende R$ 10 (R$ 110); no 2º, os 10% incidem sobre R$ 110, rendendo R$ 11 (R$ 121).",
            pergunta: "No Simulador de Juros Compostos, compare o crescimento de R$ 100 em juros simples e compostos pelos mesmos períodos.",
          }),
          aula("Juros sobre juros", "6 min", "Atividade prática", false, {
            conteudo:
              "Quanto mais períodos se passam, maior é a diferença entre juros simples e compostos, porque o efeito de 'juros sobre juros' se acumula progressivamente — o crescimento deixa de ser uma linha reta e passa a acelerar com o tempo.",
            pergunta: "No Simulador de Juros Compostos, estenda a simulação para um prazo mais longo e veja a curva se distanciar.",
          }),
        ],
      },
      {
        titulo: "Módulo 2 — Simulando cenários",
        resumo: "Prazo, aportes e o efeito de esperar.",
        aulas: [
          aula("Começar cedo", "6 min", "Atividade prática", false, {
            conteudo:
              "Por causa do efeito dos juros compostos, começar mais cedo tende a gerar um resultado final maior, mesmo guardando o mesmo valor mensal, porque o dinheiro tem mais tempo para capitalizar.",
            pergunta: "No Simulador de Juros Compostos, compare dois perfis com o mesmo aporte, um começando 5 anos antes do outro.",
          }),
          aula("E se eu aumentar o aporte?", "6 min", "Atividade prática", false, {
            conteudo:
              "Aumentar o valor do aporte mensal, combinado ao efeito dos juros compostos, amplia o resultado final de forma mais do que proporcional ao longo do tempo, especialmente em prazos mais longos.",
            pergunta: "No Simulador de Juros Compostos, aumente o aporte mensal de R$ 20 para R$ 35 e compare o resultado final.",
          }),
          aula("E se eu esperar?", "7 min", "Atividade prática", false, {
            conteudo:
              "Adiar o início de um plano de longo prazo reduz o tempo disponível para o efeito dos juros compostos atuar, o que pode significar uma diferença considerável no resultado final, mesmo com o mesmo valor de aporte.",
            pergunta: "No Simulador de Juros Compostos, compare começar agora versus adiar o início em 1 ou 2 anos.",
          }),
        ],
      },
    ],
  },
  {
    slug: "saude-emocional",
    titulo: "Protegendo seu dinheiro",
    categoria: "Educação Financeira",
    nivel: "Iniciante",
    descricao:
      "Reconheça golpes, proteja seus dados e use o Pix com mais segurança.",
    resumoLongo:
      "Como reconhecer golpes, cuidar de dados pessoais e do uso do Pix, e tomar decisões mais seguras diante de situações suspeitas envolvendo dinheiro — prêmios falsos, links suspeitos e pedidos de dinheiro inesperados.",
    duracao: "30min",
    blocos: 6,
    xp: 220,
    progresso: 45,
    avaliacao: 4.9,
    modulos: [
      {
        titulo: "Módulo 1 — Reconhecendo golpes",
        resumo: "Prêmios falsos, Pix e proteção de dados.",
        aulas: [
          aula("“Você ganhou um prêmio!”", "4 min", "Leitura curta", false, {
            conteudo:
              "Golpes que anunciam prêmios costumam criar um senso de urgência e pedir uma ação imediata antes que a pessoa tenha tempo de checar se a mensagem é legítima. Prêmios de sorteios em que você não se inscreveu são um sinal de alerta importante.",
            pergunta: "Pense numa mensagem que você já recebeu prometendo um prêmio: ela tinha urgência e origem desconhecida?",
          }),
          aula("Pix não é botão de desfazer", "5 min", "Leitura curta", false, {
            conteudo:
              "Transferências instantâneas costumam ser praticamente irreversíveis depois de concluídas. Por isso, conferir o nome do destinatário antes de confirmar, e desconfiar de solicitações urgentes ou fora do padrão, é essencial para evitar prejuízos.",
            pergunta: "Da próxima vez que for fazer um Pix, confira o nome do destinatário antes de confirmar — vire esse hábito.",
          }),
          aula("Seus dados valem dinheiro", "5 min", "Leitura curta", false, {
            conteudo:
              "Dados como senhas, CPF, informações bancárias e códigos de autenticação nunca devem ser compartilhados com terceiros, mesmo quando a solicitação parece vir de uma fonte confiável. Instituições legítimas não costumam pedir esse tipo de informação por mensagem ou ligação não solicitada.",
            pergunta: "Liste três tipos de dados que você nunca deveria compartilhar, independentemente de quem pede.",
          }),
        ],
      },
      {
        titulo: "Módulo 2 — Decidindo com segurança",
        resumo: "Links suspeitos, pedidos de dinheiro e desafio final.",
        aulas: [
          aula("O link suspeito", "5 min", "Atividade prática", false, {
            conteudo:
              "Mensagens com links inesperados, especialmente as que criam urgência ou medo, merecem verificação antes de qualquer clique. Buscar informações diretamente no aplicativo ou site oficial é uma forma segura de conferir se a mensagem é verdadeira.",
            pergunta: "Da próxima vez que receber um link suspeito, em vez de clicar, abra o aplicativo oficial direto para conferir.",
          }),
          aula("Seu amigo pediu dinheiro", "5 min", "Leitura curta", false, {
            conteudo:
              "Contas podem ser copiadas ou acessadas indevidamente por terceiros. Antes de atender a um pedido de dinheiro inesperado, mesmo vindo de um contato conhecido, confirmar por outro meio (como uma ligação) ajuda a evitar prejuízos.",
            pergunta: "Se um contato conhecido pedir dinheiro de forma inesperada, como você confirmaria que é realmente ele?",
          }),
          aula("Desafio: identifique o golpe", "6 min", "Atividade prática", false, {
            conteudo:
              "Identificar situações de risco envolve observar sinais como urgência, origem desconhecida, pedidos de dados sensíveis e solicitações fora do padrão habitual, sempre priorizando a confirmação por canais oficiais ou conhecidos diante de qualquer dúvida.",
            pergunta: "Revise os sinais de alerta desta trilha: urgência, origem desconhecida, pedido de dados, pedido de dinheiro fora do padrão.",
          }),
        ],
      },
    ],
  },
];

export const getCurso = (slug: string) => cursos.find((c) => c.slug === slug);

export type EtapaTrilha = {
  numero: number;
  titulo: string;
  descricao: string;
  status: "concluida" | "atual" | "bloqueada";
  xp: number;
  cursoSlug?: string;
};

export const trilhaEvolucao: EtapaTrilha[] = [
  {
    numero: 1,
    titulo: "Ponto de partida",
    descricao: "Você respondeu o onboarding e definiu seus primeiros interesses.",
    status: "concluida",
    xp: 60,
  },
  {
    numero: 2,
    titulo: "Quem eu sou",
    descricao: "Trilha de autoconhecimento concluída, com diário privado ativo.",
    status: "concluida",
    xp: 240,
    cursoSlug: "quem-eu-sou",
  },
  {
    numero: 3,
    titulo: "Seu primeiro dinheiro",
    descricao: "Você está no Módulo 2 — falta simular seus próximos 6 meses.",
    status: "atual",
    xp: 320,
    cursoSlug: "primeiro-dinheiro",
  },
  {
    numero: 4,
    titulo: "Descobrindo profissões",
    descricao: "Investigue três carreiras com o roteiro de pesquisa.",
    status: "bloqueada",
    xp: 280,
    cursoSlug: "descobrindo-profissoes",
  },
  {
    numero: 5,
    titulo: "Burocracia adulta",
    descricao: "Documentos, currículo e comunicação com instituições.",
    status: "bloqueada",
    xp: 380,
    cursoSlug: "vida-adulta-burocracia",
  },
  {
    numero: 6,
    titulo: "Independência em construção",
    descricao: "Marco final da jornada: plano pessoal de vida adulta.",
    status: "bloqueada",
    xp: 500,
  },
];

export type Conquista = {
  nome: string;
  descricao: string;
  desbloqueada: boolean;
};

export const conquistas: Conquista[] = [
  { nome: "Primeiro passo", descricao: "Concluiu o onboarding", desbloqueada: true },
  { nome: "7 dias seguidos", descricao: "Uma semana de sequência", desbloqueada: true },
  { nome: "Trilha completa", descricao: "Finalizou uma trilha inteira", desbloqueada: true },
  { nome: "Diarista", descricao: "10 reflexões registradas", desbloqueada: true },
  { nome: "Investigador", descricao: "Pesquisou 3 profissões", desbloqueada: false },
  { nome: "Reserva iniciada", descricao: "Criou sua primeira meta de guardar", desbloqueada: false },
];

export const desafioDoDia = {
  titulo: "Anote um gasto que você fez hoje sem pensar",
  descricao:
    "Leva 2 minutos. Serve para treinar percepção, não para julgar sua escolha.",
  xp: 20,
};

export const usuario = {
  nome: "",
  idade: 0,
  email: "",
  nivel: 4,
  streak: 9,
  trilhasConcluidas: 1,
  blocosConcluidos: 27,
};

export type TermoGlossario = {
  termo: string;
  definicao: string;
};

export type GraficoOrcamento = {
  titulo: string;
  renda: number;
  itens: { nome: string; valor: number; destaque?: boolean }[];
};

export type QuestaoQuiz = {
  pergunta: string;
  opcoes: string[];

  correta: number;

  grafico?: GraficoOrcamento;

  explicacao?: string;
};

export const quizzesPorTrilha: Record<string, QuestaoQuiz[]> = {
  "primeiro-dinheiro": [
    {
      pergunta: "Qual é o principal objetivo de uma reserva de emergência?",
      opcoes: [
        "Investir em ações para ganhar dinheiro rápido",
        "Cobrir imprevistos sem precisar recorrer a dívidas",
        "Guardar dinheiro para nunca mais usar",
        "Substituir o orçamento mensal",
      ],
      correta: 1,
    },
    {
      pergunta: "O que é \"custo de oportunidade\" numa escolha financeira?",
      opcoes: [
        "O imposto cobrado sobre uma compra",
        "O que você deixa de ganhar ou fazer ao escolher uma opção em vez de outra",
        "O preço de tabela de um produto",
        "O valor guardado na reserva de emergência",
      ],
      correta: 1,
    },
    {
      pergunta: "Para que um orçamento pessoal funciona na prática?",
      opcoes: [
        "Para gastar sem se preocupar com categorias",
        "Para definir, antes de gastar, quanto vai para cada categoria de despesa",
        "Para substituir a necessidade de anotar os gastos",
        "Para aumentar a renda automaticamente",
      ],
      correta: 1,
    },
    {
      pergunta: "Nos juros compostos, sobre o que os juros de cada período incidem?",
      opcoes: [
        "Somente sobre o valor investido inicialmente",
        "Somente sobre o último aporte feito",
        "Sobre o valor investido mais os juros já acumulados",
        "Os juros compostos não se acumulam",
      ],
      correta: 2,
    },
    {
      pergunta: "O que é necessidade, diferente de vontade, em uma decisão de compra?",
      opcoes: [
        "Algo que mantém sua vida funcionando",
        "Qualquer coisa que você deseja no momento",
        "Um produto em promoção",
        "Algo que os amigos também compraram",
      ],
      correta: 0,
    },
  ],
  "descobrindo-profissoes": [
    {
      pergunta: "O que caracteriza um déficit no orçamento?",
      opcoes: [
        "Quando a renda é maior que as despesas",
        "Quando as despesas superam a renda disponível no período",
        "Quando não há nenhuma despesa variável",
        "Quando toda a renda é guardada",
      ],
      correta: 1,
    },
    {
      pergunta: "Por que os 'gastos invisíveis' merecem atenção?",
      opcoes: [
        "Porque são sempre proibidos",
        "Porque pequenos valores recorrentes se acumulam e pesam no orçamento",
        "Porque só existem em compras parceladas",
        "Porque aumentam a renda fixa",
      ],
      correta: 1,
    },
    {
      pergunta: "Qual a diferença entre despesa fixa e variável?",
      opcoes: [
        "Fixa muda todo mês; variável não muda nunca",
        "Fixa se repete com valor semelhante; variável muda conforme uso e decisão",
        "Não existe diferença prática entre elas",
        "Variável é sempre maior que fixa",
      ],
      correta: 1,
    },
    {
      pergunta: "Ao cortar gastos para equilibrar o orçamento, qual é a estratégia mais sustentável?",
      opcoes: [
        "Eliminar todas as categorias de uma vez",
        "Priorizar cortes de menor impacto, mantendo o essencial",
        "Cortar só a categoria de reserva",
        "Ignorar o déficit até o mês seguinte",
      ],
      correta: 1,
    },
    {
      pergunta: "Por que reservar espaço para lazer dentro do orçamento ajuda a mantê-lo sustentável?",
      opcoes: [
        "Porque orçamentos rígidos demais tendem a ser abandonados",
        "Porque lazer é uma despesa fixa obrigatória",
        "Porque reduz automaticamente o déficit",
        "Porque lazer não deveria fazer parte do orçamento",
      ],
      correta: 0,
    },
    {
      pergunta:
        "Júlia ganha R$ 1.800 no primeiro emprego e o mês fechou no negativo. Qual corte resolve o déficit com menos impacto no essencial?",
      grafico: {
        titulo: "Orçamento de Júlia no mês",
        renda: 1800,
        itens: [
          { nome: "Aluguel", valor: 700 },
          { nome: "Mercado", valor: 450 },
          { nome: "Transporte", valor: 220 },
          { nome: "Assinaturas", valor: 130 },
          { nome: "Lazer", valor: 380, destaque: true },
        ],
      },
      opcoes: [
        "Cortar o mercado pela metade",
        "Cancelar uma ou duas assinaturas e reduzir um pouco o lazer",
        "Deixar de pagar o transporte neste mês",
        "Usar o cartão de crédito para cobrir a diferença",
      ],
      correta: 1,
      explicacao:
        "Os gastos somam R$ 1.880, R$ 80 a mais que a renda. Cortar R$ 60 em assinaturas e R$ 40 do lazer já cobre o déficit sem mexer em aluguel, mercado e transporte, que são essenciais. Usar o cartão só empurra o problema para o mês seguinte, com juros.",
    },
  ],
  "quem-eu-sou": [
    {
      pergunta: "O limite de crédito do cartão é...",
      opcoes: [
        "Dinheiro que já pertence a você",
        "Um valor máximo que a instituição permite gastar, a ser pago depois",
        "Um bônus dado pelo banco todo mês",
        "O mesmo que a sua renda mensal",
      ],
      correta: 1,
    },
    {
      pergunta: "O que acontece quando uma fatura não é paga integralmente?",
      opcoes: [
        "Nada, o valor fica congelado até o próximo mês",
        "Juros passam a incidir sobre o valor restante, aumentando a dívida",
        "O limite de crédito aumenta automaticamente",
        "A fatura é cancelada",
      ],
      correta: 1,
    },
    {
      pergunta: "Qual o principal risco de pagar sempre o valor mínimo da fatura?",
      opcoes: [
        "Não há risco, é sempre a melhor opção",
        "O restante continua gerando juros e a dívida pode crescer rapidamente",
        "O limite de crédito é reduzido",
        "A fatura deixa de existir",
      ],
      correta: 1,
    },
    {
      pergunta: "O que é o efeito 'bola de neve' das dívidas?",
      opcoes: [
        "Quando a renda cresce mais rápido que as dívidas",
        "Quando novos compromissos se somam às dívidas existentes, comprometendo cada vez mais o orçamento",
        "Um tipo de investimento de baixo risco",
        "Um bônus por pagar em dia",
      ],
      correta: 1,
    },
    {
      pergunta: "Entre pagar à vista e parcelar, o que diferencia as duas opções?",
      opcoes: [
        "Parcelar sempre é mais barato",
        "À vista compromete mais dinheiro agora; parcelar compromete a renda futura por mais tempo",
        "Não há nenhuma diferença real",
        "À vista só é possível com cartão de crédito",
      ],
      correta: 1,
    },
  ],
  "vida-adulta-burocracia": [
    {
      pergunta: "Quais são os quatro elementos de uma meta financeira bem definida?",
      opcoes: [
        "Nome, cor, categoria e ícone",
        "O objetivo, o valor necessário, o prazo e o valor a guardar periodicamente",
        "Banco, agência, conta e senha",
        "Renda, despesa, saldo e reserva",
      ],
      correta: 1,
    },
    {
      pergunta: "Qual a diferença entre guardar e investir?",
      opcoes: [
        "São exatamente a mesma coisa",
        "Guardar é separar dinheiro para uso futuro; investir busca fazer esse dinheiro render, com algum risco",
        "Investir nunca envolve risco",
        "Guardar sempre rende mais que investir",
      ],
      correta: 1,
    },
    {
      pergunta: "Qual a relação geral entre risco e retorno?",
      opcoes: [
        "Quanto maior o risco, menor o retorno potencial",
        "Alternativas com maior potencial de retorno tendem a envolver mais risco e oscilação",
        "Não existe relação entre risco e retorno",
        "Retorno maior é sempre garantido",
      ],
      correta: 1,
    },
    {
      pergunta: "O que a diversificação ajuda a fazer?",
      opcoes: [
        "Eliminar todo o risco de uma vez",
        "Reduzir a concentração de risco distribuindo recursos entre alternativas diferentes",
        "Garantir um retorno fixo",
        "Aumentar automaticamente o valor guardado",
      ],
      correta: 1,
    },
    {
      pergunta: "Por que começar a guardar/investir mais cedo tende a fazer diferença no resultado final?",
      opcoes: [
        "Porque o dinheiro tem mais tempo para capitalizar",
        "Porque taxas de juros são sempre maiores no início",
        "Não faz diferença nenhuma",
        "Porque reduz o valor do aporte necessário",
      ],
      correta: 0,
    },
  ],
  "uso-consciente-tecnologia": [
    {
      pergunta: "Nos juros simples, o rendimento de cada período é calculado sobre...",
      opcoes: [
        "O valor total acumulado até ali",
        "Sempre o valor original, de forma linear",
        "Um valor aleatório definido pelo banco",
        "Apenas o último período",
      ],
      correta: 1,
    },
    {
      pergunta: "Nos juros compostos, o rendimento de cada período é calculado sobre...",
      opcoes: [
        "Sempre o valor original apenas",
        "O valor acumulado até ali, incluindo os juros já ganhos",
        "Um valor fixo definido no início",
        "Somente o valor do último aporte",
      ],
      correta: 1,
    },
    {
      pergunta: "Por que a diferença entre juros simples e compostos cresce com o tempo?",
      opcoes: [
        "Porque o efeito de 'juros sobre juros' se acumula progressivamente",
        "Porque os juros simples também compõem depois de um tempo",
        "Não existe essa diferença",
        "Porque o valor investido diminui",
      ],
      correta: 0,
    },
    {
      pergunta: "O que acontece ao começar a guardar dinheiro mais cedo, mantendo o mesmo aporte?",
      opcoes: [
        "O resultado final tende a ser maior, porque há mais tempo para capitalizar",
        "Não faz nenhuma diferença no resultado",
        "O resultado final é sempre menor",
        "Só faz diferença se a taxa também aumentar",
      ],
      correta: 0,
    },
    {
      pergunta: "Qual o efeito de adiar o início de um plano de longo prazo?",
      opcoes: [
        "Nenhum, o resultado final é sempre igual",
        "Reduz o tempo disponível para os juros compostos atuarem, podendo reduzir bastante o resultado final",
        "Aumenta automaticamente o aporte necessário",
        "Só afeta planos de curto prazo",
      ],
      correta: 1,
    },
  ],
  "saude-emocional": [
    {
      pergunta: "Qual é um sinal de alerta comum em golpes que anunciam prêmios?",
      opcoes: [
        "Prazo longo para responder",
        "Urgência e origem desconhecida (sorteio do qual você não participou)",
        "Vir de um contato salvo na sua agenda",
        "Não pedir nenhuma ação",
      ],
      correta: 1,
    },
    {
      pergunta: "Por que é importante conferir o destinatário antes de confirmar um Pix?",
      opcoes: [
        "Porque transferências instantâneas costumam ser praticamente irreversíveis",
        "Porque o Pix sempre pode ser desfeito depois",
        "Não é necessário conferir, o app já faz isso sozinho",
        "Só é importante para valores muito altos",
      ],
      correta: 0,
    },
    {
      pergunta: "Dados como senha, CPF e códigos de autenticação devem ser compartilhados quando...",
      opcoes: [
        "Uma instituição pede por mensagem ou ligação não solicitada",
        "Nunca — mesmo que a solicitação pareça vir de fonte confiável",
        "Só quando a pessoa insiste bastante",
        "Sempre que for necessário 'resgatar' algo",
      ],
      correta: 1,
    },
    {
      pergunta: "Diante de uma mensagem com um link inesperado, qual é a atitude mais segura?",
      opcoes: [
        "Clicar rapidamente antes que o link expire",
        "Verificar diretamente no aplicativo ou site oficial, sem clicar no link recebido",
        "Encaminhar para os amigos verificarem",
        "Responder pedindo mais informações pelo mesmo canal",
      ],
      correta: 1,
    },
    {
      pergunta: "Ao receber um pedido de dinheiro inesperado de um contato conhecido, o que fazer?",
      opcoes: [
        "Atender de imediato, já que é um contato conhecido",
        "Confirmar por outro meio, como uma ligação, antes de decidir",
        "Ignorar sempre, mesmo sendo urgente",
        "Pedir para outra pessoa decidir",
      ],
      correta: 1,
    },
  ],
};

export const glossario: TermoGlossario[] = [
  {
    termo: "CDI",
    definicao:
      "Certificado de Depósito Interbancário. Taxa usada como referência para render a maioria dos investimentos de renda fixa no Brasil.",
  },
  {
    termo: "Selic",
    definicao:
      "Taxa básica de juros da economia brasileira, definida pelo Banco Central. Serve de referência para todas as outras taxas de juros do país.",
  },
  {
    termo: "IPCA",
    definicao:
      "Índice oficial de inflação do Brasil. Mede quanto os preços em geral subiram em um período — importante para saber se o dinheiro guardado está de fato rendendo.",
  },
  {
    termo: "Juros compostos",
    definicao:
      "Juros que incidem sobre o valor investido e também sobre os juros já ganhos anteriormente — por isso o crescimento acelera com o tempo, em vez de ser sempre igual.",
  },
  {
    termo: "Juros simples",
    definicao:
      "Juros calculados sempre sobre o valor inicial, sem considerar os juros acumulados nos períodos anteriores.",
  },
  {
    termo: "Renda fixa",
    definicao:
      "No dia a dia, é o dinheiro que você recebe de forma previsível e constante, como mesada ou salário. Em investimentos, é a categoria com regras de rendimento definidas no momento da aplicação (ex.: Tesouro Direto, CDB), com menos oscilação.",
  },
  {
    termo: "Renda variável",
    definicao:
      "No dia a dia, é o dinheiro que muda de mês a mês, como bicos, freelas ou vendas — não deve ser tratado como garantido. Em investimentos, é a categoria cujo valor pode subir ou cair a qualquer momento (ex.: ações), com mais risco e também mais potencial de ganho.",
  },
  {
    termo: "Renda extra",
    definicao:
      "Dinheiro que entra de forma pontual, sem previsão fixa de quando volta a acontecer — presentes em dinheiro, prêmios, um bico único. Diferente da renda variável, não é algo que se repete com alguma regularidade.",
  },
  {
    termo: "Receita",
    definicao:
      "Tudo o que entra de dinheiro num período — mesada, salário, bicos, presentes. É o lado positivo da conta; o oposto de despesa.",
  },
  {
    termo: "Despesa",
    definicao:
      "Tudo o que sai de dinheiro num período — qualquer gasto, pequeno ou grande. É o lado negativo da conta; o oposto de receita.",
  },
  {
    termo: "Saldo",
    definicao:
      "A diferença entre receita e despesa num período. Positivo quando sobra dinheiro, negativo quando falta — é o número que mostra se as contas fecharam.",
  },
  {
    termo: "Necessidade",
    definicao:
      "Item essencial para a vida cotidiana, como moradia, alimentação ou material escolar. O que é necessidade pode variar de pessoa para pessoa, dependendo do contexto de cada uma.",
  },
  {
    termo: "Vontade",
    definicao:
      "Desejo que traz satisfação, mas não é indispensável no momento. Não é errado ter vontades — o problema é tratá-las como se fossem necessidades na hora de decidir uma compra.",
  },
  {
    termo: "Custo de oportunidade",
    definicao:
      "O que você deixa de ganhar ou fazer ao escolher uma opção em vez de outra. Toda escolha financeira tem esse custo invisível embutido — o que você abre mão para tê-la.",
  },
  {
    termo: "Custo-benefício",
    definicao:
      "A relação entre o preço de algo e o que ele realmente entrega — durabilidade, qualidade, utilidade. Preço baixo nem sempre significa o melhor custo-benefício.",
  },
  {
    termo: "Meta financeira",
    definicao:
      "Uma vontade que ganhou elementos concretos: o que se quer, quanto custa, até quando se pretende alcançar e quanto guardar periodicamente para isso. Sem esses elementos, ainda é só uma vontade — não dá para planejar em cima dela.",
  },
  {
    termo: "Plano financeiro",
    definicao:
      "A junção de renda, orçamento por categorias, uma meta com valor e prazo, e uma reserva para imprevistos — a visão completa de como organizar o próprio dinheiro.",
  },
  {
    termo: "Reserva de emergência",
    definicao:
      "Valor guardado à parte, de fácil acesso, para cobrir imprevistos sem precisar recorrer a dívidas.",
  },
  {
    termo: "Orçamento pessoal",
    definicao:
      "Planejamento de quanto dinheiro entra e quanto sai, organizado por categorias, para saber para onde a renda está indo.",
  },
  {
    termo: "Aporte",
    definicao:
      "Valor que uma pessoa adiciona a um investimento já existente, além do que já havia sido aplicado.",
  },
  {
    termo: "Liquidez",
    definicao:
      "Facilidade de transformar um investimento em dinheiro disponível na conta. Quanto maior a liquidez, mais rápido dá para resgatar.",
  },
  {
    termo: "Déficit",
    definicao:
      "Quando as despesas superam a renda disponível num período — o orçamento fecha negativo.",
  },
  {
    termo: "Despesa fixa",
    definicao:
      "Gasto que se repete com valor semelhante todo período, como uma assinatura ou aluguel.",
  },
  {
    termo: "Despesa variável",
    definicao:
      "Gasto que muda de valor conforme o uso ou a decisão, como lanches e lazer.",
  },
  {
    termo: "Limite de crédito",
    definicao:
      "Valor máximo que uma instituição permite gastar no cartão antes de cobrar — não é dinheiro próprio, precisa ser pago depois.",
  },
  {
    termo: "Fatura",
    definicao:
      "Documento que reúne todas as compras feitas no cartão de crédito dentro de um período, somadas num único valor a pagar numa data específica.",
  },
  {
    termo: "Parcelamento",
    definicao:
      "Divisão de um valor em pagamentos menores ao longo do tempo — compromete parte da renda dos meses seguintes, não só do mês da compra.",
  },
  {
    termo: "Pagamento mínimo",
    definicao:
      "Valor mínimo exigido para não deixar a fatura totalmente em aberto. O restante continua gerando juros, o que pode encarecer bastante a dívida.",
  },
  {
    termo: "Bola de neve (dívidas)",
    definicao:
      "Efeito em que novos compromissos financeiros se somam a dívidas já existentes, comprometendo cada vez mais o orçamento disponível.",
  },
  {
    termo: "Risco",
    definicao:
      "Possibilidade de um investimento oscilar ou perder valor. Em geral, quanto maior o potencial de retorno, maior o risco envolvido.",
  },
  {
    termo: "Retorno",
    definicao:
      "Ganho que um investimento pode gerar ao longo do tempo. Nunca é garantido, mesmo em alternativas consideradas mais estáveis.",
  },
  {
    termo: "Diversificação",
    definicao:
      "Estratégia de distribuir recursos entre diferentes alternativas em vez de concentrar tudo em uma só, reduzindo o impacto de uma eventual perda isolada.",
  },
  {
    termo: "Golpe financeiro",
    definicao:
      "Tentativa de enganar alguém para obter dinheiro ou dados, geralmente usando urgência, origem desconhecida ou se passando por alguém confiável.",
  },
  {
    termo: "Pix",
    definicao:
      "Sistema de transferência instantânea de dinheiro. Como costuma ser praticamente irreversível, vale sempre conferir o destinatário antes de confirmar.",
  },
  {
    termo: "Dados pessoais",
    definicao:
      "Informações como CPF, senha e dados bancários que nunca devem ser compartilhadas com terceiros, mesmo se a solicitação parecer vir de fonte confiável.",
  },
  {
    termo: "Código de autenticação",
    definicao:
      "Código enviado para confirmar que a própria pessoa está realizando uma ação. Compartilhá-lo com outra pessoa equivale a entregar acesso à conta.",
  },
];
