-- Create storage bucket for tool images
INSERT INTO storage.buckets (id, name, public)
VALUES ('tool-images', 'tool-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to tool images
CREATE POLICY "Anyone can view tool images"
ON storage.objects FOR SELECT
USING (bucket_id = 'tool-images');

-- Allow admins to upload/update/delete tool images
CREATE POLICY "Admins can upload tool images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'tool-images' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can update tool images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'tool-images' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can delete tool images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'tool-images' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Create function to handle tool purchase
CREATE OR REPLACE FUNCTION public.purchase_tool(p_tool_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_user_money numeric;
  v_tool_price numeric;
  v_tool_name text;
  v_download_url text;
  v_already_purchased boolean;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Vui lòng đăng nhập');
  END IF;

  -- Get user balance
  SELECT money INTO v_user_money FROM profiles WHERE user_id = v_user_id;
  
  IF v_user_money IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Không tìm thấy tài khoản');
  END IF;

  -- Get tool info
  SELECT price, name, download_url INTO v_tool_price, v_tool_name, v_download_url 
  FROM tools WHERE id = p_tool_id AND is_active = true;
  
  IF v_tool_price IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Không tìm thấy tool');
  END IF;

  -- Check if already purchased
  SELECT EXISTS (
    SELECT 1 FROM purchases WHERE user_id = v_user_id AND tool_id = p_tool_id
  ) INTO v_already_purchased;

  IF v_already_purchased THEN
    RETURN json_build_object('success', true, 'message', 'Bạn đã mua tool này', 'download_url', v_download_url, 'already_purchased', true);
  END IF;

  -- Free tools
  IF v_tool_price = 0 THEN
    INSERT INTO purchases (user_id, tool_id, amount) VALUES (v_user_id, p_tool_id, 0);
    UPDATE tools SET sold_count = sold_count + 1 WHERE id = p_tool_id;
    RETURN json_build_object('success', true, 'message', 'Đã nhận tool miễn phí', 'download_url', v_download_url);
  END IF;

  -- Check balance
  IF v_user_money < v_tool_price THEN
    RETURN json_build_object('success', false, 'message', 'Số dư không đủ. Cần ' || v_tool_price || ' đ');
  END IF;

  -- Deduct money
  UPDATE profiles SET money = money - v_tool_price WHERE user_id = v_user_id;

  -- Create purchase record
  INSERT INTO purchases (user_id, tool_id, amount) VALUES (v_user_id, p_tool_id, v_tool_price);

  -- Create transaction record
  INSERT INTO transactions (user_id, type, amount, description, status)
  VALUES (v_user_id, 'purchase', -v_tool_price, 'Mua tool: ' || v_tool_name, 'completed');

  -- Update sold count
  UPDATE tools SET sold_count = sold_count + 1 WHERE id = p_tool_id;

  RETURN json_build_object('success', true, 'message', 'Mua thành công!', 'download_url', v_download_url);
END;
$$;