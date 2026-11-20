

import type { Tema } from "@/lib/assistente";

const CURSO_FB = {
  rotulo: "Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco",
  url: "https://www.ev.org.br/cursos/educacao-financeira",
};

const k = (t: Omit<Tema, "fonte" | "sugerir">): Tema => ({ ...t, fonte: CURSO_FB, sugerir: false });

export const conhecimentoFundacaoBradesco: Tema[] = [

  k({
    id: "fb-educacao-financeira",
    sugestao: "O que é educação financeira?",
    palavras: ["o que e educacao financeira", "educacao financeira", "para que serve educacao financeira", "por que aprender sobre dinheiro", "por que estudar financas"],
    resposta:
      "Educação financeira é aprender a ganhar, gastar e guardar dinheiro com consciência. A gente vive cercado de propaganda, ofertas e crédito fácil, mas o dinheiro que entra tem limite, as contas básicas se repetem todo mês e todo mundo tem planos para o futuro. Com educação financeira você consegue planejar, entender seus hábitos de consumo e decidir quanto poupar e investir.",
    links: [{ rotulo: "Trilha: Seu primeiro dinheiro", href: "/trilhas/primeiro-dinheiro" }],
  }),
  k({
    id: "fb-balanca",
    sugestao: "O que é a balança entre ganhos e gastos?",
    palavras: ["receitas e despesas", "ganhos e gastos", "balanca", "saldo positivo", "equilibrar ganhos e gastos", "receita e despesa"],
    resposta:
      "Pense numa balança: de um lado ficam os ganhos (receitas) do mês e do outro os gastos (despesas). O seu perfil financeiro é o resultado de como você equilibra essa balança. Para conseguir poupar e investir, o lado dos ganhos precisa pesar mais, deixando sempre um saldo positivo.",
    links: [{ rotulo: "Ver meu saldo no Controle de Gastos", href: "/financas" }],
  }),
  k({
    id: "fb-perfil-endividado",
    sugestao: "Como é o perfil endividado?",
    palavras: ["perfil endividado", "o endividado", "sou endividado", "estou endividado", "varios cartoes", "sempre devendo", "vivo devendo", "consequencias das dividas", "consequencias de estar endividado", "ansiedade por dividas", "dividas e ansiedade", "culpa por dividas"],
    resposta:
      "O perfil endividado não controla o que ganha e o que gasta, compra por emoção e costuma parcelar tudo, muitas vezes em vários cartões. Como está sempre devendo, paga juros altos, não faz planejamento e não tem objetivos claros; em casos graves, fica com o nome negativado. Além do dinheiro, isso pesa na vida: ansiedade, estresse, insegurança, culpa e até conflitos em casa. O primeiro passo para sair dele é anotar tudo o que entra e sai e parar de fazer dívidas novas.",
    links: [
      { rotulo: "Trilha: Cartão, crédito e dívidas", href: "/trilhas/quem-eu-sou" },
      { rotulo: "Anotar meus gastos", href: "/financas" },
    ],
  }),
  k({
    id: "fb-perfil-zero-a-zero",
    sugestao: "Como é o perfil zero a zero?",
    palavras: ["zero a zero", "empatado", "gasto tudo que ganho", "tudo que ganho gasto", "nao sobra nada", "nunca sobra", "fim do mes sem dinheiro", "dinheiro acaba", "acabar antes do fim do mes", "dinheiro nao dura", "dinheiro some"],
    resposta:
      "O perfil 'zero a zero' fecha todo mês empatado: tudo o que entra, sai. Ele até consegue pagar as contas e os financiamentos, mas não guarda nada, sente que o dinheiro some rápido e não sabe bem para onde foi. O risco é não ter reserva: quando aparece um imprevisto (um problema de saúde, um conserto, perder o emprego), a saída acaba sendo se endividar. O caminho é descobrir para onde o dinheiro vai e separar um valor para guardar assim que ele entra.",
    links: [
      { rotulo: "Definir minha reserva de emergência", href: "/financas" },
      { rotulo: "Trilha: Dominando o orçamento", href: "/trilhas/descobrindo-profissoes" },
    ],
  }),
  k({
    id: "fb-perfil-poupador",
    sugestao: "Como é o perfil poupador?",
    palavras: ["perfil poupador", "o poupador", "sou poupador", "guardo tudo", "so guardo", "medo de gastar", "mao de vaca", "po duro", "avarento"],
    resposta:
      "O perfil poupador pensa no futuro, controla bem ganhos e gastos, tem medo de dívidas e economiza em tudo no dia a dia. O ponto fraco é que muitas vezes ele só guarda, sem planejar: deixa tudo na poupança, acaba gastando nas emergências e não faz o dinheiro render. Por isso tem dificuldade de construir patrimônio e chegar à independência financeira. O próximo passo para ele é planejar objetivos e aprender a investir, não só guardar.",
    links: [{ rotulo: "Trilha: Guardar, poupar e investir", href: "/trilhas/vida-adulta-burocracia" }],
  }),
  k({
    id: "fb-comprar-a-vista",
    sugestao: "Como juntar para comprar à vista em um ano?",
    palavras: ["comprar a vista", "juntar em um ano", "poupar para comprar", "economizar para comprar", "cortar gastos para comprar", "planejamento de poupanca", "quanto guardar por mes para comprar"],
    resposta:
      "Um bom começo para virar investidor é juntar dinheiro para comprar algo à vista, sem financiamento. Exemplo: um celular de R$ 1.500 em 12 meses pede R$ 125 por mês. Esse valor pode sair de pequenos cortes: R$ 15 em bebidas, R$ 30 em lanches, R$ 40 em roupas, R$ 10 em acessórios e R$ 30 em produtos de beleza, somando exatamente R$ 125 por mês. Guarde num lugar de onde dê para tirar quando precisar, mesmo que renda pouco, e acompanhe mês a mês.",
    links: [
      { rotulo: "Criar a meta no Perfil", href: "/perfil" },
      { rotulo: "Simular no Simulador de Juros", href: "/financas/simulacoes" },
    ],
  }),

  k({
    id: "fb-oniomania",
    sugestao: "O que é oniomania?",
    palavras: ["oniomania", "compra compulsiva", "compulsao por compras", "compulsao", "viciado em compras", "vicio em compras"],
    resposta:
      "Oniomania é o nome do transtorno de compra compulsiva. A pessoa pensa demais em comprar, perde o controle, compra cada vez mais, tenta parar e não consegue, e usa as compras para aliviar tristeza, ansiedade ou outras emoções ruins. É uma condição reconhecida e tem tratamento: existem serviços especializados, como no Hospital das Clínicas de São Paulo. Se você se identificou, converse com um adulto de confiança e procure ajuda de um profissional de saúde.",
    links: [{ rotulo: "Escrever no diário de reflexões", href: "/perfil" }],
  }),
  k({
    id: "fb-desperdicio-dinheiro",
    sugestao: "Onde eu desperdiço dinheiro sem perceber?",
    palavras: ["desperdicio de dinheiro", "desperdicar dinheiro", "jogando dinheiro fora", "onde desperdico", "gasto a toa", "dinheiro indo embora", "onde estou gastando errado", "desperdico dinheiro", "desperdicando dinheiro"],
    resposta:
      "Alguns jeitos comuns de jogar dinheiro fora: comprar o que não precisa; pagar mais caro só pela marca; comprar parcelado quando daria desconto à vista; pegar empréstimo para coisas não essenciais; trocar celular, roupa ou tênis sem necessidade; comer fora com muita frequência; exagerar nos planos de celular e internet; banhos longos que gastam água e energia; e sustentar vícios, como apostas, álcool ou cigarro.",
    links: [{ rotulo: "Ver meus gastos por categoria", href: "/financas" }],
  }),
  k({
    id: "fb-habitos-saudaveis",
    sugestao: "Quais hábitos ajudam a equilibrar as contas?",
    palavras: ["habitos financeiros", "habitos saudaveis", "bons habitos", "habitos", "equilibrar as contas", "antes de comprar", "perguntas antes de comprar", "lista de compras", "dicas para economizar"],
    resposta:
      "Hábitos simples que ajudam muito: antes de comprar, pergunte 'preciso mesmo disso?', 'preciso comprar hoje?', 'acho mais barato em outro lugar?' e 'estou pagando pela marca?'. Evite dívidas, cheque especial e o rotativo do cartão. Desconfie de ofertas milagrosas, corte assinaturas que você não usa, vá ao mercado com lista (e de barriga cheia) e anote todos os seus gastos. Aprender a calcular descontos e acréscimos também evita cair em propaganda enganosa.",
    links: [{ rotulo: "Anotar meus gastos", href: "/financas" }],
  }),
  k({
    id: "fb-controlar-orcamento",
    sugestao: "Como controlar o orçamento?",
    palavras: ["controlar o orcamento", "controlar orcamento", "equilibrar o orcamento", "diminuir despesas", "aumentar receitas", "gastar menos ou ganhar mais"],
    resposta:
      "Dá para controlar, sim. Existem só duas alavancas para deixar a balança positiva: diminuir despesas ou aumentar receitas (ou as duas). Com o saldo positivo, sobra dinheiro para poupança e investimentos. E mais importante do que saber quanto você ganha é saber como você gasta: por isso anotar os gastos é o primeiro passo.",
    links: [{ rotulo: "Abrir o Controle de Gastos", href: "/financas" }],
  }),
  k({
    id: "fb-poupar-investir",
    sugestao: "Qual a diferença entre poupar e investir?",
    palavras: ["diferenca entre poupar e investir", "poupar e investir", "poupar ou investir", "guardar ou investir", "guardar e investir"],
    resposta:
      "Poupar é guardar dinheiro: separar uma parte do que entra em vez de gastar. Investir é multiplicar: colocar esse dinheiro guardado para render ao longo do tempo. Primeiro vem o hábito de poupar (e a reserva de emergência); depois, investir faz o dinheiro trabalhar por você. Toda caminhada longa começa com um primeiro passo pequeno.",
    links: [{ rotulo: "Trilha: Guardar, poupar e investir", href: "/trilhas/vida-adulta-burocracia" }],
  }),
  k({
    id: "fb-planilha",
    sugestao: "Como usar uma planilha de controle financeiro?",
    palavras: ["planilha", "planilha de controle", "controle financeiro pessoal", "como anotar gastos", "onde anotar meus gastos", "aplicativo de financas"],
    resposta:
      "Uma planilha de controle financeiro tem três partes: receitas (tudo o que entra), despesas (tudo o que sai) e investimentos. O exercício é preencher a coluna do mês atual com o que você já sabe e ir completando. No Integra Jovem, o Controle de Gastos faz esse papel: registre a renda do mês, os gastos por categoria e acompanhe o saldo e a evolução mensal.",
    links: [{ rotulo: "Abrir o Controle de Gastos", href: "/financas" }],
  }),

  k({
    id: "fb-porcentagem",
    sugestao: "Como calcular porcentagem?",
    palavras: ["porcentagem", "calcular porcentagem", "como calcular por cento", "calcular desconto", "calcular acrescimo", "quanto e por cento"],
    resposta:
      "Porcentagem é uma parte de 100. Para calcular 20% de um valor, divida o valor por 100 e multiplique por 20: 20% de 700 = 700 ÷ 100 × 20 = 140. Cuidado com a confusão: 20% sozinho é 0,2 (vinte centésimos); '20% de 100' é 20. Saber isso ajuda a conferir descontos, acréscimos e juros.",
    links: [{ rotulo: "Ver no Glossário", href: "/glossario" }],
  }),
  k({
    id: "fb-o-que-sao-juros",
    sugestao: "O que são juros?",
    palavras: ["o que sao juros", "o que e juros", "juros de emprestimo", "como calcular juros", "juros ao mes"],
    resposta:
      "Juros são uma porcentagem cobrada (ou paga) sobre um valor de dinheiro a cada período. Funciona como o 'preço' do dinheiro emprestado. Exemplo: se você pega R$ 1.000 emprestados a 4% ao mês, depois de um mês deve R$ 1.000 + 4% = R$ 1.040. Esses R$ 40 são os juros: o que você pagou para usar o dinheiro de outra pessoa. Quando você investe, é o contrário: os juros são o que você recebe.",
    links: [{ rotulo: "Trilha: Juros compostos", href: "/trilhas/uso-consciente-tecnologia" }],
  }),
  k({
    id: "fb-juros-compostos-exemplo",
    sugestao: "Como os juros compostos crescem na prática?",
    palavras: ["exemplo de juros compostos", "calcular juros compostos", "juros compostos na pratica", "juros sobre juros exemplo", "quanto rende em 40 anos", "40 anos", "juros compostos crescem", "na pratica"],
    resposta:
      "Nos juros compostos, cada mês rende sobre o valor já acumulado. Exemplo: R$ 200 a 2% ao mês viram R$ 204,00 no 1º mês, R$ 208,08 no 2º, R$ 212,24 no 3º e R$ 216,49 no 4º. No longo prazo o efeito é enorme: começando com R$ 200 e depositando R$ 200 por mês durante 40 anos, a 8% ao ano, o total chega perto de R$ 650 mil, sendo que só cerca de R$ 96 mil saíram do seu bolso; o resto são juros. Por isso tempo é dinheiro.",
    links: [{ rotulo: "Testar no Simulador de Juros Compostos", href: "/financas/simulacoes" }],
  }),
  k({
    id: "fb-parcelado-juros",
    sugestao: "Compra parcelada tem juros?",
    palavras: ["parcelado tem juros", "compra parcelada tem juros", "juros escondidos", "juros embutidos", "sem juros mesmo", "parcelamento tem juros"],
    resposta:
      "Muitas vezes, sim: nas compras parceladas costuma existir uma parte de juros embutida no preço, mesmo quando isso não fica claro. A maioria das pessoas não tem o hábito de calcular esses juros. Um teste simples: compare o total parcelado com o preço à vista (e pergunte se há desconto à vista). Se o parcelado sai mais caro, a diferença são os juros.",
    links: [{ rotulo: "Trilha: Cartão, crédito e dívidas", href: "/trilhas/quem-eu-sou" }],
  }),
  k({
    id: "fb-onde-investir",
    sugestao: "Em que dá para investir?",
    palavras: ["em que investir", "da para investir", "investir em que", "onde investir", "tipos de investimento", "ativos reais", "renda fixa e renda variavel", "rentista", "viver de renda"],
    resposta:
      "Há dois grandes caminhos. Ativos reais: imóveis ou abrir um negócio. Aplicações financeiras, que se dividem em renda fixa (como poupança, Tesouro Direto e CDB, com regras de rendimento definidas) e renda variável (como ações, que sobem e descem ao longo do tempo). Quem consegue viver só do rendimento dos investimentos é chamado de rentista. Isto é conteúdo educativo, não recomendação; menores de idade investem com um responsável.",
    links: [{ rotulo: "Simular uma carteira", href: "/financas/simulacoes" }],
  }),
  k({
    id: "fb-diversificar",
    sugestao: "Por que diversificar os investimentos?",
    palavras: ["diversificar", "diversificacao", "ovos na mesma cesta", "ovos no mesmo cesto", "nao colocar tudo no mesmo lugar", "paciencia para investir"],
    resposta:
      "Diversificar é não colocar todos os ovos na mesma cesta: dividir o dinheiro entre tipos diferentes de investimento para que um tombo em um deles não derrube tudo. Junto com a diversificação vem a paciência: investimento dá resultado com tempo, e mexer a toda hora costuma atrapalhar.",
    links: [{ rotulo: "Simular uma carteira diversificada", href: "/financas/simulacoes" }],
  }),

  k({
    id: "fb-sustentabilidade",
    sugestao: "O que é sustentabilidade?",
    palavras: ["o que e sustentabilidade", "o que significa sustentabilidade", "acao sustentavel", "acoes sustentaveis", "ser sustentavel", "sou sustentavel"],
    resposta:
      "Sustentabilidade é conseguir usar o mundo hoje sem estragar os recursos que as próximas gerações vão precisar. Ela envolve questões sociais, de energia, ambientais e políticas, que afetam também a economia. Uma ação é sustentável quando é, ao mesmo tempo, ecologicamente correta (não destrói a natureza), economicamente viável (cabe em custos e prazos reais), socialmente justa (não explora pessoas e gera oportunidades) e culturalmente diversa (respeita os valores de cada comunidade).",
    links: [{ rotulo: "Ver meus gastos com consciência", href: "/financas" }],
  }),
  k({
    id: "fb-desperdicio-dia-a-dia",
    sugestao: "Como evitar desperdício no dia a dia?",
    palavras: ["evitar desperdicio", "desperdicio no dia a dia", "torneira aberta", "lampada acesa", "chuveiro", "comida no prato", "economizar agua", "economizar energia", "economizar luz"],
    resposta:
      "Economizar, na maioria das vezes, é só deixar de desperdiçar. Exemplos do dia a dia: torneira aberta enquanto escova os dentes, luz acesa em cômodo vazio, TV ligada sem ninguém assistindo, chuveiro ligado muito antes do banho, comida que sobra no prato ou estraga na geladeira, roupa descartada só porque saiu de moda e celular trocado só por não ser o último modelo. Cada desperdício evitado vira dinheiro e menos impacto no planeta.",
    links: [{ rotulo: "Ver minha conta de energia no Controle de Gastos", href: "/financas" }],
  }),
  k({
    id: "fb-retrato-brasil",
    sugestao: "Qual é o retrato ambiental e social do Brasil?",
    palavras: ["desigualdade social", "concentracao de renda", "retrato do brasil", "retrato ambiental", "desmatamento", "agua potavel", "falta de agua potavel", "lixo no brasil", "quanto lixo o brasil", "lixoes", "dados sobre o lixo", "reciclagem no brasil", "residuos solidos"],
    resposta:
      "Alguns dados trazidos no curso (de 2019 e 2020) mostram por que sustentabilidade importa: o 1% mais rico do Brasil concentrava 28,3% da renda do país, e os 10% mais ricos, 41,9%. O Brasil tem cerca de 12% da água doce do mundo, mas 35 milhões de pessoas não tinham acesso a água potável. O país produzia perto de 80 milhões de toneladas de lixo por ano, mais da metade ia para lixões, e embora cerca de 30% pudesse ser reaproveitado, só 3% era. Separar o lixo e descartar corretamente já ajuda: ambiente limpo é o que menos se suja.",
    links: [{ rotulo: "Escrever uma reflexão sobre isso", href: "/perfil" }],
  }),
];

