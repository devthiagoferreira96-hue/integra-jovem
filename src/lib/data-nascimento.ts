

export const IDADE_MINIMA = 12;
export const IDADE_MAXIMA = 100;

export function mascararData(valor: string): string {

  const entrada = valor.replace(/\D/g, "");
  const d: string[] = [];

  for (const c of entrada) {
    if (d.length >= 8) break;
    const n = Number(c);
    switch (d.length) {
      case 0:
        if (n > 3) d.push("0", c);
        else d.push(c);
        break;
      case 1:
        if (d[0] === "0" && n === 0) break;
        if (d[0] === "3" && n > 1) break;
        d.push(c);
        break;
      case 2:
        if (n > 1) d.push("0", c);
        else d.push(c);
        break;
      case 3:
        if (d[2] === "0" && n === 0) break;
        if (d[2] === "1" && n > 2) break;
        d.push(c);
        break;
      case 4:
        if (n === 1 || n === 2) d.push(c);
        break;
      case 5:
        if ((d[4] === "1" && n === 9) || (d[4] === "2" && n === 0)) d.push(c);
        break;
      default:
        d.push(c);
    }
  }

  const digitos = d.join("");
  const dia = digitos.slice(0, 2);
  const mes = digitos.slice(2, 4);
  const ano = digitos.slice(4, 8);
  return [dia, mes, ano].filter(Boolean).join("/");
}

function montarData(ano: number, mes: number, dia: number): Date | null {
  const data = new Date(ano, mes - 1, dia);

  if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) {
    return null;
  }
  return data;
}

export function parseDataBR(valor: string): Date | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor);
  if (!m) return null;
  return montarData(Number(m[3]), Number(m[2]), Number(m[1]));
}

export function parseDataISO(valor: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
  if (!m) return null;
  return montarData(Number(m[1]), Number(m[2]), Number(m[3]));
}

export function brParaISO(valor: string): string | null {
  const data = parseDataBR(valor);
  if (!data) return null;
  const [dia, mes, ano] = valor.split("/");
  return `${ano}-${mes}-${dia}`;
}

export function isoParaBR(valor: string): string {
  if (!parseDataISO(valor)) return "";
  const [ano, mes, dia] = valor.split("-");
  return `${dia}/${mes}/${ano}`;
}

function idadeEm(nascimento: Date, hoje = new Date()): number {
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
  if (aindaNaoFezAniversario) idade -= 1;
  return idade;
}

export function calcularIdade(dataNascimentoISO: string): number | null {
  const nascimento = parseDataISO(dataNascimentoISO);
  return nascimento ? idadeEm(nascimento) : null;
}

export function validarNascimento(valor: string): string | null {
  if (!valor) return "Informe sua data de nascimento.";
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
    return "Digite a data completa no formato DD/MM/AAAA.";
  }
  const nascimento = parseDataBR(valor);
  if (!nascimento) return "Essa data não existe. Confira o dia e o mês.";

  const hoje = new Date();
  if (nascimento > hoje) return "A data de nascimento não pode estar no futuro.";

  const idade = idadeEm(nascimento, hoje);
  if (idade < IDADE_MINIMA) {
    return `Idade inapropriada para uso: é preciso ter no mínimo ${IDADE_MINIMA} anos.`;
  }
  if (idade > IDADE_MAXIMA) {
    return `Idade inapropriada para uso: a idade máxima permitida é ${IDADE_MAXIMA} anos.`;
  }
  return null;
}

export function avisoNascimento(valor: string): string | null {
  return valor.length === 10 ? validarNascimento(valor) : null;
}

export const MENSAGEM_NASCIMENTO_RECUSADO =
  "Não foi possível salvar: a data de nascimento foi recusada. Confira a data e lembre que o uso é permitido de 12 a 100 anos.";

export function erroDeBancoNoAuth(
  erro: { message?: string; status?: number },
  nascimentoMudou = true,
): boolean {
  if (/database error|error updating user|nascimento_invalido/i.test(erro.message ?? "")) {
    return true;
  }

  return nascimentoMudou && erro.status === 500;
}

const NOMES_MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

export function diasNoMes(ano: number, mes: number): number {
  return new Date(ano, mes, 0).getDate();
}

export function dataParaBR(data: Date): string {
  const dd = String(data.getDate()).padStart(2, "0");
  const mm = String(data.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${data.getFullYear()}`;
}

export function ajustarDataImpossivel(valor: string): { valor: string; ajuste: string | null } {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor);
  if (!m) return { valor, ajuste: null };
  const dia = Number(m[1]);
  const mes = Number(m[2]);
  const ano = Number(m[3]);
  if (mes < 1 || mes > 12) return { valor, ajuste: null };
  const maximo = diasNoMes(ano, mes);
  if (dia <= maximo) return { valor, ajuste: null };
  const ajustado = `${String(maximo).padStart(2, "0")}/${m[2]}/${m[3]}`;
  const motivo =
    mes === 2
      ? `em ${ano} fevereiro tem ${maximo} dias`
      : `${NOMES_MESES[mes - 1]} tem ${maximo} dias`;
  return { valor: ajustado, ajuste: `Ajustamos para ${ajustado}: ${motivo}.` };
}

export function limitesNascimento(hoje = new Date()): { minima: Date; maxima: Date } {
  const maxima = new Date(hoje.getFullYear() - IDADE_MINIMA, hoje.getMonth(), hoje.getDate());
  const minima = new Date(hoje.getFullYear() - IDADE_MAXIMA - 1, hoje.getMonth(), hoje.getDate() + 1);
  return { minima, maxima };
}
