type Props = {
  className?: string;
};

export function IlustracaoQuemEuSou({ className }: Props) {
  return (

    <img
      src="/trilhas/cartao-credito-dividas.png"
      alt=""
      aria-hidden="true"
      className={`rounded-full object-contain ${className ?? ""}`}
    />
  );
}
