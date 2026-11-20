

import { conhecimentoFundacaoBradesco, conhecimentoLegal, conhecimentoVideos } from "@/lib/assistente-conhecimento";
import { NOME_ASSISTENTE } from "@/lib/assistente-nome";
import { respostaMenuDeAssuntos } from "@/lib/assistente-topicos";

export type LinkResposta = { rotulo: string; href: string };

export type Tema = {
  id: string;

  sugestao: string;

  palavras: string[];
  resposta: string;
  links?: LinkResposta[];

  fonte?: { rotulo: string; url: string };

  sugerir?: boolean;
};

const CURSO_EV_EDUCACAO_FINANCEIRA = {
  rotulo: "Curso gratuito Educação Financeira — Escola Virtual da Fundação Bradesco",
  url: "https://www.ev.org.br/cursos/educacao-financeira",
};
const CURSO_EV_PROTECAO_FINANCEIRA = {
  rotulo: "Curso gratuito Construindo minha Proteção Financeira — Escola Virtual da Fundação Bradesco",
  url: "https://www.ev.org.br/cursos/Construindo-minha-Protecao-Financeira",
};
const CURSO_ALURA_PSICOLOGIA = {
  rotulo: "Curso Psicologia financeira: maximizando o potencial financeiro — Alura",
  url: "https://www.alura.com.br/curso-online-psicologia-financeira-maximizando-potencial-financeiro",
};
const VIDEO_SERASA_ORGANIZAR = {
  rotulo: "Vídeo: Como organizar as finanças e usar crédito — Serasa Ensina (YouTube)",
  url: "https://www.youtube.com/watch?v=8RnlxrnOcEY",
};

