import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-forest-green to-mist-green p-8">
      <h1 className="text-4xl font-bold text-white mb-4">Privacy & Security</h1>
      <p className="text-lg text-white mb-8 max-w-xl text-center">
        Your data is protected with enterprise-grade security measures and full compliance with healthcare regulations. We value your privacy and keep your information safe.
      </p>
      <Link href="/" className="px-6 py-3 bg-white text-forest-green rounded-lg shadow hover:bg-gray-100 transition">Back to Home</Link>
    </div>
  );
} 