const semSugestao = (t: Omit<Tema, "sugerir">): Tema => ({ ...t, sugerir: false });

export const conhecimentoVideos: Tema[] = [
  semSugestao({
    id: "video-saber-quanto-deve",
    sugestao: "Por que é importante saber quanto eu devo?",
    palavras: ["quanto devo", "nao sei quanto devo", "saber quanto devo", "quanto eu devo", "total das dividas", "listar dividas", "quantas parcelas faltam", "quanto falta pagar", "desconhece o quanto deve"],
    resposta:
      "Uma reportagem do SBT Brasil (2017) mostrou que quase metade dos brasileiros endividados não sabia quanto devia. Pesquisas do SPC Brasil com pessoas inadimplentes apontam o mesmo problema: muita gente sabe pouco sobre o valor das próprias contas e não sabe quantas parcelas ainda faltam pagar. Sem esse número, fica impossível planejar a saída. O caminho: liste cada dívida com o valor total, as parcelas que faltam e os juros; registre tudo por escrito (a memória falha) e comece pelas de juros mais altos.",
    links: [
      { rotulo: "Registrar as parcelas no Controle de Gastos", href: "/financas" },
      { rotulo: "Trilha: Cartão, crédito e dívidas", href: "/trilhas/quem-eu-sou" },
    ],
  }),
  semSugestao({
    id: "video-endividado-inadimplente",
    sugestao: "Qual a diferença entre endividado e inadimplente?",
    palavras: ["endividado e inadimplente", "diferenca entre endividado", "inadimplente", "inadimplencia", "o que e estar endividado", "estar endividado", "o que e ser endividado"],
    resposta:
      "São coisas diferentes, e muita gente confunde: numa pesquisa do SPC Brasil, só cerca de 1 em cada 5 pessoas acertou o significado. Estar endividado é ter parcelas a pagar de compras ou empréstimos, mesmo que estejam em dia. Estar inadimplente é ter contas atrasadas, o que pode levar ao nome negativado. Ter dívida em dia não é, por si só, um problema; o perigo é quando as parcelas somadas não cabem mais no orçamento e começam os atrasos.",
    links: [{ rotulo: "Trilha: Cartão, crédito e dívidas", href: "/trilhas/quem-eu-sou" }],
  }),
  semSugestao({
    id: "video-becky-bloom",
    sugestao: "O que o filme Os Delírios de Consumo de Becky Bloom ensina?",
    palavras: ["becky bloom", "delirios de consumo", "filme sobre consumo", "filme sobre dividas", "filme sobre compras", "filme sobre cartao de credito", "confessions of a shopaholic"],
    resposta:
      "O filme 'Os Delírios de Consumo de Becky Bloom' (2009) conta a história de uma jovem jornalista que compra por impulso, acumula dívidas em vários cartões de crédito e tenta esconder as cobranças, até a situação sair do controle. Algumas lições que dá para tirar: comprar para aliviar emoções vira um ciclo difícil de quebrar (quando vira compulsão, tem nome: oniomania); fugir das cobranças só faz a dívida crescer com juros; e o primeiro passo para sair é encarar os números, pedir ajuda e mudar hábitos. É uma comédia, mas o problema retratado é bem real.",
    links: [
      { rotulo: "Trilha: Cartão, crédito e dívidas", href: "/trilhas/quem-eu-sou" },
      { rotulo: "Anotar meus gastos", href: "/financas" },
    ],
  }),
  semSugestao({
    id: "video-mudancas-climaticas",
    sugestao: "O que são mudanças climáticas e o que isso tem a ver comigo?",
    palavras: ["mudancas climaticas", "mudanca climatica", "aquecimento global", "clima", "combustiveis fosseis", "efeito estufa", "gestao para sustentabilidade"],
    resposta:
      "Mudanças climáticas são alterações de longo prazo nos padrões de temperatura e clima do planeta. Segundo a ONU, as atividades humanas são a principal causa, sobretudo a queima de combustíveis fósseis como carvão, petróleo e gás. Isso se liga à sustentabilidade e ao seu dinheiro: consumir com consciência, evitar desperdício de energia, água e comida, e preferir produtos que duram mais ajuda o planeta e o orçamento ao mesmo tempo.",
    links: [{ rotulo: "Ver meus gastos com energia", href: "/financas" }],
  }),
  semSugestao({
    id: "video-bolha-agua-comestivel",
    sugestao: "O que é a bolha de água comestível?",
    palavras: ["bolha de agua", "agua comestivel", "embalagem comestivel", "garrafa plastica", "garrafas plasticas", "plastico descartavel", "substituir plastico", "menos plastico"],
    resposta:
      "É uma alternativa às garrafinhas plásticas: a água fica dentro de uma película fina e flexível feita de material natural (à base de algas), que pode ser comida ou se decompõe rapidamente. A ideia mostra como a inovação pode reduzir o lixo plástico, que leva centenas de anos para se degradar. No dia a dia, dá para fazer parte disso usando garrafa reutilizável, recusando descartáveis quando possível e separando o lixo reciclável; muitas vezes, isso também economiza dinheiro.",
    links: [{ rotulo: "Escrever uma reflexão sobre consumo", href: "/perfil" }],
    fonte: { rotulo: "Vídeo: Bolha de água comestível substitui garrafas plásticas (YouTube)", url: "https://www.youtube.com/watch?v=JuKWka9qZDQ" },
  }),
  semSugestao({
    id: "separar-lixo-reciclar",
    sugestao: "Como separar o lixo e reciclar?",
    palavras: [
      "separar o lixo", "separar lixo", "separacao do lixo", "como reciclar", "reciclar", "reciclagem", "lixo reciclavel",
      "coleta seletiva", "descartar", "descarte", "ecoponto", "pilhas", "lixo eletronico", "lixo organico", "jogar lixo",
    ],
    resposta:
      "Separar o lixo é simples: deixe de um lado os recicláveis (papel, plástico, metal e vidro), de preferência limpos e secos, e do outro o lixo orgânico (restos de comida) e o que não dá para reciclar. Pilhas, baterias, eletrônicos, remédios vencidos e óleo de cozinha não vão no lixo comum: procure pontos de coleta ou ecopontos na sua cidade. Veja se o seu bairro tem coleta seletiva. Reaproveitar e comprar menos descartáveis também diminui o lixo e, muitas vezes, economiza dinheiro.",
    links: [{ rotulo: "Escrever uma reflexão sobre consumo", href: "/perfil" }],
  }),
];

