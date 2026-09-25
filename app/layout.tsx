import './globals.css';
import Shell from '@/components/shell';

export const metadata = { title: 'TILIK | Surveillance Antibiotik', description: 'Local Aggregator Hub untuk pengawasan antibiotik' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body><Shell>{children}</Shell></body></html>;
}
