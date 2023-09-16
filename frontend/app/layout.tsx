import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import { Providers } from "@/redux/provider";
import { useRouter } from 'next/navigation';
import { UserDataProvider } from './userDataProvider';
import {SocketProvider} from './socket';
import { Toaster } from 'react-hot-toast';

// interface avatar{setAvatar: string;}

export const metadata: Metadata = {
  title: 'transcendence',
  description: 'PingPong web game',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <html suppressHydrationWarning={true} lang="en">
      <body suppressHydrationWarning={true} className=" bg-[url('/neon-background2.jpeg')] bg-cover bg-center bg-no-repeat flex justify-center ">
        <Providers>
          <UserDataProvider>
            <SocketProvider>
              <Navbar />
              {children}
             <Toaster position='top-right'/> 
            </SocketProvider>
          </UserDataProvider>
        </Providers>
        {/* <Footer /> */}
      </body>
    </html>
  )
}


