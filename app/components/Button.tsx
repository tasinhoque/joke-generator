export function Button({
  children,
  onClick,
  colorClass,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  colorClass: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`${colorClass} w-full text-white font-bold py-2 my-4 px-4 rounded`}
    >
      {children}
    </button>
  );
}
