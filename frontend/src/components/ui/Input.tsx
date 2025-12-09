interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}
export const Input = (props: Props) => (
  <input 
    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
    {...props}
  />
);
