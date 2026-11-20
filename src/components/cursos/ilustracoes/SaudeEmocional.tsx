type Props = {
  className?: string;
};

export function IlustracaoSaudeEmocional({ className }: Props) {
  return (

    <img
      src="/trilhas/protegendo-dinheiro.png"
      alt=""
      aria-hidden="true"
      className={`rounded-full object-contain ${className ?? ""}`}
    />
  );
}
