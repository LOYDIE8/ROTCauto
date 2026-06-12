import FeedbackForm from '../components/FeedbackForm';

export default function FeedbackPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-mono text-[var(--neon-cyan)] uppercase tracking-widest">
          Comm Link
        </h1>
        <p className="text-sm font-mono text-gray-500 uppercase mt-2">
          Secure channel for field reports, anomaly detection, and operational requests.
        </p>
      </div>

      <FeedbackForm />
    </div>
  );
}
