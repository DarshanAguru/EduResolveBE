export const acl = {
    localAdmin: {
        "/localAdmins/me": ["POST"] 
    },
    teacher: {
        "/teachers/me": ["POST"]
    },
    student: {
        "/students/me": ["POST"]
    },
    globalAdmin: {
        "/globalAdmins/me": ["POST"]
    },
    mentor: {
        "/mentors/me": ["POST"]
    }
}