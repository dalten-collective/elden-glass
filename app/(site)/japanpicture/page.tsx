import Image from 'next/image';

export const metadata = {
  title: '~dashus-navnul | Shards of Glass',
  description: 'Profile page for ~dashus-navnul',
};

export default function JapanPicturePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-8 p-8">
        <Image
          src="/images/dashusnavnulsigil.png"
          alt="DashusNavnul Sigil"
          width={200}
          height={200}
          className="opacity-90 mx-auto"
        />
        <h1 className="text-4xl text-white font-mono font-bold">~dashus-navnul</h1>
        <p className="text-[var(--text-secondary)] text-lg">Coming soon...</p>
      </div>
    </div>
  );
}
