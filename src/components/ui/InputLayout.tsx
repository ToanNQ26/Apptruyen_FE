import { Search } from "lucide-react";
import type { ChangeEvent } from "react";

type Props = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
};

export default function InputLayout({
  value,
  onChange,
  placeholder,
}: Props) {
  return (
    <div className="relative mb-4">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          font-sans
          w-full
          h-11
          bg-[#0b1220]
          border border-[#1e293b]
          rounded-lg
          px-4 pr-12
          text-sm text-white
          placeholder:text-gray-500
          transition-all duration-200
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/20
        "
      />

      <Search
        size={16}
        className="
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-gray-500
          pointer-events-none
        "
      />
    </div>
  );
}