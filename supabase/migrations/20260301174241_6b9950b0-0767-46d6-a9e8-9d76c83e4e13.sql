
-- Add rental fields to purchases
ALTER TABLE public.purchases 
ADD COLUMN rental_duration integer NOT NULL DEFAULT 1,
ADD COLUMN rental_unit text NOT NULL DEFAULT 'hour',
ADD COLUMN expires_at timestamp with time zone;

-- Update purchase_tool function for rental model
CREATE OR REPLACE FUNCTION public.purchase_tool(p_tool_id uuid, p_duration integer DEFAULT 1, p_unit text DEFAULT 'hour')
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id uuid;
  v_user_money numeric;
  v_tool_price numeric;
  v_tool_name text;
  v_download_url text;
  v_total_hours integer;
  v_total_price numeric;
  v_expires_at timestamptz;
  v_existing_purchase record;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Vui lòng đăng nhập');
  END IF;

  -- Validate unit
  IF p_unit NOT IN ('hour', 'day', 'week', 'month') THEN
    RETURN json_build_object('success', false, 'message', 'Đơn vị thời gian không hợp lệ');
  END IF;

  IF p_duration < 1 THEN
    RETURN json_build_object('success', false, 'message', 'Thời gian thuê không hợp lệ');
  END IF;

  -- Get user balance
  SELECT money INTO v_user_money FROM profiles WHERE user_id = v_user_id;
  
  IF v_user_money IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Không tìm thấy tài khoản');
  END IF;

  -- Get tool info (price = price per hour)
  SELECT price, name, download_url INTO v_tool_price, v_tool_name, v_download_url 
  FROM tools WHERE id = p_tool_id AND is_active = true;
  
  IF v_tool_price IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Không tìm thấy tool');
  END IF;

  -- Calculate total hours and price
  CASE p_unit
    WHEN 'hour' THEN v_total_hours := p_duration;
    WHEN 'day' THEN v_total_hours := p_duration * 24;
    WHEN 'week' THEN v_total_hours := p_duration * 24 * 7;
    WHEN 'month' THEN v_total_hours := p_duration * 24 * 30;
  END CASE;

  v_total_price := v_tool_price * v_total_hours;

  -- Check for active rental
  SELECT id, expires_at INTO v_existing_purchase 
  FROM purchases 
  WHERE user_id = v_user_id AND tool_id = p_tool_id AND expires_at > now()
  ORDER BY expires_at DESC
  LIMIT 1;

  IF v_existing_purchase.id IS NOT NULL THEN
    RETURN json_build_object(
      'success', true, 
      'message', 'Bạn đang thuê tool này. Hết hạn: ' || to_char(v_existing_purchase.expires_at, 'DD/MM/YYYY HH24:MI'), 
      'download_url', v_download_url, 
      'already_purchased', true,
      'expires_at', v_existing_purchase.expires_at
    );
  END IF;

  -- Free tools
  IF v_tool_price = 0 THEN
    v_expires_at := now() + (v_total_hours || ' hours')::interval;
    INSERT INTO purchases (user_id, tool_id, amount, rental_duration, rental_unit, expires_at) 
    VALUES (v_user_id, p_tool_id, 0, p_duration, p_unit, v_expires_at);
    UPDATE tools SET sold_count = sold_count + 1 WHERE id = p_tool_id;
    RETURN json_build_object('success', true, 'message', 'Đã thuê tool miễn phí', 'download_url', v_download_url, 'expires_at', v_expires_at);
  END IF;

  -- Check balance
  IF v_user_money < v_total_price THEN
    RETURN json_build_object('success', false, 'message', 'Số dư không đủ. Cần ' || v_total_price || ' đ');
  END IF;

  -- Calculate expiry
  v_expires_at := now() + (v_total_hours || ' hours')::interval;

  -- Deduct money
  UPDATE profiles SET money = money - v_total_price WHERE user_id = v_user_id;

  -- Create purchase record
  INSERT INTO purchases (user_id, tool_id, amount, rental_duration, rental_unit, expires_at) 
  VALUES (v_user_id, p_tool_id, v_total_price, p_duration, p_unit, v_expires_at);

  -- Create transaction record
  INSERT INTO transactions (user_id, type, amount, description, status)
  VALUES (v_user_id, 'rental', -v_total_price, 'Thuê tool: ' || v_tool_name || ' (' || p_duration || ' ' || p_unit || ')', 'completed');

  -- Update sold count
  UPDATE tools SET sold_count = sold_count + 1 WHERE id = p_tool_id;

  RETURN json_build_object('success', true, 'message', 'Thuê thành công!', 'download_url', v_download_url, 'expires_at', v_expires_at);
END;
$function$;
