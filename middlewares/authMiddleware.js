import JWT from 'jsonwebtoken';


// protected Routes token base 
export const requireSignIn = async(req,res,next)=>{
try {
    const decode = JWT.verify(req.headers.authorization,process.env.JWT_SECRET);
    req.user = decode;
    next();
} catch (error) {
    console.log(error);
    res.status(401).send({
        success:false,
        error,
        message:"Error in Admin middlewares"
    })
}};