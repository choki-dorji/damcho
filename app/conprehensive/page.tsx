import Link from 'next/link';

export default function ComprehensivePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-dusty-blue to-mist-green p-8">
      <h1 className="text-4xl font-bold text-forest-green mb-4">Comprehensive Survey</h1>
      <p className="text-lg text-gray-800 mb-8 max-w-xl text-center">
        Access our interactive chatbot for immediate emotional support and answers to your questions, available 24/7. Start a conversation and get the help you need, anytime.
      </p>
      <Link href="/" className="px-6 py-3 bg-forest-green text-white rounded-lg shadow hover:bg-forest-green/90 transition">Back to Home</Link>
    </div>
  );
} 