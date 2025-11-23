import Link from "next/link";
import { items as ITEMS, users as USERS } from "@/lib/data";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ ownerId: string }>;
};

export default async function OwnerItemsPage({ params }: Props) {
  const { ownerId } = await params;

  const owner = USERS.find((u) => u.id === ownerId);
  const shopId = owner?.shopId;

  const itemsForOwner = ITEMS.filter((item) => item.shopId === shopId);

  if (!owner || !shopId) {
    return <div>Invalid owner or shop.</div>;
  }

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">My Items ({itemsForOwner.length})</h1>
        <Link
          href={`/owner/${ownerId}/items/new`}
        >
          <Button>+ Add Item</Button>
        </Link>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {itemsForOwner.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-12 w-12 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3">${item.price}</td>
                <td className="px-4 py-3">{item.stock}</td>
                <td className="px-4 py-3 space-x-2">
                  <Link
                    href={`/owner/${ownerId}/items/${item.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}

            {itemsForOwner.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={5}>
                  No items yet. Click "Add Item" to create your first product.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
