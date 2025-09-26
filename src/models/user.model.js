import mongoose,{Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userschema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowecase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowecase:true,
            trim:true,
        },
        fullName:{
            type:String,
            required:true,
        },
        avatar:{
            type:String,    // cloudinary url
            required:true
        },
        coverImage:{
            type:string    // cloudinary url
        },
        password:{
            type:string,
            required:true,
            unique:true
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        refreshToken:{
            type:string
        }
    },
    {
        timestamps:true
    }
)

//  PASSWORD ENCRYPTION
userschema.pre("save", async function(next){               // USED PRE HOOK --> BECAUSE WE NEED TO MAKE CHANGES (ENCRYPT PASS) BEFORE SAVE ,, ENCRYPTION TAKES TIME SO WE USED ASYNC ,, AS WELL AS ., IT IS A MIDDLEWARE HENCE IT NEEDS 'NEXT' PARAMETER
    if(!this.isModified("password")) return next();      // IT ENSURES THAT THE HOOK RUNS ONLY IF THE PASSWORD IS MODIFIED BEFORE SAVING ., IF ANY OTHER ENTITY LIKE AVATAR OR ETC IS MODIFIED , PASSWORD NEED NOT BE ENCRYPTED AGAIN AND AGAIN

    this.password=bcrypt.hash(this.password,10)       
    next()
})
userschema.methods.isPasswordCorrect= async function(password){    // IT IS THE FUNCTION TO CHECK IF THE PASSWORD ENTERD BY USER AND ENCRYPTED PASSWORD IN DB IS SAME OR NOT ..,  CHECKS FOR CORRECTNESS OF THE PASSWORD
    return await bcrypt.compare(password,this.password)
}

//  jwt tokens
userschema.methods.generateAccessToken= function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userschema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User",userschema)