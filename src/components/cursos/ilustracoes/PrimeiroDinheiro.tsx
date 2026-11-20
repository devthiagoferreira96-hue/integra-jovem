type Props = {
  className?: string;
};

export function IlustracaoPrimeiroDinheiro({ className }: Props) {
  return (

    <img
      src="/trilhas/seu-primeiro-dinheiro.png"
      alt=""
      aria-hidden="true"
      className={`rounded-full object-contain ${className ?? ""}`}
    />
  );
}
