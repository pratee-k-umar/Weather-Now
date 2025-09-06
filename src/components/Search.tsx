export default function Search() {
  // https://nominatim.openstreetmap.org/search?q={QUERY}&format=json&limit=5
  return (
    <div>
      <div className="m-5">
        <input type="text" placeholder="Search" className="border-1 w-full" />
      </div>
    </div>
  )
}