"use client";

import { Pencil, PlusCircle, Settings2, Trash2, X } from "lucide-react";
import { useId, useMemo, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/AppButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  gerarId,
  mascararValorDigitado,
  mesAtual,
  montarMapaCategorias,
  montarOrdemCategorias,
  valorMascaradoParaNumero,
  type CategoriaCustom,
  type CategoriaGasto,
  type Gasto,
} from "@/lib/financas";

type GastoFormProps = {
  onAdicionar: (gasto: Gasto) => void;

  categoriasCustom: CategoriaCustom[];
  onCriarCategoria: (label: string) => void;
  onRenomearCategoria: (id: string, novoLabel: string) => void;
  onRemoverCategoria: (id: string) => void;
};

export function GastoForm({
  onAdicionar,
  categoriasCustom,
  onCriarCategoria,
  onRenomearCategoria,
  onRemoverCategoria,
}: GastoFormProps) {
  const idBase = useId();
  const [categoria, setCategoria] = useState<CategoriaGasto>("aluguel");
  const [valor, setValor] = useState("");
  const [mes, setMes] = useState(() => mesAtual());
  const [observacao, setObservacao] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [confirmado, setConfirmado] = useState(false);
  const [gerenciandoCategorias, setGerenciandoCategorias] = useState(false);

  const mapaCategorias = useMemo(() => montarMapaCategorias(categoriasCustom), [categoriasCustom]);
  const ordemTodasCategorias = useMemo(
    () => montarOrdemCategorias(categoriasCustom),
    [categoriasCustom],
  );

  const enviar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const valorNumerico = valorMascaradoParaNumero(valor);

    if (!valor || Number.isNaN(valorNumerico) || valorNumerico <= 0) {
      setErro("Informe um valor válido, maior que zero.");
      return;
    }
    if (!mes) {
      setErro("Selecione o mês do gasto.");
      return;
    }

    onAdicionar({
      id: gerarId(),
      categoria,
      valor: valorNumerico,
      mes,
      criadoEm: new Date().toISOString(),
      observacao: observacao.trim() || undefined,
    });

    setValor("");
    setObservacao("");
    setErro(null);
    setConfirmado(true);
    window.setTimeout(() => setConfirmado(false), 1800);
  };

  return (
    <form
      onSubmit={enviar}
      className="space-y-5 rounded-3xl border border-border bg-surface p-6 sm:p-7"
      noValidate
    >
      <div>
        <p className="eyebrow">Novo lançamento</p>
        <h2 className="mt-2 text-lg font-bold">Adicionar gasto</h2>
        <p className="mt-1.5 text-[13px] text-muted-foreground">
          Registre manualmente contas e gastos do mês. Os dados ficam salvos só no seu
          dispositivo.
        </p>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor={`${idBase}-categoria`}>Categoria</Label>
          <button
            type="button"
            onClick={() => setGerenciandoCategorias(true)}
            className="inline-flex items-center gap-1 text-[12px] text-muted-foreground hover:text-primary-light"
          >
            <Settings2 className="h-3.5 w-3.5" aria-hidden="true" />
            Gerenciar categorias
          </button>
        </div>
        <Select value={categoria} onValueChange={(valor) => setCategoria(valor as CategoriaGasto)}>
          <SelectTrigger id={`${idBase}-categoria`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ordemTodasCategorias.map((chave) => (
              <SelectItem key={chave} value={chave}>
                {mapaCategorias[chave].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`${idBase}-valor`}>Valor (R$)</Label>
          <Input
            id={`${idBase}-valor`}
            inputMode="decimal"
            placeholder="0,00"
            value={valor}
            onChange={(e) => {
              const digitado = e.target.value;
              setValor((anterior) => mascararValorDigitado(digitado, anterior));
            }}
            aria-invalid={Boolean(erro)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${idBase}-mes`}>Mês</Label>
          <Input
            id={`${idBase}-mes`}
            type="month"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${idBase}-observacao`}>Observação (opcional)</Label>
        <Input
          id={`${idBase}-observacao`}
          placeholder="Ex.: plano anual, conta com atraso..."
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          maxLength={80}
        />
      </div>

      {erro ? <p className="text-xs text-destructive">{erro}</p> : null}

      <Button type="submit" className="w-full">
        <PlusCircle className="h-4 w-4" aria-hidden="true" />
        {confirmado ? "Gasto adicionado!" : "Adicionar gasto"}
      </Button>

      <GerenciarCategoriasDialog
        aberto={gerenciandoCategorias}
        onFechar={() => setGerenciandoCategorias(false)}
        categoriasCustom={categoriasCustom}
        onCriar={onCriarCategoria}
        onRenomear={onRenomearCategoria}
        onRemover={onRemoverCategoria}
      />
    </form>
  );
}

type GerenciarCategoriasDialogProps = {
  aberto: boolean;
  onFechar: () => void;
  categoriasCustom: CategoriaCustom[];
  onCriar: (label: string) => void;
  onRenomear: (id: string, novoLabel: string) => void;
  onRemover: (id: string) => void;
};

function GerenciarCategoriasDialog({
  aberto,
  onFechar,
  categoriasCustom,
  onCriar,
  onRenomear,
  onRemover,
}: GerenciarCategoriasDialogProps) {
  const idNovaCategoria = useId();
  const [novaCategoria, setNovaCategoria] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [rascunhoEdicao, setRascunhoEdicao] = useState("");

  const criar = (event: FormEvent) => {
    event.preventDefault();
    const nome = novaCategoria.trim();
    if (!nome) return;
    onCriar(nome);
    setNovaCategoria("");
  };

  const iniciarEdicao = (categoria: CategoriaCustom) => {
    setEditandoId(categoria.id);
    setRascunhoEdicao(categoria.label);
  };

  const confirmarEdicao = () => {
    const nome = rascunhoEdicao.trim();
    if (editandoId && nome) {
      onRenomear(editandoId, nome);
    }
    setEditandoId(null);
    setRascunhoEdicao("");
  };

  return (
    <Dialog open={aberto} onOpenChange={(valor) => !valor && onFechar()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gerenciar categorias</DialogTitle>
        </DialogHeader>

        <p className="text-[13px] text-muted-foreground">
          As 6 categorias padrão não podem ser editadas. Crie novas para outros tipos de gasto,
          como &quot;Transporte&quot; ou &quot;Assinaturas&quot;.
        </p>

        <form onSubmit={criar} className="flex items-end gap-2">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor={idNovaCategoria}>Nova categoria</Label>
            <Input
              id={idNovaCategoria}
              placeholder="Ex.: Transporte"
              value={novaCategoria}
              onChange={(e) => setNovaCategoria(e.target.value)}
              maxLength={30}
            />
          </div>
          <Button type="submit" size="sm">
            <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Criar
          </Button>
        </form>

        <div className="space-y-1.5">
          {categoriasCustom.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-3 text-center text-[12px] text-muted-foreground">
              Você ainda não criou nenhuma categoria própria.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {categoriasCustom.map((categoria) => (
                <li
                  key={categoria.id}
                  className="flex items-center gap-2 rounded-xl border border-border bg-surface p-2.5"
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                    style={{ backgroundColor: categoria.cor }}
                    aria-hidden="true"
                  />
                  {editandoId === categoria.id ? (
                    <>
                      <Input
                        autoFocus
                        value={rascunhoEdicao}
                        onChange={(e) => setRascunhoEdicao(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && confirmarEdicao()}
                        maxLength={30}
                        className="h-8 flex-1 text-[13px]"
                      />
                      <button
                        type="button"
                        onClick={confirmarEdicao}
                        className="shrink-0 text-[12px] font-semibold text-primary hover:text-primary-light"
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditandoId(null)}
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-background"
                        aria-label="Cancelar edição"
                      >
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 break-words text-[13px]">{categoria.label}</span>
                      <button
                        type="button"
                        onClick={() => iniciarEdicao(categoria)}
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-background hover:text-foreground"
                        aria-label={`Renomear categoria ${categoria.label}`}
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemover(categoria.id)}
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Excluir categoria ${categoria.label}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
