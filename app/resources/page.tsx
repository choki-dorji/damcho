import Link from 'next/link';

export default function ResourcesPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-mist-green to-forest-green p-8">
      <h1 className="text-4xl font-bold text-forest-green mb-4">Resource Connection</h1>
      <p className="text-lg text-gray-800 mb-8 max-w-xl text-center">
        Connect with support groups, educational resources, and healthcare providers tailored to your specific needs. Find the help and information you need to thrive.
      </p>
      <Link href="/" className="px-6 py-3 bg-forest-green text-white rounded-lg shadow hover:bg-forest-green/90 transition">Back to Home</Link>
    </div>
  );
} 