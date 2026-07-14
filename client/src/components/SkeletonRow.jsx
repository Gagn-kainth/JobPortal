const SkeletonRow = () => (
    <tr className="border-b animate-pulse">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-200" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
      </td>
      <td><div className="h-3 w-32 bg-gray-200 rounded" /></td>
      <td><div className="h-3 w-28 bg-gray-200 rounded" /></td>
      <td><div className="h-3 w-16 bg-gray-200 rounded" /></td>
      <td><div className="h-5 w-20 bg-gray-200 rounded-full" /></td>
      <td><div className="h-7 w-24 bg-gray-200 rounded" /></td>
    </tr>
  );
  
  export default SkeletonRow;