const temasComPerguntaPronta: Tema[] = [
  {
    id: "orcamento",
    sugestao: "Como organizo meu dinheiro do mês?",
    palavras: ["orcamento", "organizar", "organizo", "controle de gastos", "planejar o mes", "gastar menos", "sobrar dinheiro", "sobra"],
    resposta:
      "Comece anotando tudo o que entra (mesada, salário, bicos) e tudo o que sai. Separe os gastos em essenciais (transporte, alimentação) e não essenciais (lanche, streaming). Uma regra simples para começar: 50% para o essencial, 30% para o que você gosta e 20% para guardar. Depois de um mês anotando, você enxerga para onde o dinheiro está indo e decide onde cortar.",
    links: [
      { rotulo: "Abrir o Controle de Gastos", href: "/financas" },
      { rotulo: "Trilha: Dominando o orçamento", href: "/trilhas/descobrindo-profissoes" },
    ],
  },
  {
    id: "50-30-20",
    sugestao: "O que é a regra 50-30-20?",
    palavras: ["50 30 20", "50-30-20", "503020", "regra 50", "cinquenta trinta vinte"],
    resposta:
      "É um jeito fácil de dividir a renda: 50% para necessidades (contas, transporte, comida), 30% para desejos (lazer, roupas, jogos) e 20% para objetivos (reserva, metas, investir). Não precisa ser exato: é um ponto de partida. Se sua renda é pequena, até guardar 5% ou 10% já cria o hábito.",
    links: [{ rotulo: "Montar meu orçamento", href: "/financas" }],
  },
  {
    id: "reserva",
    sugestao: "O que é reserva de emergência?",
    palavras: ["reserva", "emergencia", "imprevisto", "guardar para", "colchao"],
    resposta:
      "É um dinheiro guardado só para imprevistos: celular quebrado, remédio, uma conta inesperada. O ideal é juntar de 3 a 6 meses dos seus gastos essenciais, aos poucos. Ela deve ficar num lugar seguro e fácil de sacar, que renda pelo menos um pouco (por exemplo, aplicações que acompanham o CDI com liquidez diária). Primeiro a reserva, depois os outros investimentos.",
    links: [
      { rotulo: "Definir minha meta de reserva", href: "/financas" },
      { rotulo: "Trilha: Guardar, poupar e investir", href: "/trilhas/vida-adulta-burocracia" },
    ],
  },
  {
    id: "juros-compostos",
    sugestao: "Como funcionam os juros compostos?",
    palavras: ["juros compostos", "o que e juros compostos", "o que sao juros compostos", "juros sobre juros", "rendimento", "render", "rende"],
    resposta:
      "Nos juros compostos, o rendimento de cada mês passa a render também no mês seguinte: é o famoso 'juros sobre juros'. Por isso o tempo é o maior aliado: começar cedo, mesmo com pouco, costuma valer mais do que começar tarde com muito. O mesmo efeito funciona contra você numa dívida, que cresce rápido quando não é paga.",
    links: [
      { rotulo: "Testar no Simulador de Juros Compostos", href: "/financas/simulacoes" },
      { rotulo: "Trilha: Juros compostos", href: "/trilhas/uso-consciente-tecnologia" },
    ],
  },
  {
    id: "cartao",
    sugestao: "Como usar o cartão de crédito sem me enrolar?",
    palavras: ["cartao", "credito", "fatura", "limite", "pagamento minimo"],
    resposta:
      "O cartão de crédito não é dinheiro a mais: é uma dívida que chega na fatura. Algumas dicas: use só para o que você já pagaria à vista, acompanhe os gastos durante o mês e pague a fatura inteira. Evite pagar só o mínimo: o saldo restante entra no rotativo, que tem alguns dos juros mais altos do mercado.",
    links: [{ rotulo: "Trilha: Cartão, crédito e dívidas", href: "/trilhas/quem-eu-sou" }],
  },
  {
    id: "parcelamento",
    sugestao: "Vale a pena parcelar?",
    palavras: ["parcelar", "parcela", "parcelamento", "prestacao", "vezes sem juros", "10x"],
    resposta:
      "Parcelar sem juros pode ajudar a organizar o mês, mas cuidado: várias parcelas pequenas juntas viram um valor grande e ocupam sua renda por meses. Antes de parcelar, some todas as parcelas que você já tem. Se houver juros, compare o total a prazo com o preço à vista; muitas vezes vale esperar e juntar o dinheiro.",
    links: [{ rotulo: "Registrar parcelas no Controle de Gastos", href: "/financas" }],
  },
  {
    id: "dividas",
    sugestao: "Estou com dívida, o que faço?",
    palavras: ["divida", "devendo", "endividado", "negativado", "nome sujo", "atrasado", "atrasada"],
    resposta:
      "Primeiro, respire: dá para sair. 1) Liste todas as dívidas com valor e juros. 2) Pare de fazer dívidas novas. 3) Priorize as de juros mais altos (cartão, cheque especial). 4) Negocie: muitas empresas oferecem desconto para quitar. Se for menor de idade, converse com um adulto de confiança antes de assinar qualquer acordo.",
    links: [{ rotulo: "Trilha: Cartão, crédito e dívidas", href: "/trilhas/quem-eu-sou" }],
  },
  {
    id: "golpes",
    sugestao: "Como evitar golpes no Pix?",
    palavras: ["golpe", "pix", "fraude", "link suspeito", "clonado", "clonaram", "whatsapp", "boleto falso"],
    resposta:
      "Desconfie de pressa e de promessas fáceis. Nunca passe códigos que chegam por SMS, não clique em links de 'prêmios' e confirme por ligação quando alguém pedir dinheiro por mensagem, mesmo que pareça um amigo ou parente. Antes de um Pix, confira o nome de quem vai receber. Se cair num golpe, avise o banco na hora e registre um boletim de ocorrência.",
    links: [{ rotulo: "Trilha: Protegendo seu dinheiro", href: "/trilhas/saude-emocional" }],
  },
  {
    id: "investir",
    sugestao: "Como começar a investir?",
    palavras: ["investir", "investimento", "aplicar", "comecar a investir", "tesouro", "renda fixa"],
    resposta:
      "Um caminho comum: 1) organize o orçamento, 2) monte a reserva de emergência, 3) defina objetivos com prazo. Para começar, muita gente estuda a renda fixa (como Tesouro Direto e CDBs), que é mais previsível. Renda variável (como ações) oscila mais e combina com prazos longos. Menores de idade precisam de um responsável para abrir conta em corretora. Isto é conteúdo educativo, não recomendação.",
    links: [
      { rotulo: "Simular uma carteira", href: "/financas/simulacoes" },
      { rotulo: "Trilha: Guardar, poupar e investir", href: "/trilhas/vida-adulta-burocracia" },
    ],
  },
  {
    id: "cdi",
    sugestao: "O que é CDI?",
    palavras: ["cdi", "selic", "100% do cdi", "cdb", "poupanca"],
    resposta:
      "O CDI é uma taxa que anda muito perto da Selic (a taxa básica de juros do país) e serve de referência para vários investimentos de renda fixa. Quando um investimento rende '100% do CDI', ele acompanha essa taxa. Comparar quanto do CDI cada opção paga ajuda a saber qual rende mais, sempre olhando também o prazo e a segurança.",
    links: [
      { rotulo: "Simulador Juros Bancos CDI", href: "/financas/simulacoes" },
      { rotulo: "Ver no Glossário", href: "/glossario" },
    ],
  },
  {
    id: "metas",
    sugestao: "Como juntar dinheiro para algo que eu quero?",
    palavras: ["meta", "juntar", "objetivo", "sonho", "economizar", "poupar", "juntar dinheiro", "quanto guardar", "guardar pra", "guardar dinheiro"],
    resposta:
      "Transforme o desejo em meta: quanto custa e em quantos meses você quer. Divida o valor pelos meses e você tem quanto guardar por mês. Guarde logo que o dinheiro entra (não com o que sobra) e acompanhe o progresso. Se o valor mensal ficar pesado, aumente o prazo ou procure uma versão mais barata.",
    links: [
      { rotulo: "Criar uma meta no Perfil", href: "/perfil" },
      { rotulo: "Calcular no simulador", href: "/financas/simulacoes" },
    ],
  },
  {
    id: "primeiro-salario",
    sugestao: "Recebi meu primeiro salário, e agora?",
    palavras: ["salario", "primeiro emprego", "jovem aprendiz", "estagio", "holerite", "desconto", "inss"],
    resposta:
      "Parabéns! Confira o holerite: o valor líquido (que cai na conta) é menor que o bruto por causa de descontos como INSS e vale-transporte. Antes de gastar, separe um valor para guardar, planeje os gastos fixos e só então o lazer. Uma boa ideia é começar a reserva de emergência já no primeiro mês.",
    links: [{ rotulo: "Trilha: Dominando o orçamento", href: "/trilhas/descobrindo-profissoes" }],
  },
  {
    id: "inflacao",
    sugestao: "O que é inflação?",
    palavras: ["inflacao", "ipca", "preco subiu", "precos subindo", "poder de compra"],
    resposta:
      "Inflação é o aumento geral dos preços ao longo do tempo. Com ela, o mesmo dinheiro compra menos no futuro. Por isso deixar o dinheiro parado 'embaixo do colchão' faz ele perder valor, e vale procurar opções que rendam pelo menos a inflação.",
    links: [{ rotulo: "Ver no Glossário", href: "/glossario" }],
  },
  {
    id: "xp",
    sugestao: "Como ganho XP e medalhas no site?",
    palavras: ["xp", "experiencia", "nivel", "medalha", "conquista", "emblema", "pontos", "avatar"],
    resposta:
      "Você ganha XP lendo blocos das trilhas (+10), fazendo quizzes na primeira tentativa (até +100) e completando os exercícios práticos (+70). O nível máximo é o 30, alcançado ao completar tudo com os quizzes gabaritados. Nos exercícios, quanto mais rápido, melhor a medalha: de bronze até diamante. Tudo aparece na página Jornada, junto com seu avatar e os emblemas.",
    links: [{ rotulo: "Ver minha Jornada", href: "/jornada" }],
  },

  {
    id: "perfil-financeiro",
    sugestao: "Qual é o meu perfil com dinheiro?",
    palavras: ["perfil financeiro", "perfil", "tipo de pessoa", "gastador", "gastadora", "poupador", "poupadora", "consumista"],
    resposta:
      "Cada pessoa tem um jeito de lidar com dinheiro. Alguns exemplos comuns: quem gasta por impulso assim que recebe; quem nem sabe quanto tem e para onde foi; quem guarda tudo e tem medo de gastar; e quem planeja antes de decidir. Nenhum perfil é 'errado', mas reconhecer o seu ajuda a saber o que treinar: anotar gastos, criar metas ou se permitir aproveitar com planejamento.",
    links: [{ rotulo: "Começar a anotar meus gastos", href: "/financas" }],
    fonte: CURSO_EV_EDUCACAO_FINANCEIRA,
  },
  {
    id: "mapa-financeiro",
    sugestao: "Como fazer um mapa das minhas finanças?",
    palavras: ["mapa", "mapear", "mapeamento", "diagnostico", "analise financeira", "raio x", "compromissos"],
    resposta:
      "Um mapa financeiro tem três partes: 1) ganhos: tudo o que entra no mês; 2) gastos: fixos (que se repetem) e variáveis (que mudam); 3) compromissos: parcelas e dívidas que já estão marcadas para os próximos meses. Com isso na mão, você vê quanto sobra de verdade e consegue definir um objetivo realista.",
    links: [{ rotulo: "Montar no Controle de Gastos", href: "/financas" }],
    fonte: CURSO_EV_PROTECAO_FINANCEIRA,
  },
  {
    id: "impulso",
    sugestao: "Como parar de comprar por impulso?",
    palavras: ["impulso", "compulsivo", "compulsiva", "nao consigo parar", "gasto tudo", "gastei tudo", "ansiedade"],
    resposta:
      "Algumas estratégias que ajudam: espere 24 a 48 horas antes de comprar algo que não estava planejado; saia de listas de promoções e tire o cartão salvo dos apps; vá às compras com lista; e pergunte a si mesmo como está se sentindo. Muita compra por impulso vem de tédio, ansiedade ou vontade de pertencer. Se o dinheiro sai sempre que você está triste ou estressado, vale procurar outras formas de aliviar e conversar com alguém de confiança.",
    links: [{ rotulo: "Escrever no diário de reflexões", href: "/perfil" }],
    fonte: CURSO_EV_PROTECAO_FINANCEIRA,
  },
  {
    id: "necessidade-desejo",
    sugestao: "Como saber se é necessidade ou desejo?",
    palavras: ["necessidade", "desejo", "preciso mesmo", "vale a pena comprar", "devo comprar", "quero comprar"],
    resposta:
      "Necessidade é o que você precisa para viver e cumprir suas obrigações (comida, transporte para a escola, material). Desejo é o que traz prazer, mas pode esperar ou ser substituído. Desejos não são proibidos: o segredo é planejá-los. Um teste rápido: 'se eu não comprar hoje, o que acontece?'. Se a resposta for 'nada', é desejo, e dá para virar uma meta.",
    links: [{ rotulo: "Transformar em meta", href: "/perfil" }],
    fonte: CURSO_EV_EDUCACAO_FINANCEIRA,
  },
  {
    id: "seguro",
    sugestao: "Para que serve um seguro?",
    palavras: ["seguro", "seguros", "protecao financeira", "proteger", "celular roubado", "acidente"],
    resposta:
      "Um seguro é um jeito de dividir riscos: você paga um valor combinado e, se acontecer algo previsto no contrato (roubo do celular, acidente, problema de saúde), a seguradora cobre o prejuízo. Ele complementa a reserva de emergência: a reserva cobre imprevistos pequenos, o seguro protege contra perdas grandes. Antes de contratar, leia o que está coberto e o que não está. Menores de idade precisam de um responsável para contratar.",
    links: [{ rotulo: "Trilha: Protegendo seu dinheiro", href: "/trilhas/saude-emocional" }],
    fonte: CURSO_EV_PROTECAO_FINANCEIRA,
  },
  {
    id: "consumo-consciente",
    sugestao: "O que é consumo consciente?",
    palavras: ["consumo consciente", "sustentavel", "sustentabilidade", "meio ambiente", "desperdicio", "reutilizar", "brecho"],
    resposta:
      "Consumo consciente é pensar no impacto das compras no seu bolso, nas pessoas e no planeta. Na prática: comprar o que realmente vai usar, cuidar para as coisas durarem, consertar antes de trocar, considerar usados e brechós, e evitar desperdício. Além de ajudar o meio ambiente, isso costuma sobrar mais dinheiro para suas metas.",
    links: [{ rotulo: "Ver meus gastos por categoria", href: "/financas" }],
    fonte: CURSO_EV_EDUCACAO_FINANCEIRA,
  },
  {
    id: "investimento-sustentavel",
    sugestao: "Existe investimento sustentável?",
    palavras: ["investimento sustentavel", "esg", "investir sustentavel", "empresas sustentaveis", "impacto social"],
    resposta:
      "Sim. Investimentos sustentáveis consideram, além do retorno, como as empresas tratam o meio ambiente, as pessoas e a forma como são administradas (a sigla ESG vem daí, em inglês). Vale a mesma regra de qualquer investimento: entender o risco, o prazo e os custos antes de aplicar. Isto é conteúdo educativo, não recomendação.",
    links: [{ rotulo: "Trilha: Guardar, poupar e investir", href: "/trilhas/vida-adulta-burocracia" }],
    fonte: CURSO_EV_EDUCACAO_FINANCEIRA,
  },
  {
    id: "risco-liquidez",
    sugestao: "O que é risco, rentabilidade e liquidez?",
    palavras: ["liquidez", "rentabilidade", "risco", "arriscado", "seguranca do investimento", "resgatar", "sacar"],
    resposta:
      "São três pontos para olhar em qualquer investimento. Rentabilidade: quanto ele rende. Risco: a chance de render menos que o esperado ou até perder dinheiro. Liquidez: a rapidez para você resgatar o dinheiro. Normalmente não dá para ter tudo no máximo: mais rentabilidade costuma vir com mais risco ou menos liquidez. Para a reserva de emergência, a prioridade é segurança e liquidez.",
    links: [{ rotulo: "Simular uma carteira", href: "/financas/simulacoes" }],
    fonte: CURSO_EV_EDUCACAO_FINANCEIRA,
  },
  {
    id: "emprestimo",
    sugestao: "Vale a pena pegar empréstimo?",
    palavras: ["emprestimo", "emprestar", "financiamento", "financiar", "consignado", "credito pessoal"],
    resposta:
      "Empréstimo é dinheiro de outra pessoa que você devolve com juros, então sempre custa mais do que o valor pego. Ele pode fazer sentido para algo importante e planejado, quando a parcela cabe com folga no orçamento. Para consumo do dia a dia, costuma ser uma armadilha. Compare o Custo Efetivo Total (CET) entre as opções e fuja do cheque especial e do rotativo do cartão, que estão entre os mais caros.",
    links: [{ rotulo: "Trilha: Cartão, crédito e dívidas", href: "/trilhas/quem-eu-sou" }],
    fonte: CURSO_EV_PROTECAO_FINANCEIRA,
  },
  {
    id: "familia",
    sugestao: "Como conversar sobre dinheiro com minha família?",
    palavras: ["familia", "pais", "mae", "pai", "responsavel", "conversar sobre dinheiro", "contas de casa"],
    resposta:
      "Falar de dinheiro em casa ajuda todo mundo. Escolha um momento calmo, comece perguntando (como vocês organizam as contas? o que pesa mais?) e proponha algo concreto, como anotar os gastos de um mês juntos ou definir uma meta da família. Mostrar o que você está aprendendo aqui também é um bom jeito de puxar o assunto.",
    links: [{ rotulo: "Usar o Controle de Gastos juntos", href: "/financas" }],
    fonte: CURSO_EV_EDUCACAO_FINANCEIRA,
  },
  {
    id: "renda-extra",
    sugestao: "Como ganhar uma renda extra sendo jovem?",
    palavras: ["renda extra", "ganhar dinheiro", "bico", "trabalhar", "vender", "freela", "freelance", "primeiro trabalho"],
    resposta:
      "Algumas ideias: vender algo que você faz (doces, artesanato), oferecer ajuda com tecnologia, aulas de reforço, cuidar de pets ou revender itens que você não usa mais. No Brasil, o trabalho formal é permitido a partir dos 16 anos, e a partir dos 14 como jovem aprendiz. Com qualquer renda, vale a mesma regra: anotar, separar uma parte para guardar e desconfiar de propostas de 'dinheiro fácil', que costumam ser golpe.",
    links: [{ rotulo: "Trilha: Seu primeiro dinheiro", href: "/trilhas/primeiro-dinheiro" }],
    fonte: CURSO_EV_EDUCACAO_FINANCEIRA,
  },

  {
    id: "crencas-dinheiro",
    sugestao: "Por que sinto que nunca vou ter dinheiro?",
    palavras: ["nunca vou ter dinheiro", "nunca vou ser rico", "dinheiro nao e para mim", "sorte", "azar", "crenca", "crencas", "rico teve sorte", "nao nasci rico"],
    resposta:
      "Muita gente carrega frases como 'dinheiro não é pra mim' ou 'quem tem dinheiro teve sorte'. Essas crenças fazem a gente desistir antes de tentar. Na prática, o que mais pesa no longo prazo são hábitos repetidos: anotar os gastos, guardar um pouco todo mês e evitar dívidas caras. Comece com uma meta pequena e possível. Cada meta cumprida mostra para você mesmo que dá, sim.",
    links: [{ rotulo: "Criar uma meta pequena", href: "/perfil" }],
    fonte: CURSO_ALURA_PSICOLOGIA,
  },
  {
    id: "ganhar-mais",
    sugestao: "Ganhar mais resolve meus problemas com dinheiro?",
    palavras: ["ganhar mais", "se eu ganhasse mais", "aumento", "ganho pouco", "salario maior", "mais dinheiro resolve"],
    resposta:
      "Ajuda, mas não resolve sozinho. É comum que, quando a renda aumenta, os gastos subam junto (mais delivery, mais assinaturas, um celular mais caro) e o aperto continue. O que muda o jogo é o comportamento: quando a renda aumentar, guarde pelo menos parte do aumento antes de ajustar o padrão de vida. Quem organiza pouco dinheiro costuma saber organizar muito.",
    links: [{ rotulo: "Montar meu orçamento", href: "/financas" }],
    fonte: CURSO_ALURA_PSICOLOGIA,
  },
  {
    id: "comparacao",
    sugestao: "Por que me comparo com o que os outros compram?",
    palavras: ["comparar", "comparo", "comparacao", "meus amigos tem", "todo mundo tem", "influencer", "influenciador", "redes sociais", "instagram", "tiktok", "status"],
    resposta:
      "As redes mostram só a parte bonita: a viagem, o tênis novo, o celular do ano. Você não vê as parcelas, as dívidas ou o que a pessoa deixou de fazer para ter aquilo. Comparar sua vida real com o 'destaque' dos outros gera vontade de gastar para acompanhar. Uma dica: antes de comprar, pergunte se você quer aquilo para você ou para mostrar para alguém.",
    links: [{ rotulo: "Escrever no diário", href: "/perfil" }],
    fonte: CURSO_ALURA_PSICOLOGIA,
  },
  {
    id: "risco-calculado",
    sugestao: "Como correr riscos com dinheiro sem me dar mal?",
    palavras: ["correr risco", "risco calculado", "arriscar", "me dar mal", "perder dinheiro", "arriscado demais"],
    resposta:
      "Risco calculado é arriscar sabendo o tamanho do tombo. Algumas regras: só use dinheiro que você não vai precisar tão cedo; tenha a reserva de emergência antes; entenda o investimento antes de colocar dinheiro nele; não coloque tudo num lugar só; e desconfie de qualquer promessa de ganho alto e garantido, porque risco e retorno andam juntos.",
    links: [{ rotulo: "Simular uma carteira", href: "/financas/simulacoes" }],
    fonte: CURSO_ALURA_PSICOLOGIA,
  },
  {
    id: "armadilhas",
    sugestao: "Quais armadilhas financeiras eu devo evitar?",
    palavras: ["armadilha", "armadilhas", "bet", "bets", "aposta", "apostas", "cassino", "tigrinho", "ficar rico rapido", "dinheiro facil", "ganhar dinheiro facil", "piramide", "renda garantida"],
    resposta:
      "Algumas das mais comuns: promessas de dinheiro fácil ou rendimento garantido muito acima do normal (costuma ser golpe ou pirâmide); apostas online, que são feitas para a casa ganhar no longo prazo e são proibidas para menores de 18 anos; comprar por impulso para aliviar emoções; e acumular parcelas pequenas que viram uma dívida grande. Se algo parece bom demais, pare, pesquise e converse com um adulto de confiança.",
    links: [{ rotulo: "Trilha: Protegendo seu dinheiro", href: "/trilhas/saude-emocional" }],
    fonte: CURSO_ALURA_PSICOLOGIA,
  },

  {
    id: "perfil-investidor",
    sugestao: "O que é perfil de investidor?",
    palavras: ["perfil de investidor", "perfil investidor", "conservador", "moderado", "arrojado", "suitability", "teste de perfil"],
    resposta:
      "É uma forma de descobrir quanto risco combina com você. Quem é conservador prefere segurança, mesmo rendendo menos; quem é moderado aceita um pouco de oscilação; quem é arrojado topa sobe e desce em troca de um retorno maior no longo prazo. Bancos e corretoras aplicam um questionário antes de você investir. O perfil depende também dos seus objetivos e do prazo: dinheiro para daqui a 3 meses não deve correr o mesmo risco que dinheiro para daqui a 10 anos.",
    links: [{ rotulo: "Simular uma carteira", href: "/financas/simulacoes" }],
  },
  {
    id: "acoes",
    sugestao: "O que significa comprar ações?",
    palavras: ["acoes", "acao", "bolsa", "bolsa de valores", "investir na bolsa", "comprar acoes", "dividendos", "virar socio", "b3"],
    resposta:
      "Comprar uma ação é comprar um pedacinho de uma empresa: você vira sócio. Você pode ganhar se a empresa se valorizar ou quando ela divide parte do lucro (os dividendos). Mas o preço sobe e desce todos os dias, e dá para perder dinheiro. Por isso ações combinam com objetivos de longo prazo, com dinheiro que não vai fazer falta, e depois da reserva de emergência. Menores de idade só investem com um responsável.",
    links: [{ rotulo: "Trilha: Guardar, poupar e investir", href: "/trilhas/vida-adulta-burocracia" }],
  },
  {
    id: "fundos",
    sugestao: "O que é um fundo de investimento?",
    palavras: ["fundo de investimento", "fundos de investimento", "o que e um fundo", "taxa de administracao", "come cotas", "gestor do fundo"],
    resposta:
      "Um fundo junta o dinheiro de muitas pessoas e um gestor profissional decide onde aplicar (renda fixa, ações, vários mercados...). Você compra 'cotas' do fundo. A vantagem é a praticidade; o custo é a taxa de administração, cobrada todo ano, que diminui o seu ganho. Antes de escolher, compare o tipo do fundo, as taxas, o prazo para resgatar e o risco.",
    links: [{ rotulo: "Trilha: Guardar, poupar e investir", href: "/trilhas/vida-adulta-burocracia" }],
  },
  {
    id: "fundos-imobiliarios",
    sugestao: "O que são fundos imobiliários?",
    palavras: ["fundo imobiliario", "fundos imobiliarios", "fii", "fiis", "aluguel sem imovel", "investir em imovel"],
    resposta:
      "Fundos imobiliários (FIIs) investem em imóveis, como shoppings, galpões e prédios comerciais, e repassam aos cotistas parte dos aluguéis recebidos. É uma forma de 'receber aluguel' sem comprar um imóvel inteiro. As cotas são negociadas na bolsa e o preço oscila, então há risco. Como qualquer investimento de renda variável, combina com prazos mais longos.",
    links: [{ rotulo: "Simular uma carteira", href: "/financas/simulacoes" }],
  },
  {
    id: "previdencia",
    sugestao: "O que é previdência privada?",
    palavras: ["previdencia", "previdencia privada", "aposentadoria", "aposentar", "pgbl", "vgbl"],
    resposta:
      "Previdência privada é um investimento de longuíssimo prazo, pensado para complementar a renda na aposentadoria. Você contribui ao longo dos anos e o dinheiro é aplicado por uma gestora. Vale observar as taxas cobradas, o tipo de plano e as regras de imposto. Para quem está começando a vida financeira, o caminho costuma ser: orçamento, reserva de emergência e só depois pensar em objetivos tão longos.",
    links: [{ rotulo: "Testar o efeito do tempo no simulador", href: "/financas/simulacoes" }],
  },
  {
    id: "fgc",
    sugestao: "O que é o FGC?",
    palavras: ["fgc", "fundo garantidor", "garantia do investimento", "banco quebrar", "se o banco quebrar"],
    resposta:
      "O FGC (Fundo Garantidor de Créditos) protege parte do seu dinheiro se uma instituição financeira quebrar. Ele cobre, por exemplo, poupança, CDB, LCI e LCA até R$ 250 mil por CPF em cada instituição, respeitando também um limite total em um período de 4 anos. Não cobre tudo: ações, fundos e Tesouro Direto não entram (o Tesouro tem a garantia do governo federal).",
    links: [{ rotulo: "Ver no Glossário", href: "/glossario" }],
  },
  {
    id: "lci-lca",
    sugestao: "O que são LCI e LCA?",
    palavras: ["lci", "lca", "letra de credito", "carencia", "isento de imposto", "isenta de imposto"],
    resposta:
      "LCI e LCA são títulos de renda fixa emitidos por bancos para financiar o setor imobiliário (LCI) e o agronegócio (LCA). Para pessoa física, o rendimento é isento de Imposto de Renda e elas contam com a proteção do FGC. O ponto de atenção é a carência: há um prazo mínimo em que o dinheiro fica preso, então não servem para a reserva de emergência.",
    links: [{ rotulo: "Comparar rendimentos no simulador de CDI", href: "/financas/simulacoes" }],
  },
  {
    id: "imposto-investimentos",
    sugestao: "Investimento paga imposto?",
    palavras: ["imposto", "imposto de renda", "tabela regressiva", "desconto no rendimento", "pagar imposto", "paga imposto", "investimento paga imposto"],
    resposta:
      "Muitos pagam, sobre o rendimento (não sobre o valor investido). Na renda fixa comum, como CDB e Tesouro Direto, a alíquota diminui com o tempo: começa em 22,5% para aplicações de até 6 meses e cai até 15% depois de 2 anos. Alguns investimentos são isentos para pessoa física, como poupança, LCI e LCA. Por isso, na hora de comparar opções, olhe o rendimento depois do imposto.",
    links: [{ rotulo: "Ver no Glossário", href: "/glossario" }],
  },

  {
    id: "planejamento-anual",
    sugestao: "Como planejar meu dinheiro para o ano inteiro?",
    palavras: ["ano inteiro", "planejamento anual", "planejar o ano", "organizar o ano", "comeco de ano", "gastos do ano", "material escolar", "ipva", "iptu", "decimo terceiro", "13o"],
    resposta:
      "Além das contas de todo mês, o ano tem gastos que aparecem só de vez em quando: material escolar, presentes de aniversário e fim de ano, viagens, IPVA e IPTU (se a família tiver). Liste esses gastos, some o total e divida por 12: esse é o valor para separar todo mês, e aí eles não pegam você de surpresa. Se receber algum dinheiro extra, como 13º ou presente, use parte para adiantar esses compromissos.",
    links: [{ rotulo: "Planejar no Controle de Gastos", href: "/financas" }],
    fonte: VIDEO_SERASA_ORGANIZAR,
  },
  {
    id: "score",
    sugestao: "O que é score de crédito?",
    palavras: ["score", "score de credito", "meu score", "pontuacao de credito", "serasa", "cadastro positivo", "nome limpo", "aumentar meu score"],
    resposta:
      "O score é uma pontuação que indica para bancos e lojas a chance de você pagar as contas em dia. Quanto mais alto, mais fácil conseguir crédito com juros menores. Ele sobe com contas pagas em dia, dívidas negociadas e dados atualizados, e cai com atrasos e nome negativado. Quem está começando a vida financeira constrói o score aos poucos, usando crédito com responsabilidade.",
    links: [{ rotulo: "Trilha: Cartão, crédito e dívidas", href: "/trilhas/quem-eu-sou" }],
    fonte: VIDEO_SERASA_ORGANIZAR,
  },
  {
    id: "credito-a-favor",
    sugestao: "Como usar o crédito a meu favor?",
    palavras: ["credito a meu favor", "usar credito", "credito consciente", "quando usar credito", "vale usar credito", "crediario"],
    resposta:
      "Crédito pode ajudar quando é planejado: para algo importante, com parcela que cabe com folga no orçamento e comparando o custo total (o CET) entre as opções. Vira problema quando cobre gasto do dia a dia ou quando você empilha parcelas. Uma regra prática: se você não conseguiria juntar o dinheiro em alguns meses, pense duas vezes antes de parcelar.",
    links: [{ rotulo: "Trilha: Cartão, crédito e dívidas", href: "/trilhas/quem-eu-sou" }],
    fonte: VIDEO_SERASA_ORGANIZAR,
  },
  {
    id: "ser-rico",
    sugestao: "Como faço para ficar rico?",
    palavras: ["ficar rico", "ser rico", "como ser rico", "como ficar rico", "ganhar muito dinheiro", "enriquecer", "fazer fortuna", "ficar milionario", "ser milionario", "quero ser rico", "dinheiro rapido", "ficar rico rapido"],
    resposta:
      "Não existe fórmula mágica (e quem promete isso quase sempre é golpe). Ficar bem de vida vem de hábitos no longo prazo: estudar e se qualificar para ganhar mais, gastar menos do que recebe, guardar sempre uma parte e deixar os juros compostos trabalharem pelo tempo. É aqui que o Integra Jovem te ajuda: as trilhas e ferramentas foram feitas para você aprender isso desde cedo e se preparar para o futuro.",
    links: [
      { rotulo: "Começar pela trilha Seu primeiro dinheiro", href: "/trilhas/primeiro-dinheiro" },
      { rotulo: "Trilha: Guardar, poupar e investir", href: "/trilhas/vida-adulta-burocracia" },
    ],
    fonte: { rotulo: "Cursos gratuitos de finanças — Banco Central (Cidadania Financeira)", url: "https://www.bcb.gov.br/cidadaniafinanceira/cursos" },
  },
  {
    id: "como-cadastrar",
    sugestao: "Como faço para me cadastrar?",
    palavras: [
      "como me cadastro", "onde me cadastro", "como cadastrar", "onde cadastrar", "como me cadastrar", "onde me cadastrar",
      "quero me cadastrar", "quero criar conta", "criar uma conta", "criar conta", "fazer cadastro", "fazer uma conta",
      "como faco uma conta", "como crio uma conta", "me cadastrar", "cadastro", "abrir conta no site", "como entro no site",
      "como ter uma conta", "quero uma conta",
    ],
    resposta:
      "É rápido e gratuito! Clique em \"Criar conta\" no topo da página. Você vai precisar de: um nome (ou apelido), um e-mail válido, a sua data de nascimento e uma senha. Depois é só confirmar o e-mail e pronto, sua conta está criada. Aí dá para salvar suas trilhas, metas e gastos.",
    links: [{ rotulo: "Ir para a tela de cadastro", href: "/cadastro" }],
  },
  {
    id: "cadastro-gratis",
    sugestao: "O cadastro é cobrado?",
    palavras: [
      "cadastro e cobrado", "e cobrado", "cobra alguma coisa", "cobra alguma taxa", "tem que pagar", "precisa pagar",
      "pago para me cadastrar", "pagar para usar", "e pago", "e gratis", "e gratuito", "custa alguma coisa", "tem custo",
      "preco", "quanto custa", "tem taxa", "cobrado alguma taxa", "cobrado para me cadastrar", "paga alguma coisa",
    ],
    resposta:
      "Por enquanto o Integra Jovem é totalmente gratuito: você cria a conta e usa tudo sem pagar nada. No futuro, temos planos de transformá-lo num aplicativo com uma versão paga, mas o que existe hoje você aproveita de graça.",
    links: [{ rotulo: "Criar minha conta grátis", href: "/cadastro" }],
  },
  {
    id: "como-funciona-site",
    sugestao: "Como funciona o site?",
    palavras: [
      "como funciona o site", "como funciona o integra", "como funciona o aplicativo", "como usar o site", "como usar o integra",
      "o que da para fazer no site", "o que tem no site", "o que eu faco aqui", "para que serve o site", "para que serve o integra",
      "como funciona isso", "como funciona tudo", "me explica o site", "o que e o integra jovem", "o que e esse site",
      "como esse site funciona", "funcionamento do site", "o que posso fazer aqui",
      "funcionalidade do site", "funcionalidades do site", "qual a funcionalidade", "quais as funcionalidades",
      "finalidade do site", "finalidade do integra", "qual a finalidade", "objetivo do site", "objetivo do integra",
      "qual o objetivo", "proposito do site", "proposito do integra", "qual o proposito", "funcao do site",
      "funcao do integra", "qual a funcao", "pra que serve", "pra que serve o integra", "pra que serve o site",
      "por que o site foi criado", "por que o integra foi criado", "pra que foi criado", "para que foi criado",
      "o que o site faz", "o que o integra faz", "o que esse site faz", "sobre o site", "sobre o integra jovem",
      "qual o intuito", "intuito do site",
    ],
    resposta:
      "O Integra Jovem foi criado para ajudar jovens e adolescentes a aprender sobre dinheiro desde cedo e se preparar para o futuro — pensando não só no agora, mas na vida toda. Aqui você:\n" +
      "• Aprende nas trilhas: cursos curtos com leitura e quizzes sobre orçamento, dívidas, golpes e investimentos.\n" +
      "• Controla seus gastos: anota o que entra e sai e acompanha o saldo.\n" +
      "• Cria metas e uma reserva de emergência no Perfil.\n" +
      "• Testa simuladores de juros e investimentos para ver o dinheiro render.\n" +
      "• Ganha XP, sobe de nível e conquista medalhas e emblemas conforme avança.\n" +
      "• Fala comigo, o IntegraChat, sempre que tiver uma dúvida.\n\n" +
      "Tudo de graça: é só criar uma conta para salvar seu progresso. Por onde quer começar?",
    links: [
      { rotulo: "Ver as trilhas", href: "/trilhas" },
      { rotulo: "Abrir o Controle de Gastos", href: "/financas" },
      { rotulo: "Criar minha conta", href: "/cadastro" },
    ],
  },

  {
    id: "pix-seguranca",
    sugestao: "Quais são os limites de segurança do Pix?",
    palavras: ["limite do pix", "limite pix", "pix a noite", "pix de noite", "pix noturno", "limite noturno", "seguranca do pix", "aumentar limite do pix"],
    resposta:
      "Por segurança, o Banco Central define que, das 20h às 6h, o Pix entre pessoas tem limite de R$ 1.000, somando todas as transferências da noite. Você pode diminuir seus limites quando quiser; para aumentar, o banco leva pelo menos 24 horas. Dica: deixe limites baixos e cadastre só os contatos de confiança para valores maiores.",
    links: [{ rotulo: "Trilha: Protegendo seu dinheiro", href: "/trilhas/saude-emocional" }],
    fonte: { rotulo: "Pix — Banco Central", url: "https://www.bcb.gov.br/estabilidadefinanceira/pix" },
  },
  {
    id: "rotativo-teto",
    sugestao: "A dívida do cartão pode crescer sem limite?",
    palavras: ["divida do cartao cresce", "teto do rotativo", "limite de juros do cartao", "juros do rotativo", "lei do rotativo", "divida do cartao dobrou", "rotativo", "divida do cartao", "crescer sem limite", "pode crescer", "cartao pode crescer"],
    resposta:
      "Não pode mais crescer sem fim: desde 2024, pela Lei 14.690/2023, os juros e encargos do rotativo e do parcelamento da fatura não podem passar de 100% do valor original da dívida. Ou seja, ela pode no máximo dobrar. Mesmo assim, é a dívida mais cara que existe: o melhor é pagar a fatura inteira todo mês.",
    links: [{ rotulo: "Trilha: Cartão, crédito e dívidas", href: "/trilhas/quem-eu-sou" }],
  },
  {
    id: "cheque-especial",
    sugestao: "O que é cheque especial?",
    palavras: ["cheque especial", "limite da conta", "saldo negativo", "conta no vermelho", "conta negativa", "ficou no vermelho", "no vermelho"],
    resposta:
      "Cheque especial é um empréstimo automático que o banco libera quando sua conta fica negativa. Parece prático, mas os juros são altos: o Banco Central limita a até 8% ao mês. Use só em emergência e por poucos dias. Se ficou no vermelho, cubra o saldo o quanto antes ou troque por um empréstimo mais barato.",
    links: [{ rotulo: "Trilha: Cartão, crédito e dívidas", href: "/trilhas/quem-eu-sou" }],
  },
  {
    id: "valores-a-receber",
    sugestao: "Será que tenho dinheiro esquecido no banco?",
    palavras: ["dinheiro esquecido", "valores a receber", "svr", "dinheiro parado no banco", "dinheiro perdido no banco"],
    resposta:
      "Dá para conferir! O Banco Central tem o sistema Valores a Receber, que mostra se há dinheiro esquecido em bancos, consórcios ou cooperativas. A consulta é grátis no site oficial valoresareceber.bcb.gov.br, com login gov.br. Atenção: o Banco Central não manda links nem liga. Se você é menor de idade, peça ajuda a um responsável.",
    fonte: { rotulo: "Valores a Receber — site oficial do Banco Central", url: "https://valoresareceber.bcb.gov.br" },
  },
  {
    id: "debito-credito",
    sugestao: "Qual a diferença entre débito, crédito e pré-pago?",
    palavras: ["debito e credito", "debito ou credito", "diferenca entre debito", "cartao de debito", "cartao pre pago", "pre pago", "cartao pre-pago"],
    resposta:
      "No débito, o dinheiro sai na hora da sua conta: você só gasta o que tem. No crédito, o banco paga agora e você paga depois, na fatura (cuidado para não gastar o que não tem). No pré-pago, você coloca um valor antes e usa até acabar: ótimo para controlar a mesada.",
    links: [{ rotulo: "Trilha: Cartão, crédito e dívidas", href: "/trilhas/quem-eu-sou" }],
  },
  {
    id: "conta-para-menor",
    sugestao: "Menor de idade pode ter conta no banco?",
    palavras: ["menor pode ter conta", "conta para menor", "conta de menor", "abrir conta sendo menor", "conta digital para adolescente", "conta para adolescente", "abrir uma conta", "pode ter conta", "conta no banco", "menor de idade pode ter conta"],
    resposta:
      "Pode, sim! Muitos bancos e contas digitais têm opções para adolescentes, geralmente abertas junto com um responsável, que acompanha o uso. É uma ótima forma de aprender a controlar a mesada. Converse com seus pais ou responsáveis para escolher uma conta sem tarifas e com cartão de débito ou pré-pago.",
    links: [{ rotulo: "Trilha: Seu primeiro dinheiro", href: "/trilhas/primeiro-dinheiro" }],
  },
  {
    id: "poupanca",
    sugestao: "Como funciona a poupança?",
    palavras: ["como funciona a poupanca", "rendimento da poupanca", "quanto rende a poupanca", "poupanca rende", "vale a pena a poupanca", "caderneta de poupanca"],
    resposta:
      "A poupança é simples e não paga imposto de renda. Quando a Selic está acima de 8,5% ao ano, ela rende 0,5% ao mês mais a TR; quando está igual ou abaixo, rende 70% da Selic mais a TR. O rendimento cai uma vez por mês, no dia do aniversário do depósito. Com a Selic alta, outras opções seguras costumam render mais.",
    links: [{ rotulo: "Comparar no simulador", href: "/financas/simulacoes" }],
  },
  {
    id: "tesouro-direto",
    sugestao: "O que é Tesouro Direto?",
    palavras: ["tesouro direto", "tesouro selic", "tesouro prefixado", "tesouro ipca", "titulo publico", "titulos publicos"],
    resposta:
      "No Tesouro Direto você empresta dinheiro ao governo e recebe de volta com juros. É considerado um dos investimentos mais seguros do país e dá para começar com pouco. Existem tipos diferentes: o Tesouro Selic é o mais usado para reserva de emergência. Menores de idade investem com a ajuda de um responsável.",
    links: [{ rotulo: "Trilha: Guardar, poupar e investir", href: "/trilhas/vida-adulta-burocracia" }],
    fonte: { rotulo: "Tesouro Direto — site oficial", url: "https://www.tesourodireto.com.br" },
  },
  {
    id: "selic",
    sugestao: "O que é a taxa Selic?",
    palavras: ["o que e selic", "taxa selic", "selic subiu", "selic caiu", "copom", "taxa basica de juros"],
    resposta:
      "A Selic é a taxa básica de juros do Brasil, definida pelo Copom, do Banco Central, mais ou menos a cada 45 dias. Ela influencia quase tudo: quando sobe, empréstimos ficam mais caros e investimentos de renda fixa rendem mais; quando cai, acontece o contrário. Também é usada para controlar a inflação.",
    links: [{ rotulo: "Trilha: Juros compostos", href: "/trilhas/uso-consciente-tecnologia" }],
  },
  {
    id: "open-finance",
    sugestao: "O que é Open Finance?",
    palavras: ["open finance", "open banking", "compartilhar meus dados com o banco", "compartilhamento de dados"],
    resposta:
      "Open Finance é um sistema regulado pelo Banco Central que permite compartilhar seus dados financeiros entre bancos, só com a sua autorização. Assim, outro banco pode oferecer condições melhores com base no seu histórico. Você escolhe o que compartilhar, por quanto tempo, e pode cancelar quando quiser.",
  },
  {
    id: "jovem-aprendiz",
    sugestao: "Como funciona o Jovem Aprendiz?",
    palavras: ["jovem aprendiz", "aprendiz", "programa aprendiz", "primeiro emprego com 14", "trabalhar com 14 anos", "trabalhar com 15 anos"],
    resposta:
      "O Jovem Aprendiz é para quem tem de 14 a 24 anos e estuda. Você trabalha com carteira assinada, recebe salário e, ao mesmo tempo, faz um curso de formação profissional. O contrato dura até 2 anos e a jornada é menor, para não atrapalhar a escola. É uma ótima porta para o primeiro emprego.",
    links: [{ rotulo: "Trilha: Seu primeiro dinheiro", href: "/trilhas/primeiro-dinheiro" }],
  },
  {
    id: "direitos-carteira",
    sugestao: "Quais direitos tenho com carteira assinada?",
    palavras: ["carteira assinada", "direitos do trabalhador", "clt", "decimo terceiro", "ferias remuneradas", "meus direitos no trabalho"],
    resposta:
      "Com carteira assinada (CLT), você tem, entre outros: 13º salário, férias remuneradas com um terço a mais, FGTS depositado pelo empregador, contribuição ao INSS (que conta para a aposentadoria) e descanso semanal. Guarde seus holerites e confira se tudo está sendo pago.",
    links: [{ rotulo: "Trilha: Dominando o orçamento", href: "/trilhas/descobrindo-profissoes" }],
  },
  {
    id: "fgts",
    sugestao: "O que é FGTS?",
    palavras: ["fgts", "fundo de garantia", "sacar o fgts", "saque do fgts"],
    resposta:
      "O FGTS (Fundo de Garantia) é um dinheiro que o empregador deposita todo mês numa conta em seu nome na Caixa, equivalente a 8% do salário, sem descontar do seu pagamento. Ele pode ser sacado em situações como demissão sem justa causa, compra da casa própria ou aposentadoria.",
  },
  {
    id: "cashback",
    sugestao: "Cashback vale a pena?",
    palavras: ["cashback", "dinheiro de volta", "cash back"],
    resposta:
      "Cashback é quando parte do valor da compra volta para você. Vale a pena se você já ia comprar aquilo e o preço é bom. A armadilha é gastar mais só para \"ganhar\" o cashback: receber 5% de volta numa compra desnecessária ainda é perder 95%. Compare o preço final em outras lojas.",
    links: [{ rotulo: "Ver meus gastos", href: "/financas" }],
  },
  {
    id: "promocoes",
    sugestao: "Como não cair em armadilhas de promoção?",
    palavras: ["promocao", "promocoes", "black friday", "liquidacao", "desconto falso", "oferta imperdivel", "queima de estoque", "armadilhas de promocao", "cair em promocao"],
    resposta:
      "Algumas dicas: acompanhe o preço antes da data (sites e apps de comparação ajudam), desconfie de \"últimas unidades\" e contagens regressivas, compre só em lojas confiáveis e pergunte se você compraria pelo preço cheio. Em compras online, você tem até 7 dias para desistir (direito de arrependimento).",
    links: [{ rotulo: "Ver meus gastos", href: "/financas" }],
  },
  {
    id: "assinaturas",
    sugestao: "Como controlar assinaturas e streamings?",
    palavras: ["assinatura", "assinaturas", "streaming", "streamings", "netflix", "spotify", "mensalidade de app"],
    resposta:
      "Assinaturas pequenas somam muito no fim do mês. Faça uma lista de todas, veja quais você realmente usou no último mês e cancele as outras. Uma ideia é fazer rodízio: assinar um streaming por vez. E cuidado com testes grátis que viram cobrança automática.",
    links: [{ rotulo: "Anotar no Controle de Gastos", href: "/financas" }],
  },
  {
    id: "criptomoedas",
    sugestao: "O que são criptomoedas?",
    palavras: ["criptomoeda", "criptomoedas", "bitcoin", "cripto", "ethereum", "nft"],
    resposta:
      "Criptomoedas são moedas digitais que não são emitidas por um governo. O preço sobe e desce muito, às vezes num único dia, e há muitos golpes usando o nome delas. Não são indicadas para quem está começando nem para a reserva de emergência. Desconfie de quem promete ganho garantido com cripto.",
    links: [{ rotulo: "Trilha: Protegendo seu dinheiro", href: "/trilhas/saude-emocional" }],
  },
  {
    id: "consorcio",
    sugestao: "O que é consórcio?",
    palavras: ["consorcio", "consorcios", "carta de credito", "contemplado"],
    resposta:
      "Consórcio é um grupo de pessoas que paga parcelas mensais para comprar um bem (carro, moto, imóvel). Todo mês alguém é contemplado por sorteio ou lance. Não tem juros, mas tem taxa de administração, e você pode demorar a ser sorteado. Serve para quem não tem pressa.",
  },
  {
    id: "mesada",
    sugestao: "Como pedir ou negociar uma mesada?",
    palavras: ["mesada", "pedir mesada", "negociar mesada", "aumentar a mesada", "semanada"],
    resposta:
      "Converse com seus responsáveis num momento calmo e mostre que você tem um plano: quanto precisa, para quê (lanche, transporte, lazer) e quanto vai guardar. Combine também o que a mesada cobre. Anotar os gastos e mostrar depois ajuda a ganhar confiança e, quem sabe, um aumento!",
    links: [{ rotulo: "Anotar meus gastos", href: "/financas" }],
  },
];

