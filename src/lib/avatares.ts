

export type AvatarId =
  | "heroi-seta"
  | "astronauta"
  | "gamer"
  | "skatista"
  | "cientista"
  | "artista"
  | "exploradora"
  | "robo"

  | "piloto-tubarao"
  | "gata-neon"
  | "capuz-raposa"
  | "visao-coruja"
  | "armadura-besouro"
  | "abelha-jet"
  | "tigre-turbo"
  | "coelho-orbital"

  | "kaua"
  | "integrante-2"
  | "integrante-3"
  | "integrante-4"
  | "integrante-5"
  | "thiago";

export type GrupoAvatar = "Clássicos" | "Futuristas" | "Equipe do TCC";

export type Avatar = {
  id: AvatarId;
  nome: string;
  frase: string;
  grupo: GrupoAvatar;
};

export const avatares: Avatar[] = [
  { id: "heroi-seta", nome: "Heroína da Virada", frase: "Transforma cada desafio em impulso.", grupo: "Clássicos" },
  { id: "astronauta", nome: "Astronauta", frase: "Planeja a missão antes de decolar.", grupo: "Clássicos" },
  { id: "gamer", nome: "Gamer", frase: "Estratégia e foco em cada fase.", grupo: "Clássicos" },
  { id: "skatista", nome: "Skatista", frase: "Cai, levanta e manda de novo.", grupo: "Clássicos" },
  { id: "cientista", nome: "Cientista", frase: "Testa, mede e descobre.", grupo: "Clássicos" },
  { id: "artista", nome: "Artista", frase: "Cria o próprio caminho.", grupo: "Clássicos" },
  { id: "exploradora", nome: "Exploradora", frase: "Curiosidade é o mapa.", grupo: "Clássicos" },
  { id: "robo", nome: "Robô Byte", frase: "Calcula tudo, até os juros.", grupo: "Clássicos" },
  { id: "piloto-tubarao", nome: "Piloto Tubarão", frase: "Mergulha fundo antes de decidir.", grupo: "Futuristas" },
  { id: "gata-neon", nome: "Gata Neon", frase: "Sempre cai de pé no fim do mês.", grupo: "Futuristas" },
  { id: "capuz-raposa", nome: "Capuz Raposa", frase: "Esperta com cada centavo.", grupo: "Futuristas" },
  { id: "visao-coruja", nome: "Visão Coruja", frase: "Enxerga o golpe antes de todo mundo.", grupo: "Futuristas" },
  { id: "armadura-besouro", nome: "Armadura Besouro", frase: "Pequeno passo, proteção forte.", grupo: "Futuristas" },
  { id: "abelha-jet", nome: "Abelha Jet", frase: "Junta um pouco todo dia e faz render.", grupo: "Futuristas" },
  { id: "tigre-turbo", nome: "Tigre Turbo", frase: "Foco total na meta.", grupo: "Futuristas" },
  { id: "coelho-orbital", nome: "Coelho Orbital", frase: "Salta de meta em meta.", grupo: "Futuristas" },
  { id: "kaua", nome: "Kauã", frase: "Dev que transforma ideia em arte.", grupo: "Equipe do TCC" },
  { id: "integrante-2", nome: "Victoria", frase: "Da equipe que criou o Integra Jovem.", grupo: "Equipe do TCC" },
  { id: "integrante-3", nome: "Fred", frase: "Dev que só dá joinha com o build verde.", grupo: "Equipe do TCC" },
  { id: "integrante-4", nome: "Luizinho", frase: "Dev que conversa com o banco de dados.", grupo: "Equipe do TCC" },
  { id: "integrante-5", nome: "Felipe", frase: "Dev movido a energia e commits.", grupo: "Equipe do TCC" },
  { id: "thiago", nome: "Thiago", frase: "Dev que coloca o projeto no ar.", grupo: "Equipe do TCC" },
];

export const gruposAvatar: GrupoAvatar[] = ["Clássicos", "Futuristas", "Equipe do TCC"];

export function avatarValido(id: unknown): id is AvatarId {
  return typeof id === "string" && avatares.some((a) => a.id === id);
}

export const getAvatar = (id: AvatarId | null | undefined) => avatares.find((a) => a.id === id);
