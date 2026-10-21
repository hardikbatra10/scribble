type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-1 py-1  cursor-pointer text-white rounded-2xl hover:bg-gray-100 transition"
    >
      {children}
    </button>
  );
}