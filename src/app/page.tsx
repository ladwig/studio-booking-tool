import BookingForm from '../components/BookingForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Studio Booking</h1>
          <p className="mt-2 text-lg text-gray-600">Book your perfect studio session in a few simple steps</p>
        </div>
        <BookingForm />
      </div>
    </main>
  );
}
