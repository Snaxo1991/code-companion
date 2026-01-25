-- Make order_number have a default that will be overwritten by trigger
ALTER TABLE public.orders 
ALTER COLUMN order_number SET DEFAULT 'TEMP';