
export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <div className="bg-[url('/30.png')] bg-cover bg-center bg-no-repeat  h-screen w-full ">
          {children}
        </div>
    )
  }
  
  