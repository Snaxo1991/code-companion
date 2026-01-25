-- =====================================================
-- SECURITY FIX: Server-side order creation with validation
-- =====================================================

-- Create secure order creation function with full validation
CREATE OR REPLACE FUNCTION create_order_secure(
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_customer_phone TEXT,
  p_delivery_address TEXT,
  p_delivery_area_id UUID,
  p_delivery_speed delivery_speed,
  p_notes TEXT,
  p_items jsonb -- [{product_id, quantity}]
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_order_id UUID;
  v_order_number TEXT;
  v_subtotal INTEGER := 0;
  v_delivery_fee INTEGER;
  v_priority_fee INTEGER := 0;
  v_total INTEGER;
  v_item jsonb;
  v_product products;
  v_delivery_area_name TEXT;
BEGIN
  -- Validate customer name
  IF p_customer_name IS NULL OR LENGTH(TRIM(p_customer_name)) < 2 OR LENGTH(p_customer_name) > 100 THEN
    RAISE EXCEPTION 'Invalid customer name: must be between 2 and 100 characters';
  END IF;
  
  -- Validate email format
  IF p_customer_email IS NULL OR p_customer_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Validate phone format (Swedish format or international)
  IF p_customer_phone IS NULL OR LENGTH(REGEXP_REPLACE(p_customer_phone, '[^0-9]', '', 'g')) < 7 OR LENGTH(p_customer_phone) > 20 THEN
    RAISE EXCEPTION 'Invalid phone format';
  END IF;
  
  -- Validate address
  IF p_delivery_address IS NULL OR LENGTH(TRIM(p_delivery_address)) < 5 OR LENGTH(p_delivery_address) > 500 THEN
    RAISE EXCEPTION 'Invalid delivery address';
  END IF;
  
  -- Validate items array
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item';
  END IF;
  
  IF jsonb_array_length(p_items) > 50 THEN
    RAISE EXCEPTION 'Order cannot contain more than 50 items';
  END IF;
  
  -- Get delivery fee from database (not client)
  SELECT fee, name INTO v_delivery_fee, v_delivery_area_name
  FROM delivery_areas
  WHERE id = p_delivery_area_id;
  
  IF v_delivery_fee IS NULL THEN
    RAISE EXCEPTION 'Invalid delivery area';
  END IF;
  
  -- Calculate priority fee from server (not client)
  IF p_delivery_speed = 'priority' THEN
    v_priority_fee := 20;
  END IF;
  
  -- Calculate subtotal from database prices (not client)
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT * INTO v_product
    FROM products
    WHERE id = (v_item->>'product_id')::UUID
      AND in_stock = true;
    
    IF v_product IS NULL THEN
      RAISE EXCEPTION 'Product not found or out of stock: %', v_item->>'product_id';
    END IF;
    
    IF (v_item->>'quantity')::INTEGER <= 0 OR (v_item->>'quantity')::INTEGER > 99 THEN
      RAISE EXCEPTION 'Invalid quantity for product %: must be between 1 and 99', v_product.name;
    END IF;
    
    v_subtotal := v_subtotal + (v_product.price * (v_item->>'quantity')::INTEGER);
  END LOOP;
  
  v_total := v_subtotal + v_delivery_fee + v_priority_fee;
  
  -- Create order
  INSERT INTO orders (
    customer_name,
    customer_email,
    customer_phone,
    delivery_address,
    delivery_area_id,
    delivery_speed,
    notes,
    subtotal,
    delivery_fee,
    priority_fee,
    total
  ) VALUES (
    TRIM(p_customer_name),
    LOWER(TRIM(p_customer_email)),
    TRIM(p_customer_phone),
    TRIM(p_delivery_address),
    p_delivery_area_id,
    p_delivery_speed,
    NULLIF(TRIM(p_notes), ''),
    v_subtotal,
    v_delivery_fee,
    v_priority_fee,
    v_total
  )
  RETURNING id, order_number INTO v_order_id, v_order_number;
  
  -- Create order items from database product data
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT * INTO v_product
    FROM products
    WHERE id = (v_item->>'product_id')::UUID;
    
    INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
    VALUES (
      v_order_id,
      v_product.id,
      v_product.name,
      (v_item->>'quantity')::INTEGER,
      v_product.price
    );
  END LOOP;
  
  RETURN jsonb_build_object(
    'id', v_order_id,
    'order_number', v_order_number,
    'total', v_total,
    'subtotal', v_subtotal,
    'delivery_fee', v_delivery_fee,
    'priority_fee', v_priority_fee,
    'delivery_area_name', v_delivery_area_name,
    'customer_email', LOWER(TRIM(p_customer_email))
  );
END;
$$;

-- Grant execute to anon and authenticated users
GRANT EXECUTE ON FUNCTION create_order_secure TO anon, authenticated;

-- =====================================================
-- SECURITY FIX: Restrict orders table RLS policies
-- =====================================================

-- Drop the vulnerable SELECT policy
DROP POLICY IF EXISTS "Anyone can read their order by order number" ON orders;

-- Create restrictive policy - deny all direct SELECT access
-- Orders should only be retrieved through secure RPC functions
CREATE POLICY "No direct order access"
ON orders FOR SELECT
USING (false);

-- Drop the vulnerable INSERT policy (orders will be created via RPC)
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;

-- Create policy for RPC function to insert (SECURITY DEFINER bypasses this)
CREATE POLICY "Orders created via secure function only"
ON orders FOR INSERT
WITH CHECK (false);

-- =====================================================
-- SECURITY FIX: Restrict order_items table RLS policies
-- =====================================================

-- Drop the vulnerable SELECT policy
DROP POLICY IF EXISTS "Anyone can read order items" ON order_items;

-- Create restrictive policy - deny all direct SELECT access
CREATE POLICY "No direct order items access"
ON order_items FOR SELECT
USING (false);

-- Drop the vulnerable INSERT policy (items will be created via RPC)
DROP POLICY IF EXISTS "Anyone can insert order items" ON order_items;

-- Create policy - items created via secure function only
CREATE POLICY "Order items created via secure function only"
ON order_items FOR INSERT
WITH CHECK (false);