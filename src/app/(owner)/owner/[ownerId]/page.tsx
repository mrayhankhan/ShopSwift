import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { items, orders, shops, users } from '@/lib/data';
import { IndianRupee, Package, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export async function generateStaticParams() {
  return users.filter(u => u.shopId).map((user) => ({
    ownerId: user.id,
  }));
}

export default async function OwnerDashboard({ params }: { params: Promise<{ ownerId: string }> }) {
  const { ownerId } = await params;
  const owner = users.find(user => user.id === ownerId);
  const shop = shops.find(s => s.ownerId === ownerId);

  if (!owner || !shop) {
    return <p>Owner or shop not found.</p>;
  }

  const shopItems = items.filter(item => item.shopId === shop.id);
  const shopOrders = orders.filter(order => order.shopId === shop.id).sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());

  const totalInventoryValue = shopItems.reduce((acc, item) => acc + item.price * item.stock, 0);
  const totalItemsCount = shopItems.reduce((acc, item) => acc + item.stock, 0);

  const StatCard = ({ title, value, icon: Icon, description }: { title: string, value: string, icon: React.ElementType, description: string }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Welcome, {owner.name}!</h1>
        <Link href={`/ owner / ${owner.id}/items`}>
          <Button>Manage Items</Button>
        </Link >
      </div >

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`${shopOrders.reduce((acc, order) => acc + order.totalPrice, 0).toFixed(2)}`}
          icon={IndianRupee}
          description="All-time sales"
        />
        <StatCard
          title="Total Orders"
          value={shopOrders.length.toString()}
          icon={ShoppingCart}
          description="Total orders received"
        />
        <StatCard
          title="Items in Stock"
          value={totalItemsCount.toString()}
          icon={Package}
          description={`${shopItems.length} unique products`}
        />
        <StatCard
          title="Inventory Value"
          value={`${totalInventoryValue.toFixed(2)}`}
          icon={IndianRupee}
          description="Current value of all stock"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shopOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No orders yet.</TableCell>
                </TableRow>
              )}
              {shopOrders.slice(0, 10).map(order => {
                const customer = users.find(u => u.id === order.customerId);
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">{order.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{customer?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {customer?.name || 'Unknown Customer'}
                      </div>
                    </TableCell>
                    <TableCell>{format(order.orderDate, 'PPP')}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.items.map((item, idx) => {
                          const product = items.find(i => i.id === item.itemId);
                          return (
                            <div key={idx} className="text-muted-foreground">
                              {item.quantity}x {product?.name || item.itemId}
                            </div>
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold">₹{order.totalPrice.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div >
  );
}
