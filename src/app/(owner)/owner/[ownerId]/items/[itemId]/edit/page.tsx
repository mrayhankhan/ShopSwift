

import { ItemForm } from "@/components/item-form";
import { items as ITEMS, users as USERS } from "@/lib/data";

export async function generateStaticParams() {
  const params = [];
  for (const user of USERS.filter(u => u.shopId)) {
    const userItems = ITEMS.filter(item => item.shopId === user.shopId);
    for (const item of userItems) {
      params.push({
        ownerId: user.id,
        itemId: item.id,
      });
    }
  }
  return params;
}

type Props = {
  params: Promise<{ ownerId: string; itemId: string }>;
};

export default async function EditItemPage({ params }: Props) {
  const { ownerId, itemId } = await params;
  const owner = USERS.find((u) => u.id === ownerId);
  const shopId = owner?.shopId;
  const item = ITEMS.find((i) => i.id === itemId);

  if (!owner || !shopId || !item) {
    return <div>Item not found.</div>;
  }

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">Edit Item</h1>
      <ItemForm shopId={shopId} ownerId={ownerId} item={item} />
    </main>
  );
}
