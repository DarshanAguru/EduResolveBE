import  ACL  from './acl.json' assert { type: "json" };
import { match } from 'path-to-regexp';

export const checkACL = (userType, requestedURL, requestedMethod) => {
  const acl = JSON.parse(JSON.stringify(ACL));

  if (!acl[userType]) return false;

  const allowedURLs = Object.keys(acl[userType]);
  for (const routeURL of allowedURLs) {
    const matcher = match(routeURL, { decode: decodeURIComponent });
    const matchResult = matcher(requestedURL);
    if (matchResult && acl[userType][routeURL].includes(requestedMethod)) {
      return true;
    }
  }
  return false;
};
