-- Create delivery areas table
CREATE TABLE public.delivery_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  fee INTEGER NOT NULL DEFAULT 29,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert delivery areas
INSERT INTO public.delivery_areas (name, fee) VALUES
  ('Järfälla', 29),
  ('Upplands Bro', 39),
  ('Husby/Akalla/Kista', 29);

-- Enable RLS on delivery_areas (public read)
ALTER TABLE public.delivery_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read delivery areas"
  ON public.delivery_areas FOR SELECT
  USING (true);

-- Create product categories enum
CREATE TYPE public.product_category AS ENUM ('drycker', 'fryst', 'snacks', 'deals');

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  original_price INTEGER,
  category product_category NOT NULL DEFAULT 'snacks',
  image_url TEXT,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on products (public read)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read products"
  ON public.products FOR SELECT
  USING (true);

-- Insert sample products
INSERT INTO public.products (name, description, price, original_price, category, is_popular, in_stock) VALUES
  ('Red Bull 250ml', 'Energidryck som ger dig vingar', 25, NULL, 'drycker', true, true),
  ('Monster Energy 500ml', 'Unleash the beast', 29, NULL, 'drycker', true, true),
  ('Coca-Cola 500ml', 'Klassisk läsk', 22, NULL, 'drycker', false, true),
  ('Nocco BCAA 330ml', 'Kolsyrad BCAA-dryck', 28, NULL, 'drycker', true, true),
  ('Ben & Jerrys Cookie Dough', 'Vaniljglass med chokladbitar och kakdeg', 89, 99, 'fryst', true, true),
  ('Magnum Classic 4-pack', 'Klassisk vaniljglass med chokladskal', 59, NULL, 'fryst', false, true),
  ('OLW Chips Sourcream & Onion 275g', 'Krispiga chips med gräddfil och lök', 39, NULL, 'snacks', true, true),
  ('Estrella Dip Ranch 200g', 'Krämig dippsås', 32, NULL, 'snacks', false, true),
  ('Gott & Blandat Original 550g', 'Klassisk godisblandning', 49, NULL, 'snacks', true, true),
  ('Marabou Mjölkchoklad 200g', 'Klassisk mjölkchoklad', 35, NULL, 'snacks', false, true),
  ('Snaxo Party Pack', '2x chips + 2x dipp + 4-pack Monster', 149, 189, 'deals', true, true),
  ('Movie Night Bundle', 'Ben & Jerrys + OLW Chips + 2x läsk', 139, 169, 'deals', true, true);

-- Create order status enum
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled');

-- Create delivery speed enum
CREATE TYPE public.delivery_speed AS ENUM ('standard', 'priority');

-- Create orders table (guest orders - no user_id required)
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_area_id UUID REFERENCES public.delivery_areas(id) NOT NULL,
  delivery_speed delivery_speed NOT NULL DEFAULT 'standard',
  notes TEXT,
  status order_status NOT NULL DEFAULT 'pending',
  subtotal INTEGER NOT NULL,
  delivery_fee INTEGER NOT NULL,
  priority_fee INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders can be read by anyone with the order number (for tracking)
CREATE POLICY "Anyone can insert orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for orders
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'SNX-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || UPPER(SUBSTRING(NEW.id::text, 1, 4));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for order number generation
CREATE TRIGGER generate_order_number_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_order_number();