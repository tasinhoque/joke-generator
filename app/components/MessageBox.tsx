export function MessageBox({
  title,
  message,
  bgColorClass,
}: {
  title: string;
  message: string | undefined;
  bgColorClass: string;
}) {
  if (!message) return null;
  let style = title == "Evaluation" ? "1/2" : "1/4";

  return (
    <div className={`w-${style} p-4`}>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="overflow-auto h-full">
        <div
          className={`whitespace-pre-wrap ${bgColorClass} p-3 m-2 rounded-lg`}
        >
          {message}
        </div>
      </div>
    </div>
  );
}
