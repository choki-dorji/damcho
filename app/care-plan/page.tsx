import Link from 'next/link';

export default function CarePlanPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-mist-green to-dusty-blue p-8">
      <h1 className="text-4xl font-bold text-forest-green mb-4">AI-Generated Care Plans</h1>
      <p className="text-lg text-gray-800 mb-8 max-w-xl text-center">
        Receive customized recommendations for managing your post-treatment recovery, including lifestyle adjustments and follow-up care. Our AI analyzes your health profile to create a plan just for you!
      </p>
      <Link href="/" className="px-6 py-3 bg-forest-green text-white rounded-lg shadow hover:bg-forest-green/90 transition">Back to Home</Link>
    </div>
  );
} 