
import { ACL } from './acl.json';
import  { match } from 'path-to-regexp';
export const checkACL = (userType, requestedURL, requestedMethod) => {
   

    const acl = JSON.parse(JSON.stringify(ACL)); // Parse the JSON string to an object

    if (!acl.get(userType)) {
        return false;
    }
    

    const allowedURLs = Object.keys(acl[userType]);

    for(const routeURL of allowedURLs)
    {
        const matcher = match(routeURL, { decode: decodeURIComponent });
        const matchResult = matcher(requestedURL);
        if (matchResult) {
            
            if (acl[userType][routeURL].includes(requestedMethod)) {
                return true;
            }
            else{
                return false;
            } 
        }
    }
    return false;
}