const PLANALTO = {
  cp: { rotulo: "Código Penal (texto oficial — Planalto)", url: "https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm" },
  cdc: { rotulo: "Código de Defesa do Consumidor (texto oficial — Planalto)", url: "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm" },
  eca: { rotulo: "Estatuto da Criança e do Adolescente (texto oficial — Planalto)", url: "https://www.planalto.gov.br/ccivil_03/leis/l8069.htm" },
  lgpd: { rotulo: "Lei Geral de Proteção de Dados — LGPD (texto oficial — Planalto)", url: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" },
  apostas: { rotulo: "Lei 14.790/2023 — apostas de quota fixa (texto oficial — Planalto)", url: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14790.htm" },
  economiaPopular: { rotulo: "Lei 1.521/1951 — crimes contra a economia popular (texto oficial — Planalto)", url: "https://www.planalto.gov.br/ccivil_03/leis/l1521.htm" },
};

const AVISO_LEGAL = " Esta é uma explicação educativa; para um caso específico, procure a Defensoria Pública (gratuita), o Procon ou um advogado.";

export const conhecimentoLegal: Tema[] = [
  semSugestao({
    id: "lei-nao-pagar-divida",
    sugestao: "É crime não pagar dívida?",
    palavras: [
      "crime nao pagar divida", "e crime nao pagar", "nao pagar divida e crime", "crime ficar devendo", "preso por divida",
      "presa por divida", "prisao por divida", "vou preso por", "vou ser preso", "posso ser preso", "cadeia por divida",
      "policia por divida", "processado por divida", "me processar por divida",
    ],
    resposta:
      "Não. Deixar de pagar uma dívida não é crime, e no Brasil ninguém vai preso por dívida: a Constituição só permite prisão civil por pensão alimentícia não paga. Mas não pagar tem consequências: juros e multa, nome negativado (por no máximo 5 anos), cobrança e até ação na Justiça, que pode levar à penhora de alguns bens. Do outro lado, o credor também tem regras: pelo Código de Defesa do Consumidor, a cobrança não pode expor você ao ridículo nem usar ameaça ou constrangimento, e isso pode até ser crime. O melhor caminho é negociar." +
      AVISO_LEGAL,
    links: [{ rotulo: "Trilha: Cartão, crédito e dívidas", href: "/trilhas/quem-eu-sou" }],
    fonte: PLANALTO.cdc,
  }),
  semSugestao({
    id: "lei-estelionato",
    sugestao: "O que é crime de estelionato?",
    palavras: ["estelionato", "estelionatario", "estelionataria", "crime de golpe", "golpe e crime", "golpe e permitido", "golpe e legal", "aplicar golpe e crime", "dar golpe e crime", "fraude eletronica", "o que diz a lei sobre golpe", "lei do golpe"],
    resposta:
      "Estelionato é o crime de enganar alguém para conseguir uma vantagem, normalmente dinheiro, usando mentira ou truque. Está no artigo 171 do Código Penal, com pena de 1 a 5 anos de prisão e multa. Quando o golpe é feito pela internet, por telefone ou redes sociais (como golpe do Pix, do falso funcionário ou do WhatsApp clonado), a lei prevê a fraude eletrônica, com pena maior: de 4 a 8 anos. Quem foi vítima deve avisar o banco na hora, registrar um boletim de ocorrência e guardar as provas." +
      AVISO_LEGAL,
    links: [{ rotulo: "Trilha: Protegendo seu dinheiro", href: "/trilhas/saude-emocional" }],
    fonte: PLANALTO.cp,
  }),
  semSugestao({
    id: "lei-pix-errado",
    sugestao: "Recebi um Pix por engano, posso ficar com o dinheiro?",
    palavras: ["pix por engano", "pix errado", "recebi um pix", "dinheiro por engano", "transferencia por engano", "ficar com o dinheiro", "posso ficar com"],
    resposta:
      "Não. Ficar com um dinheiro que caiu na sua conta por engano pode ser crime de apropriação de coisa havida por erro (artigo 169 do Código Penal). O certo é devolver. Mas atenção: existe um golpe em que a pessoa manda um Pix e pede para você devolver para OUTRA conta. Por isso, nunca devolva por transferência nova: use a opção \"devolver\" no próprio Pix recebido, no aplicativo do banco, ou fale com o banco." +
      AVISO_LEGAL,
    links: [{ rotulo: "Trilha: Protegendo seu dinheiro", href: "/trilhas/saude-emocional" }],
    fonte: PLANALTO.cp,
  }),
  semSugestao({
    id: "lei-invasao-conta",
    sugestao: "Invadir conta ou clonar cartão é crime?",
    palavras: ["invadir conta e crime", "hackear e crime", "hackear e permitido", "hackear e legal", "invadir e permitido", "clonar e permitido", "clonar cartao e crime", "clonagem e crime", "lei carolina dieckmann", "invasao de dispositivo", "crime cibernetico", "crime virtual", "crimes na internet"],
    resposta:
      "Sim. Invadir celular, computador ou contas de outra pessoa sem autorização é crime de invasão de dispositivo informático (artigo 154-A do Código Penal, criado pela Lei Carolina Dieckmann), com pena de 1 a 4 anos de prisão e multa, que aumenta se houver prejuízo. Usar cartão clonado ou dados de outra pessoa para comprar ou transferir dinheiro também é crime, como furto ou fraude eletrônica. Se isso aconteceu com você: troque as senhas, ative a verificação em duas etapas, avise o banco e registre um boletim de ocorrência." +
      AVISO_LEGAL,
    fonte: PLANALTO.cp,
  }),
  semSugestao({
    id: "lei-conta-laranja",
    sugestao: "Emprestar a conta para outra pessoa é crime?",
    palavras: ["emprestar conta e crime", "emprestar a conta", "emprestar conta", "emprestar minha conta e crime", "conta para outra pessoa", "conta laranja e crime", "o que e conta laranja", "o que e laranja", "laranja e crime", "emprestar meu pix", "lavagem de dinheiro"],
    resposta:
      "Pode ser. Quem empresta a conta, o cartão ou a chave Pix para alguém movimentar dinheiro pode acabar respondendo junto pelo crime que foi cometido com ela, como estelionato ou lavagem de dinheiro (Lei 9.613/1998), mesmo dizendo que não sabia. Além disso, o banco pode bloquear a conta e o seu nome fica ligado à fraude. Por isso: nunca empreste nem 'alugue' sua conta, mesmo por uma comissão ou para um amigo." +
      AVISO_LEGAL,
    links: [{ rotulo: "Trilha: Protegendo seu dinheiro", href: "/trilhas/saude-emocional" }],
  }),
  semSugestao({
    id: "lei-piramide",
    sugestao: "Pirâmide financeira é crime?",
    palavras: ["piramide e crime", "piramide financeira e crime", "esquema de piramide", "marketing de piramide", "corrente de dinheiro", "crime contra a economia popular"],
    resposta:
      "Sim. Pirâmide financeira é crime contra a economia popular (Lei 1.521/1951): é um esquema em que o 'lucro' de quem entrou antes é pago com o dinheiro de quem entra depois, e não com um produto ou investimento real. Quando param de entrar pessoas novas, o esquema quebra e a maioria perde o dinheiro. Sinais de alerta: rendimento alto e 'garantido', ganho por trazer novas pessoas e pressa para você entrar." +
      AVISO_LEGAL,
    fonte: PLANALTO.economiaPopular,
  }),
  semSugestao({
    id: "lei-apostas-menores",
    sugestao: "Menor de idade pode apostar em bets?",
    palavras: ["menor pode apostar", "menor de idade pode apostar", "apostar sendo menor", "bet para menor", "bets para menores", "idade para apostar", "apostas sao legais", "aposta e legal", "lei das bets"],
    resposta:
      "Não. A Lei 14.790/2023 proíbe que menores de 18 anos façam apostas de quota fixa (as chamadas bets), e as empresas autorizadas são obrigadas a impedir o cadastro de menores. Para maiores, só podem operar no Brasil as casas autorizadas pelo Ministério da Fazenda. Mesmo para adultos, apostas não são investimento: são feitas para a casa ganhar no longo prazo e podem viciar." +
      AVISO_LEGAL,
    fonte: PLANALTO.apostas,
  }),
  semSugestao({
    id: "lei-ato-infracional",
    sugestao: "O que acontece se um menor de idade comete um crime?",
    palavras: ["menor comete crime", "menor de idade comete crime", "menor de idade comete", "se um menor", "comete um crime", "cometer crime sendo menor", "menor pode ser preso", "ato infracional", "medida socioeducativa", "medidas socioeducativas", "menor responde por crime"],
    resposta:
      "Pela lei, quando um adolescente (de 12 a 17 anos) faz algo que seria crime, isso se chama ato infracional, e ele responde pelo Estatuto da Criança e do Adolescente (ECA). As consequências são medidas socioeducativas, como advertência, obrigação de reparar o dano, prestação de serviços à comunidade, liberdade assistida e, nos casos graves, internação. Ou seja: ser menor não significa ficar sem consequência." +
      AVISO_LEGAL,
    fonte: PLANALTO.eca,
  }),
  semSugestao({
    id: "lei-furto-roubo",
    sugestao: "Qual a diferença entre furto e roubo?",
    palavras: ["diferenca entre furto e roubo", "furto e roubo", "o que e furto", "o que e roubo", "furto ou roubo"],
    resposta:
      "Furto é pegar algo de outra pessoa sem violência, muitas vezes sem a vítima perceber (artigo 155 do Código Penal). Roubo é pegar algo usando violência ou grave ameaça (artigo 157) e tem pena maior. Nos dois casos, a vítima deve registrar um boletim de ocorrência e, se levaram cartão ou celular, bloquear tudo com o banco e a operadora o quanto antes." +
      AVISO_LEGAL,
    fonte: PLANALTO.cp,
  }),
  semSugestao({
    id: "lei-cobranca-abusiva",
    sugestao: "O que é cobrança abusiva?",
    palavras: ["cobranca abusiva", "cobranca indevida", "me cobrando demais", "me ameacando por divida", "cobrador me ameacou", "ligam toda hora cobrando", "expor minha divida", "constrangimento na cobranca"],
    resposta:
      "Pelo Código de Defesa do Consumidor, quem cobra uma dívida não pode expor você ao ridículo, ameaçar, constranger ou interferir no seu trabalho e no seu descanso; usar ameaça ou constrangimento na cobrança pode até ser crime. E se você pagou algo que não devia, pode ter direito a receber de volta o dobro do que pagou a mais. Guarde provas (mensagens, áudios, prints) e reclame no Procon ou no Consumidor.gov.br." +
      AVISO_LEGAL,
    fonte: PLANALTO.cdc,
  }),
  semSugestao({
    id: "lei-nome-negativado",
    sugestao: "Por quanto tempo o nome fica sujo?",
    palavras: ["quanto tempo nome sujo", "quanto tempo o nome fica", "nome fica negativado", "prazo nome sujo", "limpar meu nome", "tirar meu nome", "paguei e meu nome", "nome continua sujo"],
    resposta:
      "Pelo Código de Defesa do Consumidor, uma dívida pode ficar registrada nos cadastros de inadimplentes (como Serasa e SPC) por no máximo 5 anos. Depois disso, o registro deve sair, mesmo que a dívida não tenha sido paga. E quando você paga, o credor tem 5 dias úteis para pedir a retirada do seu nome, segundo o entendimento do Superior Tribunal de Justiça. Se não tirarem, você pode reclamar no Procon." +
      AVISO_LEGAL,
    fonte: PLANALTO.cdc,
  }),
  semSugestao({
    id: "lei-arrependimento",
    sugestao: "Posso desistir de uma compra feita pela internet?",
    palavras: ["direito de arrependimento", "desistir da compra", "desistir de uma compra", "compra feita pela internet", "compra pela internet", "devolver compra", "cancelar compra pela internet", "comprei pela internet e quero devolver", "7 dias para devolver", "sete dias"],
    resposta:
      "Sim. Pelo Código de Defesa do Consumidor, em compras feitas fora da loja física (internet, telefone, aplicativo), você pode desistir em até 7 dias contados da compra ou do recebimento do produto, sem precisar explicar o motivo, e tem direito a receber de volta tudo o que pagou, inclusive o frete. Faça o pedido por escrito e guarde o comprovante." +
      AVISO_LEGAL,
    fonte: PLANALTO.cdc,
  }),
  semSugestao({
    id: "lei-lgpd",
    sugestao: "Quais são meus direitos sobre meus dados pessoais?",
    palavras: ["lgpd", "lei geral de protecao de dados", "protecao de dados", "meus dados pessoais", "direitos sobre meus dados", "apagar meus dados", "excluir meus dados", "vazamento de dados", "vazaram meus dados", "o que fazem com meus dados", "privacidade dos meus dados"],
    resposta:
      "A LGPD (Lei 13.709/2018) garante que você pode: saber quais dados uma empresa tem sobre você, pedir a correção de dados errados, pedir a exclusão de dados desnecessários, saber com quem eles foram compartilhados e revogar o consentimento. Dados de crianças e adolescentes devem ser tratados sempre no melhor interesse deles. No Integra Jovem, você pode ver e editar seus dados no Perfil e excluir sua conta, o que apaga seus registros. Se seus dados vazaram em algum lugar, troque as senhas, desconfie de mensagens pedindo códigos e pode reclamar na ANPD, a autoridade nacional de proteção de dados." +
      " Esta é uma explicação educativa; para um caso específico, procure a Defensoria Pública, o Procon ou um advogado.",
    links: [{ rotulo: "Abrir o Perfil", href: "/perfil" }],
    fonte: PLANALTO.lgpd,
  }),
  semSugestao({
    id: "lei-roubar-permitido",
    sugestao: "Roubar é permitido?",
    palavras: [
      "roubar e permitido", "e permitido roubar", "pode roubar", "roubar pode", "roubar e crime", "roubar e errado",
      "roubar e certo", "roubar e legal", "roubar e proibido", "furtar e permitido", "furtar e crime", "furtar e errado",
      "furtar e legal", "e crime roubar", "e crime furtar", "roubo e crime", "furto e crime", "roubar e pecado",
      "pegar sem pedir e crime", "roubar pouco", "roubar de quem tem muito",
    ],
    resposta:
      "Não. Roubar (pegar algo com violência ou ameaça) e furtar (pegar sem violência) são crimes no Brasil, previstos nos artigos 157 e 155 do Código Penal, com pena de prisão, não importa o valor nem de quem seja. Adolescentes respondem pelo ECA, com medidas socioeducativas. Além disso, sempre prejudica alguém de verdade. Se você está passando por algum aperto, eu posso te ajudar a encontrar saídas legais.",
    fonte: PLANALTO.cp,
  }),
];
