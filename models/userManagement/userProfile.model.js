import mongoose, { Schema } from "mongoose";


const userProfileSchema=new Schema({
    allowLogin:{
        type:Boolean,
        default:false
    },
    // userName:{
    //     type:String,
    // },
    // password:{
    //     type:String,
    //     required:true
    // },
    role:{
        type:String,
        ref: "Role"
    },
    accessAllLocations:{
       type:Boolean,
       default:false
    },
    posApplicationTradingCompanyWLL:{
        type:Boolean,
        default:false
    },
    salesCommissionPercentage:{
        type:Number,
        default:0
    },
    maxSalesDiscountPercent:{
        type:Number,
        default:0
    },
    allowSelectedContacts:{
        type:Boolean,
        default:false
    },
    dateOfBirth:{
        type:Date        
    },
    gender:{
        type:String,
        enum:["male","female","others"]

    },
    maritalStatus:{
        type:String,
        enum:["single","married","divorced"]
    },
    bloodGroup:{
        type:String, 
    },
    mobileNumber:{
        type:Number,
        validate:{
            validator: function(v) {
              return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
          }
    },
    alternateContactNumber:{
        type:Number,
        validate:{
            validator: function(v) {
              return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
          }
    },
    familyContactNumber:{
        type:Number,
        validate:{
            validator: function(v) {
              return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
          }
    },
    facebookLink:{
        type:String
    },
    twitterLink:{
        type:String
    },
    socialMedia1:{
        type:String
    },
    socialMedia2:{
        type:String
    },
    customField1:{
        type:String
    },
    customField2:{
        type:String
    },
    customField3:{
        type:String
    },
    customField4:{
        type:String
    },
    guardianName:{
        type:String
    },
    IDproofName:{
        type:String
    },
    IDproofNumber:{
        type:String
    },
    permanentAddress:{
        type:String
    },
    currentAddress:{
        type:String
    },
    accountHolderName:{
        type:String,

    },
    accountNumber:{
        type:String
    },
    bankName:{
        type:String
    },
    bankIdentifierCode:{
        type:String
    },
    bankBranch:{
        type:String
    },
    taxPayerID:{
        type:String
    },
    department:{
        type:String
    },
    designation:{
        type:String
    },
    primaryWorkLocation:{
        type:String
    },
    basicSalary:{
        type:String
    },
    payComponents:{
        type:String
    }
     
     
},{timestamps:true})
const UserProfile=mongoose.model("UserProfile",userProfileSchema)
export default UserProfile
