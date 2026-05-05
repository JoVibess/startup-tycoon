// src/auth.js
// Vérification d'un JWT Clerk côté serveur via JWKS.
//
// Pédagogie (TP 13 — partie 3.2 "lire le code du backend") :
//
// 1. Le client envoie le JWT obtenu via Clerk dans le header `Authorization: Bearer <token>`.
// 2. Le JWT est signé par Clerk avec une clé privée RSA. La clé publique correspondante
//    est exposée publiquement par Clerk sur un endpoint JWKS :
//      <issuer>/.well-known/jwks.json
// 3. Le serveur télécharge cette clé publique UNE seule fois (puis la cache), et l'utilise
//    pour vérifier la signature. Pas besoin d'appeler Clerk à chaque requête.
// 4. On vérifie aussi : l'issuer (iss), l'expiration (exp), et l'algorithme de signature.
// 5. Si tout est OK, on attache `req.auth = { userId, claims }` à la requête, pour les routes.
//
// Ce qu'un middleware DIY apprend qu'un SDK clé en main cache :
//  - `jose` télécharge et cache automatiquement les clés (`createRemoteJWKSet`)
//  - le serveur ne stocke aucun secret pour vérifier (juste la clé publique)
//  - la `CLERK_SECRET_KEY` n'est PAS utilisée pour vérifier les JWT, elle sert
//    seulement aux appels backend -> Clerk (récupérer un user, etc).

import { createRemoteJWKSet, jwtVerify } from 'jose';

let _jwks = null;
let _issuer = null;

/**
 * Calcule l'issuer Clerk à partir de la publishable key.
 * La publishable key encode (en base64url) le frontend API URL.
 *
 * Exemple : pk_test_Y2xlYW4tYXBlLTEyLmNsZXJrLmFjY291bnRzLmRldiQ
 *  -> base64url decode du 3e segment -> "clean-ape-12.clerk.accounts.dev$"
 *  -> issuer : https://clean-ape-12.clerk.accounts.dev
 */
function deriveIssuerFromPublishableKey(pk) {
  if (!pk) return null;
  const parts = pk.split('_');
  if (parts.length < 3) return null;
  // Le dernier segment contient l'host encodé en base64url, suivi de "$"
  const encoded = parts[parts.length - 1];
  try {
    const decoded = Buffer.from(encoded, 'base64url').toString('utf8');
    const host = decoded.replace(/\$$/, '').trim();
    if (!host) return null;
    return `https://${host}`;
  } catch {
    return null;
  }
}

function getIssuer() {
  if (_issuer) return _issuer;
  _issuer =
    process.env.CLERK_JWT_ISSUER ||
    deriveIssuerFromPublishableKey(process.env.CLERK_PUBLISHABLE_KEY);

  if (!_issuer) {
    throw new Error(
      "Issuer Clerk introuvable. Renseignez CLERK_PUBLISHABLE_KEY (recommandé) ou CLERK_JWT_ISSUER dans .env."
    );
  }
  return _issuer;
}

function getJWKS() {
  if (_jwks) return _jwks;
  const issuer = getIssuer();
  _jwks = createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`));
  return _jwks;
}

/**
 * Extrait et vérifie le JWT. Renvoie { userId, claims } ou jette une erreur.
 */
async function verifyBearer(authorizationHeader) {
  if (!authorizationHeader || typeof authorizationHeader !== 'string') {
    const err = new Error('Missing Authorization header');
    err.status = 401;
    throw err;
  }
  const match = authorizationHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    const err = new Error('Invalid Authorization header (expected "Bearer <token>")');
    err.status = 401;
    throw err;
  }
  const token = match[1].trim();

  try {
    const { payload } = await jwtVerify(token, getJWKS(), {
      issuer: getIssuer(),
      // algorithmes acceptés (RS256 = défaut Clerk)
      algorithms: ['RS256'],
    });
    if (!payload.sub) {
      const err = new Error('JWT payload missing "sub" claim');
      err.status = 401;
      throw err;
    }
    return { userId: payload.sub, claims: payload };
  } catch (e) {
    // jose lance des JWTExpired, JWSSignatureVerificationFailed, etc.
    const err = new Error(`JWT verification failed: ${e.code || e.message}`);
    err.status = 401;
    throw err;
  }
}

/**
 * Middleware : exige un JWT valide. Bloque la requête sinon (401).
 */
export function requireAuth() {
  return async (req, res, next) => {
    try {
      req.auth = await verifyBearer(req.headers.authorization);
      next();
    } catch (e) {
      res.status(e.status || 401).json({ error: e.message });
    }
  };
}

/**
 * Middleware : tente de vérifier un JWT s'il est présent. Sans token, passe en `req.auth = null`.
 * Pratique pour des endpoints publics qui montrent plus d'infos aux users connectés.
 */
export function optionalAuth() {
  return async (req, res, next) => {
    if (!req.headers.authorization) {
      req.auth = null;
      return next();
    }
    try {
      req.auth = await verifyBearer(req.headers.authorization);
    } catch {
      req.auth = null;
    }
    next();
  };
}

/**
 * Helper utilisé par le seed/dev : extraire un displayName "raisonnable" depuis les claims.
 * Ordre de priorité : full_name > name > username > first+last > email > userId.
 */
export function displayNameFromClaims(claims) {
  if (!claims) return '';
  const c = claims;
  if (c.full_name) return String(c.full_name);
  if (c.name) return String(c.name);
  if (c.username) return String(c.username);
  if (c.first_name || c.last_name) {
    return [c.first_name, c.last_name].filter(Boolean).join(' ');
  }
  if (c.email) return String(c.email);
  return String(c.sub || '');
}
