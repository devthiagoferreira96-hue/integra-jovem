
const PARTICULAS = new Set(["de", "da", "do", "dos", "das", "e", "di", "du"]);

export function formatarNome(nome: string | null | undefined): string {
  if (!nome) return "";
  return nome
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("pt-BR")
    .split(" ")
    .map((parte, i) => {
      if (i > 0 && PARTICULAS.has(parte)) return parte;

      return parte.replace(/(^|[-'])([a-zà-ú])/g, (_, sep, letra) => sep + letra.toLocaleUpperCase("pt-BR"));
    })
    .join(" ");
}

export function primeiroNome(nome: string | null | undefined): string {
  return formatarNome(nome).split(" ")[0] ?? "";
}
