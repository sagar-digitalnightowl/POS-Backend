import express from "express"
import {config} from "dotenv"
import morgan from "morgan"
import cors from "cors"
import adminRoutes from "../routes/index.js"
config()


const app=express()

const PORT=process.env.PORT ||1000  
 
//middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan("dev"))

app.use(cors({
    origin: ["http://localhost:3000"],
    credentials:true
  }));

//routes
 app.use("/admin",adminRoutes)

app.get("/",(req,res)=>{
    res.send("Server Running👍")
})

export const startServer=()=>{
    try{
        app.listen(PORT,()=>{
            console.log(`server started at: http://localhost:${PORT} `)
               
        })
    }catch(err){
        throw new Error(err)
    }
}
