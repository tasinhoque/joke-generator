export function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | undefined;
  onChange: (value: number) => void;
}) {
  return (
    <label>
      {label}:
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="block w-full p-2 border border-gray-300 rounded mb-4"
        min={1}
      />
    </label>
  );
}
