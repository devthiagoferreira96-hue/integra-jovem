type Props = {
  className?: string;
};

export function IlustracaoUsoConscienteTecnologia({ className }: Props) {
  return (

    <img
      src="/trilhas/juros-compostos.png"
      alt=""
      aria-hidden="true"
      className={`rounded-full object-contain ${className ?? ""}`}
    />
  );
}
