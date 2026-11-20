import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Erro 404</p>
        <h1 className="mt-3 text-3xl font-extrabold text-foreground">Página não encontrada</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Essa etapa da jornada ainda não existe — ou foi movida de lugar.
        </p>
        <div className="mt-7">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-light"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}
