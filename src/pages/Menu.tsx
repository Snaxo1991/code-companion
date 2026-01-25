import { Layout } from '@/components/Layout';
import { ProductGrid } from '@/components/ProductGrid';

export default function Menu() {
  return (
    <Layout>
      <div className="container px-4 py-8 md:py-12">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Vår meny</h1>
        <p className="text-muted-foreground mb-8">Välj bland våra drickor, fryst mat och snacks</p>
        <ProductGrid />
      </div>
    </Layout>
  );
}
