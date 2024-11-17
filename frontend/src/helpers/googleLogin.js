export const handleGoogleLogin = async () => {
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=897335680197-ej7vtn0rmai1d42hmhbd48t455hoiaiu.apps.googleusercontent.com&redirect_uri=https://gya2.vercel.app/auth/callback&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile%20openid`;
};
