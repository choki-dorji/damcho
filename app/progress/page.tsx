import Link from 'next/link';

export default function ProgressPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-dusty-blue to-forest-green p-8">
      <h1 className="text-4xl font-bold text-white mb-4">Progress Tracking</h1>
      <p className="text-lg text-white mb-8 max-w-xl text-center">
        Monitor your recovery journey with easy-to-understand visualizations and milestone tracking. Stay motivated and celebrate your achievements along the way!
      </p>
      <Link href="/" className="px-6 py-3 bg-white text-forest-green rounded-lg shadow hover:bg-gray-100 transition">Back to Home</Link>
    </div>
  );
} 