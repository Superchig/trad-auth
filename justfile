set dotenv-load

setup-db:
  scripts/init-db
  dbmate up

admin:
  xh post -a $BASIC_AUTH_LOGIN localhost:5173/cli username=$DEV_ADMIN_USERNAME email=$DEV_ADMIN_EMAIL password=$DEV_ADMIN_PASSWORD