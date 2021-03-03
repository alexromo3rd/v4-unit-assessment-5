INSERT INTO helo_users (
  username,
  password,
  profile_pic
) VALUES (
  ${username},
  ${hash},
  ${profile_pic}
)

returning *;