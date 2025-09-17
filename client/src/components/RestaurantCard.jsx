export default function RestaurantCard({ r }) {
    return (
      <div className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 flex gap-4">
        <img
          className="w-24 h-24 object-cover rounded-xl"
          src={
            r.logo?.url ||
            "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop"
          }
          alt={r.name}
        />
        <div className="flex-1">
          <div className="font-semibold text-lg">{r.name}</div>
          <div className="text-sm text-gray-600">{r.description || "Delicious local eats"}</div>
          {r.address && <div className="text-sm text-gray-500 mt-1">{r.address}</div>}
        </div>
      </div>
    );
  }
  