set dotenv-load

setup-db:
  scripts/init-db
  dbmate up

admin USERNAME EMAIL PASSWORD:
  xh post -a $BASIC_AUTH_LOGIN localhost:5173/cli username=$USERNAME email=$EMAIL password=$PASSWORD
