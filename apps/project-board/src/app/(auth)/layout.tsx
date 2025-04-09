
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center w-auto h-screen py-5">
        {children}
    </div>
  );
}
