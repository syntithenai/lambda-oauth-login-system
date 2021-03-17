cd /projects/projectshome/lambda-oauth-login-system/

cd lambda-oauth-login-system-react-components
npm run build
npm publish

cd ../client
npm update
npm run build

cd ../lambda-oauth-login-system-example/react-login-example
npm update
npm run build

