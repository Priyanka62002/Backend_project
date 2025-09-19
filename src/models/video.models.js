import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema=new Schema(
    {
        videoFile:{
            type:String,   //cloudinary service is used here
            required:true,
        },
        thumbnail:{          //cloudinary service is used here
            type:String,
            required:true,
        },
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        duration:{
            type:Number,  //cloudnary
            required:true,
        },
        views:{
            type:Number,
            default:0,
        },
        isPublshed:{
            type:Boolean,
            default:true,
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",

        }

    },
    {timestamps:true}


);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video=mongoose.model("Video",videoSchema);