set dotenv-load

setup-db:
  scripts/init-db
  dbmate up

admin username email password:
  xh post -a $BASIC_AUTH_LOGIN localhost:5173/cli username={{username}} email={{email}} password={{password}}
