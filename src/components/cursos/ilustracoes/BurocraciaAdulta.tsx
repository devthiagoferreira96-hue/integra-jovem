type Props = {
  className?: string;
};

export function IlustracaoBurocraciaAdulta({ className }: Props) {
  return (

    <img
      src="/trilhas/guardar-poupar-investir.png"
      alt=""
      aria-hidden="true"
      className={`rounded-full object-contain ${className ?? ""}`}
    />
  );
}
