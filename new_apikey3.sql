INSERT INTO user_api_keys ("id", "userId", "label", "apiKey", "scopes", "createdAt", "updatedAt", "audience")
SELECT gen_random_uuid()::text, id, 'opencode-' || NOW(), gen_random_uuid()::text,
  '["workflow:create","workflow:read","workflow:update","workflow:delete","workflow:list","workflow:activate","workflow:deactivate"]'::jsonb,
  NOW(), NOW(), 'public-api'
FROM "user"
WHERE email = 'ijv00777@gmail.com'
RETURNING "apiKey";
