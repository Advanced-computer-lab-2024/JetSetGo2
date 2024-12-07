const generatePromoCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let promoCode = "";
  for (let i = 0; i < 8; i++) {
    promoCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return promoCode;
};

module.exports = generatePromoCode;
