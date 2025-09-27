import mongoose, { Schema } from "mongoose";
const subscriptionSchema = new Schema({
  subscriber: {                       //subscriber are also users only
    type: Schema.Types.ObjectId,     //one who is subscribing
    ref:"User",
  },
  channel:{                           //theses are also one type of users only as each channel is being subscriped to by the subscribers
    type:Schema.Types.ObjectId, 
    ref:"User"                    // one who is being subscribed to
  },

},
{timestamps:true}
)

export const Subscription = mongoose.model("Subscription", subscriptionSchema);