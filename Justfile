set dotenv-load

setup-db:
  scripts/init-db

admin username email password:
  xh post -a $BASIC_AUTH_LOGIN localhost:5173/cli username={{username}} email={{email}} password={{password}}

psql:
  psql $DATABASE_URL
