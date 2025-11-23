

import { ItemForm } from "@/components/item-form";
import { users as USERS } from "@/lib/data";

type Props = {
  params: Promise<{ ownerId: string }>;
};

export default async function NewItemPage({ params }: Props) {
  const { ownerId } = await params;
  const owner = USERS.find((u) => u.id === ownerId);
  const shopId = owner?.shopId;

  if (!owner || !shopId) {
    return <div>Invalid owner.</div>;
  }

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">Add New Item</h1>
      <ItemForm shopId={shopId} ownerId={ownerId} />
    </main>
  );
}
