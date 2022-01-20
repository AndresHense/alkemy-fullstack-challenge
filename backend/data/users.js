import bcrypt from 'bcryptjs'

const users=[{
    name:"Admin User",
    password: bcrypt.hashSync('123456',10),
    email:'admin@example.com',
    isAdmin:true
},{
    name:"John Doe",
    password: bcrypt.hashSync('123456',10),
    email:'john@example.com'
},{
    name:"Jane Doe",
    password: bcrypt.hashSync('123456',10),
    email:'jane@example.com'
}]

export default users