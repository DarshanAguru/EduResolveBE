
import { ACL } from './acl.json';
export const checkACL = (userType, requestedURL, requestedMethod) => {
    const acl = JSON.parse(JSON.stringify(ACL)); // Parse the JSON string to an object
    if(acl.get(userType) !== undefined)
    {
        if(acl[userType].get(requestedURL) !== undefined)
        {
            if(acl[userType][requestedURL].includes(requestedMethod))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
   
    return false;
}