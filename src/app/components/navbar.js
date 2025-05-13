import Link from 'next/link'

export const metadata = {
  title: 'My Next.js App',
  description: 'A simple Next.js app with a navbar',
};

export default function navbar () {
  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'About', path: '/about' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Courses', path: '/courses' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <html lang="en">
      <body className="bg-gray-100">
        <nav className="bg-blue-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              MyApp
            </Link>
            <div className="space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="hover:text-blue-200 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4"></main>
      </body>
    </html>
  );
}