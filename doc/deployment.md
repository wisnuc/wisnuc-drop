# 部署 (Deployment)
Deploy the project using pm2 automatically.

## Required
- node
- git 
- pm2 

## Pm2 Configure
config file: ecosystem.config.js

## Publish Project
test
```bash
# Setup deployment at remote location
pm2 deploy ecosystem.config.js test setup
# Deploy your code
pm2 deploy ecosystem.config.js test --force
```

production
```bash
# Setup deployment at remote location
pm2 deploy ecosystem.config.js production setup
# Deploy your code
pm2 deploy ecosystem.config.js production --force
```

## Reference
- [SSH passwordLess login using SSH keygen](https://www.tecmint.com/ssh-passwordless-login-using-ssh-keygen-in-5-easy-steps)
- [pm2 deployment](http://pm2.keymetrics.io/docs/usage/deployment)
