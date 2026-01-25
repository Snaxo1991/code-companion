
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
DROP POLICY IF EXISTS "Anyone can insert order items" ON order_items;

-- Create permissive INSERT policies for guest checkout
CREATE POLICY "Anyone can insert orders" 
ON orders 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can insert order items" 
ON order_items 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Allow reading orders by order_number (for confirmation page)
CREATE POLICY "Anyone can read their order by order number" 
ON orders 
FOR SELECT 
TO anon, authenticated
USING (true);

-- Allow reading order items for orders user can see
CREATE POLICY "Anyone can read order items" 
ON order_items 
FOR SELECT 
TO anon, authenticated
USING (true);
