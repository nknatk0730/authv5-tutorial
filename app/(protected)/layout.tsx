import { Navbar } from "./components/navbar";

export default function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full w-full flex flex-col gap-y-4 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <Navbar />
      {children}
    </div>
  );
}