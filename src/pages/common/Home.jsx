import Navbar from "../../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h2 className="text-3xl font-bold text-orange-600 mb-2">
          Fresh homemade food near you
        </h2>

        <button className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
          View Today’s Menu
        </button>
      </div>
    </>
  );
}
