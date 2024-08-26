export const generateRandomString = (length: number) =>
  Array.from({ length }, () =>
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_".charAt(
      Math.floor(Math.random() * 63)
    )
  ).join("");
