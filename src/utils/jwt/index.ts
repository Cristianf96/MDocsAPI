import jwt, { Secret } from "jsonwebtoken";
import { CCorsAudApiArray } from "@app/utils/constants/Constants";

const encoder = new TextEncoder();
export const SecretKey: Secret | Uint8Array = encoder
  .encode(process.env.JWT_SECRET_KEY)
  .toString();

export const SecretKeyMsSql: Secret | Uint8Array = encoder
  .encode(process.env.JWT_SECRET_MSSQL_KEY)
  .toString();

export const verifyToken = (
  token: string,
  secretToken: string,
  secretTokenData: string
): any => {
  try {
    const decoded = jwt.verify(token, secretToken);

    if (
      typeof decoded !== "string" &&
      typeof decoded.aud === "string" &&
      CCorsAudApiArray.includes(decoded.aud)
    ) {
      const decodedData = jwt.verify(decoded.data, secretTokenData);

      if (decodedData) {
        return {
          valid: true,
          decoded: {
            data: decodedData,
            aud: decoded.aud,
            sub: decoded.sub,
            name: decoded.name,
            idUser: decoded.idUser,
            iat: decoded,
            exp: decoded.exp,
          },
        };
      } else {
        console.error("Error to verify token data");
        return { valid: false, decoded: null };
      }
    } else {
      console.error("Audience not allowed");
      return { valid: false, decoded: null };
    }
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      console.error("El token ha expirado");
    } else if (err.name === "JsonWebTokenError") {
      console.error("El token no es válido");
    } else {
      console.error("Error al verificar el token:", err.message);
    }
    return { valid: false, decoded: null };
  }
};
