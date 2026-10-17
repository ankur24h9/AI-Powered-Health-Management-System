function DashboardCard({ title, value }) {
  return (
    <div className="bg-slate-100 rounded-xl shadow p-6 mb-8">
    <div className="bg-slate-200 rounded-xl shadow mt-15 p-16 hover:shadow-lg transition">

      <h3 className="text-gray-500 text-sm">
        {title}
      </h3>

      <h2 className="text-3xl font-bold mt-2 md-4">
        {value}
      </h2>
    
      

    </div>
   
</div>

    
  );
}

export default DashboardCard;