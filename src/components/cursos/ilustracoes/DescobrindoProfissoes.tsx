type Props = {
  className?: string;
};

export function IlustracaoDescobrindoProfissoes({ className }: Props) {
  return (

    <img
      src="/trilhas/dominando-orcamento.png"
      alt=""
      aria-hidden="true"
      className={`rounded-full object-contain ${className ?? ""}`}
    />
  );
}