export const temas: Tema[] = [...temasComPerguntaPronta, ...conhecimentoFundacaoBradesco, ...conhecimentoVideos, ...conhecimentoLegal];

export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9%\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export type RespostaAssistente = {
  texto: string;

  temaId?: string;
  links?: LinkResposta[];
  fonte?: { rotulo: string; url: string };
  sugestoes?: string[];

  externos?: { rotulo: string; url: string }[];

  topicos?: { id: string; titulo: string; emoji: string }[];
};

const SAUDACOES = ["oi", "ola", "bom dia", "boa tarde", "boa noite", "eai", "e ai", "salve", "hey"];
const AGRADECIMENTOS = ["obrigado", "obrigada", "valeu", "vlw", "brigado", "tmj"];

export const MENSAGEM_INICIAL: RespostaAssistente = {
  texto:
    `Oi! Eu sou o ${NOME_ASSISTENTE}, o assistente do Integra Jovem. Tenho respostas prontas sobre dinheiro, orçamento, cartão, golpes e investimentos, e também posso consultar os seus registros no site: seu nível, suas trilhas, seus gastos, suas metas e mais. Escolha uma pergunta abaixo ou escreva a sua.`,
  sugestoes: [
    "Me mostre um resumo sobre mim",
    "Quanto gastei este mês?",
    "Como organizo meu dinheiro do mês?",
    "Ver todos os assuntos",
  ],
};

export function sugestoesAleatorias(lista: Tema[], excluir?: string, quantidade = 3): string[] {
  return lista
    .filter((t) => t.id !== excluir && t.sugerir !== false)
    .map((t) => t.sugestao)
    .sort(() => Math.random() - 0.5)
    .slice(0, quantidade);
}

export function responder(pergunta: string, lista: Tema[] = temas): RespostaAssistente {
  const texto = ` ${normalizar(pergunta)} `;
  if (!texto.trim()) return MENSAGEM_INICIAL;

  const contem = (trecho: string) => texto.includes(` ${trecho} `) || (trecho.length > 4 && texto.includes(` ${trecho}`));

  if (AGRADECIMENTOS.some(contem)) {
    return {
      texto: "Por nada! Se surgir outra dúvida, é só perguntar.",
      sugestoes: sugestoesAleatorias(lista, undefined, 2),
    };
  }

  const pontuados = lista
    .map((tema, ordem) => ({
      tema,
      ordem,
      pontos: tema.palavras.reduce((soma, p) => soma + (contem(normalizar(p)) ? p.split(" ").length : 0), 0),
    }))
    .filter((x) => x.pontos > 0)

    .sort(
      (a, b) =>
        b.pontos - a.pontos ||
        Number(b.tema.sugerir === false) - Number(a.tema.sugerir === false) ||
        a.ordem - b.ordem,
    );
  const melhor = pontuados[0];

  if (melhor) {
    let texto = melhor.tema.resposta;
    let links = melhor.tema.links ?? [];

    const complemento = pontuados.find(
      (x) => x.tema.id !== melhor.tema.id && x.tema.sugerir === false && x.pontos >= Math.max(2, melhor.pontos * 0.6),
    );
    if (complemento) {
      const primeiraFrase = complemento.tema.resposta.split(/(?<=[.!?])\s/)[0];
      texto += `\n\nTem mais a ver com isso: ${primeiraFrase}`;
      const hrefs = new Set(links.map((l) => l.href));
      links = [...links, ...(complemento.tema.links ?? []).filter((l) => !hrefs.has(l.href))].slice(0, 3);
    }
    return {
      texto,
      temaId: melhor.tema.id,
      links,
      fonte: melhor.tema.fonte ?? complemento?.tema.fonte,
      sugestoes: sugestoesAleatorias(lista, melhor.tema.id, 2),
    };
  }

  if (SAUDACOES.some(contem)) return MENSAGEM_INICIAL;

  return {
    ...respostaMenuDeAssuntos(
      "Ainda não tenho uma resposta pronta para isso. Tente com outras palavras ou escolha um assunto abaixo para ver o que eu sei responder. Para dúvidas sobre a sua situação específica, vale conversar também com um adulto de confiança.",
    ),

    temaId: "fallback",
  };
}
